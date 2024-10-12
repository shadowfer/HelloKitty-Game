import {
  incrementCustomProperty,
  setCustomProperty,
  getCustomProperty,
} from "./updateCustomProperty.js";

const dinoElem = document.querySelector("[data-dino]");
const JUMP_SPEED = 0.45;
const GRAVITY = 0.0015;
const DINO_FRAME_COUNT = 2; // Número de cuadros en el GIF (si tu GIF tiene más cuadros, ajústalo aquí)
const FRAME_TIME = 100; // Tiempo entre cada cuadro

let isJumping;
let dinoFrame;
let currentFrameTime;
let yVelocity;

export function setupDino() {
  isJumping = false;
  dinoFrame = 0;
  currentFrameTime = 0;
  yVelocity = 0;
  setCustomProperty(dinoElem, "--bottom", 0);
  document.removeEventListener("keydown", onJump);
  document.addEventListener("keydown", onJump);
}

export function updateDino(delta, speedScale) {
  handleRun(delta, speedScale);
  handleJump(delta);
}

export function getDinoRect() {
  return dinoElem.getBoundingClientRect();
}

export function setDinoLose() {
  dinoElem.src = 'imgs/new-img/kitty-lose.png'; // Cambia la imagen cuando el dino pierde
}

function handleRun(delta, speedScale) {
  if (isJumping) {
    // Cuando el dino está saltando, usa el GIF de salto (puedes tener un GIF específico para esto)
    dinoElem.src = 'imgs/new-img/hellokitty-run-jump.png';
    return;
  }

  // Si el dino no está saltando, usa el GIF de correr
  dinoElem.src = 'imgs/new-img/hellokitty-run.gif';

  // Aquí es donde puedes manejar los cuadros del GIF si tienes diferentes animaciones
  if (currentFrameTime >= FRAME_TIME) {
    dinoFrame = (dinoFrame + 2) % DINO_FRAME_COUNT; // Cambia el cuadro del dino si corresponde
    // Cambia el `src` según el cuadro actual (Asegúrate de que los nombres de los archivos sean correctos)
    // Si solo tienes un GIF, no necesitas esta lógica
    // dinoElem.src = `imgs/new-img/hellokitty-run${dinoFrame}.gif`;
    currentFrameTime -= FRAME_TIME;
  }
  currentFrameTime += delta * speedScale;
}

function handleJump(delta) {
  if (!isJumping) return;

  incrementCustomProperty(dinoElem, "--bottom", yVelocity * delta);

  if (getCustomProperty(dinoElem, "--bottom") <= 0) {
    setCustomProperty(dinoElem, "--bottom", 0);
    isJumping = false;
  }

  yVelocity -= GRAVITY * delta;
}

function onJump(e) {
  if (e.code !== "Space" || isJumping) return;

  yVelocity = JUMP_SPEED;
  isJumping = true;
}
