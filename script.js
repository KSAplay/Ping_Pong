
const canvas = document.getElementById('mesa');
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');

var canvasAncho = window.innerWidth-window.innerWidth/14;
var canvasAlto = window.innerHeight-window.innerHeight/14;

ctx.canvas.width  = canvasAncho;
ctx.canvas.height = canvasAlto;

var moverBarra1Arriba = false, moverBarra1Abajo = false, moverBarra2Arriba = false, moverBarra2Abajo = false;
var distanciaBarras = 40, velocidadBarras = 14;
var largoBarrasDefault = canvasAlto/5, grosorBorde = 15;
var puntajeBarra1 = 0, puntajeBarra2 = 0, meta = 5;
var nombreJugador1 = "Jugador 1", nombreJugador2 = "Jugador 2";
var update, empezoJuego = false;
var touchX = [], touchY = [], mostrarGuia = false;


var barra1 = {
    x: distanciaBarras,
    y: canvasAlto/2,
    largo: largoBarrasDefault,
    ancho: grosorBorde,
    color: "white",
    velocidad: velocidadBarras
};

var barra2 = {
    x: canvasAncho - distanciaBarras,
    y: canvasAlto/2,
    largo: largoBarrasDefault,
    ancho: grosorBorde,
    color: "white",
    velocidad: velocidadBarras
};

var pelota = {
    x: canvasAncho/2,
    y: canvasAlto/2,
    color: "white",
    radio : 15, // 15
    velocidad: 14, // 7
    direccion: {
        x: "derecha",
        y: "arriba"
    }
};

var puntaje = {
    tamaño: "25px"
};

var botonEmpezar = {
    x: canvasAncho/2,
    y: canvasAlto - canvasAlto/5,
    color: "white",
    texto: "Jugar",
    colorTexto: "black",
    alto: 35,
    largo: 110
};

if(window.innerWidth > 1200){
    puntaje.tamaño = "50px";
    largoBarrasDefault = canvasAlto/6;
} else {
    puntaje.tamaño = "30px";
    pelota.velocidad = pelota.velocidad/2;
    pelota.radio = pelota.radio/2;
    canvasAncho = window.innerWidth - window.innerWidth/14;
    canvasAlto = window.innerHeight;
    ctx.canvas.width  = canvasAncho;
    ctx.canvas.height = canvasAlto;
    barra1.velocidad = velocidadBarras/2;
    barra2.velocidad = velocidadBarras/2;
    barra1.ancho = grosorBorde/2;
    barra2.ancho = grosorBorde/2;
    
}

canvas.addEventListener("mousedown", clicPantalla);
canvas.addEventListener("mousemove", movimientoMouse);

document.onkeydown = function(evento){
    evento = evento || window.event;
    if(evento.key == "w"){
        moverBarra1Arriba = true;
    } else if(evento.key == "s"){
        moverBarra1Abajo = true;
    }

    if(evento.key == "ArrowUp"){
        moverBarra2Arriba = true;
    } else if(evento.key == "ArrowDown"){
        moverBarra2Abajo = true;
    }
}

document.onkeyup = function(evento){
    evento = evento || window.event;
    if(evento.key == "w"){
        moverBarra1Arriba = false;
    } else if(evento.key == "s"){
        moverBarra1Abajo = false;
    }

    if(evento.key == "ArrowUp"){
        moverBarra2Arriba = false;
    } else if(evento.key == "ArrowDown"){
        moverBarra2Abajo = false;
    }
}

window.ontouchstart = (event) => {
    for(let i = 0; i < 4; i++){
        touchX[i] = event.touches[i].clientX;
        touchY[i] = event.touches[i].clientY;
        
        if(empezoJuego){
            if(touchX[i] < canvasAncho/2){
                if(touchY[i] < canvasAlto/2){
                    moverBarra1Arriba = true;
                    moverBarra1Abajo = false;
                } else {
                    moverBarra1Arriba = false;
                    moverBarra1Abajo = true;
                }
            } else{
                if(touchY[i] < canvasAlto/2){
                    moverBarra2Arriba = true;
                    moverBarra2Abajo = false;
                } else {
                    moverBarra2Arriba = false;
                    moverBarra2Abajo = true;
                }
            }
        }
    }
}

window.ontouchend = (event) => {
    for(let i = 0; i < 4; i++){
        if(empezoJuego){
            if(touchX[i] < canvasAncho/2 && touchX[i] != 0){
                if(touchY[i] < canvasAlto/2){
                    moverBarra1Arriba = false;
                } else {
                    moverBarra1Abajo = false;
                }
            } else{
                if(touchY[i] < canvasAlto/2){
                    moverBarra2Arriba = false;
                } else {
                    moverBarra2Abajo = false;
                }
            }
        }
        touchX[i] = null;
        touchY[i] = null;
    }
}

