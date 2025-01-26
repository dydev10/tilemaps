
export type LayerTiles = number[];

export default class TileMap {
  cols: number;
  rows: number;
  tileSize: number;
  
  image: HTMLImageElement;
  imageTile: number;
  imageCols: number;
  imageRows: number;

  // multi layer tileMap data model
  layers: number[][];

  //preview stuff
  previewWidth?: number;
  previewHeight?: number;

  constructor(layers: number[][], previewWidth?: number, previewHeight?: number) {
    this.cols = 12;
    this.rows = 12;
    this.tileSize = 64;

    this.image = document.getElementById('tilemap-source') as HTMLImageElement;
    this.imageTile = 32;
    this.imageCols = Math.floor(this.image.width / this.imageTile);
    this.imageRows = Math.floor(this.image.height / this.imageTile);
    this.layers = layers;

    // preview things
    if (previewWidth) {
      this.previewWidth = previewWidth;
      this.tileSize = (previewWidth / 4); 
      this.cols = 4; 
    }
    if (previewHeight) {
      this.previewHeight = previewHeight;
      this.tileSize = (previewHeight / 4); 
      this.rows = 4;
    }
  }

  getTileIndex = (col: number, row: number): number => row * this.cols + col

  getTile = (layer: number, col: number, row: number): number => {
    return this.layers[layer][row * this.cols + col]
  }

  saveTileNumbers = (): number[][] => {
    const savedArray: number[][] = [];
    for (let row = 0; row < this.rows; row++) {
      const sCols = [];
      for (let col = 0; col < this.cols; col++) {
        sCols.push(this.getTileIndex(col, row) + 1);
      }
      savedArray.push(sCols);
    }
    return savedArray;
  }

  /**
   * preview
  */

  setPreviewTileSize = (size: number) => {
    // preview things
    if (this.previewWidth) {
      this.cols = (this.previewWidth / size); 
      this.tileSize = size; ; 
   }
   if (this.previewHeight) {
     this.rows = (this.previewHeight / size);
     this.tileSize = size; 
   }
  }
  setPreviewTileCols = (cols: number) => {
     // preview things
     if (this.previewWidth) {
      this.tileSize = (this.previewWidth / cols); 
      this.cols = cols; 
    }
    if (this.previewHeight) {
      this.tileSize = (this.previewHeight / cols); 
      this.rows = cols;
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
