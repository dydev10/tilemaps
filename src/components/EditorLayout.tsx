import React, { useEffect, useRef } from "react";
// import layerImage from '../assets/tilemap1layer.png'
// import worldImage from '../assets/worldtileset.png'
// import summerPlain from '../assets/summerPlain.png'
import grass from '../assets/grass.png'
import PreviewEditor from "./PreviewEditor";
import PreviewImage from "./PreviewImage";
import PreviewForm from "./PreviewForm";
import { DEFAULT_COLS } from "../helpers/constants";
import useBoundStore from "../stores/useBoundStore";


const EditorLayout: React.FC = () => {
  const imageRef = useRef<HTMLImageElement>(null);

  const updatePreview = useBoundStore(state => state.preview.updatePreview);

  useEffect(() => {
    const image = imageRef.current;
    if (image) {
      image.onload = () => {
        updatePreview({
          tileCols: DEFAULT_COLS,
          chain: true,
        });
      }
    }

    return () => {
      if(image) {
        image.onload = null;
      }
    }
  }, [updatePreview]);

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
        ref={imageRef}
        alt="Hidden tilemap source img"
        src={grass}
        id="tilemap-source"
        style={{
          display: 'none',
        }}
      />
    </div>
  );
};

export default EditorLayout;
