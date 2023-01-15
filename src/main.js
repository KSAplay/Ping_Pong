//--------------------------------------------------------------------------- 
//                              IMPORTS
//---------------------------------------------------------------------------
import * as sonido from './sistema/sonido.js';
import * as teclado from './entradas/teclado.js';
import * as render from './sistema/render.js';
import {barra1,barra2,pelota} from './juego/objetos.js';
import * as barraIA from './juego/maquina.js';

//--------------------------------------------------------------------------- 
//                             VARIABLES
//---------------------------------------------------------------------------
const SEGUNDO = 1000;
var update, guia, estaMostrandoGuia = false;
var timeDelta = 0, lastTick;
var distanciaBarras;    // Distancia que separa el borde de la barra
var velocidadBarras;    // Velocidad de ambas barras
var largoBarras;        // Largo de ambas barras por defecto
var minVelocidadX, maxVelocidadX;   // Variación de la velocidad min y max de X al golpear con la barra
var minVelocidadY, maxVelocidadY;   // Variación de la velocidad min y max de Y al golpear con la barra
var puntajeBarra1 = 0, puntajeBarra2 = 0, metaPuntaje = 5;  // Variables de puntaje
var nombreJugador1 = "Jugador 1", nombreJugador2 = "Jugador 2";    // Nombre de los jugadores
var menuActual = '.menu-principal', menuAnterior = '';      // Variables para el botón "Regresar"
var jugandoSolo = false;         // Variables de estado

// Movimiento de las barras mediante toque
var touches = [];
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

//--------------------------------------------------------------------------- 
//                       FUNCIÓN INCIAL DEL JUEGO
//---------------------------------------------------------------------------

function gameStart(){
    sonido.init();
    render.init();
    teclado.init();
    setValoresIniciales();
    render.limpiar();
    render.renderizar();
}

//--------------------------------------------------------------------------- 
//                       FUNCIÓN BUCLE DEL JUEGO
//---------------------------------------------------------------------------

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
        barraIA.moverBarra2();
    } else {
        if(teclado.estaPresionando("ArrowUp")){
            barra2.mover('arriba');
        } else if(teclado.estaPresionando("ArrowDown")){
            barra2.mover('abajo');
        }
    }

    // ----- Detecta la pelota en los bordes -----
    // Borde de abajo
    if(pelota.getY() + pelota.getRadio()/2 >= render.canvasAlto - render.grosorBorde/2 && pelota.getDireccionY() === "abajo"){
        pelota.setDireccionY("arriba");
        sonido.reproducir(sonido.reboteBorde);
    }
    // Borde de arriba
    if(pelota.getY() - pelota.getRadio()/2 <= render.grosorBorde/2 && pelota.getDireccionY() === "arriba"){
        pelota.setDireccionY("abajo");
        sonido.reproducir(sonido.reboteBorde);
    }
    // ---------- Detecta la pelota si rebota en la barra 1 ----------
    if(barra1.getX() < pelota.getX()
        && barra1.getX() + barra1.getAncho() > pelota.getX() - pelota.getRadio()/2
        && pelota.getY() > barra1.getY() - barra1.getLargo()/2 - pelota.getRadio()/2
        && pelota.getY() < barra1.getY() + barra1.getLargo()/2 + pelota.getRadio()/2
        && pelota.getDireccionX() === "izquierda"){
        
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
        && pelota.getY() < barra2.getY() + barra2.getLargo()/2 + pelota.getRadio()/2
        && pelota.getDireccionX() === "derecha"){
        
        pelota.setDireccionX("izquierda");
        // Cambia la velocidadX de la pelota dependiendo de donde golpea con la barra 2
        pelota.setVelocidadY(((pelota.getY() < barra2.getY()) ? barra2.getY()-pelota.getY() : pelota.getY()-barra2.getY())/(barra2.getLargo()/2+pelota.getRadio()/2)*(maxVelocidadY - minVelocidadY)+minVelocidadY);
        pelota.setVelocidadX(((pelota.getY() < barra2.getY()) ? pelota.getY()-(barra2.getY()-barra2.getLargo()/2-pelota.getRadio()/2) : (barra2.getY()+barra2.getLargo()/2+pelota.getRadio()/2)-pelota.getY())/(barra2.getLargo()/2+pelota.getRadio()/2)*(maxVelocidadX - minVelocidadX)+minVelocidadX);
        // Reproduce audio de rebote con la barra
        sonido.reproducir(sonido.reboteBarra);
    }

    // ---------- Detecta si la pelota golpea con el borde detras de la barra 1 ----------
    if(pelota.getX() + pelota.getRadio()/2 >= render.canvasAncho - render.grosorBorde/2){
        // Sumamos y mostramos punto para el jugador 1
        puntajeBarra1++;
        document.querySelector('.puntaje-1').textContent = puntajeBarra1;
        // Reproduce audio del punto si no se ha llegado a la meta
        if(puntajeBarra1 != metaPuntaje){
            sonido.reproducir(sonido.punto);
        }
        // Reposicionamos la pelota
        pelota.setX(barra1.getX() + barra1.getAncho() + pelota.getRadio()/2);
        pelota.setY(barra1.getY());
        // Ajustamos su velocidad a una velocidad aleatoria
        pelota.setVelocidadX((render.canvasAncho * (numeroAleatorio(4,7) / 10)) / SEGUNDO);
        pelota.setVelocidadY((render.canvasAncho * (numeroAleatorio(2,7) / 10)) / SEGUNDO);
    }
    // ---------- Detecta si la pelota golpea con el borde detras de la barra 2 ----------
    if(pelota.getX() - pelota.getRadio()/2 <= render.grosorBorde/2){
        // Sumamos y mostramos punto para el jugador 2
        puntajeBarra2++;
        document.querySelector('.puntaje-2').textContent = puntajeBarra2;
        // Reproduce audio del punto si no se ha llegado a la meta
        if(puntajeBarra2 != metaPuntaje){
            sonido.reproducir(sonido.punto);
        }
         // Reposicionamos la pelota
         pelota.setX(barra2.getX() - barra2.getAncho() - pelota.getRadio()/2);
         pelota.setY(barra2.getY());
         // Ajustamos su velocidad a una velocidad aleatoria
         pelota.setVelocidadX((render.canvasAncho * (numeroAleatorio(4,7) / 10)) / SEGUNDO);
         pelota.setVelocidadY((render.canvasAncho * (numeroAleatorio(2,7) / 10)) / SEGUNDO);
    }
    // ---------- Verifica si terminó el juego ----------
    if(puntajeBarra1 == metaPuntaje){
        gameOver(nombreJugador1);
    } else if(puntajeBarra2 == metaPuntaje){
        gameOver(nombreJugador2);
    } else {
        update = window.requestAnimationFrame(gameLoop);
    }
}

