import React, { useRef } from "react";
// import layerImage from '../assets/tilemap1layer.png'
// import worldImage from '../assets/worldtileset.png'
// import summerPlain from '../assets/summerPlain.png'
import grass from '../assets/grass.png'
import EditorCanvas from "./EditorCanvas";
import PreviewCanvas from "./PreviewCanvas";
import PreviewForm from "./PreviewForm";
import useBoundStore from "../stores/useBoundStore";
import ExportCanvas from "./ExportCanvas";


const EditorLayout: React.FC = () => {
  const imageRef = useRef<HTMLImageElement>(null);
  const imageUrl = useBoundStore(state => state.imageUrl);

  return (
    <div className="editor-layout">
      <EditorCanvas />
      <div className="editor-tools">
        <div className="editor-tools__header">
          <span>Source</span>
        </div>
        <PreviewForm />
        <div className="editor-tools__main">
          <PreviewCanvas />
        </div>
      </div>

      <ExportCanvas />
      <img
        ref={imageRef}
        alt="Hidden tilemap source img"
        src={imageUrl ?? grass}
        id="tilemap-source"
        style={{
          display: 'none',
        }}
      />
    </div>
  );
};

export default EditorLayout;
