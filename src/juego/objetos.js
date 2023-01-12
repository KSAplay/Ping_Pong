import {canvasAlto, grosorBorde} from '../sistema/render.js';

class Barra{
    constructor(x, y, largo, ancho, color, velocidad) {
        this.x = x;
        this.y = y;
        this.largo = largo;
        this.ancho = ancho;
        this.color = color;
        this.velocidad = velocidad;
    }

    setX(x) {
        this.x = x;
    }
    setY(y) {
        this.y = y;
    }
    setLargo(largo) {
        this.largo = largo;
    }
    setAncho(ancho) {
        this.ancho = ancho;
    }
    setColor(color) {
        this.color = color;
    }
    setVelocidad(velocidad) {
        this.velocidad = velocidad;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    getLargo() {
        return this.largo;
    }
    getAncho() {
        return this.ancho;
    }
    getColor() {
        return this.color;
    }
    getVelocidad() {
        return this.velocidad;
    }

    mover(direccion){
        switch (direccion) {
            case 'arriba':
                if(this.y - this.largo/2 - this.velocidad <= grosorBorde/2){
                    this.y = this.largo/2 + grosorBorde/2;
                } else {
                    this.y -= this.velocidad;
                }
                break;
            case 'abajo':
                if(this.y +this.largo/2 + this.velocidad >= canvasAlto - grosorBorde/2){
                    this.y = canvasAlto - this.largo/2 - grosorBorde/2;
                } else {
                    this.y += this.velocidad;
                }
                break;
        }
    }
}

class Pelota {
    constructor(x, y, color, radio, velocidadX, velocidadY, direccionX, direccionY) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radio = radio;
        this.velocidadX = velocidadX;
        this.velocidadY = velocidadY;
        this.direccionX = direccionX;
        this.direccionY = direccionY;
    }
    setX(x) {
        this.x = x;
    }
    setY(y) {
        this.y = y;
    }
    setColor(color) {
        this.color = color;
    }
    setRadio(radio) {
        this.radio = radio;
    }
    setVelocidadX(velocidadX) {
        this.velocidadX = velocidadX;
    }
    setVelocidadY(velocidadY) {
        this.velocidadY = velocidadY;
    }
    setDireccionX(direccionX) {
        this.direccionX = direccionX;
    }
    setDireccionY(direccionY) {
        this.direccionY = direccionY;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    getColor() {
        return this.color;
    }
    getRadio() {
        return this.radio;
    }
    getVelocidadX() {
        return this.velocidadX;
    }
    getVelocidadY() {
        return this.velocidadY;
    }
    getDireccionX() {
        return this.direccionX;
    }
    getDireccionY() {
        return this.direccionY;
    }
}

export const barra1 = new Barra();

export const barra2 = new Barra();

export const pelota = new Pelota();