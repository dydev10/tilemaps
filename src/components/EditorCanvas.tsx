import React, { ChangeEvent, MouseEvent, useCallback, useRef, useState, WheelEvent } from "react";
import useEditorRender from "../hooks/useEditorRender";
import useBoundStore from "../stores/useBoundStore";
import TileMap from "../engine/TileMap";
import { getBaseLog } from "../helpers/maths";
import { DEFAULT_CANVAS_SIZE } from "../helpers/constants";

const EDITOR_WIDTH = DEFAULT_CANVAS_SIZE;
const EDITOR_HEIGHT = DEFAULT_CANVAS_SIZE;

const EditorCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  // ui 
  const resolution = useBoundStore(state => state.editor.resolution);
  const setResolution = useBoundStore(state => state.editor.setEditorResolution);
  const updateInput = useBoundStore(state => state.editor.updateEditorInput);
  const updateScroll = useBoundStore(state => state.editor.updateEditorScroll);
  const updateFocus = useBoundStore(state => state.editor.updateEditorFocus);
  
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

    updateInput({ mouse: { x: mouseX, y: mouseY } });
  }, [updateInput]);

  const handleMouseEnter = useCallback(() => {
    updateFocus(true);
    }, [updateFocus]);
  
  const handleMouseLeave = useCallback(() => {
    updateFocus(false);
  }, [updateFocus]);

  const handleMouseScroll = useCallback((e: WheelEvent) => {
    /**
     * wheel event not supported in safari.
     * use WASD in safari for all scroll things
     */
    const  { deltaY, shiftKey } = e;
    updateScroll(deltaY, shiftKey);
  }, [updateScroll]);

  const handleChangeResolution = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    
    const size = TileMap.getSizeByPower(parseInt(value, 10));
    setResolution(size);
  };

  return (
    <div className="editor-canvas">
       <datalist id="size-markers">
        <option key={`size-opt-${3}`} value={3} />
        <option key={`size-opt-${4}`} value={4} />
        <option key={`size-opt-${5}`} value={5} />
        <option key={`size-opt-${6}`} value={6} />
        <option key={`size-opt-${7}`} value={7} />
        <option key={`size-opt-${8}`} value={8} />
        <option key={`size-opt-${9}`} value={9} />
        <option key={`size-opt-${10}`} value={10} />
      </datalist>
      <label className="editor-canvas__slider-label">
        Resolution
        <input
          name="imageTile"
          type="range"
          min={3}
          max={10}
          list="size-markers"
          className="editor-canvas__slider"
          value={getBaseLog(resolution, 2)}
          onChange={handleChangeResolution}
        />
        <span className="editor-canvas__slider-value">{resolution}</span>
      </label>

      <canvas
        className="editor-canvas__canvas"
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onWheel={handleMouseScroll}
        style={{
          imageRendering: 'pixelated',
        }}
      />
    </div>
  );
};

export default EditorCanvas;
