import { StateCreator } from "zustand";
import Input from "../../engine/Input";
import TileMap from "../../engine/TileMap";
import { Point } from "../../types";
import { BoundStore, LoadingState } from "../useBoundStore";
import { DEFAULT_COLS } from "../../helpers/constants";


export interface PreviewSlice {
  preview: {
    cols: number,
    input: Input | null,
    map: TileMap | null,
    setupPreview: (previewWidth: number, previewHeight: number) => void;
    updatePreviewImage: () => void;
    updatePreview: (imageConfig: { tileCols?: number, imageTile?: number, chain?: boolean }) => void;
    updatePreviewFocus: (focus: boolean) => void;
    updatePreviewInput: (data: { mouse?: Point }) => void;
    setPreviewCols: (cols: number) => void;
    destroyPreview: () => void;
  }
}

const createPreviewSlice: StateCreator<BoundStore, [], [], PreviewSlice> = (set, get) => ({
  preview: {
    input: null,
    map: null,
    cols: DEFAULT_COLS,
  
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
      get().preview.updatePreview({
        tileCols: map.cols,
        chain: true,
      });
    },

    updatePreviewImage: () => {
      const { preview, editor } = get();
      
      preview.map?.syncPreviewImage();
      set({
        imageStatus: LoadingState.IDLE,
      });

      // update editor also
      if (editor) {        
        editor.updateEditor({
          tileSize: preview.map?.imageTile ?? 0,
          chain: true,
        });
      }
    },

    // no subscription triggered, frame updates read/write
    updatePreview: (imageConfig: { tileCols?: number, imageTile?: number, chain?: boolean }) => {
      const { tileCols, imageTile, chain } = imageConfig;
      const map = get().preview.map;
      const editorMap = get().editor.map;
      if (!map) return;
      
      // received imageTile from chain
      if (imageTile) {
        map.setPreviewImageTile(imageTile);
        get().preview.setPreviewCols(map.cols);
      }
      
      if (tileCols) {
        map.setPreviewTileCols(tileCols);
        get().preview.setPreviewCols(tileCols);
        // update the editor which can not control its own imageTile
        if(chain && editorMap) {
          get().editor.updateEditor({ tileSize: map.imageTile })
        }
      }
    },
    updatePreviewFocus: (focus: boolean) => {
      get().preview.input?.updateFocus(focus);
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
