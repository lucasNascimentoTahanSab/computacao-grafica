import Canvas from './canvas.js';
import Pixel from './pixel.js'

const _calcularDimensoesPixel = (canvas, zoom) => [canvas.altura * zoom, canvas.comprimento * zoom]
const _calcularQuantidadePixels = (canvas, alturaPixel, larguraPixel) => [canvas.comprimento / alturaPixel, canvas.altura / larguraPixel]

export default class CanvasController {
  canvas

  constructor() {
    this.canvas = new Canvas
  }

  get matrizPixels() {
    return this.canvas.pixels
  }

  /**
   * @param {{ target: { dataset: { x: string | number; y: string | number; }; }; }} pixel
   */
  set selecionarPixel(pixel) {
    const x = pixel.target.dataset.x
    const y = pixel.target.dataset.y
    this.canvas.pixels[x][y].selecionado = !this.canvas.pixels[x][y].selecionado
  }

  carregarCanvas() {
    const [alturaPixel, comprimentoPixel] = _calcularDimensoesPixel(this.canvas, this.canvas.zoom)
    const [quantidadePixelsVertical, quantidadePixelsHorizontal] = _calcularQuantidadePixels(this.canvas, alturaPixel, comprimentoPixel)
    this.canvas.pixels = this._gerarMalhaDePixelsAPartirDasInformacoes(
      [quantidadePixelsVertical, quantidadePixelsHorizontal],
      [alturaPixel, comprimentoPixel]
    )
  }

  _gerarMalhaDePixelsAPartirDasInformacoes(quantidade, dimensoes) {
    const pixels = []
    const [altura, comprimento] = dimensoes
    const [quantidadeVertical, quantidadeHorizontal] = quantidade
    for (let x = 0; x < quantidadeHorizontal; x++) {
      pixels[x] = []
      for (let y = 0; y < quantidadeVertical; y++)
        pixels[x][y] = new Pixel({ comprimento, altura, x, y })
    }

    return pixels
  }
}