
import {estaJugando} from '../sistema/render.js';

const touchPositions = {};
let touchPaddle;

export function init() {
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
}

//Función para manejar el evento touchstart
function handleTouchStart(event) {
    event.preventDefault();
    touchPositions.initialX = event.touches[0].clientX;
    touchPositions.initialY = event.touches[0].clientY;
    if(event.touches.length > 1){
        touchPositions.initialX = event.touches[1].clientX;
        touchPositions.initialY = event.touches[1].clientY;
    }
}

//Función para manejar el evento touchmove
function handleTouchMove(event) {
    event.preventDefault();
    touchPositions.currentX = event.touches[0].clientX;
    touchPositions.currentY = event.touches[0].clientY;
    touchPaddle += touchPositions.currentY - touchPositions.initialY;
    touchPositions.initialX = touchPositions.currentX;
    touchPositions.initialY = touchPositions.currentY;
}

//Función para manejar el evento touchend
function handleTouchEnd(event) {
    event.preventDefault();
    touchPaddle = null;
}