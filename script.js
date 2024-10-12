import { updateGround, setupGround } from "./ground.js"; 
import { updateDino, setupDino, getDinoRect, setDinoLose } from "./kitty.js";
import { updateCactus, setupCactus, getCactusRects } from "./kanye.js";

const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 30;
const SPEED_SCALE_INCREASE = 0.00001;

const worldElem = document.querySelector("[data-world]");
const scoreElem = document.querySelector("[data-score]");
const startScreenElem = document.querySelector("[data-start-screen]");

// Lista de pistas de música
const musicTracks = [
  "music/Taylor Swift - ...Ready For It Español.mp3",
  "music/Taylor Swift - 22 (Taylor's Version) (Español).mp3",
  "music/Taylor Swift - Blank Space (Taylor's Version) (Español Lyrics).mp3",
  "music/Taylor Swift - Shake It Off (Taylor's Version) (Español Lyrics).mp3",
  "music/Taylor Swift - Style (Taylor's Version) (Español Lyrics).mp3",
  "music/Taylor Swift - We Are Never Ever Getting Back Together (Taylor's Version) (Español).mp3",
  "music/Taylor Swift - Wildest Dreams (Taylor's Version) (Español).mp3",
  "music/Taylor Swift - You Belong With Me (Taylor’s Version) (Español).mp3"
];

// Crear un elemento de audio
let audioElement = new Audio();

// Función para seleccionar una pista de música aleatoria
function getRandomTrack() {
  const randomIndex = Math.floor(Math.random() * musicTracks.length);
  return musicTracks[randomIndex];
}

// Función para reproducir la música
function playMusic() {
  const randomTrack = getRandomTrack(); // Selecciona aleatoriamente una pista
  audioElement.src = randomTrack; // Asigna la pista al elemento de audio
  audioElement.play(); // Reproduce la pista

  // Cuando la pista termine, selecciona y reproduce la siguiente
  audioElement.addEventListener("ended", () => {
    playMusic(); // Llama de nuevo a la función para reproducir la siguiente pista
  });
}

// Función para verificar la orientación del dispositivo
function checkOrientation() {
  if (window.innerHeight > window.innerWidth) {
    // El dispositivo está en modo vertical
    startScreenElem.textContent = "Gira el teléfono a modo horizontal para jugar";
    startScreenElem.classList.remove("hide");
  } else {
    // El dispositivo está en modo horizontal
    startScreenElem.classList.add("hide");
    document.removeEventListener("keydown", handleStart);
    document.addEventListener("keydown", handleStart, { once: true });
    document.addEventListener("touchstart", handleStart, { once: true });
  }
}

// Llama a la función de verificación de orientación al cargar la página
checkOrientation();
window.addEventListener("resize", checkOrientation);

let lastTime;
let speedScale;
let score;

function update(time) {
  if (lastTime == null) {
    lastTime = time;
    window.requestAnimationFrame(update);
    return;
  }
  const delta = time - lastTime;

  updateGround(delta, speedScale);
  updateDino(delta, speedScale);
  updateCactus(delta, speedScale);
  updateSpeedScale(delta);
  updateScore(delta);
  if (checkLose()) return handleLose();

  lastTime = time;
  window.requestAnimationFrame(update);
}

function checkLose() {
  const dinoRect = getDinoRect();
  return getCactusRects().some(rect => isCollision(rect, dinoRect));
}

function isCollision(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.top < rect2.bottom &&
    rect1.right > rect2.left &&
    rect1.bottom > rect2.top
  );
}

function updateSpeedScale(delta) {
  speedScale += delta * SPEED_SCALE_INCREASE;
}

function updateScore(delta) {
  score += delta * 0.01;
  scoreElem.textContent = Math.floor(score);
}

function handleStart() {
  lastTime = null;
  speedScale = 1;
  score = 0;
  setupGround();
  setupDino();
  setupCactus();
  startScreenElem.classList.add("hide");

  // Iniciar la música cuando el juego comience
  playMusic();

  window.requestAnimationFrame(update);
}

function handleLose() {
  setDinoLose();
  setTimeout(() => {
    document.addEventListener("keydown", handleStart, { once: true });
    document.addEventListener("touchstart", handleStart, { once: true }); // Permite reiniciar el juego con touch
    startScreenElem.classList.remove("hide");
    audioElement.pause(); // Pausar la música cuando el jugador pierda
  }, 100);
}

function setPixelToWorldScale() {
  let worldToPixelScale;
  if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
    worldToPixelScale = window.innerWidth / WORLD_WIDTH;
  } else {
    worldToPixelScale = window.innerHeight / WORLD_HEIGHT;
  }

  worldElem.style.width = `${WORLD_WIDTH * worldToPixelScale}px`;
  worldElem.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`;
}