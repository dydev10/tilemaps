import { StateCreator } from "zustand";
import Input from "../../engine/Input";
import Camera from "../../engine/Camera";
import Viewport from "../../engine/Viewport";
import { Point } from "../../types";
import TileMap from "../../engine/TileMap";
import { BoundStore } from "../useBoundStore";
import { DEFAULT_CANVAS_SIZE, DEFAULT_TILE_SIZE } from "../../helpers/constants";
import sampleLayers from "../../sampleLayers";


export interface EditorSlice {
  editor: {
    resolution: number;
    size: number,
    input: Input | null,
    map: TileMap | null,
    viewport: Viewport | null,
    camera: Camera | null,
    setupEditor: (editorWidth: number, editorHeight: number) => void,
    setEditorResolution: (resolution: number) => void;
    updateEditor: (imageConfig: { tileSize: number, chain?: boolean }) => void,
    updateEditorFocus:  (focus: boolean) => void;
    updateEditorInput: (data: { mouse?: Point }) => void,
    updateEditorCamera: (deltaTime: number, speedX: number, speedY: number) => void,
    updateEditorScroll: (deltaY: number, shiftKey: boolean) => void,
    setEditorSize: (size: number) => void,
    destroyEditor: () => void,

  },
}

const createEditorSlice: StateCreator<BoundStore, [], [], EditorSlice> = (set, get) => ({
  editor: {
    resolution: DEFAULT_CANVAS_SIZE,
    input: null,
    map: null,
    size: DEFAULT_TILE_SIZE,
    viewport: null,
    camera: null,

    // setup should trigger all state subscriptions, rest should not
    setupEditor: (editorWidth: number, editorHeight: number) => {
      const layers = structuredClone(sampleLayers);
      const input = new Input();
      const map = new TileMap(layers, editorWidth, editorHeight);
      const viewport = new Viewport(map, editorWidth, editorHeight);
      const camera = new Camera(map, viewport);
      set({
        editor: {
          ...get().editor,
          input,
          map,
          viewport,
          camera,
          size: map.tileSize,
        }
      });
    },

    setEditorResolution: (resolution: number) => {
      // check if tileSize allows this resolutions
      const { map } = get().editor;
      if (map && map?.imageTile > resolution) return;

      map?.setEditorResolution(resolution);

      set({
        editor: {
          ...get().editor,
          resolution,
        }
      });
    },

    // no subscription triggered, frame updates read/write
    updateEditor: (imageConfig: { tileSize: number, chain?: boolean }) => {
      const { tileSize, chain } = imageConfig;
      const { editor, preview}= get();
      
      // check if resolution allows this tileSize
      if (editor.map && editor.resolution >= tileSize) {
        editor.map.setEditorTileSize(tileSize);
        editor.setEditorSize(tileSize);
      }

      // update the preview which can not control its cols
      if(chain && editor.map) {
        preview.updatePreview({ imageTile: editor.map.imageTile })
      }
    },
    updateEditorFocus: (focus: boolean) => {
      get().editor.input?.updateFocus(focus);
    },
    updateEditorInput: (data: { mouse?: Point }) => {
      const { input } = get().editor;
      if (!input) return;
      
      const { mouse } = data;
      
      if (mouse) {
        input.setMouseXY(mouse);
      }
    },
    updateEditorCamera: (deltaTime: number, speedX: number, speedY: number) => {
      const { camera } = get().editor;
      camera?.move(deltaTime, speedX, speedY);    
    },
    updateEditorScroll: (deltaY: number, shiftKey: boolean) => {
      const { camera } = get().editor;
      let speedX = 0;
      let speedY = 0;
      const speed = Math.round(deltaY / 100);
      if (shiftKey) {
        speedX = speed;
      } else {
        speedY = speed;
      }
      camera?.move(0.1, speedX, speedY);    
    },
    setEditorSize: (size: number) => {
      set({
        editor: {
          ...get().editor,
          size,
        }
      });
    },
    destroyEditor: () => {
      get().editor?.input?.destroy();
    },
  }
});

export default createEditorSlice;
