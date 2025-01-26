import { StateCreator } from "zustand";
import Input from "../../engine/Input";
import TileMapEdit from "../../engine/TileMapEdit";
import Camera from "../../engine/Camera";
import Viewport from "../../engine/Viewport";

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
    cols: number,
    input: Input | null,
    map: TileMapEdit | null,
    viewport: Viewport | null,
    camera: Camera | null,
    setupEditor: (editorWidth: number, editorHeight: number) => void,
  },
}

const createEditorSlice: StateCreator<EditorSlice> = (set) => ({
  editor: {
    input: null,
    map: null,
    size: 32,
    cols: 4,
    viewport: null,
    camera: null,
    setupEditor: (editorWidth: number, editorHeight: number) => {
      const layers = structuredClone(sampleEditLayers);
      const input = new Input();
      const map = new TileMapEdit(layers, editorWidth, editorHeight);
      const viewport = new Viewport(map, editorWidth, editorHeight);
      const camera = new Camera(map, viewport);
      set({
        input,
        map,
        viewport,
        camera,
        // size: 32,
        // cols: 4,
        size: map.tileSize,
        cols: map.cols,
      });
    },
  }
});

export default createEditorSlice;
