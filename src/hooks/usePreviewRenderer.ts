import { useCallback, useEffect, useRef } from "react";
import TileMap from "../engine/TileMap";
import { clearCanvas, drawImage, drawOutline, drawText } from "../helpers/canvas";
import useBoundStore from "../stores/useBoundStore";
import { MouseButtons, MouseXY } from "../engine/Input";
import { MAX_TEXT_SIZE } from "../helpers/constants";

function usePreviewRenderer(ctx: CanvasRenderingContext2D | null, previewWidth: number, previewHeight: number, showGrid: boolean) {
  const frameRef = useRef<number | null>(null);
  
  const tileBrush = useBoundStore(state => state.tileBrush);
  const setTileBrush = useBoundStore(state => state.setTileBrush);
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

    const size = Math.min(MAX_TEXT_SIZE, map.tileSize / 3);
    drawText(ctx, x , y, `${tileNum}`, { size, color: 'white', opacity: 0.6 });
  }

  const updateControls = useCallback(() => {
      if (!ctx || !input || !map) return;
  
      const { keys, mouse } = input;
      
      // typescript enum weirdness, do NOT use MouseButtons.MOUSE_L (=0, we need 'MOUSE_L')
      if (keys[0] === MouseButtons[MouseButtons.MOUSE_L]) {
        const { mouseCol, mouseRow } = getMouseTile(mouse, map);
        const curTile = map.getTile(0, mouseCol, mouseRow);
          
        if (curTile && curTile !== tileBrush) {
          setTileBrush(curTile);
        }
      }
    }, [ctx, input, map, tileBrush, setTileBrush]);

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
        '#5ee9b5',
        4
      );
    }
  }, [ctx, previewHeight, previewWidth, map, input, showGrid]);
  
  const draw = useCallback(() => {
    if (!ctx) return;
    // setup canvas config
    ctx.imageSmoothingEnabled = false;
    clearCanvas(ctx, '#ffeeee');
    
    updateControls();
    drawTiles();
  }, [ctx, drawTiles, updateControls]);

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
