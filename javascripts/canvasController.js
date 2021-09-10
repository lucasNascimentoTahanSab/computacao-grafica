/**
 * Módulo responsável pelo carregamento do canvas, incluso a formatação
 * dos pixels a serem representados e sua quantidade. Além disso, é entidade
 * intermediária entre o 'index.js' e o módulo de algoritmos.
 * Possui registro de todas as estruturas de dados representadas no canvas (retas
 * e circunferências) e é a principal responsável pela alteração, inclusão e
 * exclusão das mesmas. 
 */
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

  /**
   * A entidade 'operacoes' é importante para registro e chamada dinâmica das
   * operações passíveis de execução pelo módulo de algoritmos. A entidade
   * 'estruturas' é uma rota importante para acesso dinâmico das estruturas
   * cadastradas na 'canvasController'.
   */
  constructor() {
    this._canvas = new Canvas
    this._retas = []
    this._circunferencias = []
    this._operacoes = {
      'translacao': this._transladarEstrutura.bind(this),
      'rotacao': this._rotacionarEstrutura.bind(this),
      'escala': this._escalarEstrutura.bind(this),
      'reflexao': this._refletirEstrutura.bind(this),
      'dda': this._desenharRetaComAlgoritmoDDA.bind(this),
      'bresenham': this._desenharRetaComAlgoritmoBresenham.bind(this),
      'desenhar-circunferencia': this._desenharCircunferencia.bind(this),
      'cohen-sutherland': this._recorteCohenSutherland.bind(this),
      'liang-barsky': this._recorteLiangBarsky.bind(this)
    }
    this._estruturas = {
      'reta': this._retas,
      'circunferencia': this._circunferencias
    }
  }

  /**
   * Método responsável pela obtenção da matriz de pixels calculada
   * no carregamento para exibição ao usuário.
   */
  get matrizPixels() {
    return this._canvas.pixels
  }

  /**
   * Método responsável pelo carregamento do 'canvas', todos
   * os seus pixels, dimensões de cada um e quantidades.
   */
  carregarCanvas() {
    const [alturaPixel, comprimentoPixel] = _calcularDimensoesPixel(this._canvas, this._canvas.zoom)
    const [quantidadePixelsVertical, quantidadePixelsHorizontal] = _calcularQuantidadePixels(this._canvas, alturaPixel, comprimentoPixel)
    this._canvas.pixels = this._gerarMalhaDePixelsAPartirDasInformacoes(
      [quantidadePixelsVertical, quantidadePixelsHorizontal],
      [alturaPixel, comprimentoPixel]
    )
  }

  /**
   * Método responsável pela chamada e passagem de informações
   * dinâmica à operação selecionada.
   */
  executarOperacaoPorMeioDasInformacoes(operacao, informacoes) {
    if (!(operacao in this._operacoes)) return

    return this._operacoes[operacao](informacoes)
  }

  /**
   * Método responsável pela geração da malha de pixels no
   * 'canvas' por meio da quantidade e dimensões previamente
   * calculadas.
   */
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

  /**
   * Método responsável pela execução da translação da estrutura
   * selecionada a partir da informação dos fatores de transformação.
   */
  _transladarEstrutura(informacoes) {
    if (!('fatorTransformacaoEmX' in informacoes) || !('fatorTransformacaoEmY' in informacoes) || !('estruturaAtual' in informacoes) || !('idEstruturaAtual' in informacoes))
      return false

    const fatorTransformacaoEmX = parseFloat(informacoes.fatorTransformacaoEmX)
    const fatorTransformacaoEmY = parseFloat(informacoes.fatorTransformacaoEmY)
    const matrizTransformacao = this._obterMatrizTransformacaoTranslacao(fatorTransformacaoEmX, fatorTransformacaoEmY)
    const estruturaAtual = this._estruturas[informacoes.estruturaAtual][informacoes.idEstruturaAtual]
    algoritmos.transladarEstrutura(matrizTransformacao, estruturaAtual, this._canvas)

    if (estruturaAtual.pixels.length === 0) this._estruturas[informacoes.estruturaAtual].splice(informacoes.idEstruturaAtual, 1)
  }

  /**
   * Método responsável pela execução da rotação da estrutura
   * selecionada a partir da informação do fator de angulação.
   */
  _rotacionarEstrutura(informacoes) {
    if (!('angulacaoDaRotacao' in informacoes) || !('estruturaAtual' in informacoes) || !('idEstruturaAtual' in informacoes))
      return false

    const angulacaoDaRotacao = informacoes.angulacaoDaRotacao
    const matrizTransformacao = this._obterMatrizTransformacaoRotacao(angulacaoDaRotacao)
    const estruturaAtual = this._estruturas[informacoes.estruturaAtual][informacoes.idEstruturaAtual]
    algoritmos.rotacionarEstrutura(matrizTransformacao, estruturaAtual, this._canvas)

    if (estruturaAtual.pixels.length === 0) this._estruturas[informacoes.estruturaAtual].splice(informacoes.idEstruturaAtual, 1)
  }

  /**
   * Método responsável pela execução da escala da estrutura
   * selecionada a partir da informação dos fatores de transformação.
   */
  _escalarEstrutura(informacoes) {
    if (!('fatorTransformacaoEmX' in informacoes) || !('fatorTransformacaoEmY' in informacoes) || !('estruturaAtual' in informacoes) || !('idEstruturaAtual' in informacoes))
      return false

    const fatorTransformacaoEmX = parseFloat(informacoes.fatorTransformacaoEmX)
    const fatorTransformacaoEmY = parseFloat(informacoes.fatorTransformacaoEmY)
    const matrizTransformacao = this._obterMatrizTransformacaoEscala(fatorTransformacaoEmX, fatorTransformacaoEmY)
    const estruturaAtual = this._estruturas[informacoes.estruturaAtual][informacoes.idEstruturaAtual]
    algoritmos.escalarEstrutura(matrizTransformacao, estruturaAtual, this._canvas)

    if (estruturaAtual.pixels.length === 0) this._estruturas[informacoes.estruturaAtual].splice(informacoes.idEstruturaAtual, 1)
  }

  /**
   * Método responsável pela execução da reflexão da estrutura
   * selecionada a partir da informação dos eixos de reflexão.
   */
  _refletirEstrutura(informacoes) {
    if (!('refletirEmX' in informacoes) || !('refletirEmY' in informacoes) || !('estruturaAtual' in informacoes) || !('idEstruturaAtual' in informacoes))
      return false

    const matrizTransformacao = this._obterMatrizTransformacaoReflexao(informacoes.refletirEmX, informacoes.refletirEmY)
    const estruturaAtual = this._estruturas[informacoes.estruturaAtual][informacoes.idEstruturaAtual]
    algoritmos.refletirEstrutura(matrizTransformacao, estruturaAtual, this._canvas)

    if (estruturaAtual.pixels.length === 0) this._estruturas[informacoes.estruturaAtual].splice(informacoes.idEstruturaAtual, 1)
  }

  /**
   * Método responsável pela execução do algoritmo DDA
   * para retas. Após execução do algoritmo, a estrutura
   * gerada é registrada para posteriores manipulações.
   * São passadas as coordenadas para os pontos final e inicial
   * da reta.
   */
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

  /**
   * Método responsável pela execução do algoritmo Bresenham
   * para retas. Após execução do algoritmo, a estrutura
   * gerada é registrada para posteriores manipulações.
   * São passadas as coordenadas para os pontos final e inicial
   * da reta.
   */
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

  /**
   * Método responsável pela execução do algoritmo Bresenham
   * para circunferências. Após execução do algoritmo, a estrutura
   * gerada é registrada para posteriores manipulações.
   * São passadas a coordenada para o ponto central e o raio
   * da circunferência.
   */
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

  /**
   * Método responsável pela execução do algoritmo Cohen-Sutherland para
   * recortes. São passadas as coordenadas para os limites inferior e
   * superior da janela.
   */
  _recorteCohenSutherland(informacoes) {
    if (
      !('coordenadaXFinal' in informacoes) || !('coordenadaYFinal' in informacoes) ||
      !('coordenadaXInicial' in informacoes) || !('coordenadaYInicial' in informacoes)
    )
      return false

    const limiteInferior = new Pixel({ x: parseFloat(informacoes.coordenadaXFinal), y: parseFloat(informacoes.coordenadaYFinal) })
    const limiteSuperior = new Pixel({ x: parseFloat(informacoes.coordenadaXInicial), y: parseFloat(informacoes.coordenadaYInicial) })
    algoritmos.recorteCohenSutherland(limiteInferior, limiteSuperior, this._retas)
    this._atualizarRetasNoCanvas()
  }

  /**
   * Método responsável pela execução do algoritmo Liang-Barsky para
   * recortes. São passadas as coordenadas para os limites inferior e
   * superior da janela.
   */
  _recorteLiangBarsky(informacoes) {
    if (
      !('coordenadaXFinal' in informacoes) || !('coordenadaYFinal' in informacoes) ||
      !('coordenadaXInicial' in informacoes) || !('coordenadaYInicial' in informacoes)
    )
      return false

    const limiteInferior = new Pixel({ x: parseFloat(informacoes.coordenadaXFinal), y: parseFloat(informacoes.coordenadaYFinal) })
    const limiteSuperior = new Pixel({ x: parseFloat(informacoes.coordenadaXInicial), y: parseFloat(informacoes.coordenadaYInicial) })
    algoritmos.recorteLiangBarsky(limiteInferior, limiteSuperior, this._retas)
    this._atualizarRetasNoCanvas()
  }

  /**
   * Método responsável pela atualização do 'canvas' sempre que
   * uma nova estrutura for inserida. 
   */
  _atualizarCanvasComNovaEstrutura(estrutura) {
    if (!('pixels' in estrutura)) return

    estrutura.pixels.forEach(pixel => {
      if ((pixel.x < 0 || pixel.x > this._canvas.pixels.length - 1) || (pixel.y < 0 || pixel.y > this._canvas.pixels[0].length - 1)) return

      this._canvas.pixels[pixel.x][pixel.y] = { ...pixel }
    });
  }

  /**
   * Método responsável pela atualização das estruturas de retas
   * existentes no 'canvas' após execução dos algoritmos de recorte.
   */
  _atualizarRetasNoCanvas() {
    for (let i = 0; i < this._retas.length; i++)
      this._retas[i].pixels.forEach(pixel => this._canvas.pixels[pixel.x][pixel.y] = { ...pixel });
  }

  /**
   * Método responsável pela obtenção da matriz de transformação de
   * translação.
   */
  _obterMatrizTransformacaoTranslacao(fatorTransformacaoEmX, fatorTransformacaoEmY) {
    return [
      [1, 0, fatorTransformacaoEmX],
      [0, 1, fatorTransformacaoEmY],
      [0, 0, 1],
    ]
  }

  /**
   * Método responsável pela obtenção da matriz de transformação de
   * rotação.
   */
  _obterMatrizTransformacaoRotacao(angulacaoDaRotacao) {
    return [
      [Math.cos(_obterGrausEmRadianos(angulacaoDaRotacao)), -Math.sin(_obterGrausEmRadianos(angulacaoDaRotacao)), 0],
      [Math.sin(_obterGrausEmRadianos(angulacaoDaRotacao)), Math.cos(_obterGrausEmRadianos(angulacaoDaRotacao)), 0],
      [0, 0, 1]
    ]
  }

  /**
   * Método responsável pela obtenção da matriz de transformação de
   * escala.
   */
  _obterMatrizTransformacaoEscala(fatorTransformacaoEmX, fatorTransformacaoEmY) {
    return [
      [fatorTransformacaoEmX, 0, 0],
      [0, fatorTransformacaoEmY, 0],
      [0, 0, 1]
    ]
  }

  /**
   * Método responsável pela obtenção da matriz de transformação de
   * reflexão.
   */
  _obterMatrizTransformacaoReflexao(eixoX, eixoY) {
    return [
      [eixoY ? -1 : 1, 0, 0],
      [0, eixoX ? -1 : 1, 0],
      [0, 0, 1]
    ]
  }
}