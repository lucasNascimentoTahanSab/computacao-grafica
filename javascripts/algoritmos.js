function transladarElementos(fatorTransformacaoEmX, fatorTransformacaoEmY) { }

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

function _desenharPixel(x, y) {
  const pixel = document.querySelector(`[data-x='${x}'][data-y='${y}'`)
  pixel?.classList.add('selected')
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