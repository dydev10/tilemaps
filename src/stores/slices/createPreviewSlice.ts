import { StateCreator } from "zustand";
import Input from "../../engine/Input";
import TileMap from "../../engine/TileMap";
import { Point } from "../../types";
import { BoundStore } from "../useBoundStore";


export interface PreviewSlice {
  preview: {
    cols: number,
    input: Input | null,
    map: TileMap | null,
    setupPreview: (previewWidth: number, previewHeight: number) => void;
    updatePreview: (imageConfig: { tileSize?: number, tileCols?: number }) => void;
    updatePreviewInput: (data: { mouse?: Point }) => void;
    setPreviewCols: (cols: number) => void;
    destroyPreview: () => void;
  }
}

const createPreviewSlice: StateCreator<BoundStore, [], [], PreviewSlice> = (set, get) => ({
  preview: {
    input: null,
    map: null,
    cols: 4,
  
    // setup should trigger all state subscriptions, rest should not
    setupPreview: (previewWidth: number, previewHeight: number) => {
      const input = new Input();
      const map = new TileMap([], previewWidth, previewHeight);
      set({
        preview: {
          ...get().preview,
          input,
          map,
          cols: map.cols,
        }
      });
    },

    // no subscription triggered, frame updates read/write
    updatePreview: (imageConfig: { tileSize?: number, tileCols?: number }) => {
      const { tileCols } = imageConfig;
      const map = get().preview.map;
      if (!map) return;

      if (tileCols) {
        map.setPreviewTileCols(tileCols);
      }
    },
    updatePreviewInput: (data: { mouse?: Point }) => {
      const { input } = get().preview;
      const { mouse } = data;
      
      if (input && mouse) {
        input.setMouseXY(mouse);
      }
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
      get().preview.input?.destroy();
    },
  }
});

export default createPreviewSlice;
