import { useCallback, useEffect, useRef } from "react";
import TileMap from "../engine/TileMap";
import { clearCanvas, drawCircle, drawImageTile, drawOutline, drawText } from "../helpers/canvas";
import useBoundStore from "../stores/useBoundStore";
import { MouseButtons, MouseXY } from "../engine/Input";
import Viewport from "../engine/Viewport";
import { MAX_TEXT_SIZE } from "../helpers/constants";

function useEditorRender(ctx: CanvasRenderingContext2D | null, previewWidth: number, previewHeight: number, showGrid: boolean) {
  const frameRef = useRef<number | null>(null);
  const prevTimeRef = useRef<number>(0);
  
  const tileBrush = useBoundStore(state => state.tileBrush); 
  const activeLayer = useBoundStore(state => state.activeLayer); 
  const input = useBoundStore(state => state.editor.input);
  const map = useBoundStore(state => state.editor.map);
  const viewport = useBoundStore(state => state.editor.viewport);
  const setupEditor = useBoundStore(state => state.editor.setupEditor);
  const moveCamera = useBoundStore(state => state.editor.updateEditorCamera);
  const destroyEditor = useBoundStore(state => state.editor.destroyEditor);  
  
  const getOffsetMouse = (mouse: MouseXY, map: TileMap, viewport: Viewport) => {
    const mouseCol = mouse.x / map.tileSize;
    const mouseRow = mouse.y / map.tileSize;
    const offMouseX = viewport.getViewportMouseX(mouseCol);
    const offMouseY = viewport.getViewportMouseY(mouseRow);
    const offMouseCol = Math.floor(offMouseX / map.tileSize);
    const offMouseRow = Math.floor(offMouseY / map.tileSize);

    return {
      mouseCol: offMouseCol,
      mouseRow: offMouseRow,
      mouseX: offMouseX,
      mouseY: offMouseY,
    };
  }

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

    const size = Math.min(MAX_TEXT_SIZE, map.tileSize / 3);
    drawText(ctx, cornerX , cornerY, `${tileNum}`, { size, color: 'black', opacity: 0.2 });
  }

  const updateCamera = useCallback((deltaTime: number) => {
    if (!ctx || !input || !map || !viewport) return;

    let speedX = 0;
    let speedY = 0;
    const { keys, mouse } = input;
    
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

    // typescript enum weirdness, do NOT use MouseButtons.MOUSE_L (=0, we need 'MOUSE_L')
    if (keys[0] === MouseButtons[MouseButtons.MOUSE_L]) {
      const { mouseCol, mouseRow } = getOffsetMouse(mouse, map, viewport);
      map.setTargetTile(mouseCol, mouseRow);

      const curTile = map.getTile(mouseCol, mouseRow, activeLayer);
      if (tileBrush && curTile !== tileBrush) {
        map.setLayerAtTile(tileBrush, mouseCol, mouseRow, activeLayer);
      }
    }

    moveCamera(deltaTime, speedX, speedY);
  }, [ctx, activeLayer, input, map, viewport, tileBrush, moveCamera]);

  const drawLayer = useCallback((layer: number) => {
    if (!ctx || !map || !viewport) return;

    const { startTile, endTile } = viewport;
    const endCol = Math.min(endTile.x, map.layers[layer].length / map.rows);
    const endRow = Math.min(endTile.y, map.layers[layer].length / map.cols);

    // tile grid
    for (let row = startTile.y; row <= endRow; row++) {
      for (let col = startTile.x; col <= endCol; col++) {
        const tile = map.getTile(col, row, layer);
        const x = viewport.getViewportX(col);
        const y = viewport.getViewportY(row);

        // draw image tile
        drawImageTile(
          ctx,
          map.image,
          x,
          y,
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

  const drawOverlays = useCallback(() => {
    if (!ctx || !map || !input || !viewport) return;

    // Convert to tile coordinates
    let hoveredTile = null;
    const { mouse } = input;
    const { startTile, endTile } = viewport;
    const endCol = Math.min(endTile.x, map.layers[0].length / map.rows);
    const endRow = Math.min(endTile.y, map.layers[0].length / map.cols);

    const { mouseCol, mouseRow } = getOffsetMouse(mouse, map, viewport);

    // tile grid
    for (let row = startTile.y; row <= endRow; row++) {
      for (let col = startTile.x; col <= endCol; col++) {
        const x = viewport.getViewportX(col);
        const y = viewport.getViewportY(row);
        
        // hover tile
        if (input.focused && mouseCol === col && mouseRow === row) {
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
            'black',
            1,
            0.1,
          );
        }
      }
    }

    // draw hovered tile on top on everything
    if (hoveredTile) {          
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
    
    if (input.focused) {
      // Debug mouse potion on canvas
      drawCircle(ctx, mouse.x, mouse.y, 5, "red")
    }

  }, [ctx, input, map, viewport, showGrid]);

  const drawAllLayers = useCallback(() => {
    if  (map) {
      map.layers.forEach((_, i) => {
        drawLayer(i);
      });
    }
  }, [map, drawLayer]);
  
  const draw = useCallback(() => {
    if (!ctx || !map) return;
    // setup canvas config
    ctx.imageSmoothingEnabled = false;
    clearCanvas(ctx, 'gray');
    
    drawAllLayers();
    drawOverlays();
  }, [ctx, map, drawAllLayers, drawOverlays]);

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

export default useEditorRender;
