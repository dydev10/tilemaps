import React from "react";
// import layerImage from '../assets/tilemap1layer.png'
import worldImage from '../assets/worldtileset.png'
import PreviewEditor from "./PreviewEditor";
import PreviewImage from "./PreviewImage";


const EditorLayout: React.FC = () => {

  return (
    <div className="editor-layout">
      <PreviewEditor />
      <PreviewImage />

      <img
        alt="Hidden tilemap source img"
        src={worldImage}
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
