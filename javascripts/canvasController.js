import Canvas from './canvas.js'
import Pixel from './pixel.js'
import algoritmos from './algoritmos.js'

const _calcularDimensoesPixel = (canvas, zoom) => [canvas.altura * zoom, canvas.comprimento * zoom]
const _calcularQuantidadePixels = (canvas, alturaPixel, larguraPixel) => [canvas.comprimento / alturaPixel, canvas.altura / larguraPixel]
const _obterGrausEmRadianos = graus => graus * Math.PI / 180

export default class CanvasController {
  _canvas
  _retas
  _circunferencias
  _operacoes
  _estruturas

  constructor() {
    this._canvas = new Canvas
    this._retas = []
    this._circunferencias = []
    this._operacoes = {
      'translacao': this._transladarElementos.bind(this),
      'rotacao': this._rotacionarElementos.bind(this),
      'escala': this._escalarElementos.bind(this),
      'reflexao': this._refletirElementos.bind(this),
      'dda': this._desenharRetaComAlgoritmoDDA.bind(this),
      'bresenham': this._desenharRetaComAlgoritmoBresenham.bind(this),
      'desenhar-circunferencia': this._desenharCircunferencia.bind(this)
    }
    this._estruturas = {
      'reta': this._retas,
      'circunferencia': this._circunferencias
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
    if (!('fatorTransformacaoEmX' in informacoes) || !('fatorTransformacaoEmY' in informacoes) || !('estruturaAtual' in informacoes) || !('idEstruturaAtual' in informacoes))
      return false

    const fatorTransformacaoEmX = parseFloat(informacoes.fatorTransformacaoEmX)
    const fatorTransformacaoEmY = parseFloat(informacoes.fatorTransformacaoEmY)
    const matrizTransformacao = this._obterMatrizTransformacaoTranslacao(fatorTransformacaoEmX, fatorTransformacaoEmY)
    const estruturaAtual = this._estruturas[informacoes.estruturaAtual][informacoes.idEstruturaAtual]
    algoritmos.transladarEstrutura(matrizTransformacao, estruturaAtual, this._canvas)

    if (estruturaAtual.pixels.length === 0) this._estruturas[informacoes.estruturaAtual].splice(informacoes.idEstruturaAtual, 1)
  }

  _rotacionarElementos(informacoes) {
    if (!('angulacaoDaRotacao' in informacoes) || !('estruturaAtual' in informacoes) || !('idEstruturaAtual' in informacoes))
      return false

    const angulacaoDaRotacao = informacoes.angulacaoDaRotacao
    const matrizTransformacao = this._obterMatrizTransformacaoRotacao(angulacaoDaRotacao)
    const estruturaAtual = this._estruturas[informacoes.estruturaAtual][informacoes.idEstruturaAtual]
    algoritmos.rotacionarEstrutura(matrizTransformacao, estruturaAtual, this._canvas)

    if (estruturaAtual.pixels.length === 0) this._estruturas[informacoes.estruturaAtual].splice(informacoes.idEstruturaAtual, 1)
  }

  _escalarElementos(informacoes) {
    if (!('fatorTransformacaoEmX' in informacoes) || !('fatorTransformacaoEmY' in informacoes) || !('estruturaAtual' in informacoes) || !('idEstruturaAtual' in informacoes))
      return false

    const fatorTransformacaoEmX = parseFloat(informacoes.fatorTransformacaoEmX)
    const fatorTransformacaoEmY = parseFloat(informacoes.fatorTransformacaoEmY)
    const matrizTransformacao = this._obterMatrizTransformacaoEscala(fatorTransformacaoEmX, fatorTransformacaoEmY)
    const estruturaAtual = this._estruturas[informacoes.estruturaAtual][informacoes.idEstruturaAtual]
    algoritmos.escalarEstrutura(matrizTransformacao, estruturaAtual, this._canvas)

    if (estruturaAtual.pixels.length === 0) this._estruturas[informacoes.estruturaAtual].splice(informacoes.idEstruturaAtual, 1)
  }

  _refletirElementos(informacoes) {
    if (!('refletirEmX' in informacoes) || !('refletirEmY' in informacoes) || !('estruturaAtual' in informacoes) || !('idEstruturaAtual' in informacoes))
      return false

    const matrizTransformacao = this._obterMatrizTransformacaoReflexao(informacoes.refletirEmX, informacoes.refletirEmY)
    const estruturaAtual = this._estruturas[informacoes.estruturaAtual][informacoes.idEstruturaAtual]
    algoritmos.refletirEstrutura(matrizTransformacao, estruturaAtual, this._canvas)

    if (estruturaAtual.pixels.length === 0) this._estruturas[informacoes.estruturaAtual].splice(informacoes.idEstruturaAtual, 1)
  }

  _desenharRetaComAlgoritmoDDA(informacoes) {
    if (
      !('coordenadaXFinal' in informacoes) || !('coordenadaYFinal' in informacoes) ||
      !('coordenadaXInicial' in informacoes) || !('coordenadaYInicial' in informacoes)
    )
      return false

    algoritmos.EstruturaAtual.estrutura = 'reta'
    algoritmos.EstruturaAtual.id = this._retas.length + ''
    const pixelFinal = new Pixel({ x: parseFloat(informacoes.coordenadaXFinal), y: parseFloat(informacoes.coordenadaYFinal) })
    const pixelInicial = new Pixel({ x: parseFloat(informacoes.coordenadaXInicial), y: parseFloat(informacoes.coordenadaYInicial) })
    this._retas.push(algoritmos.desenharRetaComAlgoritmoDDA(pixelFinal, pixelInicial, this._canvas))
    this._atualizarCanvasComNovaEstrutura(this._retas[this._retas.length - 1])
  }

  _desenharRetaComAlgoritmoBresenham(informacoes) {
    if (
      !('coordenadaXFinal' in informacoes) || !('coordenadaYFinal' in informacoes) ||
      !('coordenadaXInicial' in informacoes) || !('coordenadaYInicial' in informacoes)
    )
      return false

    algoritmos.EstruturaAtual.estrutura = 'reta'
    algoritmos.EstruturaAtual.id = this._retas.length + ''
    const pixelFinal = new Pixel({ x: parseFloat(informacoes.coordenadaXFinal), y: parseFloat(informacoes.coordenadaYFinal) })
    const pixelInicial = new Pixel({ x: parseFloat(informacoes.coordenadaXInicial), y: parseFloat(informacoes.coordenadaYInicial) })
    this._retas.push(algoritmos.desenharRetaComAlgoritmoBresenham(pixelFinal, pixelInicial, this._canvas))
    this._atualizarCanvasComNovaEstrutura(this._retas[this._retas.length - 1])
  }

  _desenharCircunferencia(informacoes) {
    if (
      !('coordenadaXCentral' in informacoes) || !('coordenadaYCentral' in informacoes) ||
      !('raio' in informacoes)
    )
      return false

    algoritmos.EstruturaAtual.estrutura = 'circunferencia'
    algoritmos.EstruturaAtual.id = this._circunferencias.length + ''
    const pixelCentral = new Pixel({ x: parseFloat(informacoes.coordenadaXCentral), y: parseFloat(informacoes.coordenadaYCentral) })
    const raio = informacoes.raio
    this._circunferencias.push(algoritmos.desenharCircunferencia(pixelCentral, parseFloat(raio), this._canvas))
    this._atualizarCanvasComNovaEstrutura(this._circunferencias[this._circunferencias.length - 1])
  }

  _recorteCohenSutherland(informacoes) {
    if (!('limiteSuperior' in informacoes) || !('limiteInferior' in informacoes)) return false

    algoritmos.recorteCohenSutherland(informacoes.limiteInferior, informacoes.limiteInferior, this._retas)
    this._atualizarRetasNoCanvas()
  }

  _recorteCohenSutherland(informacoes) {
    if (!('limiteSuperior' in informacoes) || !('limiteInferior' in informacoes)) return false

    algoritmos.recorteLiangBarsky(informacoes.limiteInferior, informacoes.limiteInferior, this._retas)
    this._atualizarRetasNoCanvas()
  }

  _atualizarCanvasComNovaEstrutura(estrutura) {
    if (!('pixels' in estrutura)) return

    estrutura.pixels.forEach(pixel => {
      if ((pixel.x < 0 || pixel.x > this._canvas.pixels.length - 1) || (pixel.y < 0 || pixel.y > this._canvas.pixels[0].length - 1)) return

      this._canvas.pixels[pixel.x][pixel.y] = { ...pixel }
    });
  }

  _atualizarRetasNoCanvas() {
    for (let i = 0; i < this._retas.length; i++)
      this._retas[i].pixels.forEach(pixel => this._canvas.pixels[pixel.x][pixel.y] = { ...pixel });
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