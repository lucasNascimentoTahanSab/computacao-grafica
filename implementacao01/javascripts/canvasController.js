import Canvas from './canvas.js';
import Pixel from './pixel.js'
import { desenharReta } from './retasDDA.js'

export default class CanvasController {
  _canvas
  _pixelInicial
  _pixelFinal

  constructor() {
    this._canvas = new Canvas
  }

  carregarCanvas() {
    const comprimentoPixel = this._canvas.comprimento * this._canvas.zoom
    const alturaPixel = this._canvas.altura * this._canvas.zoom
    const quantidadePixelsHorizontal = this._canvas.comprimento / comprimentoPixel
    const quantidadePixelsVertical = this._canvas.altura / alturaPixel
    this._canvas.pixels = this._gerarMalhaDePixelsAPartirDoTemplate({
      quantidadePixelsHorizontal,
      quantidadePixelsVertical,
      comprimentoPixel,
      alturaPixel
    })
  }

  carregarMalhaDePixels() {
    const canvas = document.getElementById('canvas')
    for (let x = 0; x < this._canvas.pixels.length; x++) {
      const linha = this._gerarColuna(x, this._canvas.pixels[x].length)
      const linhaPreenchida = this.inserirPixelsEm(linha)
      canvas.appendChild(linhaPreenchida)
    }
  }

  inserirPixelsEm(linha) {
    for (let y = 0; y < parseInt(linha.dataset.comprimento); y++) {
      const pixel = this._gerarPixelNasCoordenadas(parseInt(linha.dataset.posicao), y)
      pixel.addEventListener('click', this._selecionarPixel.bind(this))
      linha.appendChild(pixel)
    }

    return linha
  }

  _gerarMalhaDePixelsAPartirDoTemplate(template) {
    let pixels = []
    for (let x = 0; x < template.quantidadePixelsHorizontal; x++) {
      pixels[x] = []
      for (let y = 0; y < template.quantidadePixelsVertical; y++) {
        pixels[x][y] = new Pixel({
          comprimento: template.comprimentoPixel,
          altura: template.alturaPixel,
          x,
          y
        })
      }
    }

    return pixels
  }

  _gerarColuna(posicao, comprimento) {
    const linha = document.createElement('div')
    linha.className = 'column'
    linha.dataset.posicao = posicao
    linha.dataset.comprimento = comprimento

    return linha
  }

  _gerarPixelNasCoordenadas(x, y) {
    const pixel = document.createElement('div')
    pixel.className = 'pixel'
    pixel.dataset.x = x
    pixel.dataset.y = y

    return pixel
  }

  _selecionarPixel(event) {
    const pixel = document.querySelector(`[data-x='${event.target.dataset.x}'][data-y='${event.target.dataset.y}'`)
    if (pixel.classList.contains('selected')) pixel.classList.remove('selected')
    else pixel.classList.add('selected')

    this._selecionarPixelFinalOuInicial(event.target.dataset.x, event.target.dataset.y)
    this._desenharRetaSePixelFinalSelecionado()
  }

  _selecionarPixelFinalOuInicial = (x, y) => {
    if (this._pixelInicial) this._pixelFinal = this._canvas.pixels[x][y]
    else this._pixelInicial = this._canvas.pixels[x][y]
  }

  _desenharRetaSePixelFinalSelecionado = () => {
    if (!this._pixelFinal) return
    desenharReta(this._pixelInicial, this._pixelFinal)
    this._pixelInicial = null
    this._pixelFinal = null
  }
}