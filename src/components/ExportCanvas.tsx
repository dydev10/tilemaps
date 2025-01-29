import React, { useRef, useState } from "react";
import useExportRender from "../hooks/useExportRender";
import useBoundStore from "../stores/useBoundStore";
import { FaDownload } from "react-icons/fa6";


const ExportCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  const isExportOpen = useBoundStore(state => state.isExportOpen);
  const closeExport = useBoundStore(state => state.closeExport);

  React.useEffect(() => {
    if (isExportOpen) {
      const canvas = canvasRef.current;
      if (canvas) {
        setCtx(canvas.getContext("2d"));
      }
    }
  }, [isExportOpen]);

  useExportRender(ctx);

  const downloadCanvasAsImage = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "canvas-image.png";
      link.click();
    }
  };

  return (
    <>
      {isExportOpen && (
        <div
          className="modal"
          onClick={() => closeExport()}
        >
          <div
            className="modal__dialog"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <div className="modal__header">
              <h2 className="modal__title">Fullscreen Modal</h2>
              <button
                className="modal__close"
                onClick={() => closeExport()}
              >
                ✕
              </button>
            </div>

            <div className="modal__content">
              <div className="modal__content--main">
                <canvas
                  className="export-canvas"
                  ref={canvasRef}
                  style={{
                    border: '1px solid black',
                    background: '#ffaaaa',
                    maxWidth: '85%',
                    maxHeight: '85%',
                    imageRendering: 'pixelated',
                  }}
                />
              </div>

              <div className="modal__content--right">
                <button className="modal__content--right__button" onClick={downloadCanvasAsImage}>
                  <FaDownload />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExportCanvas;
