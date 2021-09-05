import Canvas from './canvas.js'
import Pixel from './pixel.js'
import algoritmos from './algoritmos.js'

const _calcularDimensoesPixel = (canvas, zoom) => [canvas.altura * zoom, canvas.comprimento * zoom]
const _calcularQuantidadePixels = (canvas, alturaPixel, larguraPixel) => [canvas.comprimento / alturaPixel, canvas.altura / larguraPixel]
const _obterGrausEmRadianos = graus => graus * Math.PI / 180

export default class CanvasController {
  _canvas
  _operacoes

  constructor() {
    this._canvas = new Canvas
    this._operacoes = {
      'translacao': this._transladarElementos.bind(this),
      'rotacao': this._rotacionarElementos.bind(this),
      'escala': this._escalarElementos.bind(this),
      'reflexao': this._refletirElementos.bind(this),
      'dda': this._desenharRetaComAlgoritmoDDA.bind(this),
      'bresenham': this._desenharRetaComAlgoritmoBresenham.bind(this),
      'desenhar-circunferencia': this._desenharCircunferencia.bind(this)
    }
  }

  get matrizPixels() {
    return this._canvas.pixels
  }

  carregarCanvas() {
    const [alturaPixel, comprimentoPixel] = _calcularDimensoesPixel(this._canvas, this._canvas.zoom)
    const [quantidadePixelsVertical, quantidadePixelsHorizontal] = _calcularQuantidadePixels(this._canvas, alturaPixel, comprimentoPixel)
    this._canvas.pixels = this._gerarMalhaDePixelsAPartirDasInformacoes(
      [quantidadePixelsVertical, quantidadePixelsHorizontal],
      [alturaPixel, comprimentoPixel]
    )
  }

  executarOperacaoPorMeioDasInformacoes(operacao, informacoes) {
    if (!(operacao in this._operacoes)) return

    return this._operacoes[operacao](informacoes)
  }

  apagarPixel(x, y) {
    if ((x > 0 && x < this._canvas.pixels.length) && (y > 0 && y < this._canvas.pixels[0].length)) return

    this._canvas.pixels[x][y].selecionado = false
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

  _transladarElementos(informacoes) {
    if (!('fatorTransformacaoEmX' in informacoes) || !('fatorTransformacaoEmY' in informacoes))
      return false

    const fatorTransformacaoEmX = parseFloat(informacoes.fatorTransformacaoEmX)
    const fatorTransformacaoEmY = parseFloat(informacoes.fatorTransformacaoEmY)
    const matrizTransformacao = this._obterMatrizTransformacaoTranslacao(fatorTransformacaoEmX, fatorTransformacaoEmY)
    this._canvas.pixels = algoritmos.transladarElementos(matrizTransformacao, this._canvas)
  }

  _rotacionarElementos(informacoes) {
    if (!('angulacaoDaRotacao' in informacoes))
      return false

    const angulacaoDaRotacao = informacoes.angulacaoDaRotacao
    const matrizTransformacao = this._obterMatrizTransformacaoRotacao(angulacaoDaRotacao)
    this._canvas.pixels = algoritmos.rotacionarElementos(matrizTransformacao, this._canvas)
  }

  _escalarElementos(informacoes) {
    if (!('fatorTransformacaoEmX' in informacoes) || !('fatorTransformacaoEmY' in informacoes))
      return false

    const fatorTransformacaoEmX = parseFloat(informacoes.fatorTransformacaoEmX)
    const fatorTransformacaoEmY = parseFloat(informacoes.fatorTransformacaoEmY)
    const matrizTransformacao = this._obterMatrizTransformacaoEscala(fatorTransformacaoEmX, fatorTransformacaoEmY)
    this._canvas.pixels = algoritmos.escalarElementos(matrizTransformacao, this._canvas)
  }

  _refletirElementos(informacoes) {
    if (!('refletirEmX' in informacoes) || !('refletirEmY' in informacoes))
      return false

    const matrizTransformacao = this._obterMatrizTransformacaoReflexao(informacoes.refletirEmX, informacoes.refletirEmY)
    this._canvas.pixels = algoritmos.refletirElementos(matrizTransformacao, this._canvas)
  }

  _desenharRetaComAlgoritmoDDA(informacoes) {
    if (
      !('coordenadaXFinal' in informacoes) || !('coordenadaYFinal' in informacoes) ||
      !('coordenadaXInicial' in informacoes) || !('coordenadaYInicial' in informacoes)
    )
      return false

    const pixelFinal = new Pixel({ x: parseFloat(informacoes.coordenadaXFinal), y: parseFloat(informacoes.coordenadaYFinal) })
    const pixelInicial = new Pixel({ x: parseFloat(informacoes.coordenadaXInicial), y: parseFloat(informacoes.coordenadaYInicial) })
    this._canvas = algoritmos.desenharRetaComAlgoritmoDDA(pixelFinal, pixelInicial, this._canvas);
  }

  _desenharRetaComAlgoritmoBresenham(informacoes) {
    if (
      !('coordenadaXFinal' in informacoes) || !('coordenadaYFinal' in informacoes) ||
      !('coordenadaXInicial' in informacoes) || !('coordenadaYInicial' in informacoes)
    )
      return false

    const pixelFinal = new Pixel({ x: parseFloat(informacoes.coordenadaXFinal), y: parseFloat(informacoes.coordenadaYFinal) })
    const pixelInicial = new Pixel({ x: parseFloat(informacoes.coordenadaXInicial), y: parseFloat(informacoes.coordenadaYInicial) })
    this._canvas = algoritmos.desenharRetaComAlgoritmoBresenham(pixelFinal, pixelInicial, this._canvas)
  }

  _desenharCircunferencia(informacoes) {
    if (
      !('coordenadaXCentral' in informacoes) || !('coordenadaYCentral' in informacoes) ||
      !('raio' in informacoes)
    )
      return false

    const pixelCentral = new Pixel({ x: parseFloat(informacoes.coordenadaXCentral), y: parseFloat(informacoes.coordenadaYCentral) })
    const raio = informacoes.raio
    this._canvas = algoritmos.desenharCircunferencia(pixelCentral, parseFloat(raio), this._canvas)
  }

  _obterMatrizTransformacaoTranslacao(fatorTransformacaoEmX, fatorTransformacaoEmY) {
    return [
      [1, 0, fatorTransformacaoEmX],
      [0, 1, fatorTransformacaoEmY],
      [0, 0, 1],
    ]
  }

  _obterMatrizTransformacaoRotacao(angulacaoDaRotacao) {
    return [
      [Math.cos(_obterGrausEmRadianos(angulacaoDaRotacao)), -Math.sin(_obterGrausEmRadianos(angulacaoDaRotacao)), 0],
      [Math.sin(_obterGrausEmRadianos(angulacaoDaRotacao)), Math.cos(_obterGrausEmRadianos(angulacaoDaRotacao)), 0],
      [0, 0, 1]
    ]
  }

  _obterMatrizTransformacaoEscala(fatorTransformacaoEmX, fatorTransformacaoEmY) {
    return [
      [fatorTransformacaoEmX, 0, 0],
      [0, fatorTransformacaoEmY, 0],
      [0, 0, 1]
    ]
  }

  _obterMatrizTransformacaoReflexao(eixoX, eixoY) {
    return [
      [eixoY ? -1 : 1, 0, 0],
      [0, eixoX ? -1 : 1, 0],
      [0, 0, 1]
    ]
  }
}