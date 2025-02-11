// dino.js

import {
  incrementCustomProperty,
  setCustomProperty,
  getCustomProperty,
} from "./updateCustomProperty.js"

const dinoElem = document.querySelector("[data-dino]")
const JUMP_SPEED = 0.45
const GRAVITY = 0.0015
const DINO_FRAME_COUNT = 2
const FRAME_TIME = 100

let isJumping
let dinoFrame
let currentFrameTime
let yVelocity

export function setupDino() {
  isJumping = false
  dinoFrame = 0
  currentFrameTime = 0
  yVelocity = 0
  setCustomProperty(dinoElem, "--bottom", 0)
  
  // Remove existing event listeners
  document.removeEventListener("keydown", onJump);
  document.removeEventListener("touchstart", onJump); // Remove previous touch event

  // Add new event listeners
  document.addEventListener("keydown", onJump);
  document.addEventListener("touchstart", onJump);
}

export function updateDino(delta, speedScale) {
  handleRun(delta, speedScale)
  handleJump(delta)
}

export function getDinoRect() {
  return dinoElem.getBoundingClientRect()
}

export function setDinoLose() {
  dinoElem.src = 'imgs/new-img/kitty-lose.png'
}

function handleRun(delta, speedScale) {
  if (isJumping) {
    dinoElem.src = `imgs/new-img/hellokitty-run-jump.png`
    return
  }

  dinoElem.src = 'imgs/new-img/hellokitty-run.gif'
  if (currentFrameTime >= FRAME_TIME) {
    dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT
    dinoElem.src = `imgs/new-img/hellokitty-run${dinoFrame}.gif`
    currentFrameTime -= FRAME_TIME
  }
  currentFrameTime += delta * speedScale
}

function handleJump(delta) {
  if (!isJumping) return

  incrementCustomProperty(dinoElem, "--bottom", yVelocity * delta)

  if (getCustomProperty(dinoElem, "--bottom") <= 0) {
    setCustomProperty(dinoElem, "--bottom", 0)
    isJumping = false
  }

  yVelocity -= GRAVITY * delta
}

function onJump(e) {
  // Previene el comportamiento predeterminado del evento touch
  e.preventDefault();

  // Verifica si el evento es touch o una tecla y si no está saltando
  if ((e.code !== "Space" && e.type !== "touchstart") || isJumping) return

  yVelocity = JUMP_SPEED
  isJumping = true
}
