import { useCallback, useEffect, useRef } from "react";
import useTileStore from "../stores/useTileStore";
import TileMap from "../engine/TileMap";
import { clearCanvas, drawImage, drawOutline, drawText } from "../helpers/canvas";

function usePreviewEditor(ctx: CanvasRenderingContext2D | null, previewWidth: number, previewHeight: number, showGrid: boolean) {
  const frameRef = useRef<number | null>(null);
  
  const input = useTileStore(state => state.preview.input);
  const map = useTileStore(state => state.preview.map);
  const setupPreview = useTileStore(state => state.setupPreview);
  const destroyPreview = useTileStore(state => state.destroyPreview);

  const drawTileNumber = (ctx: CanvasRenderingContext2D, map: TileMap, col: number, row: number) => {
    const tileNum = map.getTileIndex(col, row) + 1;
    const tileCol = col * map.tileSize;
    const tileRow = row * map.tileSize;
    const x = tileCol + map.tileSize / 4;
    const y = tileRow +  map.tileSize / 4;

    drawText(ctx, x , y, `${tileNum}`);
  }

  const drawLayer = useCallback((layer: number) => {
    if (!ctx || !map || !input) return;

    // Convert to tile coordinates
    let hoveredTile = null;
    const { mouse } = input;
    const mouseCol = Math.floor(mouse.x / map.tileSize);
    const mouseRow = Math.floor(mouse.y / map.tileSize);

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
        const tile = map.getTile(layer, col, row);
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
    
    drawLayer(0);
    // drawLayer(1);
  }, [ctx, drawLayer]);

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

export default usePreviewEditor;
