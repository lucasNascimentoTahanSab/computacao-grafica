function transladarElementos(fatorTransformacaoEmX, fatorTransformacaoEmY) {
  const canvas = document.getElementById('canvas')
  const quantidadePixelsHorizontal = canvas.children.length
  const quantidadePixelsVertical = canvas.children[0].children.length
  const fatorTransformacaoEmXAbsoluto = Math.abs(fatorTransformacaoEmX)
  const fatorTransformacaoEmYAbsoluto = Math.abs(fatorTransformacaoEmY)
  const comecarDaEsquerdaParaDireita = fatorTransformacaoEmX < 0
  const comecarDeCimaParaBaixo = fatorTransformacaoEmY < 0
  const pontoDeParadaEmX = comecarDaEsquerdaParaDireita ? quantidadePixelsHorizontal - fatorTransformacaoEmXAbsoluto : fatorTransformacaoEmXAbsoluto
  const pontoDeParadaEmY = comecarDeCimaParaBaixo ? quantidadePixelsVertical - fatorTransformacaoEmYAbsoluto : fatorTransformacaoEmYAbsoluto

  let x = comecarDaEsquerdaParaDireita ? 0 : quantidadePixelsHorizontal - 1
  for (; comecarDaEsquerdaParaDireita ? x < quantidadePixelsHorizontal : x >= 0; comecarDaEsquerdaParaDireita ? x++ : x--) {
    let y = comecarDeCimaParaBaixo ? 0 : quantidadePixelsVertical - 1
    for (; comecarDeCimaParaBaixo ? y < quantidadePixelsVertical : y >= 0; comecarDeCimaParaBaixo ? y++ : y--) {
      const pixel = canvas.children[x].children[y]
      _aplicarTransformacoesSobrePixel(pixel, fatorTransformacaoEmX, fatorTransformacaoEmY)
      const chegouNoPontoDeParadaEmX = comecarDaEsquerdaParaDireita ? x >= pontoDeParadaEmX : x <= pontoDeParadaEmX
      const chegouNoPontoDeParadaEmY = comecarDeCimaParaBaixo ? y >= pontoDeParadaEmY : y <= pontoDeParadaEmY
      if (chegouNoPontoDeParadaEmX || chegouNoPontoDeParadaEmY) _apagarPixel(x, y)
    }
  }
}

function rotacionarElementos(angulacaoDaRotacao) { }

function escalarElementos(fatorTransformacaoEmX, fatorTransformacaoEmY) { }

function refletirElementos(fatorTransformacaoEmX, fatorTransformacaoEmY) { }

function desenharRetaComAlgoritmoDDA(pixelFinal, pixelInicial) {
  const [deltaY, deltaX] = _obterDeltas(pixelFinal, pixelInicial)
  const [deltaYAbsoluto, deltaXAbsoluto] = _obterDeltasAbsolutos(deltaY, deltaX)
  const passos = _obterQuantidadePassos(deltaYAbsoluto, deltaXAbsoluto)
  const [incrementoEmY, incrementoEmX] = _obterIncrementos(deltaY, deltaX, passos)

  _calcularPontosDaReta(pixelInicial, incrementoEmX, incrementoEmY, passos)
}

function desenharRetaComAlgoritmoBresenham(pixelFinal, pixelInicial) {
  const [deltaY, deltaX] = _obterDeltas(pixelFinal, pixelInicial)
  const [deltaYAbsoluto, deltaXAbsoluto] = _obterDeltasAbsolutos(deltaY, deltaX)
  const [incrementoEmY, incrementoEmX] = _obterIncrementosEmBresenham(deltaY, deltaX)
  const [incrementoDePNegativo, incrementoDePPositivo] = _obterIncrementosDeP(deltaYAbsoluto, deltaXAbsoluto)
  const pInicial = deltaYAbsoluto < deltaXAbsoluto ? _obterPInicial(deltaYAbsoluto, deltaXAbsoluto) : _obterPInicial(deltaXAbsoluto, deltaYAbsoluto)
  const passos = _obterQuantidadePassos(deltaYAbsoluto, deltaXAbsoluto)

  if (deltaYAbsoluto < deltaXAbsoluto) _calcularPontosDaRetaEmBresenhamDeltaYMenorQueDeltaX(
    pixelInicial, pInicial, [incrementoEmY, incrementoEmX, incrementoDePNegativo, incrementoDePPositivo], passos
  )
  else _calcularPontosDaRetaEmBresenhamDeltaYMaiorQueDeltaX(
    pixelInicial, pInicial, [incrementoEmY, incrementoEmX, incrementoDePNegativo, incrementoDePPositivo], passos
  )
}

