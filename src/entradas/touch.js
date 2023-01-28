import { barra1, barra2 } from "../juego/objetos.js";
import { canvasAncho } from "../sistema/render.js";

export const toques = {};
let toquesActivos = 0;

export function init() {
  // Asignamos los eventos touch
  document.addEventListener("touchstart", touchStart);
  document.addEventListener("touchmove", touchMove);
  document.addEventListener("touchend", touchEnd);
}

function touchStart(event) {
  for (let i = 0; i < event.touches.length; i++) {
    const id = event.touches[i].identifier;
    toques[id] = {
      x: event.touches[i].clientX,
      y: event.touches[i].clientY,
      estaTocando: true,
      barraSeleccionada: "ninguno",
    };
    if (toques[id].x < canvasAncho / 2) {
      toques[id].barraSeleccionada = "barra1";
    }

    if (toques[id].x > canvasAncho / 2) {
      toques[id].barraSeleccionada = "barra2";
    }
  }
}

function touchMove(event) {
  for (let i = 0; i < event.touches.length; i++) {
    const id = event.touches[i].identifier;
    if (toques[id].estaTocando) {
      toques[id].y = event.touches[i].clientY;
    }
  }
}

function touchEnd(event) {
  for (let i = 0; i < event.changedTouches.length; i++) {
    const id = event.changedTouches[i].identifier;
    toques[id].estaTocando = false;
    toques[id].barraSeleccionada = "ninguno";
    // delete toques[id];
  }
}

export function estaTocandoIzquierda() {
  let aux = false;
  if (Object.keys(toques).length > 0) {
    for (let i = 0; i < Object.keys(toques).length; i++) {
      if (toques[i].barraSeleccionada === "barra1" && toques[i].estaTocando) {
        aux = true;
      }
    }
  }
  return aux;
}

export function estaTocandoDerecha() {
  let aux = false;
  if (Object.keys(toques).length > 0) {
    for (let i = 0; i < Object.keys(toques).length; i++) {
      if (toques[i].barraSeleccionada === "barra2" && toques[i].estaTocando) {
        aux = true;
      }
    }
  }
  return aux;
}

export function estaTocandoSobre(barraObjeto, barraNombre) {
  let aux = false;
  if (Object.keys(toques).length > 0) {
    for (let i = 0; i < Object.keys(toques).length; i++) {
      if (
        toques[i].barraSeleccionada === barraNombre &&
        toques[i].y < barraObjeto.getY() - barraObjeto.getVelocidad()
      ) {
        aux = true;
      }
    }
  }
  return aux;
}

export function estaTocandoDebajo(barraObjeto, barraNombre) {
  let aux = false;
  if (Object.keys(toques).length > 0) {
    for (let i = 0; i < Object.keys(toques).length; i++) {
      if (
        toques[i].barraSeleccionada === barraNombre &&
        toques[i].y > barraObjeto.getY() + barraObjeto.getVelocidad()
      ) {
        aux = true;
      }
    }
  }
  return aux;
}
