import { barra1, barra2 } from "../juego/objetos.js";
import { canvasAncho } from "../sistema/render.js";

export const toques = {
  0: { x: 0, y: 0, state: false },
  1: { x: 0, y: 0, state: false },
};
let toquesActivos = 0;

export function init() {
  // Asignamos los eventos touch
  document.addEventListener("touchstart", touchStart);
  document.addEventListener("touchmove", touchMove);
  document.addEventListener("touchend", touchEnd);
  document.addEventListener("touchcancel", touchCancel);
}

function touchStart(event) {
  for (let i = 0; i < event.touches.length; i++) {
    if (toquesActivos < 2) {
      toquesActivos++;
      toques[event.touches[i].identifier].state = true;
      toques[event.touches[i].identifier].x = event.touches[i].clientX;
      toques[event.touches[i].identifier].y = event.touches[i].clientY;
    }
  }
  console.log("----------- Touch Start -----------");
  console.log(toques);
  console.log(toquesActivos);
}

function touchMove(event) {
  for (let i = 0; i < event.touches.length; i++) {
    if (toques[event.touches[i].identifier].state) {
      toques[event.touches[i].identifier].x = event.touches[i].clientX;
      toques[event.touches[i].identifier].y = event.touches[i].clientY;
    }
  }
  console.log("----------- Touch Move -----------");
  console.log(toques);
  console.log(toquesActivos);
}

function touchEnd(event) {
  for (let i = 0; i < event.changedTouches.length; i++) {
    toques[event.changedTouches[i].identifier].state = false;
    toquesActivos--;
  }
  console.log("----------- Touch End -----------");
  console.log(toques);
  console.log(toquesActivos);
}

function touchCancel(event) {
  for (let i = 0; i < event.changedTouches.length; i++) {
    toques[event.changedTouches[i].identifier].state = false;
    toquesActivos--;
  }
  console.log("----------- Touch Cancel -----------");
  console.log(toques);
  console.log(toquesActivos);
}

export function isTouching() {}