function empezar(){
    update = window.requestAnimationFrame(bucle);
}
function inicio(){
    // Bordes
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.lineWidth = grosorBorde;
    ctx.strokeRect(0,0,canvasAncho, canvasAlto);
    ctx.stroke();
    ctx.closePath();
    // Dibjuar Pelota
    ctx.beginPath();
    ctx.fillStyle = pelota.color;
    ctx.fillRect(pelota.x - pelota.radio/2, pelota.y - pelota.radio/2, pelota.radio, pelota.radio);
    // Dibjuar Barra 1
    ctx.fillStyle = barra1.color;
    ctx.fillRect(barra1.x, barra1.y - barra1.largo/2, barra1.ancho, barra1.largo);
    // Dibjuar Barra 2
    ctx.fillStyle = barra2.color;
    ctx.fillRect(barra2.x - barra2.ancho, barra2.y - barra2.largo/2, barra2.ancho, barra2.largo);
    // Interfaz
    // - Titulo
    ctx.font = "50px ArcadeClassic";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Ping    Pong", canvasAncho/2, canvasAlto/4);
    // - Boton Empezar con su texto
    ctx.fillStyle = botonEmpezar.color;
    ctx.fillRect(botonEmpezar.x - botonEmpezar.largo/2, botonEmpezar.y - botonEmpezar.alto/2, botonEmpezar.largo, botonEmpezar.alto);
    ctx.fillRect(botonEmpezar.x - botonEmpezar.largo/2 - 8, botonEmpezar.y - botonEmpezar.alto/2 + 6, botonEmpezar.largo + 16, botonEmpezar.alto - 12);
    ctx.font = "32px ArcadeClassic";
    ctx.fillStyle = botonEmpezar.colorTexto;
    ctx.fillText(botonEmpezar.texto, botonEmpezar.x-2, botonEmpezar.y+9);
    ctx.closePath();
    // - Guia de botones
    if(mostrarGuia){

    }
}

const bucle = () => {

    empezoJuego = true;
    actualizarPantalla();

    for(let i=1 ; i <= pelota.velocidad; i++){
        switch (pelota.direccion.x) {
            case "izquierda":
                pelota.x -= 1;
                break;
            case "derecha":
                pelota.x += 1;
                break;
        }
    
        switch (pelota.direccion.y) {
            case "arriba":
                pelota.y -= 1;
                break;
            case "abajo":
                pelota.y += 1;
                break;
        }
        actualizarPantalla();
    }
    // ---------- Movimieto de la Barra 1 ----------
    if(moverBarra1Arriba){
        if(barra1.y - barra1.largo/2 - barra1.velocidad <= 0){
            barra1.y = barra1.largo/2;
        } else {
            barra1.y -= barra1.velocidad;
        }
    } else if(moverBarra1Abajo){
        if(barra1.y + barra1.largo/2 + barra1.velocidad >= canvasAlto){
            barra1.y = canvasAlto - barra1.largo/2;
        } else {
            barra1.y += barra1.velocidad;
        }
    }
    // ---------- Movimieto de la Barra 2 ----------
    if(moverBarra2Arriba){
        if(barra2.y - barra2.largo/2 - barra2.velocidad <= 0){
            barra2.y = barra2.largo/2;
        } else {
            barra2.y -= barra2.velocidad;
        }
    } else if(moverBarra2Abajo){
        if(barra2.y + barra2.largo/2 + barra2.velocidad >= canvasAlto){
            barra2.y = canvasAlto - barra2.largo/2;
        } else {
            barra2.y += barra2.velocidad;
        }
    }
    // ----- Detecta la pelota en los bordes -----
    if(pelota.y + pelota.radio/2 >= canvasAlto - grosorBorde/2){
        pelota.direccion.y = "arriba";
    }

    if(pelota.y - pelota.radio/2 <= grosorBorde/2){
        pelota.direccion.y = "abajo";
    }
    // ---------- Detecta la pelota si rebota en la barra 1 ----------
    if(barra1.x < pelota.x
        && barra1.x + barra1.ancho > pelota.x - pelota.radio/2
        && pelota.y > barra1.y - barra1.largo/2 - pelota.radio/2
        && pelota.y < barra1.y + barra1.largo/2 + pelota.radio/2){
        
        pelota.direccion.x = "derecha";
        // Cambia la direccion de Y de la pelota si rebota arriba o abajo de la mitad de la barra 1
        // if(pelota.y < barra1.y){
        //     pelota.direccion.y = "arriba";
        // } else {
        //     pelota.direccion.y = "abajo";
        // }
    }
    // ---------- Detecta la pelota si rebota en la barra 2 ----------
    if(barra2.x > pelota.x
        && barra2.x - barra2.ancho < pelota.x + pelota.radio/2
        && pelota.y > barra2.y - barra2.largo/2 - pelota.radio/2
        && pelota.y < barra2.y + barra2.largo/2 + pelota.radio/2){
        
        pelota.direccion.x = "izquierda";
        // Cambia la direccion de Y de la pelota si rebota arriba o abajo de la mitad de la barra 2
        // if(pelota.y < barra2.y){
        //     pelota.direccion.y = "arriba";
        // } else {
        //     pelota.direccion.y = "abajo";
        // }
    }

    if(pelota.x - pelota.radio/2 <= grosorBorde/2){
        pelota.x = barra2.x - barra2.ancho - pelota.radio/2;
        pelota.y = barra2.y;
        puntajeBarra2++;
    }

    if(pelota.x + pelota.radio/2 >= canvasAncho - grosorBorde/2){
        pelota.x = barra1.x + barra1.ancho + pelota.radio/2;
        pelota.y = barra1.y;
        puntajeBarra1++;
    }
    // ---------- Verifica si terminó el juego ----------
    if(puntajeBarra1 == meta){
        detenerJuego(nombreJugador1);
    } else if(puntajeBarra2 == meta){
        detenerJuego(nombreJugador2);
    } else {
        update = window.requestAnimationFrame(bucle);
    }
    
}

