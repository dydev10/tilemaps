import { useCallback, useEffect, useRef } from "react";
import TileMap from "../engine/TileMap";
import { clearCanvas, drawImage, drawOutline, drawText } from "../helpers/canvas";
import useBoundStore from "../stores/useBoundStore";
import { MouseXY } from "../engine/Input";

function usePreviewRenderer(ctx: CanvasRenderingContext2D | null, previewWidth: number, previewHeight: number, showGrid: boolean) {
  const frameRef = useRef<number | null>(null);
  
  const input = useBoundStore(state => state.preview.input);
  const map = useBoundStore(state => state.preview.map);
  const setupPreview = useBoundStore(state => state.preview.setupPreview);
  const destroyPreview = useBoundStore(state => state.preview.destroyPreview);

  const getMouseTile = (mouse: MouseXY, map: TileMap) => {
    const mouseCol = Math.floor(mouse.x / map.tileSize);
    const mouseRow = Math.floor(mouse.y / map.tileSize);

    return {
      mouseCol,
      mouseRow,
    };
  }
  
  
  const drawTileNumber = (ctx: CanvasRenderingContext2D, map: TileMap, col: number, row: number) => {
    const tileNum = map.getTileIndex(col, row) + 1;
    const tileCol = col * map.tileSize;
    const tileRow = row * map.tileSize;
    const x = tileCol + map.tileSize / 4;
    const y = tileRow +  map.tileSize / 4;

    drawText(ctx, x , y, `${tileNum}`);
  }

  const drawTiles = useCallback(() => {
    if (!ctx || !map || !input) return;

    // Convert to tile coordinates
    let hoveredTile = null;
    const { mouse } = input;
    const { mouseCol, mouseRow } = getMouseTile(mouse, map);

    // draw full preview image and fit it in preview size
    drawImage(
      ctx,
      map.image,
      0,
      0,
      previewWidth,
      previewHeight,
    );

    // tile grid
    for (let row = 0; row < map.rows; row++) {
      for (let col = 0; col < map.cols; col++) {
        // hover tile
        if (mouseCol === col && mouseRow === row) {
          hoveredTile = { col, row };
        }

        // draw
        drawTileNumber(ctx, map, col, row);
        if (showGrid) {
          drawOutline(
            ctx,
            col * map.tileSize,
            row * map.tileSize,
            map.tileSize,
            map.tileSize,
          );
        }
      }
    }

    // draw hovered tile on top on everything
    if (hoveredTile) {      
      drawOutline(
        ctx,
        hoveredTile.col * map.tileSize,
        hoveredTile.row * map.tileSize,
        map.tileSize,
        map.tileSize,
        '#ffcccc',
        2
      );
    }
  }, [ctx, previewHeight, previewWidth, map, input, showGrid]);
  
  const draw = useCallback(() => {
    if (!ctx) return;
    // setup canvas config
    ctx.imageSmoothingEnabled = false;
    clearCanvas(ctx, '#ffeeee');
    
    drawTiles();
  }, [ctx, drawTiles]);

  const frame = useCallback(() => {
    draw();
    
    frameRef.current = requestAnimationFrame(frame);
  }, [draw]);

  useEffect(() => {
    setupPreview(previewWidth, previewHeight)

    return () => {
      destroyPreview();
    }
  }, [previewWidth, previewHeight, setupPreview, destroyPreview]);

  // start frame loop
  useEffect(() => {
    frameRef.current = requestAnimationFrame(frame);
    
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    }
  }, [frame]);

  return draw;
}

export default usePreviewRenderer;
