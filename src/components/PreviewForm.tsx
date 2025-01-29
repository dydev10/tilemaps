import React, { ChangeEvent } from "react";
import { FaDownload, FaFileImage, FaPalette } from "react-icons/fa6";
import useBoundStore from "../stores/useBoundStore";
import { getBaseLog, uptoFixed } from "../helpers/maths";
import colorTiles from '../assets/colortiles.png'

const PreviewForm: React.FC = () => {
  // controls ui
  const loadingPreviewImage = useBoundStore(state => state.loadingPreviewImage);
  const setPreviewImage = useBoundStore(state => state.setPreviewImage);
  const openExport = useBoundStore(state => state.openExport);
  const tileSize = useBoundStore(state => state.editor.size);
  const setTileSize = useBoundStore(state => state.editor.setEditorSize);
  const tileCols = useBoundStore(state => state.preview.cols);
  const setTileCols = useBoundStore(state => state.preview.setPreviewCols);
  // ????
  const updateEditor = useBoundStore(state => state.editor.updateEditor);
  const updatePreview = useBoundStore(state => state.preview.updatePreview);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    // call loading action to reset status and trigger re-renders
    loadingPreviewImage();
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setPreviewImage(e.target.result as string); // Set the image source in state
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorPalette = () => {
    setPreviewImage(colorTiles)
  };
  
  const handleDownload = () => {
    openExport();
  };


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
          step={0.01}
          min={3}
          max={7}
          list="size-markers"
          className="editor-form__slider"
          value={getBaseLog(tileSize, 2)}
          onChange={handleChangeSize}
        />
        <span className="editor-form__value">{uptoFixed(tileSize, 2)}</span>
      </label>

      <label className="editor-form__label">
        Rows:
        <input
          name="imageCols"
          type="range"
          step={1}
          min={2}
          max={32}
          className="editor-form__slider"
          value={tileCols}
          onChange={handleChangeCol}
        />
        <span className="editor-form__value">{tileCols}</span>
      </label>
      <div className="image-uploader">
      </div>
      <div className="editor-form__actions">
        <label className="editor-form__button">
          <input type ="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
          <FaFileImage className="editor-form__uploader-icon" />
        </label>
        <button className="editor-form__button" onClick={handleColorPalette}>
          <FaPalette className="editor-form__palette-icon" />
        </button>
        <button className="editor-form__button" onClick={handleDownload}>
          <FaDownload className="editor-form__download-icon" />
        </button>
      </div>
    </div>
  );
};

export default PreviewForm;
