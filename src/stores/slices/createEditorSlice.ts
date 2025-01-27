import { StateCreator } from "zustand";
import Input from "../../engine/Input";
import Camera from "../../engine/Camera";
import Viewport from "../../engine/Viewport";
import { Point } from "../../types";
import TileMap from "../../engine/TileMap";
import { BoundStore } from "../useBoundStore";
import { DEFAULT_TILE_SIZE } from "../../helpers/constants";

const sampleEditLayers = [
  [
    18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18,
    18, 1, 2, 2, 2, 2, 3, 18, 18, 18, 18, 18,
    18, 6, 7, 7, 7, 7, 8, 18, 18, 18, 18, 18,
    18, 6, 7, 16, 12, 17, 8, 18, 18, 18, 18, 18,
    18, 6, 7, 21, 2, 22, 8, 18, 18, 18, 18, 18,
    18, 6, 7, 7, 7, 7, 8, 18, 18, 18, 18, 18,
    18, 11, 12, 12, 12, 12, 13, 18, 18, 18, 18, 18,
    18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18,
    18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18,
    18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18,
    18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18,
    18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18,
  ],
  [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 23, 0, 5, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 20, 0, 10, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 20, 25, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
];

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
      const layers = structuredClone(sampleEditLayers);
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
