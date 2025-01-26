import { useCallback, useEffect, useRef } from "react";
import useTileStore from "../stores/useTileStore";
import TileMap from "../engine/TileMap";
import { clearCanvas, drawCircle, drawImage, drawOutline, drawText } from "../helpers/canvas";

function usePreviewEditor(ctx: CanvasRenderingContext2D | null, previewWidth: number, previewHeight: number, showGrid: boolean) {
  const frameRef = useRef<number | null>(null);
  const prevTimeRef = useRef<number>(0);
  
  const input = useTileStore(state => state.editor.input);
  const map = useTileStore(state => state.editor.map);
  const viewport = useTileStore(state => state.editor.viewport);
  const setupEditor = useTileStore(state => state.setupEditor);
  const moveCamera = useTileStore(state => state.updateEditorCamera);
  const destroyEditor = useTileStore(state => state.destroyEditor);  

  const updateCamera = useCallback((deltaTime: number) => {
    if (!ctx || !input) return;

    let speedX = 0;
    let speedY = 0;
    const { keys } = input;
    
    if (keys.length && keys[0] === 'KeyA') {
      speedX = -1;
    }
    if (keys.length && keys[0] === 'KeyD') {
      speedX = 1;
    }
    if (keys.length && keys[0] === 'KeyW') {
      speedY = -1;
    }
    if (keys.length && keys[0] === 'KeyS') {
      speedY = 1;
    }    

    moveCamera(deltaTime, speedX, speedY);
  }, [ctx, input, moveCamera]);

  const drawTileNumber = (ctx: CanvasRenderingContext2D, map: TileMap, col: number, row: number) => {
    const tileNum = map.getTileIndex(col, row) + 1;
    const tileCol = col * map.tileSize;
    const tileRow = row * map.tileSize;
    const x = tileCol + map.tileSize / 4;
    const y = tileRow +  map.tileSize / 4;

    drawText(ctx, x , y, `${tileNum}`);
  }

  const drawLayer = useCallback((layer: number) => {
    if (!ctx || !map || !input || !viewport) return;

    // Convert to tile coordinates
    let hoveredTile = null;
    const { mouse } = input;
    const { offset, startTile, endTile } = viewport;

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
    for (let row = startTile.y; row <= endTile.y; row++) {
      for (let col = startTile.x; col <= endTile.x; col++) {
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
            offset.x + col * map.tileSize,
            offset.y + row * map.tileSize,
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
        offset.x + hoveredTile.col * map.tileSize,
        offset.y + hoveredTile.row * map.tileSize,
        map.tileSize,
        map.tileSize,
        '#ffcccc',
        2
      );
    }

    // Debug mouse potion on canvas
    drawCircle(ctx, mouse.x, mouse.y, 5, "red")

  }, [ctx, previewHeight, previewWidth, input, map, viewport, showGrid]);
  
  const draw = useCallback(() => {
    if (!ctx) return;
    // setup canvas config
    ctx.imageSmoothingEnabled = false;
    clearCanvas(ctx, '#ffeeee');
    
    drawLayer(0);
    // drawLayer(1);
  }, [ctx, drawLayer]);

  const frame = useCallback((time: DOMHighResTimeStamp) => {
    const deltaTime = (time - prevTimeRef.current) / 1000; 
    prevTimeRef.current = time; 
    
    updateCamera(deltaTime);
    draw();
    
    frameRef.current = requestAnimationFrame(frame);
  }, [updateCamera, draw]);

  useEffect(() => {
    setupEditor(previewWidth, previewHeight)

    return () => {
      destroyEditor();
    }
  }, [previewWidth, previewHeight, setupEditor, destroyEditor]);

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
