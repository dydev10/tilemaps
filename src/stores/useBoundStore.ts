import { create } from "zustand";
import createEditorSlice, { EditorSlice } from "./slices/createEditorSlice";
import createPreviewSlice, { PreviewSlice } from "./slices/createPreviewSlice";

export interface BoundStore extends EditorSlice, PreviewSlice {
  isImageReady: boolean;
  imageUrl: string | null;
  setPreviewImage: (url: string) => void;

  tileBrush: number | null;
  setTileBrush: (brushNum: number | null) => void;
};

const useBoundStore = create<BoundStore>((set, get, ...ar) => ({
  ...createEditorSlice(set, get, ...ar),
  ...createPreviewSlice(set, get, ...ar),

  // uploaded image
  isImageReady: false,
  imageUrl: null,
  setPreviewImage: (url: string) => {    
    set({
      imageUrl: url,
      isImageReady: true,
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
