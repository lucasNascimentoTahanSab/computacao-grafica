import Canvas from "./canvas.js";
import PixelController from "./pixelController.js";

export default class CanvasController {
  _canvas
  _pixelController

  constructor() {
    this._canvas = new Canvas
    this._pixelController = new PixelController
  }

  carregarCanvas() {
    const comprimentoPixel = this._canvas.comprimento * this._canvas.zoom
    const alturaPixel = this._canvas.altura * this._canvas.zoom
    const quantidadePixelsHorizontal = this._canvas.comprimento / comprimentoPixel
    const quantidadePixelsVertical = this._canvas.altura / alturaPixel
    this._canvas.pixels = this._pixelController.gerarMalhaDePixelsAPartirDoTemplate({
      quantidadePixelsHorizontal,
      quantidadePixelsVertical,
      comprimentoPixel,
      alturaPixel
    })
  }

  carregarMalhaDePixels() {
    const canvas = document.getElementById('canvas')
    for (let x = 0; x < this._canvas.pixels.length; x++) {
      const linha = this._gerarLinha(x, this._canvas.pixels[x].length)
      const linhaPreenchida = this._pixelController.inserirPixelsEm(linha)
      canvas.appendChild(linhaPreenchida)
    }
  }

  _gerarLinha(posicao, comprimento) {
    const linha = document.createElement('div')
    linha.className = 'row'
    linha.dataset.posicao = posicao
    linha.dataset.comprimento = comprimento

    return linha
  }
}