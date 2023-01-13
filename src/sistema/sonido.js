// Audios
export const reboteBarra = new Audio("src/assets/sounds/rebote-barra.wav");
export const reboteBorde = new Audio("src/assets/sounds/rebote-borde.wav");
export const punto = new Audio("src/assets/sounds/punto.wav");
export const pressBoton = new Audio("src/assets/sounds/boton.wav");
export const iniciarJuego = new Audio("src/assets/sounds/iniciar-juego.wav");
export const terminarJuego = new Audio("src/assets/sounds/game-over.wav");

var estaSilenciado = false;

export function init(){
    document.querySelector('.boton-silenciar').addEventListener('click', silenciar);
    let volumen = .5;
    setVolumen(reboteBarra, volumen);
    setVolumen(reboteBorde, volumen);
    setVolumen(punto, volumen);
    setVolumen(terminarJuego, volumen);
    setVolumen(pressBoton, volumen);
    setVolumen(iniciarJuego, volumen);
}

export function reproducir(audio){
    //Agrega la etiqueta al body
    const audioElement = document.createElement("audio");
    audioElement.src = audio.src;
    audioElement.volume = audio.volume;

    //Agrega la etiqueta al body
    document.body.appendChild(audioElement);

    // Reproduce el archivo de audio
    if(!estaSilenciado){
        audioElement.play();
    }

    audioElement.onended = function() {
        // Elimina la etiqueta de audio del DOM
        audioElement.remove();
    }
}

export function silenciar(){
    if(estaSilenciado){
        estaSilenciado = false;
        reproducir(pressBoton);
    } else {
        estaSilenciado = true;
    }
    document.querySelector('.mute').classList.toggle('checked');
}

function setVolumen(audio, valor){
    audio.volume = valor;
}