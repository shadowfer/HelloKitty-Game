import {
  getCustomProperty,
  incrementCustomProperty,
  setCustomProperty,
} from "./updateCustomProperty.js";

const SPEED = 0.05;
const groundElems = document.querySelectorAll("[data-ground]");
const backgroundElem = document.querySelector("[data-background]"); // Referencia del fondo

export function setupGround() {
  // Configuramos el valor inicial del suelo
  setCustomProperty(groundElems[0], "--left", 0);
  setCustomProperty(groundElems[1], "--left", 300);
  
  // Configuramos el valor inicial del fondo
  setCustomProperty(backgroundElem, "--left", 0); 
}

export function updateGround(delta, speedScale) {
  // Movimiento del suelo
  groundElems.forEach(ground => {
    incrementCustomProperty(ground, "--left", delta * speedScale * SPEED * -1);

    if (getCustomProperty(ground, "--left") <= -300) {
      incrementCustomProperty(ground, "--left", 600); // Reseteamos cuando se sale de pantalla
    }
  });

  // Movimiento del fondo con una velocidad más lenta
  incrementCustomProperty(backgroundElem, "--left", delta * speedScale * SPEED * -0.5); 

  // Reseteamos el fondo cuando sale de la pantalla
  if (getCustomProperty(backgroundElem, "--left") <= -300) {
    incrementCustomProperty(backgroundElem, "--left", 600); 
  }
}
