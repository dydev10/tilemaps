import React from "react";
// import layerImage from '../assets/tilemap1layer.png'
// import fullMap from '../assets/fullMap.png'
import worldImage from '../assets/worldtileset.png'
import PreviewEditor from "./PreviewEditor";
import PreviewImage from "./PreviewImage";
import PreviewForm from "./PreviewForm";


const EditorLayout: React.FC = () => {
  return (
    <div className="editor-layout">
      <PreviewEditor />
      <div className="editor-tools">
        <div className="editor-tools__header">
          <span>Source</span>
        </div>
        <PreviewForm />
        <div className="editor-tools__main">
          <PreviewImage />
        </div>
      </div>

      <img
        alt="Hidden tilemap source img"
        src={worldImage}
        // src={fullMap}
        id="tilemap-source"
        style={{
          // visibility: 'hidden',
          display: 'none',
        }}
      />
    </div>
  );
};

export default EditorLayout;
