import React, { MouseEvent, useCallback, useRef, useState, WheelEvent } from "react";
import useEditorRender from "../hooks/useEditorRender";
import useBoundStore from "../stores/useBoundStore";

// const PREVIEW_WIDTH = 256;
// const PREVIEW_HEIGHT = 256;
const EDITOR_WIDTH = 512;
const EDITOR_HEIGHT = 512;
// const GAME_WIDTH = 768;
// const GAME_HEIGHT = 768;



const EditorCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  // ui 
  const updateEditorInput = useBoundStore(state => state.editor.updateEditorInput);
  const updateEditorScroll = useBoundStore(state => state.editor.updateEditorScroll);
  const updateEditorFocus = useBoundStore(state => state.editor.updateEditorFocus);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      setCtx(canvas.getContext("2d"));
      canvas.width = EDITOR_WIDTH;
      canvas.height = EDITOR_HEIGHT;
    }
  }, []);

  useEditorRender(ctx, EDITOR_WIDTH, EDITOR_HEIGHT, true);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // Get mouse position relative to the canvas
    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;

    updateEditorInput({ mouse: { x: mouseX, y: mouseY } });
  }, [updateEditorInput]);

  const handleMouseEnter = useCallback(() => {
    updateEditorFocus(true);
    }, [updateEditorFocus]);
  
  const handleMouseLeave = useCallback(() => {
    updateEditorFocus(false);
  }, [updateEditorFocus]);

  const handleMouseScroll = useCallback((e: WheelEvent) => {
    /**
     * wheel event not supported in safari.
     * use WASD in safari for all scroll things
     */
    const  { deltaY, shiftKey } = e;
    updateEditorScroll(deltaY, shiftKey);
  }, [updateEditorScroll]);

  return (
    <canvas
      className="editor-canvas"
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onWheel={handleMouseScroll}
      style={{
        border: '1px solid black',
        background: '#ffaaaa',
        // width: '384px',
        // height: '384px',
        imageRendering: 'pixelated',
      }}
    />
  );
};

export default EditorCanvas;
