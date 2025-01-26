import { StateCreator } from "zustand";
import Input from "../../engine/Input";
import Camera from "../../engine/Camera";
import Viewport from "../../engine/Viewport";
import TileMap from "../../engine/TileMap";

const samplePreviewLayers = [
  [
    18, 18,
    18, 1,
  ],
  [
    0, 0,
    0, 0,
  ],
];

export interface PreviewSlice {
  preview: {
    size: number,
    cols: number,
    input: Input | null,
    map: TileMap | null,
    viewport: Viewport | null,
    camera: Camera | null,
    setupPreview: (previewWidth: number, previewHeight: number) => void,
  }
}

const createPreviewSlice: StateCreator<PreviewSlice> = (set, get) => ({
  preview: {
    input: null,
    map: null,
    size: 32,
    cols: 4,
    viewport: null,
    camera: null,
  
    setupPreview: (previewWidth: number, previewHeight: number) => {
      const layers = structuredClone(samplePreviewLayers);
      const input = new Input();
      const map = new TileMap(layers, previewWidth, previewHeight);
      const viewport = new Viewport(map, previewWidth, previewHeight);
      const camera = new Camera(map, viewport);
      set({
        preview: {
          ...get().preview,
          input,
          map,
          viewport,
          camera,
          // size: 32,
          // cols: 4,
          size: map.tileSize,
          cols: map.cols,
        }
      });
    },
  }
});

export default createPreviewSlice;
