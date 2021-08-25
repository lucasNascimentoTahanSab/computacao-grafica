import Canvas from './canvas.js';
import Pixel from './pixel.js'

const _calcularDimensoesPixel = (canvas, zoom) => [canvas.altura * zoom, canvas.comprimento * zoom]
const _calcularQuantidadePixels = (canvas, alturaPixel, larguraPixel) => [canvas.comprimento / alturaPixel, canvas.altura / larguraPixel]

export default class CanvasController {
  _canvas
  _pixelInicial
  _pixelFinal

  constructor() {
    this._canvas = new Canvas
  }

  get quantidadePixelsHorizontal() {
    return this._canvas.pixels.length
  }

  get quantidadePixelsVertical() {
    return this._canvas.pixels[0].length
  }

  carregarCanvas() {
    const [alturaPixel, comprimentoPixel] = _calcularDimensoesPixel(this._canvas, this._canvas.zoom)
    const [quantidadePixelsVertical, quantidadePixelsHorizontal] = _calcularQuantidadePixels(this._canvas, alturaPixel, comprimentoPixel)
    this._canvas.pixels = this._gerarMalhaDePixelsAPartirDasInformacoes(
      [quantidadePixelsVertical, quantidadePixelsHorizontal],
      [alturaPixel, comprimentoPixel]
    )
  }

  obterPixelNasCoordenadas(x, y) {
    return this._canvas.pixels[x][y]
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