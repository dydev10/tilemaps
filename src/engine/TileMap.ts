
export type LayerTiles = number[];

export default class TileMap {
  private _tileSize: number;
  private _cols: number;
  private _rows: number;
  
  image: HTMLImageElement;
  private _imageTile: number;
  private _imageCols: number;
  private _imageRows: number;

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
    this._imageTile = 32;
    this._imageCols = Math.floor(this.image.width / this._imageTile);
    this._imageRows = Math.floor(this.image.height / this._imageTile);
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
    } else {
      this.layers = this.generateLayers();
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

  public get imageTile() {
    return this._imageTile;
  }
  public set imageTile(size: number) {
    this._imageTile = size;
  }

  public get imageCols() {
    return this._imageCols;
  }
  public set imageCols(cols: number) {
    this._imageCols = cols;
  }

  public get imageRows() {
    return this._imageRows;
  }
  public set imageRows(rows: number) {
    this._imageRows = rows;
  }

  /**
   * methods
   */

  // called when auto generating grid mapping for image
  generateLayers = (): number[][] => {
    const layers: number[][] = [];

    const layer0: number[] = [];
    for (let row = 0; row < this._rows; row++) {
      for (let col = 0; col < this._cols; col++) {
        layer0.push(this.getTileNumber(col, row));
      }
    }
    layers.push(layer0)
  
    return layers;
  }

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

  /**
   * preview
  */
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

    // sync imageTile size to be used in editor
    this._imageTile = (this.image.width / cols);

    // generate new tilemap
    this.layers = this.generateLayers();
  }

  setPreviewImageTile = (imageTile: number) => {
    if (this.previewWidth) {
      this._cols = Math.floor(this.image.width / imageTile);
      this._tileSize = (this.previewWidth / this._cols); 
    }
    if (this.previewHeight) {
      this._rows = Math.floor(this.image.height / imageTile);
      this._tileSize = (this.previewHeight / this._rows); 
    }
    // generate new tilemap
    this.layers = this.generateLayers();
  }

  
  /**
   * editor
  */
  setEditorTileSize = (size: number) => {
    this._tileSize = size;

    this._imageTile = size;
    this._imageCols = Math.floor(this.image.width / this._imageTile);
    this._imageRows = Math.floor(this.image.height / this._imageTile);
  }
}
