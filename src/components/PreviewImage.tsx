import React, { MouseEvent, useCallback, useRef, useState } from "react";
import usePreviewRenderer from "../hooks/usePreviewRenderer";
import useBoundStore from "../stores/useBoundStore";

// const PREVIEW_WIDTH = 256;
// const PREVIEW_HEIGHT = 256;
const PREVIEW_WIDTH = 512;
const PREVIEW_HEIGHT = 512;




const PreviewImage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  // ui
  const updatePreviewInput = useBoundStore(state => state.preview.updatePreviewInput);
  const updatePreviewFocus = useBoundStore(state => state.preview.updatePreviewFocus);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      setCtx(canvas.getContext("2d"));
      canvas.width = PREVIEW_WIDTH;
      canvas.height = PREVIEW_HEIGHT;
    }
  }, []);

  usePreviewRenderer(ctx, PREVIEW_WIDTH, PREVIEW_HEIGHT, true);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // Get mouse position relative to the canvas
    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;

    updatePreviewInput({ mouse: { x: mouseX, y: mouseY } });
  }, [updatePreviewInput]);

  const handleMouseEnter = useCallback(() => {
    updatePreviewFocus(true);
  }, [updatePreviewFocus]);

  const handleMouseLeave = useCallback(() => {
    updatePreviewFocus(false);
  }, [updatePreviewFocus]);

  return (
    <div className="preview-image">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          border: '1px solid black',
          background: '#ffaaaa',
          // width: '384px',
          // height: '384px',
          imageRendering: 'pixelated',
        }}
      />
    </div>
  );
};

export default PreviewImage;
