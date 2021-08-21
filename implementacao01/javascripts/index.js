import CanvasController from './canvasController.js';

const canvasController = new CanvasController

window.addEventListener('load', () => {
  carregarCanvas()
})

function carregarCanvas() {
  canvasController.carregarCanvas()
  canvasController.carregarMalhaDePixels()
}