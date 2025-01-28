import { DEFAULT_COLS, DEFAULT_TILE_SIZE } from "../helpers/constants";

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
    this._cols = DEFAULT_COLS;
    this._rows = DEFAULT_COLS;
    this._tileSize = DEFAULT_TILE_SIZE;

    this.image = document.getElementById('tilemap-source') as HTMLImageElement;
    this._imageTile = DEFAULT_TILE_SIZE;
    this._imageCols = Math.floor(this.image.width / this._imageTile);
    this._imageRows = Math.floor(this.image.height / this._imageTile);
    
    this.layers = layers;

    // preview things
    if (previewWidth) {
      this.previewWidth = previewWidth;
      this._cols = DEFAULT_COLS;
      this._tileSize = (previewWidth / this._cols); 
    }
    if (previewHeight) {
      this.previewHeight = previewHeight;
      this._rows = DEFAULT_COLS;
      this._tileSize = (previewHeight / this._rows); 
    }

    if (layers?.length) {
      this._cols = Math.floor(Math.sqrt(layers[0].length));
      this._rows = Math.floor(Math.sqrt(layers[0].length));
      this._tileSize = DEFAULT_TILE_SIZE;      
    } else {
      this.layers = TileMap.generate(this._cols, this._rows, 1, null, this.getTileNumber);
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
   * static helpers
   */

  static generate = (cols: number, rows: number, layerCount: number = 1, fill: number | null = 0, fillFn?: (layer: number, col: number, row: number) => number) => {
    const layers: number[][] = [];
    for (let layerIndex = 0; layerIndex < layerCount; layerIndex++) {
      const layer: number[] = [];      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (fillFn) {
            layer.push(fillFn(col, row, layerIndex));
          } else {
            layer.push(fill ?? 0);
          }
        }
      }
      layers.push(layer);
    }
    return layers;
  }

  static getTileI = () => (col: number, row: number, totalCols: number): number => row * totalCols + col;
  static getTileN = (col: number, row: number, totalCols: number): number => TileMap.getTileN(col, row, totalCols) + 1;

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

  getTile = (col: number, row: number, layer: number = 0): number => {    
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
    this.layers = TileMap.generate(this._cols, this._rows, 1, null, this.getTileNumber);
  }

  setPreviewImageTile = (imageTile: number) => {
    this._imageTile = imageTile;
    if (this.previewWidth) {
      this._cols = Math.floor(this.image.width / this._imageTile);
      this._tileSize = (this.previewWidth / this._cols); 
    }
    if (this.previewHeight) {
      this._rows = Math.floor(this.image.height / this._imageTile);
      this._tileSize = (this.previewHeight / this._rows); 
    }
    // generate new tilemap
    this.layers = TileMap.generate(this._cols, this._rows, 1, null, this.getTileNumber);
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

  /**
   * image
   */
  syncPreviewImage = () => {
    this.image = document.getElementById('tilemap-source') as HTMLImageElement;
    const newTile = this.image.width / this._cols;
    this.setPreviewImageTile(newTile);
  }
}
