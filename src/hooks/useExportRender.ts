import { useCallback, useEffect } from "react";
import { clearCanvas, drawImageTile } from "../helpers/canvas";
import useBoundStore from "../stores/useBoundStore";

function useExportRender(ctx: CanvasRenderingContext2D | null) {
  
  const map = useBoundStore(state => state.editor.map);
  const viewport = useBoundStore(state => state.editor.viewport);
  const tileSize = useBoundStore(state => state.editor.size);

  const drawLayer = useCallback((layer: number) => {
    if (!ctx || !map || !viewport) return;

    // tile grid
    for (let row = 0; row <= map.rows; row++) {
      for (let col = 0; col <= map.cols; col++) {
        const tile = map.getTile(col, row, layer);
        
        // draw image tile
        drawImageTile(
          ctx,
          map.image,
          col * map.tileSize,
          row * map.tileSize,
          map.tileSize,
          map.tileSize,
          {
            x: ((tile - 1) * map.imageTile) % map.image.width,
            y: Math.floor((tile - 1) / map.imageCols) * map.imageTile,
            width: map.imageTile,
            height: map.imageTile,
          },
        );
      }
    }
  }, [ctx, map, viewport]);
  
  const draw = useCallback(() => {
    if (!ctx) return;
    // setup canvas config
    ctx.imageSmoothingEnabled = false;
    clearCanvas(ctx, 'transparent');

    if(map) {
      ctx.canvas.width = tileSize * map.cols;
      ctx.canvas.height = tileSize * map.rows;
      
      drawLayer(0);
      // drawLayer(1);
    }    
  }, [ctx, drawLayer, tileSize, map]);

  useEffect(() => {
    draw();
  }, [draw]);

  return draw;
}

export default useExportRender;
