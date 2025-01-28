import { create } from "zustand";
import createEditorSlice, { EditorSlice } from "./slices/createEditorSlice";
import createPreviewSlice, { PreviewSlice } from "./slices/createPreviewSlice";

export enum LoadingState {
  IDLE = 'idle',
  PENDING = 'pending',
  READY = 'ready',
}

export interface BoundStore extends EditorSlice, PreviewSlice {
  imageStatus: LoadingState;
  imageUrl: string | null;
  loadingPreviewImage: () => void;
  setPreviewImage: (url: string) => void;

  tileBrush: number | null;
  setTileBrush: (brushNum: number | null) => void;
};

const useBoundStore = create<BoundStore>((set, get, ...ar) => ({
  ...createEditorSlice(set, get, ...ar),
  ...createPreviewSlice(set, get, ...ar),

  // uploaded image
  imageStatus: LoadingState.IDLE,
  imageUrl: null,
  loadingPreviewImage: () => {
    set({
      imageStatus: LoadingState.PENDING,
    });
  },
  setPreviewImage: (url: string) => {    
    set({
      imageUrl: url,
      imageStatus: LoadingState.READY,
    });
  },

  // brush
  tileBrush: null,
  setTileBrush: (brushNum: number | null) => {
    set({
      tileBrush: brushNum,
    });
  },
}));

export default useBoundStore;
