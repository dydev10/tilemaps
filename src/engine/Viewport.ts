import TileMap from "./TileMap";

type Coords = {
  x: number;
  y: number;
};

export default class Viewport {
  map: TileMap;
  screen: Coords;
  startTile: Coords;
  endTile: Coords;
  offset: Coords;
  
  constructor(map: TileMap, width: number, height: number) {
    this.screen = {
      x: width,
      y: height,
    };
    this.map = map;

    this.startTile = {
      x: 0,
      y: 0,
    };

    this.endTile = {
      x: 0,
      y: 0,
    };
    
    this.offset = {
      x: 0,
      y: 0,
    }
  }

  update = (x: number, y: number) => {
    this.offset.x = Math.floor((this.screen.x / 2) - x);
    this.offset.y = Math.floor((this.screen.y / 2) - y);
  
    // center view tile
    const viewTile = {
      x: Math.floor(x / this.map.tileSize),
      y: Math.floor(y / this.map.tileSize),
    };

    // start corner
    this.startTile.x = viewTile.x - 1 - Math.ceil((this.screen.x / 2) / this.map.tileSize);
    this.startTile.y = viewTile.y - 1 - Math.ceil((this.screen.y / 2) / this.map.tileSize);
    
    // end corner
    this.endTile.x = viewTile.x + 1 + Math.ceil((this.screen.x / 2) / this.map.tileSize);
    this.endTile.y = viewTile.y + 1 + Math.ceil((this.screen.y / 2) / this.map.tileSize);
  }
}
