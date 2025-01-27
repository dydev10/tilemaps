import React, { ChangeEvent } from "react";
import useBoundStore from "../stores/useBoundStore";
import { getBaseLog } from "../helpers/maths";

const PreviewForm: React.FC = () => {
  // controls ui
  const tileSize = useBoundStore(state => state.editor.size);
  const setTileSize = useBoundStore(state => state.editor.setEditorSize);
  const tileCols = useBoundStore(state => state.preview.cols);
  const setTileCols = useBoundStore(state => state.preview.setPreviewCols);
  // ????
  const updateEditor = useBoundStore(state => state.editor.updateEditor);
  const updatePreview = useBoundStore(state => state.preview.updatePreview);

  const getSizeByPower = (pow: number) => {
    return 2**pow;
  }

  // edi
  const handleApplySize = (tileSize: number) => {
    updateEditor({
      tileSize,
      chain: true,
    });
  }

  const handleChangeSize = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const size = getSizeByPower(parseInt(value, 10));

    setTileSize(size)
    handleApplySize(size);
  }

  // pre
  const handleApplyCols = (tileCols: number) => {
    updatePreview({
      tileCols,
      chain: true,
    });
  }
  const handleChangeCol = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const cols = parseInt(value, 10);
    setTileCols(cols);
    handleApplyCols(cols);
  }

  return (
    <div className="editor-form">
      <datalist id="size-markers">
        <option key={`size-opt-${3}`} value={3} />
        <option key={`size-opt-${4}`} value={4} />
        <option key={`size-opt-${5}`} value={5} />
        <option key={`size-opt-${6}`} value={6} />
        <option key={`size-opt-${7}`} value={7} />
      </datalist>
      <label className="editor-form__label">
        TileSize:
        <input
          name="imageTile"
          type="range"
          min={3}
          max={7}
          list="size-markers"
          className="editor-form__slider"
          value={getBaseLog(tileSize, 2)}
          onChange={handleChangeSize}
        />
        <span className="editor-form__value">{tileSize}</span>
      </label>

      <label className="editor-form__label">
        Rows:
        <input
          name="imageCols"
          type="range"
          step={1}
          min={2}
          max={128}
          className="editor-form__slider"
          value={tileCols}
          onChange={handleChangeCol}
        />
        <span className="editor-form__value">{tileCols}</span>
      </label>
    </div>
  );
};

export default PreviewForm;
