
const canvas = document.getElementById('mesa');
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');

var canvasAncho = window.innerWidth-window.innerWidth/14;
var canvasAlto = window.innerHeight-window.innerHeight/14;

const audio_rebote = new Audio("sounds/rebote.ogg");
const audio_punto = new Audio("sounds/punto.ogg");
const audio_gameover = new Audio("sounds/gameover.ogg");

ctx.canvas.width  = canvasAncho;
ctx.canvas.height = canvasAlto;

const SEGUNDO = 1000;
var moverBarra1Arriba = false, moverBarra1Abajo = false, moverBarra2Arriba = false, moverBarra2Abajo = false;
var distanciaBarras = 40, velocidadBarras = canvasAlto * 20 / SEGUNDO;
var largoBarrasDefault = canvasAlto/6, grosorBorde = 15;
var puntajeBarra1 = 0, puntajeBarra2 = 0, meta = 5;
var nombreJugador1 = "Jugador 1", nombreJugador2 = "Jugador 2";
var update, lastTick, empezoJuego = false, reproducirSonido = true;
var touches = [], touchesEnd = [], mostrarGuia = false;
var minVelocidadX = canvasAncho * 0.4 / SEGUNDO, maxVelocidadX = canvasAncho * 0.7 / SEGUNDO;
var minVelocidadY = canvasAncho * 0.2 / SEGUNDO, maxVelocidadY = canvasAncho * 0.7 / SEGUNDO;

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
    velocidadX: canvasAncho * 0.4 / SEGUNDO,
    velocidadY: canvasAncho * 0.4 / SEGUNDO,
    direccion: {
        x: "derecha",
        y: "arriba"
    }
};

