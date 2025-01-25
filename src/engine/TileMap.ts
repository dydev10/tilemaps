
export type LayerTiles = number[];

export default class TileMap {
  cols: number;
  rows: number;
  tileSize: number;
  
  image: HTMLImageElement;
  imageTile: number;
  imageCols: number;

  // multi layer tileMap data model
  layers: number[][];

  constructor(layers: number[][]) {
    this.cols = 12;
    this.rows = 12;
    this.tileSize = 64;

    this.image = document.getElementById('tilemap-source') as HTMLImageElement;
    this.imageTile = 32;
    this.imageCols = this.image.width / this.imageTile;

    this.layers = layers;
  }

  getTileNumber = (col: number, row: number): number => row * this.cols + col

  getTile = (layer: number, col: number, row: number): number => {
    return this.layers[layer][row * this.cols + col]
  }
}
