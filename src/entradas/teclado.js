
const teclas = {};

export function init() {
    document.addEventListener("keydown", teclaPresionada);
    document.addEventListener("keyup", teclaLevantada);
}

export function teclaPresionada(event) {
    teclas[event.key] = true;
}

export function teclaLevantada(event) {
    teclas[event.key] = false;
}

export function estaPresionando(tecla) {
    return teclas[tecla] === true;
}