//--------------------------------------------------------------------------- 
//                       FUNCIÓN FINAL DEL JUEGO
//---------------------------------------------------------------------------

function gameOver(ganador){
    // Terminamos el gameLoop
    cancelAnimationFrame(update);
    // Redefinimos valores
    render.setJugando(false);
    barra1.setY(render.canvasAlto/2);
    barra2.setY(render.canvasAlto/2);
    // Actualizamos la pantalla
    render.limpiar();
    render.renderizar();
    // Mostrar ganador
    document.querySelector('.game-over').style.display = 'flex';
    document.querySelector('.ganador').textContent = ganador+"   gana  !";
    // Reproducir sonido de Game Over
    sonido.reproducir(sonido.terminarJuego);
}

/* ------------------------ FUNCIONES AUXILIARES ------------------------ */

function empezar(){
    render.setJugando(true);
    document.querySelector('.interfaz').style.display = 'none';
    document.querySelector('.puntaje').style.display = 'flex';
    update = window.requestAnimationFrame(gameLoop);
    sonido.reproducir(sonido.iniciarJuego);
}

function setValoresIniciales(){
    // Establecer variables
    estaMostrandoGuia = false;
    distanciaBarras = 40;
    velocidadBarras = render.canvasAlto * 20 / SEGUNDO;
    largoBarras = render.canvasAlto/6;
    puntajeBarra1 = 0, puntajeBarra2 = 0;
    document.querySelector('.puntaje-1').textContent = puntajeBarra1;
    document.querySelector('.puntaje-2').textContent = puntajeBarra2;
    timeDelta = 0; lastTick = 0; render.setJugando(false);
    minVelocidadX = render.canvasAncho * 0.4 / SEGUNDO; maxVelocidadX = render.canvasAncho * 0.7 / SEGUNDO;
    minVelocidadY = render.canvasAncho * 0.2 / SEGUNDO; maxVelocidadY = render.canvasAncho * 0.7 / SEGUNDO;
    cancelAnimationFrame(update);
    // Establecer objetos
    // --- Barra 1 ---
    barra1.setX(distanciaBarras);
    barra1.setY(render.canvasAlto/2);
    barra1.setLargo(largoBarras);
    barra1.setAncho(render.grosorBorde);
    barra1.setColor("white");
    barra1.setVelocidad(velocidadBarras);
    // --- Barra 2 ---
    barra2.setX(render.canvasAncho - distanciaBarras);
    barra2.setY(render.canvasAlto/2);
    barra2.setLargo(largoBarras);
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

export function numeroAleatorio(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

/* ------------------ FUNCIONES DEL MENU DEL JUEGO ------------------ */
var iconosRedesSociales = document.querySelectorAll('.icon');
iconosRedesSociales.forEach(function(botonRS) {
    botonRS.addEventListener('click', sonarRedSocial);
});

document.querySelector('.boton-un-jugador').addEventListener('click', unJugador);
document.querySelector('.boton-multijugador').addEventListener('click', multijugador);
document.querySelector('.boton-como-jugar').addEventListener('click', comoJugar);
document.querySelector('.boton-opciones').addEventListener('click', mostrarOpciones);

document.querySelector('.boton-local').addEventListener('click', multijugadorLocal);
document.querySelector('.boton-online').addEventListener('click', multijugadorOnline);

document.querySelector('.boton-pantalla-completa').addEventListener('click', pantallaCompleta);

document.querySelector('.boton-reintentar').addEventListener('click', reintentar);
document.querySelector('.boton-salir').addEventListener('click', salir);

var botonesRegresar = document.querySelectorAll('.boton-regresar');
botonesRegresar.forEach(function(boton) {
  boton.addEventListener('click', regresar);
});

function unJugador(){
    jugandoSolo = true;
    empezar();
}

function multijugador(){
    mostrarMenu('.menu-multijugador');
    sonido.reproducir(sonido.pressBoton);
}

function multijugadorOnline(){
    alert('No diponible aún.');
}

function multijugadorLocal(){
    jugandoSolo = false;
    empezar();
}

function comoJugar(){
    mostrarMenu('.menu-como-jugar');
    sonido.reproducir(sonido.pressBoton);
    guia = window.requestAnimationFrame(movimientoGuia);
    estaMostrandoGuia = true;
}

function movimientoGuia(){
    // Renderizamos
    render.limpiar();
    render.renderizar();
    // Para pantallas largas
    if(teclado.estaPresionando("w") || teclado.estaPresionando("W")){
        barra1.mover('arriba');
    } else if(teclado.estaPresionando("s") || teclado.estaPresionando("S")){
        barra1.mover('abajo');
    }
    if(teclado.estaPresionando("ArrowUp")){
        barra2.mover('arriba');
    } else if(teclado.estaPresionando("ArrowDown")){
        barra2.mover('abajo');
    }
    // Para moviles

    // Llamamos a otro frame
    guia = window.requestAnimationFrame(movimientoGuia);
}

function mostrarOpciones(){
    mostrarMenu('.menu-opciones');
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

function reintentar(){
    setValoresIniciales();
    document.querySelector('.game-over').style.display = 'none';
    empezar();
}

function salir(){
    setValoresIniciales();
    menuActual.classList.remove('active');
    document.querySelector('.menu-principal').classList.add('active');
    menuActual = document.querySelector('.menu-principal');
    document.querySelector('.puntaje').style.display = 'none';
    document.querySelector('.game-over').style.display = 'none';
    document.querySelector('.interfaz').style.display = 'flex';

    sonido.reproducir(sonido.pressBoton);
}

function regresar(){
    sonido.reproducir(sonido.pressBoton);
    // Obtener el menú actual y el menú anterior
    menuActual = document.querySelector('.menu.active');
    // Ocultar el menú actual
    menuActual.classList.remove('active');
    // Mostrar el menú anterior
    menuAnterior.classList.add('active');
    // Cancelamos la muestra, reestablecemos valores de las barra y renderizamos
    if(estaMostrandoGuia){
        cancelAnimationFrame(guia);
        barra1.setY(render.canvasAlto/2);
        barra2.setY(render.canvasAlto/2);
        estaMostrandoGuia = false;
        render.limpiar();
        render.renderizar();
    }
}

function mostrarMenu(menuClase){
    menuActual = document.querySelector(menuClase);
    menuAnterior = document.querySelector('.active');
    menuAnterior.classList.remove('active');
    menuActual.classList.add('active');
}

function sonarRedSocial(){
    sonido.reproducir(sonido.pressBoton);
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
    if(window.innerWidth < 990){
        document.querySelector('.contenedor-guia-desktop').classList.remove('guia-activa');
        document.querySelector('.contenedor-guia-movil').classList.add('guia-activa');
    } else {
        document.querySelector('.contenedor-guia-movil').classList.remove('guia-activa');
        document.querySelector('.contenedor-guia-desktop').classList.add('guia-activa');
    }
});

window.addEventListener('resize', () => {
    if(window.innerHeight > window.innerWidth){
        location.reload();
    } else {
        document.querySelector('.puntaje').style.display = 'none';
        document.querySelector('.aviso-girar-pantalla').style.display = 'none';
        document.querySelector('.interfaz').style.display = 'flex';
        if (!document.fullscreenElement) {
            document.querySelector('.screen').classList.remove('checked');
        }
        render.init();
        setValoresIniciales();
        render.renderizar();
    }
});