import { barra1, barra2, pelota } from "../juego/objetos.js";

// Canvas y Contexto 2D
const canvas = document.getElementById("mesa");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

export var canvasAncho;
export var canvasAlto;
export const grosorBorde = 15;

export var estaJugando = false;

export function init() {
  canvasAncho = window.innerWidth - window.innerWidth / 14;
  canvasAlto = window.innerHeight - window.innerHeight / 14;
  ctx.canvas.width = canvasAncho;
  ctx.canvas.height = canvasAlto;
}

export function renderizar() {
  // Bordes
  ctx.beginPath();
  ctx.strokeStyle = "white";
  ctx.lineWidth = grosorBorde;
  ctx.strokeRect(0, 0, canvasAncho, canvasAlto);
  ctx.stroke();
  // Barra 1
  ctx.fillStyle = barra1.color;
  ctx.fillRect(
    barra1.x,
    barra1.y - barra1.largo / 2,
    barra1.ancho,
    barra1.largo
  );
  // Barra 2
  ctx.fillStyle = barra2.color;
  ctx.fillRect(
    barra2.x - barra2.ancho,
    barra2.y - barra2.largo / 2,
    barra2.ancho,
    barra2.largo
  );
  // Renderizas figuras del juego en acción
  if (estaJugando) {
    // Línea central
    if (window.innerWidth < 990) {
      ctx.lineWidth = grosorBorde / 8;
      ctx.setLineDash([15, 10]);
    } else {
      ctx.lineWidth = grosorBorde / 5;
      ctx.setLineDash([15, 20]);
    }
    ctx.moveTo(canvasAncho / 2, 0);
    ctx.lineTo(canvasAncho / 2, canvasAlto);
    ctx.stroke();
    ctx.setLineDash([]);
    // Pelota
    ctx.fillStyle = pelota.color;
    ctx.fillRect(
      pelota.x - pelota.radio / 2,
      pelota.y - pelota.radio / 2,
      pelota.radio,
      pelota.radio
    );
    ctx.closePath();
  } else {
    ctx.closePath();
  }
}

export function limpiar() {
  ctx.clearRect(0, 0, canvasAncho, canvasAlto);
}

export function setJugando(boolean) {
  estaJugando = boolean;
}
