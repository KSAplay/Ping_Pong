import { numeroAleatorio } from '../main.js';
import { canvasAncho } from '../sistema/render.js';
import { barra1,barra2,pelota } from '../juego/objetos.js';

var dificultadBarra1 = 0, dificultadBarra2 = 0;
export var sinDificultad = false;

export function moverBarra2(){

    if(pelota.getX() < canvasAncho * 0.51 && !sinDificultad){
        dificultadBarra2 = numeroAleatorio(0,4) * barra2.getLargo()/4;
    }

    if(pelota.getDireccionX() === "derecha" && pelota.getX() > canvasAncho/2){

        if(pelota.getDireccionY() === "arriba"){
            if(predecirPelotaEnY() > barra2.getY() + barra2.getLargo()/2 + dificultadBarra2){
                barra2.mover('abajo');
            } else if(predecirPelotaEnY() < barra2.getY() - barra2.getLargo()/2 - dificultadBarra2){
                barra2.mover('arriba');
            }
        } else {
            if(predecirPelotaEnY() > barra2.getY() + barra2.getLargo()/2 + dificultadBarra2){
                barra2.mover('abajo');
            } else if(predecirPelotaEnY() < barra2.getY() - barra2.getLargo()/2 - dificultadBarra2){
                barra2.mover('arriba');
            }
        }
    }

    // Por diversión
    //moverBarra1();
}

function predecirPelotaEnY(){
    let vecesX = pelota.getDireccionX() === "derecha" ? (canvasAncho - pelota.getX())/pelota.getVelocidadX() : pelota.getX()/pelota.getVelocidadX();
    let distanciaY = pelota.getVelocidadY() * vecesX;
    let posY = pelota.getDireccionY() === "arriba" ? pelota.getY() - distanciaY : pelota.getY() + distanciaY;
    return posY;
}

function moverBarra1(){
    if(pelota.getX() > canvasAncho * 0.51 && !sinDificultad){
        dificultadBarra1 = numeroAleatorio(0,4) * barra1.getLargo()/4;
    }

    if(pelota.getDireccionX() === "izquierda" && pelota.getX() < canvasAncho/2){
        
        if(pelota.getDireccionY() === "arriba"){
            if(predecirPelotaEnY() > barra1.getY() + barra1.getLargo()/2 + dificultadBarra1){
                barra1.mover('abajo');
            } else if(predecirPelotaEnY() < barra1.getY() - barra1.getLargo()/2 - dificultadBarra1){
                barra1.mover('arriba');
            }
        } else {
            if(predecirPelotaEnY() > barra1.getY() + barra1.getLargo()/2 + dificultadBarra1){
                barra1.mover('abajo');
            } else if(predecirPelotaEnY() < barra1.getY() - barra1.getLargo()/2 - dificultadBarra1){
                barra1.mover('arriba');
            }
        }
    }
}