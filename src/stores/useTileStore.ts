import { create } from "zustand";
import Input from "../engine/Input";
import TileMap from "../engine/TileMap";
import Camera2D from "../engine/Camera2D";

const sampleLayers = [
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

type PreviewTiles = {
  input: Input | null,
  map: TileMap | null,
}

type TileStore = {
  layers: number[][],
  input: Input | null,
  map: TileMap | null,
  camera: Camera2D | null,
  setupLayers:(gameWidth: number, gameHeight: number) => void,
  destroyTiles:() => void,

  preview: PreviewTiles,
  setupPreview: (previewWidth: number, previewHeight: number) => void;
  destroyPreview: () => void;
}

const useTileStore = create<TileStore>((set, get) =>({
  /**
   * states
   */
  layers: [],
  input: null,
  map: null,
  camera: null,
  
  preview: {
    input: null,
    map: null,
  },
  
  /**
   * reducers
  */
  setupPreview: (previewWidth: number, previewHeight: number) => {
    const layers = structuredClone(sampleLayers);
    const input = new Input();
    const map = new TileMap(layers);
    set({
      preview: {
        input,
        map,
      }
    })
  },

  destroyPreview: () => {
    get().input?.destroy();
  },

  setupLayers: (gameWidth: number, gameHeight: number) => {
    const layers = structuredClone(sampleLayers);
    const input = new Input();
    const map = new TileMap(layers);
    const camera = new Camera2D(map, gameWidth, gameHeight);
    set({
      layers,
      input,
      map,
      camera,
    })
  },

  destroyTiles: () => {
    get().input?.destroy();
  },
}));

export default useTileStore;
