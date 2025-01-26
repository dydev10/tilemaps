import { useCallback, useEffect, useRef } from "react";
import useTileStore from "../stores/useTileStore";
import TileMap from "../engine/TileMap";

function usePreviewRenderer(ctx: CanvasRenderingContext2D | null, previewWidth: number, previewHeight: number, showGrid: boolean) {
  const frameRef = useRef<number | null>(null);
  
  const input = useTileStore(state => state.preview.input);
  const map = useTileStore(state => state.preview.map);
  const setupPreview = useTileStore(state => state.setupPreview);
  const destroyPreview = useTileStore(state => state.destroyPreview);

  const drawTileNumber = (ctx: CanvasRenderingContext2D, map: TileMap, col: number, row: number) => {
    const tileNum = map.getTileIndex(col, row) + 1;
    const x = col * map.tileSize;
    const y = row * map.tileSize;

    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${tileNum}`, x + map.tileSize / 4, y +  map.tileSize / 4);
  }

  const drawLayer = useCallback((layer: number) => {
    if (!ctx || !map || !input) return;

    // Convert to tile coordinates
    let hoveredTile = null;
    const { mouse } = input;
    const mouseCol = Math.floor(mouse.x / map.tileSize);
    const mouseRow = Math.floor(mouse.y / map.tileSize);

    ctx.fillStyle = "#ffeeee";
    ctx.fillRect(0, 0, previewWidth, previewHeight);  

    ctx.drawImage(
      map.image,
      0,  // sx,
      0,  // sy,
      map.image.width,  // sw,
      map.image.height,  // sh,
      0,
      0,
      previewWidth,
      previewHeight,
    );

    // grid
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
          ctx.strokeStyle = "black";
          ctx.lineWidth = 1;
          ctx.strokeRect(
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
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.strokeRect(
        hoveredTile.col * map.tileSize,
        hoveredTile.row * map.tileSize,
        map.tileSize,
        map.tileSize,
      );
    }
  }, [ctx, previewHeight, previewWidth, map, input, showGrid]);
  
  const draw = useCallback(() => {
    if (!ctx) return;
    // setup canvas config
    ctx.imageSmoothingEnabled = false;

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

export default usePreviewRenderer;