var puntaje = {
    tamaño: "60px"
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

if(window.innerWidth < 990){
    puntaje.tamaño = "40px";
    pelota.radio = pelota.radio * 0.6;
    barra1.ancho = barra1.ancho * 0.8;
    barra2.ancho = barra2.ancho * 0.8;
}

canvas.addEventListener("mousedown", clicPantalla);
canvas.addEventListener("mousemove", movimientoMouse);

document.onkeydown = function(evento){
    evento = evento || window.event;
    if(evento.key == "w" || evento.key == "W"){
        moverBarra1Arriba = true;
    } else if(evento.key == "s" || evento.key == "S"){
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
    if(evento.key == "w" || evento.key == "W"){
        moverBarra1Arriba = false;
    } else if(evento.key == "s" || evento.key == "S"){
        moverBarra1Abajo = false;
    }

    if(evento.key == "ArrowUp"){
        moverBarra2Arriba = false;
    } else if(evento.key == "ArrowDown"){
        moverBarra2Abajo = false;
    }
}

window.ontouchstart = (event) => {   
    moverBarras(event);
}

window.ontouchend = (event) => {
    moverBarras(event);
}

function moverBarras(evento){
    touches = evento.touches;
    if(empezoJuego){
        if(touches.length > 0){
            for(let i = 0; i < touches.length; i++){
                if(touches[i].clientX < canvasAncho/2){
                    moverBarra1Arriba = (touches[i].clientY < canvasAlto/2) ? true : false;
                    moverBarra1Abajo = (touches[i].clientY > canvasAlto/2) ? true : false;
                } else {
                    moverBarra2Arriba = (touches[i].clientY < canvasAlto/2) ? true : false;
                    moverBarra2Abajo = (touches[i].clientY > canvasAlto/2) ? true : false;
                }
            }
        } else {
            moverBarra1Arriba = false;
            moverBarra1Abajo = false;
            moverBarra2Arriba = false;
            moverBarra2Abajo = false;
        }
    }
}

function empezar(){
    empezoJuego = true;
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
    reproducirSonido = true;
}

const bucle = (time) => {
    actualizarPantalla();

    // ---------- Movimieto de la Pelota ----------
    const timeDelta = lastTick ? (time - lastTick) : 0;
    lastTick = time;
    pelota.x = pelota.x + ((pelota.direccion.x == "izquierda") ? -1 : 1) * pelota.velocidadX * timeDelta;
    pelota.y = pelota.y + ((pelota.direccion.y == "arriba") ? -1 : 1) * pelota.velocidadY * timeDelta;

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
        audio_rebote.play();
    }

    if(pelota.y - pelota.radio/2 <= grosorBorde/2){
        pelota.direccion.y = "abajo";
        audio_rebote.play();
    }
    // ---------- Detecta la pelota si rebota en la barra 1 ----------
    if(barra1.x < pelota.x
        && barra1.x + barra1.ancho > pelota.x - pelota.radio/2
        && pelota.y > barra1.y - barra1.largo/2 - pelota.radio/2
        && pelota.y < barra1.y + barra1.largo/2 + pelota.radio/2){
        
        pelota.direccion.x = "derecha";
        // Cambia la velocidadX de la pelota dependiendo de donde golpea con la barra 1
        pelota.velocidadY = ((pelota.y < barra1.y) ? barra1.y-pelota.y : pelota.y-barra1.y)/(barra1.largo/2+pelota.radio/2)*(maxVelocidadY - minVelocidadY)+minVelocidadY;
        pelota.velocidadX = ((pelota.y < barra1.y) ? pelota.y-(barra1.y-barra1.largo/2-pelota.radio/2) : (barra1.y+barra1.largo/2+pelota.radio/2)-pelota.y)/(barra1.largo/2+pelota.radio/2)*(maxVelocidadX - minVelocidadX)+minVelocidadX;
        // Reproduce audio de rebote con la barra
        audio_rebote.playbackRate = 1;
        audio_rebote.play();
    }
    // ---------- Detecta la pelota si rebota en la barra 2 ----------
    if(barra2.x > pelota.x
        && barra2.x - barra2.ancho < pelota.x + pelota.radio/2
        && pelota.y > barra2.y - barra2.largo/2 - pelota.radio/2
        && pelota.y < barra2.y + barra2.largo/2 + pelota.radio/2){
        
        pelota.direccion.x = "izquierda";
        // Cambia la velocidadX de la pelota dependiendo de donde golpea con la barra 2
        pelota.velocidadY = ((pelota.y < barra2.y) ? barra2.y-pelota.y : pelota.y-barra2.y)/(barra2.largo/2+pelota.radio/2)*(maxVelocidadY - minVelocidadY)+minVelocidadY;
        pelota.velocidadX = ((pelota.y < barra2.y) ? pelota.y-(barra2.y-barra2.largo/2-pelota.radio/2) : (barra2.y+barra2.largo/2+pelota.radio/2)-pelota.y)/(barra2.largo/2+pelota.radio/2)*(maxVelocidadX - minVelocidadX)+minVelocidadX;
        // Reproduce audio de rebote con la barra
        audio_rebote.playbackRate = 1;
        audio_rebote.play();
    }

    if(pelota.x - pelota.radio/2 <= grosorBorde/2){
        pelota.x = barra2.x - barra2.ancho - pelota.radio/2;
        pelota.y = barra2.y;
        puntajeBarra2++;
        audio_punto.play();
    }

    if(pelota.x + pelota.radio/2 >= canvasAncho - grosorBorde/2){
        pelota.x = barra1.x + barra1.ancho + pelota.radio/2;
        pelota.y = barra1.y;
        puntajeBarra1++;
        audio_punto.play();
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
    reproducirSonido = false;
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
    // Asignar ganador
    ctx.font = "50px ArcadeClassic";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(ganador+"   gana  !", canvasAncho/2, canvasAlto/2);
    // Reproducir sonido de Game Over
    audio_punto.pause();
    audio_punto.currentTime = 0;
    audio_gameover.play();
}

function reset(){
    
}

function limpiarPantalla(){
    ctx.clearRect(0, 0, canvasAncho, canvasAlto);
    // // Dibujar bordes
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.lineWidth = grosorBorde;
    ctx.strokeRect(0,0,canvasAncho, canvasAlto);
    ctx.stroke();
    ctx.closePath();
}

function actualizarPantalla(){
    limpiarPantalla();
    // Linea central
    ctx.beginPath();
    if(window.innerWidth < 990) {
        ctx.lineWidth = grosorBorde/6;
        ctx.setLineDash([15, 10])
    } else {
        ctx.lineWidth = grosorBorde/3;
        ctx.setLineDash([30, 20])
    }
    ctx.moveTo(canvasAncho/2,0);
    ctx.lineTo(canvasAncho/2,canvasAlto)
    ctx.stroke();
    ctx.closePath();
    ctx.setLineDash([]);
    // Puntaje
    ctx.beginPath();
    ctx.font = puntaje.tamaño+" ArcadeClassic";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(puntajeBarra1, canvasAncho/2 - canvasAncho/8, canvasAlto/7);
    ctx.fillText(puntajeBarra2, canvasAncho/2 + canvasAncho/8, canvasAlto/7);
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

document.fonts.ready.then(inicio);
