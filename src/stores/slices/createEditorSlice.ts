import { StateCreator } from "zustand";
import Input from "../../engine/Input";
import Camera from "../../engine/Camera";
import Viewport from "../../engine/Viewport";
import { Point } from "../../types";
import TileMap from "../../engine/TileMap";
import { BoundStore } from "../useBoundStore";
import { DEFAULT_TILE_SIZE } from "../../helpers/constants";
import sampleLayers from "../../sampleLayers";


export interface EditorSlice {
  editor: {
    size: number,
    input: Input | null,
    map: TileMap | null,
    viewport: Viewport | null,
    camera: Camera | null,
    setupEditor: (editorWidth: number, editorHeight: number) => void,
    updateEditor: (imageConfig: { tileSize: number, chain?: boolean }) => void,
    updateEditorFocus:  (focus: boolean) => void;
    updateEditorInput: (data: { mouse?: Point }) => void,
    updateEditorCamera: (deltaTime: number, speedX: number, speedY: number) => void,
    setEditorSize: (size: number) => void,
    destroyEditor: () => void,
  },
}

const createEditorSlice: StateCreator<BoundStore, [], [], EditorSlice> = (set, get) => ({
  editor: {
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

    // no subscription triggered, frame updates read/write
    updateEditor: (imageConfig: { tileSize: number, chain?: boolean }) => {
      const { tileSize, chain } = imageConfig;
      const map = get().editor.map;
      const previewMap = get().preview.map;
      if (!map) return;
  
      map.setEditorTileSize(tileSize);

      // update the preview which can not control its cols
      if(chain && previewMap) {
        get().preview.updatePreview({ imageTile: map.imageTile })
      }
    },
    updateEditorFocus: (focus: boolean) => {
      get().editor.input?.updateFocus(focus);
    },
    updateEditorInput: (data: { mouse?: Point }) => {
      const { input } = get().editor;
      const { mouse } = data;
      
      if (input && mouse) {
        input.setMouseXY(mouse);
      }
    },
    updateEditorCamera: (deltaTime: number, speedX: number, speedY: number) => {
      // console.log(deltaTime, speedX, speedY);
      const { camera } = get().editor;
      camera?.move(deltaTime, speedX, speedY);    
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
