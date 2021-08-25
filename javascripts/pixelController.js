import Pixel from './pixel.js'
import algoritmos from './algoritmos.js'

export default class PixelController {
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

  executarOperacaoPorMeioDasInformacoes(operacao, informacoes) {
    if (!(operacao in this._operacoes)) return

    this._operacoes[operacao](informacoes)
  }

  _transladarElementos(informacoes) {
    if (!('fatorTransformacaoEmX' in informacoes) || !('fatorTransformacaoEmY' in informacoes))
      return false

    const fatorTransformacaoEmX = parseFloat(informacoes.fatorTransformacaoEmX)
    const fatorTransformacaoEmY = parseFloat(informacoes.fatorTransformacaoEmY)
    algoritmos.transladarElementos(fatorTransformacaoEmX, fatorTransformacaoEmY)
    return true
  }

  _rotacionarElementos(informacoes) {
    if (!('angulacaoDaRotacao' in informacoes))
      return false

    const angulacaoDaRotacao = informacoes.angulacaoDaRotacao
    algoritmos.rotacionarElementos(angulacaoDaRotacao)
    return true
  }

  _escalarElementos(informacoes) {
    if (!('fatorTransformacaoEmX' in informacoes) || !('fatorTransformacaoEmY' in informacoes))
      return false

    const fatorTransformacaoEmX = parseFloat(informacoes.fatorTransformacaoEmX)
    const fatorTransformacaoEmY = parseFloat(informacoes.fatorTransformacaoEmY)
    algoritmos.escalarElementos(fatorTransformacaoEmX, fatorTransformacaoEmY)
    return true
  }

  _refletirElementos(informacoes) {
    if (!('fatorTransformacaoEmX' in informacoes) || !('fatorTransformacaoEmY' in informacoes))
      return false

    const fatorTransformacaoEmX = parseFloat(informacoes.fatorTransformacaoEmX)
    const fatorTransformacaoEmY = parseFloat(informacoes.fatorTransformacaoEmY)
    algoritmos.refletirElementos(fatorTransformacaoEmX, fatorTransformacaoEmY)
    return true
  }

  _desenharRetaComAlgoritmoDDA(informacoes) {
    if (
      !('coordenadaXFinal' in informacoes) || !('coordenadaYFinal' in informacoes) ||
      !('coordenadaXInicial' in informacoes) || !('coordenadaYInicial' in informacoes)
    )
      return false

    const pixelFinal = new Pixel({ x: parseFloat(informacoes.coordenadaXFinal), y: parseFloat(informacoes.coordenadaYFinal) })
    const pixelInicial = new Pixel({ x: parseFloat(informacoes.coordenadaXInicial), y: parseFloat(informacoes.coordenadaYInicial) })
    algoritmos.desenharRetaComAlgoritmoDDA(pixelFinal, pixelInicial);
    return true
  }

  _desenharRetaComAlgoritmoBresenham(informacoes) {
    if (
      !('coordenadaXFinal' in informacoes) || !('coordenadaYFinal' in informacoes) ||
      !('coordenadaXInicial' in informacoes) || !('coordenadaYInicial' in informacoes)
    )
      return false

    const pixelFinal = new Pixel({ x: parseFloat(informacoes.coordenadaXFinal), y: parseFloat(informacoes.coordenadaYFinal) })
    const pixelInicial = new Pixel({ x: parseFloat(informacoes.coordenadaXInicial), y: parseFloat(informacoes.coordenadaYInicial) })
    algoritmos.desenharRetaComAlgoritmoBresenham(pixelFinal, pixelInicial)
    return true
  }

  _desenharCircunferencia(informacoes) {
    if (
      !('coordenadaXCentral' in informacoes) || !('coordenadaYCentral' in informacoes) ||
      !('raio' in informacoes)
    )
      return false

    const pixelCentral = new Pixel({ x: parseFloat(informacoes.coordenadaXCentral), y: parseFloat(informacoes.coordenadaYCentral) })
    const raio = informacoes.raio
    algoritmos.desenharCircunferencia(pixelCentral, parseFloat(raio))
    return true
  }
}