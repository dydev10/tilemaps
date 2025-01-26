import { create } from "zustand";
import createEditorSlice, { EditorSlice } from "./slices/createEditorSlice";
import createPreviewSlice, { PreviewSlice } from "./slices/createPreviewSlice";

export interface BoundStore extends EditorSlice, PreviewSlice {};

const useBoundStore = create<BoundStore>((...a) => ({
  ...createEditorSlice(...a),
  ...createPreviewSlice(...a),
}));

export default useBoundStore;
