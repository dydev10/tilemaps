/**
 * @module helpers/canvas
 * 
 * dom canvas helper functions to provide declarative canvas shape drawing apis
 */

import { MAX_TEXT_SIZE } from "./constants";

/**
 *  Always call this BEFORE starting draw, NEVER call this for layer draw or shape draw
 * @param ctx 
 * @param color 
 */
export const clearCanvas = (ctx: CanvasRenderingContext2D, color: string = 'red') => {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);  
}

export const drawCircle = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string = 'black',
) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
};

export const drawLine = (
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  color: string = 'black',
  thickness: number = 1,
) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = thickness;
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();
};

export const drawText = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string | null | undefined = null,
  color: string = 'white',
  size: number = MAX_TEXT_SIZE,
) => {
  if (text?.length) {
    ctx.fillStyle = color;
    ctx.font = `${size}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y);
  }
};

export const drawOutline = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string = 'black',
  thickness: number = 0.1,
  opacity: number = 1,
) => {
  ctx.globalAlpha = opacity;
  ctx.strokeStyle = color;
  ctx.lineWidth = thickness;
  ctx.strokeRect(x, y, width, height);
  ctx.globalAlpha = 1;
};

export const drawImage = (
  ctx: CanvasRenderingContext2D,
  sourceImage: HTMLImageElement,
  x: number = 0,
  y: number = 0,
  width?: number,
  height?: number,
) => {
  if (sourceImage) {
    ctx.drawImage(
      sourceImage,
      x,
      y,
      width ?? sourceImage.width,
      height?? sourceImage.height,
    );
  }
};

export const drawImageTile = (
  ctx: CanvasRenderingContext2D,
  sourceImage: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  crop: { x: number, y: number, width: number, height: number }
) => {
  if (sourceImage) {
    ctx.drawImage(
      sourceImage,
      crop.x ?? 0,  // sx,
      crop.y ?? 0,  // sy,
      crop.width ?? sourceImage.width,  // sw,
      crop.height ?? sourceImage.height,  // sh,
      x,
      y,
      width,
      height,
    );
  }
};

