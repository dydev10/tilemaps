import TileMap from "./TileMap";
import Viewport from "./Viewport";

export default class Camera {
  map: TileMap;
  viewport: Viewport;
  speed: number;
  x: number;
  y: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
  
  constructor(map: TileMap, viewport: Viewport) {
    this.map = map;
    this.viewport = viewport;
    
    this.width = viewport.screen.x;
    this.height = viewport.screen.y;
    // this.width = viewport.screen.x / 4;
    // this.height = viewport.screen.y /4;
    
    this.speed = 256; // pixels/sec
    this.x = 0;
    this.y = 0;

    this.maxX = this.map.cols * this.map.tileSize - this.width;
    this.maxY = this.map.rows * this.map.tileSize  - this.height;
  }

  updateBounds = () => {
    this.maxX = this.map.cols * this.map.tileSize - this.width;
    this.maxY = this.map.rows * this.map.tileSize  - this.height;    
  };

  move = (deltaTime: number, speedX: number, speedY: number) => {
    this.updateBounds();

    this.x += speedX * this.speed * deltaTime;
    this.y += speedY * this.speed * deltaTime;

    this.x = Math.max(0, Math.min(this.x, this.maxX));
    this.y = Math.max(0, Math.min(this.y, this.maxY));

    // update viewport
    this.viewport.update(this.x + this.width / 2, this.y + this.height / 2);
  }
}
