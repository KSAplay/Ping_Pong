import { numeroAleatorio } from '../main.js';
import { canvasAlto,canvasAncho,grosorBorde } from '../sistema/render.js';
import { barra2,pelota } from '../juego/objetos.js';

var dificultad;

export function mover(){
    if(pelota.getDireccionX() === "derecha" && pelota.getX() < canvasAncho/2){
        dificultad = numeroAleatorio(0,3) * 10;
    }
    if(pelota.getDireccionX() === "derecha" && pelota.getX() > canvasAncho/2){
        if(pelota.getY() > barra2.getY() + barra2.getLargo()/2 + pelota.getRadio()/2 + dificultad){
            if(barra2.getY() + barra2.getLargo()/2 + barra2.getVelocidad() >= canvasAlto - grosorBorde/2){
                barra2.setY(canvasAlto - barra2.getLargo()/2 - grosorBorde/2);
            } else {
                barra2.setY(barra2.getY() + barra2.getVelocidad());
            }
        } else if(pelota.getY() <= barra2.getY() - barra2.getLargo()/2 - pelota.getRadio()/2 - dificultad){
            if(barra2.getY() - barra2.getLargo()/2 - barra2.getVelocidad() <= grosorBorde/2){
                barra2.setY(barra2.getLargo()/2 + grosorBorde/2);
            } else {
                barra2.setY(barra2.getY() - barra2.getVelocidad());
            }
        }
    }
}