
const canvas = document.getElementById('mesa');
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');

var canvasAncho = window.innerWidth-100;
var canvasAlto = window.innerHeight-100;

ctx.canvas.width  = canvasAncho;
ctx.canvas.height = canvasAlto;

const FPS = 120;
var distanciaBarras = 40, velocidadBarras = 8;
var puntajeBarra1 = 0, puntajeBarra2 = 0, meta = 5;
var nombreJugador1 = "Jugador 1", nombreJugador2 = "Jugador 2";
var update;

var barra1 = {
    x: distanciaBarras,
    y: canvasAlto/2,
    largo: 120,
    ancho: 20,
    color: "white",
    velocidad: velocidadBarras
};

var barra2 = {
    x: canvasAncho - distanciaBarras,
    y: canvasAlto/2,
    largo: 120,
    ancho: 20,
    color: "white",
    velocidad: velocidadBarras
};

var pelota = {
    x: canvasAncho/2,
    y: canvasAlto/2,
    color: "white",
    radio : 15,
    velocidad: 5,
    direccion: {
        x: "derecha",
        y: "arriba"
    }
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

var moverBarra1Arriba = false, moverBarra1Abajo = false, moverBarra2Arriba = false, moverBarra2Abajo = false;

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

function inicio(){
    // Bordes
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 15;
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
    // - Boton Empezar
    ctx.fillStyle = botonEmpezar.color;
    ctx.fillRect(botonEmpezar.x - botonEmpezar.largo/2, botonEmpezar.y - botonEmpezar.alto/2, botonEmpezar.largo, botonEmpezar.alto);
    ctx.fillRect(botonEmpezar.x - botonEmpezar.largo/2 - 8, botonEmpezar.y - botonEmpezar.alto/2 + 6, botonEmpezar.largo + 16, botonEmpezar.alto - 12);
    ctx.font = "32px ArcadeClassic";
    ctx.fillStyle = botonEmpezar.colorTexto;
    ctx.fillText(botonEmpezar.texto, botonEmpezar.x-2, botonEmpezar.y+9);
    ctx.fill();
    ctx.closePath();
}

function bucle(){
    actualizarPantalla();
    // Puntaje
    ctx.font = "50px ArcadeClassic";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(puntajeBarra1+" - "+puntajeBarra2, canvasAncho/2, canvasAlto/7);
    // Barra 1
    ctx.beginPath();
    ctx.fillStyle = barra1.color;
    ctx.fillRect(barra1.x, barra1.y - barra1.largo/2, barra1.ancho, barra1.largo);
    // Barra 2
    ctx.fillStyle = barra2.color;
    ctx.fillRect(barra2.x - barra2.ancho, barra2.y - barra2.largo/2, barra2.ancho, barra2.largo);
    // Pelota
    ctx.fillStyle = pelota.color;
    ctx.fillRect(pelota.x - pelota.radio/2, pelota.y - pelota.radio/2, pelota.radio, pelota.radio);
    ctx.closePath();

    switch (pelota.direccion.x) {
        case "izquierda":
            pelota.x -= pelota.velocidad;
            break;
        case "derecha":
            pelota.x += pelota.velocidad;
            break;
    }

    switch (pelota.direccion.y) {
        case "arriba":
            pelota.y -= pelota.velocidad;
            break;
        case "abajo":
            pelota.y += pelota.velocidad;
            break;
    }

    // ----- Detecta la pelota en los bordes o en las barras -----
    if(pelota.y + pelota.radio + 2 >= canvasAlto){
        pelota.direccion.y = "arriba";
    }

    if(pelota.y - pelota.radio - 2 <= 0){
        pelota.direccion.y = "abajo";
    }

    if((pelota.x + pelota.radio*2 >= barra2.x)
        && (pelota.y + pelota.radio > barra2.y - barra2.largo/2 && pelota.y - pelota.radio < barra2.y + barra2.largo/2)){
        pelota.direccion.x = "izquierda";
    } else if(pelota.x + pelota.radio + 2 >= canvasAncho){
        pelota.x = barra1.x + pelota.radio*2;
        pelota.y = barra1.y;
        puntajeBarra1++;
    }

    if((pelota.x <= barra1.x + barra1.ancho)
        && (pelota.y + pelota.radio > barra1.y - barra1.largo/2 && pelota.y - pelota.radio < barra1.y + barra1.largo/2)){
        pelota.direccion.x = "derecha";
    } else if(pelota.x - pelota.radio - 2 <= 0){
        pelota.x = barra2.x - pelota.radio*2;
        pelota.y = barra2.y;
        puntajeBarra2++;
    }
    // ------------------------------------------------------------
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

    if(puntajeBarra1 == meta){
        detenerJuego(nombreJugador1);
    } else if(puntajeBarra2 == meta){
        detenerJuego(nombreJugador2);
    }
    
}

function detenerJuego(ganador){
    clearInterval(update);
    actualizarPantalla();
    // Puntaje
    ctx.font = "50px ArcadeClassic";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(puntajeBarra1+" - "+puntajeBarra2, canvasAncho/2, canvasAlto/7);
    // Barra 1
    ctx.beginPath();
    ctx.fillStyle = barra1.color;
    ctx.fillRect(barra1.x, barra1.y - barra1.largo/2, barra1.ancho, barra1.largo);
    // Barra 2
    ctx.fillStyle = barra2.color;
    ctx.fillRect(barra2.x - barra2.ancho, barra2.y - barra2.largo/2, barra2.ancho, barra2.largo);
    //Asignar ganador
    ctx.font = "50px ArcadeClassic";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(ganador+"   gana  !", canvasAncho/2, canvasAlto/2);
}

function empezar(){
    update = setInterval(bucle, 1000/FPS);
}

function reset(){
    
}

function evaluarRebote(){
    
}

function actualizarPantalla(){
    ctx.clearRect(0, 0, canvasAncho, canvasAlto);

    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 15;
    ctx.strokeRect(0,0,canvasAncho, canvasAlto);
    ctx.stroke();
    ctx.closePath();
}

function clicPantalla(evento){
    let posX = evento.pageX - canvas.offsetLeft;
    let posY = evento.pageY - canvas.offsetTop;
    // Boton Empezar
    if((posX > botonEmpezar.x - botonEmpezar.largo/2 && posX < botonEmpezar.x + botonEmpezar.largo/2)
        && (posY > botonEmpezar.y - botonEmpezar.alto/2 && posY < botonEmpezar.y + botonEmpezar.alto/2)){
        empezar();
    }
}

function movimientoMouse(evento){
    let posX = evento.pageX - canvas.offsetLeft;
    let posY = evento.pageY - canvas.offsetTop;
    // Boton Empezar
    if((posX > botonEmpezar.x - botonEmpezar.largo/2 && posX < botonEmpezar.x + botonEmpezar.largo/2)
        && (posY > botonEmpezar.y - botonEmpezar.alto/2 && posY < botonEmpezar.y + botonEmpezar.alto/2)){
        canvas.style.cursor = "pointer";
    } else  {
        canvas.style.cursor = "default";
    }
}

inicio();