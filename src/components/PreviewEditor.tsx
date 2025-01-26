import React, { ChangeEvent, MouseEvent, useCallback, useRef, useState } from "react";
// import layerImage from '../assets/tilemap1layer.png'
import worldImage from '../assets/worldtileset.png'
import fullMap from '../assets/fullMap.png'
import usePreviewEditor from "../hooks/usePreviewEditor";
import useBoundStore from "../stores/useBoundStore";

// const PREVIEW_WIDTH = 256;
// const PREVIEW_HEIGHT = 256;
const PREVIEW_WIDTH = 512;
const PREVIEW_HEIGHT = 512;
// const GAME_WIDTH = 768;
// const GAME_HEIGHT = 768;



const PreviewEditor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  // ui 
  const tileSize = useBoundStore(state => state.editor.size);
  const tileCols = useBoundStore(state => state.editor.cols);
  const updateEditor = useBoundStore(state => state.editor.updateEditor);
  const updateEditorInput = useBoundStore(state => state.editor.updateEditorInput);
  const setTileSize = useBoundStore(state => state.editor.setEditorSize);
  const setTileCols = useBoundStore(state => state.editor.setEditorCols);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      setCtx(canvas.getContext("2d"));
      canvas.width = PREVIEW_WIDTH;
      canvas.height = PREVIEW_HEIGHT;
    }
  }, []);

  usePreviewEditor(ctx, PREVIEW_WIDTH, PREVIEW_HEIGHT, true);


  const handleApplySize = () => {
    updateEditor({
      tileSize,
    });
  }

  const handleChangeSize = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTileSize(parseInt(value, 10));
  }

  const handleApplyCol = () => {
    updateEditor({
      tileCols,
    });
  }

  const handleChangeCol = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTileCols(parseInt(value, 10));
  }

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // Get mouse position relative to the canvas
    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;

    updateEditorInput({ mouse: { x: mouseX, y: mouseY } });
  }, [updateEditorInput]);

  return (
    <div className="preview-image">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        style={{
          border: '1px solid black',
          background: '#ffaaaa',
          // width: '384px',
          // height: '384px',
          imageRendering: 'pixelated',
        }}
      />
      
      {/* <img
        alt="Hidden tilemap source img"
        src={layerImage}
        id="tilemap-source"
        style={{
          // visibility: 'hidden',
          display: 'none',
        }}
      /> */}
      
      <img
        alt="Hidden tilemap source img"
        src={worldImage}
        id="tilemap-source"
        style={{
          // visibility: 'hidden',
          display: 'none',
        }}
      />

      {/* <img
        alt="Hidden tilemap source img"
        src={fullMap}
        id="tilemap-source"
        style={{
          // visibility: 'hidden',
          display: 'none',
        }}
      /> */}
      <span>
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

export default PreviewEditor;
