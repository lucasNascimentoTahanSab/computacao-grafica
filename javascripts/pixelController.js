import Pixel from './pixel.js'
import algoritmos from './algoritmos.js'

const _obterGrausEmRadianos = graus => graus * Math.PI / 180

export default class PixelController {
  _canvas
  _operacoes

  constructor() {
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

  atualizarCanvas(canvasController) {
    if (typeof canvasController !== 'object') return

    this._canvas = canvasController.canvas
  }

  executarOperacaoPorMeioDasInformacoes(operacao, informacoes) {
    if (!(operacao in this._operacoes)) return

    return this._operacoes[operacao](informacoes)
  }

  _transladarElementos(informacoes) {
    if (!('fatorTransformacaoEmX' in informacoes) || !('fatorTransformacaoEmY' in informacoes))
      return false

    const fatorTransformacaoEmX = parseFloat(informacoes.fatorTransformacaoEmX)
    const fatorTransformacaoEmY = parseFloat(informacoes.fatorTransformacaoEmY)
    const matrizTransformacao = this._obterMatrizTransformacaoTranslacao(fatorTransformacaoEmX, fatorTransformacaoEmY)
    return algoritmos.transladarElementos(matrizTransformacao, this._canvas)
  }

  _rotacionarElementos(informacoes) {
    if (!('angulacaoDaRotacao' in informacoes))
      return false

    const angulacaoDaRotacao = informacoes.angulacaoDaRotacao
    const matrizTransformacao = this._obterMatrizTransformacaoRotacao(angulacaoDaRotacao)
    return algoritmos.rotacionarElementos(matrizTransformacao, this._canvas)
  }

  _escalarElementos(informacoes) {
    if (!('fatorTransformacaoEmX' in informacoes) || !('fatorTransformacaoEmY' in informacoes))
      return false

    const fatorTransformacaoEmX = parseFloat(informacoes.fatorTransformacaoEmX)
    const fatorTransformacaoEmY = parseFloat(informacoes.fatorTransformacaoEmY)
    const matrizTransformacao = this._obterMatrizTransformacaoEscala(fatorTransformacaoEmX, fatorTransformacaoEmY)
    return algoritmos.escalarElementos(matrizTransformacao, this._canvas)
  }

  _refletirElementos(informacoes) {
    if (!('refletirEmX' in informacoes) || !('refletirEmY' in informacoes))
      return false

    const matrizTransformacao = this._obterMatrizTransformacaoReflexao(informacoes.refletirEmX, informacoes.refletirEmY)
    return algoritmos.refletirElementos(matrizTransformacao, this._canvas)
  }

  _desenharRetaComAlgoritmoDDA(informacoes) {
    if (
      !('coordenadaXFinal' in informacoes) || !('coordenadaYFinal' in informacoes) ||
      !('coordenadaXInicial' in informacoes) || !('coordenadaYInicial' in informacoes)
    )
      return false

    const pixelFinal = new Pixel({ x: parseFloat(informacoes.coordenadaXFinal), y: parseFloat(informacoes.coordenadaYFinal) })
    const pixelInicial = new Pixel({ x: parseFloat(informacoes.coordenadaXInicial), y: parseFloat(informacoes.coordenadaYInicial) })
    return algoritmos.desenharRetaComAlgoritmoDDA(pixelFinal, pixelInicial, this._canvas);
  }

  _desenharRetaComAlgoritmoBresenham(informacoes) {
    if (
      !('coordenadaXFinal' in informacoes) || !('coordenadaYFinal' in informacoes) ||
      !('coordenadaXInicial' in informacoes) || !('coordenadaYInicial' in informacoes)
    )
      return false

    const pixelFinal = new Pixel({ x: parseFloat(informacoes.coordenadaXFinal), y: parseFloat(informacoes.coordenadaYFinal) })
    const pixelInicial = new Pixel({ x: parseFloat(informacoes.coordenadaXInicial), y: parseFloat(informacoes.coordenadaYInicial) })
    return algoritmos.desenharRetaComAlgoritmoBresenham(pixelFinal, pixelInicial, this._canvas)
  }

  _desenharCircunferencia(informacoes) {
    if (
      !('coordenadaXCentral' in informacoes) || !('coordenadaYCentral' in informacoes) ||
      !('raio' in informacoes)
    )
      return false

    const pixelCentral = new Pixel({ x: parseFloat(informacoes.coordenadaXCentral), y: parseFloat(informacoes.coordenadaYCentral) })
    const raio = informacoes.raio
    return algoritmos.desenharCircunferencia(pixelCentral, parseFloat(raio), this._canvas)
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