import { barra1, barra2 } from "../juego/objetos.js";
import { canvasAncho } from "../sistema/render,js";

// Variables para almacenar la posición inicial del dedo del jugador
let posBarra1X, posBarra2X;
let aux;
export var posBarra1Y = -1,
  posBarra2Y = -1;
export var moverBarra = false;

export function init() {
  // Asignar eventos touchstart y touchmove al canvas del juego
  canvas.addEventListener("touchstart", touchStart);
  canvas.addEventListener("touchmove", touchMove);
}

function touchStart(event) {
  let posToque = event.touches[0].clientX;
  if (posToque < canvasAncho / 2) {
    aux = "barra1";
    posBarra1X = event.touches[0].clientX;
    posBarra2X = event.touches[1].clientX;
  } else {
    aux = "barra2";
    posBarra1X = event.touches[1].clientX;
    posBarra2X = event.touches[0].clientX;
  }
}

function touchMove(event) {
  if (aux == "barra1") {
    posBarra1Y = event.touches[0].clientY;
    posBarra2Y = event.touches[1].clientY;
  } else {
    posBarra1Y = event.touches[1].clientY;
    posBarra2Y = event.touches[0].clientY;
  }
}
