import React, { useRef, useState } from "react";
import layerImage from '../assets/tilemap1layer.png'

import useTileMapRenderer from "../hooks/useTileMapRenderer";

const GAME_WIDTH = 512;
const GAME_HEIGHT = 512;
// const GAME_WIDTH = 768;
// const GAME_HEIGHT = 768;



const TileCamera: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  // ui 
  const [showGrid, setShowGrid] = useState<boolean>(true);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      setCtx(canvas.getContext("2d"));
      canvas.width = GAME_WIDTH;
      canvas.height = GAME_HEIGHT;
    }
  }, []);

  useTileMapRenderer(ctx, GAME_WIDTH, GAME_HEIGHT, showGrid);

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{
          border: '1px solid black',
          background: '#ffaaaa',
          width: '384px',
          height: '384px',
          imageRendering: 'pixelated',
        }}
      />
      
     

      <img
        alt="Hidden tilemap source img"
        src={layerImage}
        id="tilemap-source"
        style={{
          // visibility: 'hidden',
        }}
      />
      <button onClick={() => { setShowGrid(!showGrid) }}>Grid</button>
    </div>
  );
};

export default TileCamera;
