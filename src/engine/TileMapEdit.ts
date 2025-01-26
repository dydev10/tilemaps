import TileMap from "./TileMap";

export type LayerTiles = number[];

export default class TileMapEdit extends TileMap {
  constructor(layers: number[][], previewWidth?: number, previewHeight?: number) {
    super(layers, previewWidth, previewHeight);

    if (layers?.length) {
      this.cols = Math.floor(Math.sqrt(layers[0].length));
      this.rows = Math.floor(Math.sqrt(layers[0].length));
      this.tileSize = 64;      
    }
  }
  
  /**
   * editor
  */

  setEditorTileSize = (size: number) => {
    // preview things
    if (this.image.width) {
      this.cols = (this.image.width / size); 
      this.tileSize = size; ; 
   }
   if (this.image.height) {
     this.rows = (this.image.height / size);
     this.tileSize = size; 
   }
 }
  setEditorTileCols = (cols: number) => {
    console.log('!!! xxxx NOT ALLOWED xxxx');
     
    
    // preview things
     if (this.image.width) {
      this.tileSize = (this.image.width / cols); 
      this.cols = cols; 
    }
    if (this.image.height) {
      this.tileSize = (this.image.height / cols); 
      this.rows = cols;
    }
  }
}
