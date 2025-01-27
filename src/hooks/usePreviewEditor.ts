import { useCallback, useEffect, useRef } from "react";
import TileMap from "../engine/TileMap";
import { clearCanvas, drawCircle, drawImage, drawOutline, drawText } from "../helpers/canvas";
import useBoundStore from "../stores/useBoundStore";

function usePreviewEditor(ctx: CanvasRenderingContext2D | null, previewWidth: number, previewHeight: number, showGrid: boolean) {
  const frameRef = useRef<number | null>(null);
  const prevTimeRef = useRef<number>(0);
   
  const input = useBoundStore(state => state.editor.input);
  const map = useBoundStore(state => state.editor.map);
  const viewport = useBoundStore(state => state.editor.viewport);
  const setupEditor = useBoundStore(state => state.editor.setupEditor);
  const moveCamera = useBoundStore(state => state.editor.updateEditorCamera);
  const destroyEditor = useBoundStore(state => state.editor.destroyEditor);  

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

  const drawTileNumber = (
    ctx: CanvasRenderingContext2D,
    map: TileMap,
    x: number,
    y: number,
    col: number,
    row: number
  ) => {
    const tileNum = map.getTileIndex(col, row) + 1;
    const cornerX = x + map.tileSize / 4;
    const cornerY = y +  map.tileSize / 4;

    drawText(ctx, cornerX , cornerY, `${tileNum}`);
  }

  const drawLayer = useCallback((layer: number) => {
    if (!ctx || !map || !input || !viewport) return;

    // Convert to tile coordinates
    let hoveredTile = null;
    const { mouse } = input;
    const { offset, startTile, endTile } = viewport;

    const mouseCol = mouse.x / map.tileSize;
    const mouseRow = mouse.y / map.tileSize;
    const offMouseX = viewport.getViewportMouseX(mouseCol);
    const offMouseY = viewport.getViewportMouseY(mouseRow);
    const offMouseCol = Math.floor(offMouseX / map.tileSize);
    const offMouseRow = Math.floor(offMouseY / map.tileSize);

    // draw full preview image
    // and NOT fit it in preview size
    drawImage(
      ctx,
      map.image,
      offset.x + 0,
      offset.y + 0,
      map.cols * map.tileSize,
      map.rows * map.tileSize,
    );

    // tile grid
    for (let row = startTile.y; row <= endTile.y; row++) {
      for (let col = startTile.x; col <= endTile.x; col++) {
        const tile = map.getTile(layer, col, row);
        const x = viewport.getViewportX(col);
        const y = viewport.getViewportY(row);
        
        // hover tile
        if (offMouseCol === col && offMouseRow === row) {
          hoveredTile = { col, row };
        }

        // draw
        drawTileNumber(ctx, map, x, y, col, row);
        if (showGrid) {
          drawOutline(
            ctx,
            x,
            y,
            map.tileSize,
            map.tileSize,
          );
        }
      }
    }

    // draw hovered tile on top on everything
    if (hoveredTile) {
      // console.log('hocer', map.tileSize, map.getTileIndex(hoveredTile.col, hoveredTile.row) + 1);
          
      drawOutline(
        ctx,
        viewport.getViewportX(hoveredTile.col),
        viewport.getViewportY(hoveredTile.row),
        map.tileSize,
        map.tileSize,
        '#ffcccc',
        2
      );
    }

    // Debug mouse potion on canvas
    drawCircle(ctx, mouse.x, mouse.y, 5, "red")

  }, [ctx, input, map, viewport, showGrid]);
  
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
