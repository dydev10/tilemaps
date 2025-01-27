import React, { ChangeEvent } from "react";

import useBoundStore from "../stores/useBoundStore";

const GAME_WIDTH = 512;
const GAME_HEIGHT = 512;
// const GAME_WIDTH = 768;
// const GAME_HEIGHT = 768;



const PreviewForm: React.FC = () => {
  // controls ui
  const tileBrush = useBoundStore(state => state.tileBrush);
  const setTileBrush = useBoundStore(state => state.setTileBrush);
  
  const tileSize = useBoundStore(state => state.editor.size);
  const setTileSize = useBoundStore(state => state.editor.setEditorSize);
  const tileCols = useBoundStore(state => state.preview.cols);
  const setTileCols = useBoundStore(state => state.preview.setPreviewCols);
  // ????
  const updateEditor = useBoundStore(state => state.editor.updateEditor);
  const updatePreview = useBoundStore(state => state.preview.updatePreview);

  // edi
  const handleApplySize = () => {
    updateEditor({
      tileSize,
    });
  }

  const handleChangeSize = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTileSize(parseInt(value, 10));
  }

  // pre
  const handleApplyCol = () => {
    updatePreview({
      tileCols,
    });
  }
  const handleChangeCol = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTileCols(parseInt(value, 10));
  }

  return (
    <div className="editor-form">
      <span className="editor-form-size">
        <input
          name="imageTile"
          type="number"
          value={tileSize}
          onChange={handleChangeSize}
        />
        <button onClick={handleApplySize}>Apply size</button>
      </span>
      <span>
        <input
          name="imageCol"
          type="number"
          value={tileCols}
          onChange={handleChangeCol}
        />
        <button onClick={handleApplyCol}>Apply col</button>
      </span>
    </div>
  );
};

export default PreviewForm;
