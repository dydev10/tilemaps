import { create } from "zustand";
import createEditorSlice, { EditorSlice } from "./slices/createEditorSlice";
import createPreviewSlice, { PreviewSlice } from "./slices/createPreviewSlice";

const useBoundStore = create<EditorSlice & PreviewSlice>((...a) => ({
  ...createEditorSlice(...a),
  ...createPreviewSlice(...a),
}));

export default useBoundStore;
