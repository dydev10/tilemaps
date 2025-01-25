import { useCallback, useEffect, useRef } from "react";
import useTileStore from "../stores/useTileStore";

function useTileMapRenderer(ctx: CanvasRenderingContext2D | null, gameWidth: number, gameHeight: number, showGrid: boolean) {
  const input = useTileStore(state => state.input);
  const map = useTileStore(state => state.map);
  const camera = useTileStore(state => state.camera);
  const setupLayers = useTileStore(state => state.setupLayers);
  const destroyTiles = useTileStore(state => state.destroyTiles);
  
  const frameRef = useRef<number | null>(null);
  const prevTimeRef = useRef<number>(0);

  const updateCamera = useCallback((deltaTime: number) => {
    if (!ctx || !input || !camera) return;

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
    camera.move(deltaTime, speedX, speedY);
  }, [ctx, input, camera]);

  const drawLayer = useCallback((layer: number) => {
    if (!ctx || !map || !camera) return;

    const startCol = Math.floor(camera.x / map.tileSize);
    const endCol = startCol + (camera.width / map.tileSize);
    const startRow = Math.floor(camera.y / map.tileSize);
    const endRow = startRow + (camera.height / map.tileSize);
    
    const offsetX = -camera.x + startCol * map.tileSize;
    const offsetY = -camera.y + startRow * map.tileSize;

    // grid
    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const tile = map.getTile(layer, col, row);
        const x = (col - startCol) * map.tileSize + offsetX;
        const y = (row - startRow) * map.tileSize + offsetY;

        ctx.drawImage(
          map.image,
          ((tile - 1) * map.imageTile) % map.image.width,  // sx,
          Math.floor((tile - 1) / map.imageCols) * map.imageTile,  // sy,
          map.imageTile,  // sw,
          map.imageTile,  // sh,
          Math.round(x),
          Math.round(y),
          map.tileSize,
          map.tileSize
        );

        if (showGrid) {
          ctx.strokeRect(
            Math.round(x),
            Math.round(y),
            map.tileSize,
            map.tileSize,
          );
        }
      }
    }
  }, [ctx, map, camera, showGrid]);
  
  const draw = useCallback(() => {
    if (!ctx) return;
    // setup canvas config
    ctx.imageSmoothingEnabled = false;

    drawLayer(0);
    drawLayer(1);
  }, [ctx, drawLayer]);

  const frame = useCallback((time: DOMHighResTimeStamp) => {
    const deltaTime = (time - prevTimeRef.current) / 1000; 
    prevTimeRef.current = time; 
    
    updateCamera(deltaTime);
    draw();
    
    frameRef.current = requestAnimationFrame(frame);
  }, [updateCamera, draw]);

  useEffect(() => {
    setupLayers(gameWidth, gameHeight)

    return () => {
      destroyTiles();
    }
  }, [gameWidth, gameHeight, setupLayers, destroyTiles]);

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

export default useTileMapRenderer;
