
export type LayerTiles = number[];

export default class TileMap {
  private _tileSize: number;
  private _cols: number;
  private _rows: number;
  
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
    this._cols = 12;
    this._rows = 12;
    this._tileSize = 64;

    this.image = document.getElementById('tilemap-source') as HTMLImageElement;
    this.imageTile = 32;
    this.imageCols = Math.floor(this.image.width / this.imageTile);
    this.imageRows = Math.floor(this.image.height / this.imageTile);
    this.layers = layers;

    // preview things
    if (previewWidth) {
      this.previewWidth = previewWidth;
      this._tileSize = (previewWidth / 4); 
      this._cols = 4; 
    }
    if (previewHeight) {
      this.previewHeight = previewHeight;
      this._tileSize = (previewHeight / 4); 
      this._rows = 4;
    }

    if (layers?.length) {
      this._cols = Math.floor(Math.sqrt(layers[0].length));
      this._rows = Math.floor(Math.sqrt(layers[0].length));
      this._tileSize = 64;      
    }
  }

  /**
   * getters & setters
   */
  public get tileSize() {
    return this._tileSize;
  }
  public set tileSize(size: number) {
    this._tileSize = size;
  }

  public get cols() {
    return this._cols;
  }
  public set cols(cols: number) {
    this._cols = cols;
  }

  public get rows() {
    return this._rows;
  }
  public set rows(rows: number) {
    this._rows = rows;
  }


  /**
   * methods
   */

  getTileIndex = (col: number, row: number): number => row * this._cols + col;
  getTileNumber = (col: number, row: number): number => this.getTileIndex(col, row) + 1;

  getTile = (layer: number, col: number, row: number): number => {
    return this.layers[layer][row * this._cols + col]
  }

  setLayerAtTile = (layerTile: number, col: number, row: number, layer: number = 0) => {
    this.layers[layer][this.getTileIndex(col, row)] = layerTile;
  }
  setLayerAtTileIndex = (index: number, layer: number = 0) => {
    console.log('setting at INDEX', index, '::', layer);
  }
  setLayerAtTileNumber = (tileNumber: number, layer: number = 0) => {
    console.log('setting at Number', tileNumber, '::', layer);
  }

  saveTileNumbers = (): number[][] => {
    const savedArray: number[][] = [];
    for (let row = 0; row < this._rows; row++) {
      const sCols = [];
      for (let col = 0; col < this._cols; col++) {
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
      this._cols = (this.previewWidth / size); 
      this._tileSize = size; ; 
   }
   if (this.previewHeight) {
     this._rows = (this.previewHeight / size);
     this._tileSize = size; 
   }
  }
  setPreviewTileCols = (cols: number) => {
     // preview things
     if (this.previewWidth) {
      this._tileSize = (this.previewWidth / cols); 
      this._cols = cols; 
    }
    if (this.previewHeight) {
      this._tileSize = (this.previewHeight / cols); 
      this._rows = cols;
    }
  }

  
  /**
   * editor
  */
  setEditorTileSize = (size: number) => {
    this._tileSize = size;

    this.imageTile = size;
    this.imageCols = Math.floor(this.image.width / this.imageTile);
    this.imageRows = Math.floor(this.image.height / this.imageTile);
  }
  setEditorTileCols = (cols: number) => {
    console.log('!!! xxxx maybe NOT ALLOWED xxxx');

    // preview things
     if (this.image.width) {
      this._tileSize = (this.image.width / cols); 
      this._cols = cols; 
    }
    if (this.image.height) {
      this._tileSize = (this.image.height / cols); 
      this._rows = cols;
    }
  }
}
