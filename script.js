
// Canvas y Contexto 2D
const canvas = document.getElementById('mesa');
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');

var canvasAncho, canvasAlto;

// Audios
const audio_reboteBarra = new Audio("assets/sounds/rebote-barra.wav");
const audio_reboteBorde = new Audio("assets/sounds/rebote-borde.wav");
const audio_punto = new Audio("assets/sounds/punto.wav");
const audio_gameOver = new Audio("assets/sounds/game-over.wav");
const audio_pressBoton = new Audio("assets/sounds/boton.wav");
const audio_iniciarJuego = new Audio("assets/sounds/iniciar-juego.wav");

// Variables
const SEGUNDO = 1000;
var timeDelta = 0;
var moverBarra1Arriba, moverBarra1Abajo, moverBarra2Arriba, moverBarra2Abajo;
var distanciaBarras, velocidadBarras;
var largoBarrasDefault, grosorBorde = 15;
var puntajeBarra1 = 0, puntajeBarra2 = 0, metaPuntaje = 5;
var nombreJugador1 = "Jugador 1", nombreJugador2 = "Jugador 2";
var update, lastTick, empezoJuego = false;
var touches = [];
var minVelocidadX, maxVelocidadX;
var minVelocidadY, maxVelocidadY;
var menuActual = '.menu-principal', menuAnterior = '';
var estaSilenciado = false, unJugador = false, multijugador = false;

// Objetos
const barra1 = {
    x: 0,
    y: 0,
    largo: 0,
    ancho: 0,
    color: "white",
    velocidad: 0
};

const barra2 = {
    x: 0,
    y: 0,
    largo: 0,
    ancho: 0,
    color: "white",
    velocidad: 0
};

const pelota = {
    x: 0,
    y: 0,
    color: "white",
    radio: 0,
    velocidadX: 0,
    velocidadY: 0,
    direccion:{
        x: 0,
        y: 0
    }
};

// Movimiento de las barras mediante teclado
document.onkeydown = function(evento){
    evento = evento || window.event;
    if(evento.key == "w" || evento.key == "W"){
        moverBarra1Arriba = true;
    } else if(evento.key == "s" || evento.key == "S"){
        moverBarra1Abajo = true;
    }
    if(!unJugador){
        if(evento.key == "ArrowUp"){
            moverBarra2Arriba = true;
        } else if(evento.key == "ArrowDown"){
            moverBarra2Abajo = true;
        }   
    }
}

document.onkeyup = function(evento){
    evento = evento || window.event;
    if(evento.key == "w" || evento.key == "W"){
        moverBarra1Arriba = false;
    } else if(evento.key == "s" || evento.key == "S"){
        moverBarra1Abajo = false;
    }
    if(!unJugador){
        if(evento.key == "ArrowUp"){
            moverBarra2Arriba = false;
        } else if(evento.key == "ArrowDown"){
            moverBarra2Abajo = false;
        }
    }
}

// Movimiento de las barras mediante toque
window.ontouchstart = (event) => {   
    detectarToque(event);
}

window.ontouchend = (event) => {
    detectarToque(event);
}

