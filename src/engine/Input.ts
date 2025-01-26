type MouseXY = {
  x: number,
  y: number,
};

export default class Input {
  keys: string[];
  mouse: MouseXY;

  constructor() {
    this.keys = [];
    this.mouse = { x: 0, y: 0 }
    // add listeners
    this.setup();
  }
  
  onKeyDown = (e: KeyboardEvent) => {
    const isPressed = this.keys.find((val) => val === e.code);
    if (!isPressed) {
      this.keys = [e.code, ...this.keys];
    }
  }
  
  onKeyUp = (e: KeyboardEvent) => {
    this.keys = this.keys.filter((val) => val !== e.code);    
  }

  setMouseXY = (point: MouseXY) => {
    this.mouse = {
      x: point.x,
      y: point.y,
    };
  }

  setup = () => {    
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  destroy = () => {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }
}