function detenerJuego(ganador){
    cancelAnimationFrame(update);
    empezoJuego = false;
    limpiarPantalla();
    // Puntaje
    ctx.font = puntaje.tamaño+" ArcadeClassic";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(puntajeBarra1+" - "+puntajeBarra2, canvasAncho/2, canvasAlto/7);
    // Barra 1
    ctx.beginPath();
    ctx.fillStyle = barra1.color;
    ctx.fillRect(barra1.x, canvasAlto/2 - barra1.largo/2, barra1.ancho, barra1.largo);
    // Barra 2
    ctx.fillStyle = barra2.color;
    ctx.fillRect(barra2.x - barra2.ancho, canvasAlto/2 - barra2.largo/2, barra2.ancho, barra2.largo);
    //Asignar ganador
    ctx.font = "50px ArcadeClassic";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(ganador+"   gana  !", canvasAncho/2, canvasAlto/2);
}

function reset(){
    
}

function detectarRebote(){

}

function limpiarPantalla(){
    ctx.clearRect(0, 0, canvasAncho, canvasAlto);
    // Dibujar bordes
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.lineWidth = grosorBorde;
    ctx.strokeRect(0,0,canvasAncho, canvasAlto);
    ctx.stroke();
    ctx.closePath();
}

function actualizarPantalla(){
    limpiarPantalla();
    // Puntaje
    ctx.beginPath();
    ctx.font = puntaje.tamaño+" ArcadeClassic";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(puntajeBarra1+" - "+puntajeBarra2, canvasAncho/2, canvasAlto/7);
    // Barra 1
    ctx.fillStyle = barra1.color;
    ctx.fillRect(barra1.x, barra1.y - barra1.largo/2, barra1.ancho, barra1.largo);
    // Barra 2
    ctx.fillStyle = barra2.color;
    ctx.fillRect(barra2.x - barra2.ancho, barra2.y - barra2.largo/2, barra2.ancho, barra2.largo);
    // Pelota
    ctx.fillStyle = pelota.color;
    ctx.fillRect(pelota.x - pelota.radio/2, pelota.y - pelota.radio/2, pelota.radio, pelota.radio);
    ctx.closePath();
}

function clicPantalla(evento){
    let posX = evento.pageX - canvas.offsetLeft;
    let posY = evento.pageY - canvas.offsetTop;
    // Boton Empezar
    if((posX > botonEmpezar.x - botonEmpezar.largo/2 && posX < botonEmpezar.x + botonEmpezar.largo/2)
        && (posY > botonEmpezar.y - botonEmpezar.alto/2 && posY < botonEmpezar.y + botonEmpezar.alto/2) && !empezoJuego){
        empezar();
    }
}

function movimientoMouse(evento){
    let posX = evento.pageX - canvas.offsetLeft;
    let posY = evento.pageY - canvas.offsetTop;
    // Boton Empezar
    if((posX > botonEmpezar.x - botonEmpezar.largo/2 && posX < botonEmpezar.x + botonEmpezar.largo/2)
        && (posY > botonEmpezar.y - botonEmpezar.alto/2 && posY < botonEmpezar.y + botonEmpezar.alto/2) && !empezoJuego){
        canvas.style.cursor = "pointer";
    } else  {
        canvas.style.cursor = "default";
    }
}

inicio();
