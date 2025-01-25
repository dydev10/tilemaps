import React, { useRef, useState } from "react";
import layerImage from '../assets/tilemap1layer.png'

import useTileMapRenderer from "../hooks/useTileMapRenderer";

const GAME_WIDTH = 512;
const GAME_HEIGHT = 512;
// const GAME_WIDTH = 768;
// const GAME_HEIGHT = 768;



const PreviewImage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  // ui 

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      setCtx(canvas.getContext("2d"));
      canvas.width = GAME_WIDTH;
      canvas.height = GAME_HEIGHT;
    }
  }, []);

  useTileMapRenderer(ctx, GAME_WIDTH, GAME_HEIGHT, true);

  return (
    <div className="preview-image">
      <img
        alt="Hidden tilemap source img"
        src={layerImage}
        id="tilemap-source"
        style={{
          // visibility: 'hidden',
        }}
      />
    </div>
  );
};

export default PreviewImage;
