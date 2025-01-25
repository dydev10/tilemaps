import { useCallback, useEffect, useRef } from "react";
import useTileStore from "../stores/useTileStore";

function usePreviewRenderer(ctx: CanvasRenderingContext2D | null, previewWidth: number, previewHeight: number, showGrid: boolean) {
  // const input = useTileStore(state => state.preview.input);
  const map = useTileStore(state => state.preview.map);
  const setupPreview = useTileStore(state => state.setupPreview);
  const destroyPreview = useTileStore(state => state.destroyPreview);

  const drawLayer = useCallback((layer: number) => {
    if (!ctx || !map) return;


    ctx.drawImage(
      map.image,
      0,  // sx,
      0,  // sy,
      map.image.width,  // sw,
      map.image.height,  // sh,
      0,
      0,
      previewWidth,
      previewHeight
    );

    // grid
    for (let row = 0; row <= map.rows; row++) {
      for (let col = 0; col <= map.cols; col++) {
        const tile = map.getTile(layer, col, row);

        // ctx.drawImage(
        //   map.image,
        //   ((tile - 1) * map.imageTile) % map.image.width,  // sx,
        //   Math.floor((tile - 1) / map.imageCols) * map.imageTile,  // sy,
        //   map.imageTile,  // sw,
        //   map.imageTile,  // sh,
        //   col * map.tileSize,
        //   row * map.tileSize,
        //   map.tileSize,
        //   map.tileSize
        // );

        if (showGrid) {
          ctx.strokeRect(
            col * map.tileSize,
            row * map.tileSize,
            map.tileSize,
            map.tileSize,
          );
        }
      }
    }
  }, [ctx, previewHeight, previewWidth, map, showGrid]);
  
  const draw = useCallback(() => {
    if (!ctx) return;
    // setup canvas config
    ctx.imageSmoothingEnabled = false;

    drawLayer(0);
    drawLayer(1);
  }, [ctx, drawLayer]);

  useEffect(() => {
    setupPreview(previewWidth, previewHeight)

    return () => {
      destroyPreview();
    }
  }, [previewWidth, previewHeight, setupPreview, destroyPreview]);

  // start frame loop
  useEffect(() => {
    draw();
  }, [draw]);

  return draw;
}

export default usePreviewRenderer;