function desenharCircunferencia(pixelCentral, raio) { }

function _calcularPontosDaReta(pixelInicial, incrementoEmX, incrementoEmY, passos) {
  let [x, y] = [pixelInicial.x, pixelInicial.y]

  for (let i = 0; i < passos + 1; i++) {
    _desenharPixel(Math.round(x), Math.round(y))
    x += incrementoEmX
    y += incrementoEmY
  }
}

function _calcularPontosDaRetaEmBresenhamDeltaYMenorQueDeltaX(pixelInicial, p, incrementos, passos) {
  let [x, y] = [pixelInicial.x, pixelInicial.y]
  const [incrementoEmY, incrementoEmX, incrementoDePNegativo, incrementoDePPositivo] = incrementos

  for (let i = 0; i < passos + 1; i++) {
    _desenharPixel(x, y)
    x += incrementoEmX

    if (p > 0) {
      y += incrementoEmY
      p += incrementoDePNegativo
    } else {
      p += incrementoDePPositivo
    }
  }
}

function _calcularPontosDaRetaEmBresenhamDeltaYMaiorQueDeltaX(pixelInicial, p, incrementos, passos) {
  let [x, y] = [pixelInicial.x, pixelInicial.y]
  const [incrementoEmY, incrementoEmX, incrementoDePNegativo, incrementoDePPositivo] = incrementos

  for (let i = 0; i < passos + 1; i++) {
    _desenharPixel(x, y)
    y += incrementoEmY

    if (p > 0) {
      x += incrementoEmX
      p += incrementoDePNegativo
    } else {
      p += incrementoDePPositivo
    }
  }
}

function _aplicarTransformacoesSobrePixel(pixel, fatorTransformacaoEmX, fatorTransformacaoEmY) {
  const xAposTransformacao = parseInt(pixel.dataset.x) + fatorTransformacaoEmX
  const yAposTransformacao = parseInt(pixel.dataset.y) + fatorTransformacaoEmY
  if (pixel.classList.contains('selected')) _desenharPixel(xAposTransformacao, yAposTransformacao)
  else _apagarPixel(xAposTransformacao, yAposTransformacao)
}

function _desenharPixel(x, y) {
  const pixel = document.querySelector(`[data-x='${x}'][data-y='${y}'`)
  pixel?.classList.add('selected')
}

function _apagarPixel(x, y) {
  const pixel = document.querySelector(`[data-x='${x}'][data-y='${y}'`)
  pixel?.classList.remove('selected')
}

const _calcularDelta = (coordenadaFinal, coordernadaInicial) => coordenadaFinal - coordernadaInicial
const _obterDeltas = (pixelFinal, pixelInicial) => [_calcularDelta(pixelFinal.y, pixelInicial.y), _calcularDelta(pixelFinal.x, pixelInicial.x)]
const _obterDeltasAbsolutos = (deltaY, deltaX) => [Math.abs(deltaY), Math.abs(deltaX)]
const _obterQuantidadePassos = (deltaY, deltaX) => deltaX > deltaY ? deltaX : deltaY
const _obterIncrementos = (deltaY, deltaX, passos) => [deltaY / passos, deltaX / passos]
const _obterIncrementosEmBresenham = (deltaY, deltaX) => [deltaY < 0 ? -1 : 1, deltaX < 0 ? -1 : 1]
const _obterPInicial = (primeiroDelta, segundoDelta) => 2 * primeiroDelta - segundoDelta
const _obterIncrementosDeP = (deltaY, deltaX) => deltaY < deltaX
  ? [2 * deltaY, 2 * (deltaY - deltaX)]
  : [2 * deltaX, 2 * (deltaX - deltaY)]

export default {
  transladarElementos,
  rotacionarElementos,
  escalarElementos,
  refletirElementos,
  desenharRetaComAlgoritmoDDA,
  desenharRetaComAlgoritmoBresenham,
  desenharCircunferencia
}