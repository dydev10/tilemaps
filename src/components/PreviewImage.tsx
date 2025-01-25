import React, { ChangeEvent, useRef, useState } from "react";
// import layerImage from '../assets/tilemap1layer.png'
import worldImage from '../assets/worldtileset.png'
import fullMap from '../assets/fullMap.png'

import usePreviewRenderer from "../hooks/usePreviewRenderer";
import useTileStore from "../stores/useTileStore";

// const PREVIEW_WIDTH = 256;
// const PREVIEW_HEIGHT = 256;
const PREVIEW_WIDTH = 512;
const PREVIEW_HEIGHT = 512;
// const GAME_WIDTH = 768;
// const GAME_HEIGHT = 768;



const PreviewImage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  // ui 
  const updatePreview = useTileStore(state => state.updatePreview);
  // const activeTileProp = useTileStore(state => state.preview.active);
  const tileSize = useTileStore(state => state.preview.size);
  const tileCols = useTileStore(state => state.preview.cols);
  const setTileSize = useTileStore(state => state.setPreviewSize);
  const setTileCols = useTileStore(state => state.setPreviewCols);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      setCtx(canvas.getContext("2d"));
      canvas.width = PREVIEW_WIDTH;
      canvas.height = PREVIEW_HEIGHT;
    }
  }, []);

  usePreviewRenderer(ctx, PREVIEW_WIDTH, PREVIEW_HEIGHT, true);


  const handleApplySize = () => {
    updatePreview({
      tileSize,
    });
  }

  const handleChangeSize = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTileSize(parseInt(value, 10));
  }

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
    <div className="preview-image">
      <canvas
        ref={canvasRef}
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
      
      {/* <img
        alt="Hidden tilemap source img"
        src={worldImage}
        id="tilemap-source"
        style={{
          // visibility: 'hidden',
          display: 'none',
        }}
      /> */}

      <img
        alt="Hidden tilemap source img"
        src={fullMap}
        id="tilemap-source"
        style={{
          // visibility: 'hidden',
          display: 'none',
        }}
      />
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

export default PreviewImage;
