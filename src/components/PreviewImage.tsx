import React, { useRef, useState } from "react";
import layerImage from '../assets/tilemap1layer.png'

import usePreviewRenderer from "../hooks/usePreviewRenderer";

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

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      setCtx(canvas.getContext("2d"));
      canvas.width = PREVIEW_WIDTH;
      canvas.height = PREVIEW_HEIGHT;
    }
  }, []);

  // useTileMapRenderer(ctx, PREVIEW_WIDTH, PREVIEW_HEIGHT, true);
  usePreviewRenderer(ctx, PREVIEW_WIDTH, PREVIEW_HEIGHT, true);

  return (
    <div className="preview-image">
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
    </div>
  );
};

export default PreviewImage;
