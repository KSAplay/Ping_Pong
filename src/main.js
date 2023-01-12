// Imports
import * as sonido from './sistema/sonido.js';
import * as teclado from './entradas/teclado.js';
import * as render from './sistema/render.js';
import {barra1,barra2,pelota} from './juego/objetos.js';

// Variables
const SEGUNDO = 1000;
var timeDelta = 0;
var distanciaBarras, velocidadBarras;
var largoBarrasDefault;
var puntajeBarra1 = 0, puntajeBarra2 = 0, metaPuntaje = 5;
var nombreJugador1 = "Jugador 1", nombreJugador2 = "Jugador 2";
var update, lastTick;
var touches = [];
var minVelocidadX, maxVelocidadX;
var minVelocidadY, maxVelocidadY;
var menuActual = '.menu-principal', menuAnterior = '';
var jugandoSolo = false, multijugadorLocal = false;

// Movimiento de las barras mediante toque
window.ontouchstart = (event) => {   
    detectarToque(event);
}

window.ontouchend = (event) => {
    detectarToque(event);
}

function detectarToque(evento){
    touches = evento.touches;
    if(render.estaJugando){
        if(touches.length > 0){
            for(let i = 0; i < touches.length; i++){
                if(touches[i].clientX < render.canvasAncho/2){
                    moverBarra1Arriba = (touches[i].clientY < render.canvasAlto/2) ? true : false;
                    moverBarra1Abajo = (touches[i].clientY > render.canvasAlto/2) ? true : false;
                } else {
                    if(!jugandoSolo){
                        moverBarra2Arriba = (touches[i].clientY < render.canvasAlto/2) ? true : false;
                        moverBarra2Abajo = (touches[i].clientY > render.canvasAlto/2) ? true : false;
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

function gameStart(){
    sonido.init();
    render.init();
    teclado.init();
    setValoresIniciales();
    render.limpiar();
    render.renderizar();
}

function gameLoop(time){
    // ---------- Renderizar la pantalla ----------
    render.limpiar();
    render.renderizar();

    // ---------- Movimieto de la Pelota ----------
    timeDelta = lastTick ? (time - lastTick) : 0;
    lastTick = time;
    pelota.setX(pelota.getX() + ((pelota.getDireccionX() == "izquierda") ? -1 : 1) * pelota.getVelocidadX() * timeDelta);
    pelota.setY(pelota.getY() + ((pelota.getDireccionY() == "arriba") ? -1 : 1) * pelota.getVelocidadY() * timeDelta);

    // ---------- Movimieto de la Barra 1 ----------

    if(teclado.estaPresionando("w") || teclado.estaPresionando("W")){
        barra1.mover('arriba');
    } else if(teclado.estaPresionando("s") || teclado.estaPresionando("S")){
        barra1.mover('abajo');
    }
    // ---------- Movimieto de la Barra 2 ----------
    if(jugandoSolo){
        barraIA();
    } else {
        if(teclado.estaPresionando("ArrowUp")){
            barra2.mover('arriba');
        } else if(teclado.estaPresionando("ArrowDown")){
            barra2.mover('abajo');
        }
    }

    // ----- Detecta la pelota en los bordes -----
    // Borde de abajo
    if(pelota.getY() + pelota.getRadio()/2 >= render.canvasAlto - render.grosorBorde/2){
        pelota.setDireccionY("arriba");
        sonido.reproducir(sonido.reboteBorde);
    }
    // Borde de arriba
    if(pelota.getY() - pelota.getRadio()/2 <= render.grosorBorde/2){
        pelota.setDireccionY("abajo");
        sonido.reproducir(sonido.reboteBorde);
    }
    // ---------- Detecta la pelota si rebota en la barra 1 ----------
    if(barra1.getX() < pelota.getX()
        && barra1.getX() + barra1.getAncho() > pelota.getX() - pelota.getRadio()/2
        && pelota.getY() > barra1.getY() - barra1.getLargo()/2 - pelota.getRadio()/2
        && pelota.getY() < barra1.getY() + barra1.getLargo()/2 + pelota.getRadio()/2){
        
        pelota.setDireccionX("derecha");
        // Cambia la velocidadX de la pelota dependiendo de donde golpea con la barra 1
        pelota.setVelocidadY(((pelota.getY() < barra1.getY()) ? 
            barra1.getY()-pelota.getY() : pelota.getY()-barra1.getY())/(barra1.getLargo()/2+pelota.getRadio()/2)*(maxVelocidadY - minVelocidadY)+minVelocidadY);
        pelota.setVelocidadX(((pelota.getY() < barra1.getY()) ? 
            pelota.getY()-(barra1.getY()-barra1.getLargo()/2-pelota.getRadio()/2) : (barra1.getY()+barra1.getLargo()/2+pelota.getRadio()/2)-pelota.getY())/(barra1.getLargo()/2+pelota.getRadio()/2)*(maxVelocidadX - minVelocidadX)+minVelocidadX);
        // Reproduce audio de rebote con la barra
        sonido.reproducir(sonido.reboteBarra);
    }
    // ---------- Detecta la pelota si rebota en la barra 2 ----------
    if(barra2.getX() > pelota.getX()
        && barra2.getX() - barra2.getAncho() < pelota.getX() + pelota.getRadio()/2
        && pelota.getY() > barra2.getY() - barra2.getLargo()/2 - pelota.getRadio()/2
        && pelota.getY() < barra2.getY() + barra2.getLargo()/2 + pelota.getRadio()/2){
        
        pelota.setDireccionX("izquierda");
        // Cambia la velocidadX de la pelota dependiendo de donde golpea con la barra 2
        pelota.setVelocidadY(((pelota.getY() < barra2.getY()) ? barra2.getY()-pelota.getY() : pelota.getY()-barra2.getY())/(barra2.getLargo()/2+pelota.getRadio()/2)*(maxVelocidadY - minVelocidadY)+minVelocidadY);
        pelota.setVelocidadX(((pelota.getY() < barra2.getY()) ? pelota.getY()-(barra2.getY()-barra2.getLargo()/2-pelota.getRadio()/2) : (barra2.getY()+barra2.getLargo()/2+pelota.getRadio()/2)-pelota.getY())/(barra2.getLargo()/2+pelota.getRadio()/2)*(maxVelocidadX - minVelocidadX)+minVelocidadX);
        // Reproduce audio de rebote con la barra
        sonido.reproducir(sonido.reboteBarra);
    }

    // ---------- Detecta si la pelota golpea con el borde detras de las barras ----------
    if(pelota.getX() + pelota.getRadio()/2 >= render.canvasAncho - render.grosorBorde/2){
        pelota.setX(barra1.getX() + barra1.getAncho() + pelota.getRadio()/2);
        pelota.setY(barra1.getY());
        
        puntajeBarra1++;
        document.querySelector('.puntaje-1').textContent = puntajeBarra1;
        
        if(puntajeBarra1 != metaPuntaje){
            sonido.reproducir(sonido.punto);
        }
    }
    if(pelota.getX() - pelota.getRadio()/2 <= render.grosorBorde/2){
        pelota.setX(barra2.getX() - barra2.getAncho() - pelota.getRadio()/2);
        pelota.setY(barra2.getY());
        
        puntajeBarra2++;
        document.querySelector('.puntaje-2').textContent = puntajeBarra2;
        
        if(puntajeBarra2 != metaPuntaje){
            sonido.reproducir(sonido.punto);
        }
    }
    // ---------- Verifica si terminó el juego ----------
    if(puntajeBarra1 == metaPuntaje){
        detenerJuego(nombreJugador1);
    } else if(puntajeBarra2 == metaPuntaje){
        detenerJuego(nombreJugador2);
    } else {
        update = window.requestAnimationFrame(gameLoop);
    }
    
}

function empezar(){
    render.setJugando(true);
    document.querySelector('.interfaz').style.display = 'none';
    document.querySelector('.puntaje').style.display = 'flex';
    update = window.requestAnimationFrame(gameLoop);
    sonido.reproducir(sonido.iniciarJuego);
}

function barraIA(){
    if(pelota.getDireccionX() === "derecha" && pelota.getX() > render.canvasAncho/2){
        if(barra2.getY() < pelota.getY()){
            if(barra2.getY() + barra2.getLargo()/2 + barra2.getVelocidad() >= render.canvasAlto - render.grosorBorde/2){
                barra2.setY(render.canvasAlto - barra2.getLargo()/2 - render.grosorBorde/2);
            } else {

                barra2.setY(barra2.getY() + barra2.getVelocidad());
            }
        } else {
            if(barra2.getY() - barra2.getLargo()/2 - barra2.getVelocidad() <= render.grosorBorde/2){
                barra2.setY(barra2.getLargo()/2 + render.grosorBorde/2);
            } else {
                barra2.setY(barra2.getY() - barra2.getVelocidad());
            }
        }
    }
}

function setValoresIniciales(){
    // Establecer variables
    distanciaBarras = 40;
    velocidadBarras = render.canvasAlto * 20 / SEGUNDO;
    largoBarrasDefault = render.canvasAlto/6;
    puntajeBarra1 = 0, puntajeBarra2 = 0;
    timeDelta = 0; lastTick = 0; render.setJugando(false);
    minVelocidadX = render.canvasAncho * 0.4 / SEGUNDO; maxVelocidadX = render.canvasAncho * 0.7 / SEGUNDO;
    minVelocidadY = render.canvasAncho * 0.2 / SEGUNDO; maxVelocidadY = render.canvasAncho * 0.7 / SEGUNDO;
    cancelAnimationFrame(update);
    // Establecer objetos
    // --- Barra 1 ---
    barra1.setX(distanciaBarras);
    barra1.setY(render.canvasAlto/2);
    barra1.setLargo(largoBarrasDefault);
    barra1.setAncho(render.grosorBorde);
    barra1.setColor("white");
    barra1.setVelocidad(velocidadBarras);
    // --- Barra 2 ---
    barra2.setX(render.canvasAncho - distanciaBarras);
    barra2.setY(render.canvasAlto/2);
    barra2.setLargo(largoBarrasDefault);
    barra2.setAncho(render.grosorBorde);
    barra2.setColor("white");
    barra2.setVelocidad(velocidadBarras);
    // --- Pelota ---
    pelota.setX(render.canvasAncho/2);
    pelota.setY(render.canvasAlto/2);
    pelota.setColor("white");
    pelota.setRadio(15); // 15 por defecto
    pelota.setVelocidadX(render.canvasAncho * 0.4 / SEGUNDO);
    pelota.setVelocidadY(render.canvasAncho * 0.4 / SEGUNDO);
    pelota.setDireccionX(numeroAleatorio(0,1) ? "izquierda" : "derecha");
    pelota.setDireccionY(numeroAleatorio(0,1) ? "arriba" : "abajo");

    if(window.innerWidth < 990){
        pelota.setRadio(pelota.getRadio() * 0.6);
        barra1.setAncho(barra1.getAncho() * 0.8);
        barra2.setAncho(barra2.getAncho() * 0.8);
    }
}

function detenerJuego(ganador){
    cancelAnimationFrame(update);
    render.setJugando(false);
    render.limpiar();
    render.renderizar();
    // Mostrar ganador
    document.querySelector('.game-over').style.display = 'flex';
    document.querySelector('.ganador').textContent = ganador+"   gana  !";
    // Reproducir sonido de Game Over
    sonido.reproducir(sonido.gameOver);
}

/* ------------------ FUNCIONES DEL MENU DEL JUEGO ------------------ */

document.querySelector('.boton-un-jugador').addEventListener('click', unJugador);
document.querySelector('.boton-multijugador').addEventListener('click', multijugador);
document.querySelector('.boton-opciones').addEventListener('click', mostrarOpciones);

document.querySelector('.boton-pantalla-completa').addEventListener('click', pantallaCompleta);

document.querySelector('.boton-reintentar').addEventListener('click', reintentar);
document.querySelector('.boton-salir').addEventListener('click', salir);

document.querySelector('.boton-regresar').addEventListener('click', regresar);

function unJugador(){
    jugandoSolo = true;
    empezar();
}

function multijugador(){
    jugandoSolo = false;
    empezar();
}

function mostrarOpciones(){
    menuAnterior = menuActual;
    menuActual = '.menu-opciones';
    document.querySelector(menuAnterior).style.display = 'none';
    document.querySelector(menuActual).style.display = 'block';
    sonido.reproducir(sonido.pressBoton);
}

function pantallaCompleta(){
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        document.documentElement.requestFullscreen();
    }
    document.querySelector('.screen').classList.toggle('checked');
    sonido.reproducir(sonido.pressBoton);
}


function regresar(){
    document.querySelector(menuAnterior).style.display = 'block';
    document.querySelector(menuActual).style.display = 'none';
    menuActual = menuAnterior;
    menuAnterior = '';
    sonido.reproducir(sonido.pressBoton);
}

function reintentar(){
    setValoresIniciales();
    render.setJugando(true);
    document.querySelector('.game-over').style.display = 'none';
    document.querySelector('.puntaje').style.display = 'flex';
    sonido.reproducir(sonido.iniciarJuego);
    update = window.requestAnimationFrame(gameLoop);
}

function salir(){
    setValoresIniciales();
    document.querySelector('.puntaje').style.display = 'none';
    document.querySelector('.game-over').style.display = 'none';
    document.querySelector('.interfaz').style.display = 'flex';
    sonido.reproducir(sonido.pressBoton);
}

/* ------------------------- FUNCIONES AUXILIARES -------------------------- */

function numeroAleatorio(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

/* ------------ FUNCIONES CUANDO LA PANTALLA CARGA O SE REDIMENSIONA ------------- */

window.addEventListener("load",() => {
    if(window.innerHeight > window.innerWidth){
        document.querySelector('.interfaz').style.display = 'none';
        document.querySelector('.aviso-girar-pantalla').style.display = 'flex';
    } else {
        document.querySelector('.aviso-girar-pantalla').style.display = 'none';
        document.querySelector('.interfaz').style.display = 'flex';
        document.fonts.ready.then(gameStart);
    }
});

window.addEventListener('resize', () => {
    if(window.innerHeight > window.innerWidth){
        location.reload();
    } else {
        document.querySelector('.puntaje').style.display = 'none';
        document.querySelector('.aviso-girar-pantalla').style.display = 'none';
        document.querySelector('.interfaz').style.display = 'flex';
        render.init();
        setValoresIniciales();
        render.renderizar();
    }
});