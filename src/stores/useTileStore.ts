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

export type Point = {
  x: number,  // float
  y: number,  // float
}

export type Cell = {
  col: number,  // int
  row: number,  // int
}

export enum PreviewProps {
  SIZE = 'size',
  COLS = 'cols',
}

type PreviewTiles = {
  active: PreviewProps,
  input: Input | null,
  map: TileMap | null,
  size: number,
  cols: number,
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
  updatePreview: (imageConfig: { tileSize?: number, tileCols?: number }) => void;
  updatePreviewInput: (data: { mouse?: Point }) => void;
  setPreviewSize: (size: number) => void;
  setPreviewCols: (cols: number) => void;
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
    active: PreviewProps.COLS,
    size: 32,
    cols: 4,
  },
  
  /**
   * reducers
  */
  setupPreview: (previewWidth: number, previewHeight: number) => {
    const layers = structuredClone(sampleLayers);
    const input = new Input();
    const map = new TileMap(layers, previewWidth, previewHeight);
    set({
      preview: {
        input,
        map,
        active: PreviewProps.COLS,
        size: 32,
        cols: 4,
      }
    })
  },
  updatePreview: (imageConfig: { tileSize?: number, tileCols?: number }) => {
    const { tileSize, tileCols } = imageConfig;
    const map = get().preview.map;
    if (!map) return;

    if (tileSize) {
      map.setPreviewTileSize(tileSize);
      set({
        preview: {
          ...get().preview,
          active: PreviewProps.SIZE,
        }
      })
    }

    if (tileCols) {
      map.setPreviewTileCols(tileCols);
      set({
        preview: {
          ...get().preview,
          active: PreviewProps.SIZE,
        }
      })
    }
  },
  updatePreviewInput: (data: { mouse?: Point }) => {
    const { input } = get().preview;
    const { mouse } = data;
    
    if (input && mouse) {
      input.setMouseXY(mouse);
    }
  },
  setPreviewSize: (size: number) => {
    set({
      preview: {
        ...get().preview,
        size,
      }
    })
  },
  setPreviewCols: (cols: number) => {
    set({
      preview: {
        ...get().preview,
        cols,
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
