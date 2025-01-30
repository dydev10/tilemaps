import { create } from "zustand";
import createEditorSlice, { EditorSlice } from "./slices/createEditorSlice";
import createPreviewSlice, { PreviewSlice } from "./slices/createPreviewSlice";
import isEmpty from "../helpers/isEmpty";

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
  loadedPreviewImage: () => void;

  tileBrush: number | null;
  setTileBrush: (brushNum: number | null) => void;

  activeLayer: number;
  setActiveLayer: (layer: number) => void;
  nextActiveLayer: () => void;

  isExportOpen: boolean;
  openExport: () => void;
  closeExport: () => void;
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
    });
  },
  loadedPreviewImage: () => {
    set({
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

  activeLayer: 0,
  setActiveLayer(layer: number) {
    set({
      activeLayer: layer,
    });
  },
  nextActiveLayer: () => {
    const { editor, activeLayer, setActiveLayer } = get();
  
    if (editor.map && !isEmpty(activeLayer)) {
      const layers = editor.map.layers.length;
      const nextLayer = (activeLayer + 1) % layers;
      setActiveLayer(nextLayer);
    }
  },

  // export 
  isExportOpen: false,
  openExport: () => {
    set({
      isExportOpen: true,
    });
  },
  closeExport: () => {
    set({
      isExportOpen: false,
    });
  },
}));

export default useBoundStore;
