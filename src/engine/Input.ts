export enum MouseButtons {
  MOUSE_L = 0,  
  MOUSE_M = 1,  
  MOUSE_R = 2,  
}

export type MouseXY = {
  x: number,
  y: number,
};

export default class Input {
  focused: boolean;
  keys: string[];
  mouse: MouseXY;

  constructor() {
    this.focused = false;
    this.keys = [];
    this.mouse = { x: 0, y: 0 }
    // add listeners
    this.setup();
  }

  // block/unblock all input reading with focused flag
  updateFocus = (focus: boolean) => {
    this.focused = focus;
  }
  
  onKeyDown = (e: KeyboardEvent) => {
    if (!this.focused) return;
    const isPressed = this.keys.find((val) => val === e.code);
    if (!isPressed) {
      this.keys = [e.code, ...this.keys];
    }
  }
  
  onKeyUp = (e: KeyboardEvent) => {
    if (!this.focused) return;
    this.keys = this.keys.filter((val) => val !== e.code);    
  }

  onMouseDown = (e: MouseEvent) => {
    if (!this.focused) return;
    this.keys = [MouseButtons[e.button], ...this.keys];
  }
  
  onMouseUp = (e: MouseEvent) => {
    if (!this.focused) return;
    this.keys = this.keys.filter((val) => val !== MouseButtons[e.button]);
  }

  setMouseXY = (point: MouseXY) => {
    if (!this.focused) return;
    this.mouse = {
      x: point.x,
      y: point.y,
    };
  }

  setup = () => {    
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);

    window.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
  }
  
  destroy = () => {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);

    window.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
  }
}