function detectarToque(evento){
    touches = evento.touches;
    if(empezoJuego){
        if(touches.length > 0){
            for(let i = 0; i < touches.length; i++){
                if(touches[i].clientX < canvasAncho/2){
                    moverBarra1Arriba = (touches[i].clientY < canvasAlto/2) ? true : false;
                    moverBarra1Abajo = (touches[i].clientY > canvasAlto/2) ? true : false;
                } else {
                    if(!unJugador){
                        moverBarra2Arriba = (touches[i].clientY < canvasAlto/2) ? true : false;
                        moverBarra2Abajo = (touches[i].clientY > canvasAlto/2) ? true : false;
                    }
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
    document.querySelector('.interfaz').style.display = 'none';
    document.querySelector('.puntaje').style.display = 'flex';
    update = window.requestAnimationFrame(bucle);
    if(!estaSilenciado){audio_iniciarJuego.play();}
}
function inicio(){
    // Establecer canvas
    canvasAncho = window.innerWidth-window.innerWidth/14;
    canvasAlto = window.innerHeight-window.innerHeight/14;
    ctx.canvas.width  = canvasAncho;
    ctx.canvas.height = canvasAlto;
    // Establecer variables y objetos
    establecerValores();
    // Bordes
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.lineWidth = grosorBorde;
    ctx.strokeRect(0,0,canvasAncho, canvasAlto);
    ctx.stroke();
    // Dibjuar Barra 1
    ctx.fillStyle = barra1.color;
    ctx.fillRect(barra1.x, barra1.y - barra1.largo/2, barra1.ancho, barra1.largo);
    // Dibjuar Barra 2
    ctx.fillStyle = barra2.color;
    ctx.fillRect(barra2.x - barra2.ancho, barra2.y - barra2.largo/2, barra2.ancho, barra2.largo);
    ctx.closePath();
}

const bucle = (time) => {
    actualizarPantalla();

    // ---------- Movimieto de la Pelota ----------
    timeDelta = lastTick ? (time - lastTick) : 0;
    lastTick = time;
    pelota.x = pelota.x + ((pelota.direccion.x == "izquierda") ? -1 : 1) * pelota.velocidadX * timeDelta;
    pelota.y = pelota.y + ((pelota.direccion.y == "arriba") ? -1 : 1) * pelota.velocidadY * timeDelta;

    // ---------- Movimieto de la Barra 1 ----------
    if(moverBarra1Arriba){
        moverBarra(barra1,'arriba');
    } else if(moverBarra1Abajo){
        moverBarra(barra1,'abajo');
    }
    // ---------- Movimieto de la Barra 2 ----------
    if(moverBarra2Arriba){
        moverBarra(barra2,'arriba');
    } else if(moverBarra2Abajo){
        moverBarra(barra2,'abajo');
    }
    // ----- Detecta la pelota en los bordes -----
    // Borde de abajo
    if(pelota.y + pelota.radio/2 >= canvasAlto - grosorBorde/2){
        pelota.direccion.y = "arriba";
        if(!estaSilenciado) {audio_reboteBorde.play();}
    }
    // Borde de arriba
    if(pelota.y - pelota.radio/2 <= grosorBorde/2){
        pelota.direccion.y = "abajo";
        if(!estaSilenciado) {audio_reboteBorde.play();}
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
        if(!estaSilenciado) {audio_reboteBarra.play();}
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
        if(!estaSilenciado) {audio_reboteBarra.play();}
    }

    // ---------- Detecta si la pelota golpea con el borde detras de las barras ----------
    if(pelota.x + pelota.radio/2 >= canvasAncho - grosorBorde/2){
        pelota.x = barra1.x + barra1.ancho + pelota.radio/2;
        pelota.y = barra1.y;
        puntajeBarra1++;
        if(!estaSilenciado) {
            if(puntajeBarra1 != metaPuntaje){
                audio_punto.play();
            }
        }
    }
    if(pelota.x - pelota.radio/2 <= grosorBorde/2){
        pelota.x = barra2.x - barra2.ancho - pelota.radio/2;
        pelota.y = barra2.y;
        puntajeBarra2++;
        if(!estaSilenciado) {
            if(puntajeBarra2 != metaPuntaje){
                audio_punto.play();
            }
        }
    }
    // ---------- Verifica si terminó el juego ----------
    if(puntajeBarra1 == metaPuntaje){
        detenerJuego(nombreJugador1);
    } else if(puntajeBarra2 == metaPuntaje){
        detenerJuego(nombreJugador2);
    } else {
        update = window.requestAnimationFrame(bucle);
    }
    
}

function barraIA(){
    
}

function establecerValores(){
    // Establecer variables
    moverBarra1Arriba = false; moverBarra1Abajo = false; moverBarra2Arriba = false; moverBarra2Abajo = false;
    distanciaBarras = 40;
    velocidadBarras = canvasAlto * 20 / SEGUNDO;
    largoBarrasDefault = canvasAlto/6;
    puntajeBarra1 = 0, puntajeBarra2 = 0;
    timeDelta = 0; lastTick = 0; empezoJuego = false;
    minVelocidadX = canvasAncho * 0.4 / SEGUNDO; maxVelocidadX = canvasAncho * 0.7 / SEGUNDO;
    minVelocidadY = canvasAncho * 0.2 / SEGUNDO; maxVelocidadY = canvasAncho * 0.7 / SEGUNDO;
    // Establecer objetos
    // --- Barra 1 ---
    barra1.x = distanciaBarras;
    barra1.y = canvasAlto/2;
    barra1.largo = largoBarrasDefault;
    barra1.ancho = grosorBorde;
    barra1.color = "white";
    barra1.velocidad = velocidadBarras;
    // --- Barra 2 ---
    barra2.x = canvasAncho - distanciaBarras;
    barra2.y = canvasAlto/2;
    barra2.largo = largoBarrasDefault;
    barra2.ancho = grosorBorde;
    barra2.color = "white";
    barra2.velocidad = velocidadBarras;
    // --- Pelota ---
    pelota.x = canvasAncho/2;
    pelota.y = canvasAlto/2;
    pelota.color = "white";
    pelota.radio = 15; // 15 por defecto
    pelota.velocidadX = canvasAncho * 0.4 / SEGUNDO;
    pelota.velocidadY = canvasAncho * 0.4 / SEGUNDO;
    pelota.direccion.x = numeroAleatorio(0,1) ? "izquierda" : "derecha";
    pelota.direccion.y = numeroAleatorio(0,1) ? "arriba" : "abajo";

    if(window.innerWidth < 990){
        pelota.radio = pelota.radio * 0.6;
        barra1.ancho = barra1.ancho * 0.8;
        barra2.ancho = barra2.ancho * 0.8;
    }
}

function moverBarra(barra, direccion){
    switch (direccion) {
        case 'arriba':
            if(barra.y - barra.largo/2 - barra.velocidad <= grosorBorde/2){
                barra.y = barra.largo/2 + grosorBorde/2;
            } else {
                barra.y -= barra.velocidad;
            }
            break;
        case 'abajo':
            if(barra.y + barra.largo/2 + barra.velocidad >= canvasAlto - grosorBorde/2){
                barra.y = canvasAlto - barra1.largo/2 - grosorBorde/2;
            } else {
                barra.y += barra.velocidad;
            }
            break;
    }
}

function detenerJuego(ganador){
    cancelAnimationFrame(update);
    empezoJuego = false;
    limpiarPantalla();
    // // Puntaje
    document.querySelector('.puntaje-1').textContent = puntajeBarra1;
    document.querySelector('.puntaje-2').textContent = puntajeBarra2;
    // Barra 1
    ctx.beginPath();
    ctx.fillStyle = barra1.color;
    ctx.fillRect(barra1.x, canvasAlto/2 - barra1.largo/2, barra1.ancho, barra1.largo);
    // Barra 2
    ctx.fillStyle = barra2.color;
    ctx.fillRect(barra2.x - barra2.ancho, canvasAlto/2 - barra2.largo/2, barra2.ancho, barra2.largo);
    ctx.closePath();
    // Mostrar ganador
    document.querySelector('.game-over').style.display = 'flex';
    document.querySelector('.ganador').textContent = ganador+"   gana  !";
    // Reproducir sonido de Game Over
    if(!estaSilenciado) {audio_gameOver.play();}
}

function alertaTamaño(){
    document.querySelector('.interfaz').style.display = 'none';
    document.querySelector('.aviso-rotar-pantalla').style.display = 'flex';
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
        ctx.lineWidth = grosorBorde/8;
        ctx.setLineDash([15, 10])
    } else {
        ctx.lineWidth = grosorBorde/5;
        ctx.setLineDash([15, 20])
    }
    ctx.moveTo(canvasAncho/2,0);
    ctx.lineTo(canvasAncho/2,canvasAlto)
    ctx.stroke();
    ctx.closePath();
    ctx.setLineDash([]);
    // Puntaje
    document.querySelector('.puntaje-1').textContent = puntajeBarra1;
    document.querySelector('.puntaje-2').textContent = puntajeBarra2;
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

function mostrarOpciones(){
    menuAnterior = menuActual;
    menuActual = '.menu-opciones';
    document.querySelector(menuAnterior).style.display = 'none';
    document.querySelector(menuActual).style.display = 'block';
    if(!estaSilenciado){audio_pressBoton.play();}
}

function pantallaCompleta(){
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        document.documentElement.requestFullscreen();
    }
    if(!estaSilenciado){audio_pressBoton.play();}
    document.querySelector('.screen').classList.toggle('checked');
}

function mutear(){
    if(estaSilenciado){
        audio_pressBoton.play();
        estaSilenciado = false;
    } else {
        estaSilenciado = true;
    }
    document.querySelector('.mute').classList.toggle('checked');
}


function regresar(){
    document.querySelector(menuAnterior).style.display = 'block';
    document.querySelector(menuActual).style.display = 'none';
    menuActual = menuAnterior;
    menuAnterior = '';
    if(!estaSilenciado){audio_pressBoton.play();}
}

function reintentar(){
    establecerValores();
    empezoJuego = true;
    document.querySelector('.game-over').style.display = 'none';
    document.querySelector('.puntaje').style.display = 'flex';
    if(!estaSilenciado){audio_iniciarJuego.play();}
    update = window.requestAnimationFrame(bucle);
}

function salir(){
    establecerValores();
    document.querySelector('.puntaje').style.display = 'none';
    document.querySelector('.game-over').style.display = 'none';
    document.querySelector('.interfaz').style.display = 'flex';
    if(!estaSilenciado){audio_pressBoton.play();}
}

function numeroAleatorio(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function reproducirAudio(){

}

window.onload = function() {
    if(window.innerHeight > window.innerWidth){
        ctx.clearRect(0,0,canvasAncho,canvasAlto);
        document.querySelector('.puntaje').style.display = 'none';
        document.querySelector('.interfaz').style.display = 'none';
        document.querySelector('.aviso-girar-pantalla').style.display = 'flex';
    } else {
        document.querySelector('.aviso-girar-pantalla').style.display = 'none';
        document.querySelector('.interfaz').style.display = 'flex';
        document.fonts.ready.then(inicio);
    }
};

window.addEventListener('resize', function() {
    if(empezoJuego){
        location.reload();
    } else {
        if(window.innerHeight > window.innerWidth){
            ctx.clearRect(0,0,canvasAncho,canvasAlto);
            document.querySelector('.interfaz').style.display = 'none';
            document.querySelector('.aviso-girar-pantalla').style.display = 'flex';
        } else {
            document.querySelector('.aviso-girar-pantalla').style.display = 'none';
            document.querySelector('.interfaz').style.display = 'flex';
            inicio();
        }
    }
});
  