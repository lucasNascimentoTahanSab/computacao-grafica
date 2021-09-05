import Pixel from './pixel.js'
import Reta from './reta.js'
import Circunferencia from './circunferencia.js'

class EstruturaAtual {
  static estrutura
  static id
}

function transladarElementos(matrizTransformacao, canvas) {
  const novaMatrizPixels = _obterNovaMatrizPixels(canvas)
  for (let x = 0; x < canvas.pixels.length; x++) {
    for (let y = 0; y < canvas.pixels[x].length; y++) {
      const matrizPonto = [x, y, 1]
      const [novoX, novoY] = _multiplicarMatrizPontoPorTransformacao(matrizPonto, matrizTransformacao)

      if (novoX >= canvas.pixels.length || novoY >= canvas.pixels[x].length) break
      if ((novoX < 0 || novoY < 0) || (!canvas.pixels[x][y].selecionado)) continue

      novaMatrizPixels[novoX][novoY].selecionado = true
    }
  }

  return novaMatrizPixels
}

function rotacionarElementos(matrizTransformacao, canvas) {
  const novaMatrizPixels = _obterNovaMatrizPixels(canvas)
  for (let x = 0; x < canvas.pixels.length; x++) {
    for (let y = 0; y < canvas.pixels[x].length; y++) {
      const matrizPonto = [x, y, 1]
      const [novoX, novoY] = _multiplicarMatrizPontoPorTransformacao(matrizPonto, matrizTransformacao)

      if (novoX >= canvas.pixels.length || novoY >= canvas.pixels[x].length) break
      if ((novoX < 0 || novoY < 0) || (!canvas.pixels[x][y].selecionado)) continue

      novaMatrizPixels[Math.round(novoX)][Math.round(novoY)].selecionado = true
    }
  }

  return novaMatrizPixels
}

function escalarElementos(matrizTransformacao, canvas) {
  const novaMatrizPixels = _obterNovaMatrizPixels(canvas)
  for (let x = 0; x < canvas.pixels.length; x++) {
    for (let y = 0; y < canvas.pixels[x].length; y++) {
      const matrizPonto = [x, y, 1]
      const [novoX, novoY] = _multiplicarMatrizPontoPorTransformacao(matrizPonto, matrizTransformacao)

      if (novoX >= canvas.pixels.length || novoY >= canvas.pixels[x].length) break
      if ((novoX < 0 || novoY < 0) || (!canvas.pixels[x][y].selecionado)) continue

      novaMatrizPixels[novoX][novoY].selecionado = true
    }
  }

  return novaMatrizPixels
}

function refletirElementos(matrizTransformacao, canvas) {
  const novaMatrizPixels = _obterNovaMatrizPixels(canvas)
  for (let x = 0; x < canvas.pixels.length; x++) {
    for (let y = 0; y < canvas.pixels[x].length; y++) {
      const matrizPonto = [x, y, 1]
      const matrizResultante = _multiplicarMatrizPontoPorTransformacao(matrizPonto, matrizTransformacao)
      const [xResultante, yResultante] = [matrizResultante[0], matrizResultante[1]]
      const novoX = xResultante < 0 ? xResultante + (canvas.pixels.length - 1) : xResultante
      const novoY = yResultante < 0 ? yResultante + (canvas.pixels[x].length - 1) : yResultante

      if (novoX >= canvas.pixels.length || novoY >= canvas.pixels[x].length) break
      if ((novoX < 0 || novoY < 0) || (!canvas.pixels[x][y].selecionado)) continue

      novaMatrizPixels[novoX][novoY].selecionado = true
    }
  }

  return novaMatrizPixels
}

function desenharRetaComAlgoritmoDDA(pixelFinal, pixelInicial, canvas) {
  const [deltaY, deltaX] = _obterDeltas(pixelFinal, pixelInicial)
  const [deltaYAbsoluto, deltaXAbsoluto] = _obterDeltasAbsolutos(deltaY, deltaX)
  const passos = _obterQuantidadePassos(deltaYAbsoluto, deltaXAbsoluto)
  const [incrementoEmY, incrementoEmX] = _obterIncrementos(deltaY, deltaX, passos)

  return _calcularPontosDaReta(pixelInicial, pixelFinal, [incrementoEmY, incrementoEmX], passos, canvas)
}

function desenharRetaComAlgoritmoBresenham(pixelFinal, pixelInicial, canvas) {
  const [deltaY, deltaX] = _obterDeltas(pixelFinal, pixelInicial)
  const [deltaYAbsoluto, deltaXAbsoluto] = _obterDeltasAbsolutos(deltaY, deltaX)
  const [incrementoEmY, incrementoEmX] = _obterIncrementosEmBresenham(deltaY, deltaX)
  const [incrementoDePNegativo, incrementoDePPositivo] = _obterIncrementosDeP(deltaYAbsoluto, deltaXAbsoluto)
  const pInicial = deltaYAbsoluto < deltaXAbsoluto ? _obterPInicial(deltaYAbsoluto, deltaXAbsoluto) : _obterPInicial(deltaXAbsoluto, deltaYAbsoluto)
  const passos = _obterQuantidadePassos(deltaYAbsoluto, deltaXAbsoluto)

  return deltaYAbsoluto < deltaXAbsoluto
    ? _calcularPontosDaRetaEmBresenhamDeltaYMenorQueDeltaX(
      pixelInicial, pixelFinal, pInicial, [incrementoEmY, incrementoEmX, incrementoDePNegativo, incrementoDePPositivo], passos, canvas
    )
    : _calcularPontosDaRetaEmBresenhamDeltaYMaiorQueDeltaX(
      pixelInicial, pixelFinal, pInicial, [incrementoEmY, incrementoEmX, incrementoDePNegativo, incrementoDePPositivo], passos, canvas
    )
}

function desenharCircunferencia(pixelCentral, raio, canvas) {
  const pInicial = _obterPInicialCircunferencia(raio)
  const incrementos = { x: 0, y: raio }

  return _calcularPontosDaCircunferenciaEmBresenham(incrementos, pixelCentral, pInicial, canvas)
}

function _calcularPontosDaReta(pixelInicial, pixelFinal, incrementos, passos, canvas) {
  let [x, y] = [pixelInicial.x, pixelInicial.y]
  const reta = new Reta(pixelInicial, pixelFinal)
  const [incrementoEmY, incrementoEmX] = incrementos

  for (let i = 0; i < passos + 1; i++) {
    const xArredondado = Math.round(x)
    const yArredondado = Math.round(y)
    const pixel = canvas.pixels[xArredondado][yArredondado]
    reta.pixels.push(new Pixel({ ...pixel, selecionado: true, estrutura: EstruturaAtual.estrutura, idEstrutura: EstruturaAtual.id }))
    x += incrementoEmX
    y += incrementoEmY
  }

  return reta
}

function _calcularPontosDaRetaEmBresenhamDeltaYMenorQueDeltaX(pixelInicial, pixelFinal, p, incrementos, passos, canvas) {
  let [x, y] = [pixelInicial.x, pixelInicial.y]
  const reta = new Reta(pixelInicial, pixelFinal)
  const [incrementoEmY, incrementoEmX, incrementoDePNegativo, incrementoDePPositivo] = incrementos

  for (let i = 0; i < passos + 1; i++) {
    const pixel = canvas.pixels[x][y]
    reta.pixels.push(new Pixel({ ...pixel, selecionado: true, estrutura: EstruturaAtual.estrutura, idEstrutura: EstruturaAtual.id }))
    x += incrementoEmX

    if (p > 0) {
      y += incrementoEmY
      p += incrementoDePNegativo
    } else {
      p += incrementoDePPositivo
    }
  }

  return reta
}

function _calcularPontosDaRetaEmBresenhamDeltaYMaiorQueDeltaX(pixelInicial, pixelFinal, p, incrementos, passos, canvas) {
  let [x, y] = [pixelInicial.x, pixelInicial.y]
  const reta = new Reta(pixelInicial, pixelFinal)
  const [incrementoEmY, incrementoEmX, incrementoDePNegativo, incrementoDePPositivo] = incrementos

  for (let i = 0; i < passos + 1; i++) {
    const pixel = canvas.pixels[x][y]
    reta.pixels.push(new Pixel({ ...pixel, selecionado: true, estrutura: EstruturaAtual.estrutura, idEstrutura: EstruturaAtual.id }))
    y += incrementoEmY

    if (p > 0) {
      x += incrementoEmX
      p += incrementoDePNegativo
    } else {
      p += incrementoDePPositivo
    }
  }

  return reta
}

function _calcularPontosDaCircunferenciaEmBresenham(incrementos, pixelCentral, p, canvas) {
  const circunferencia = new Circunferencia(pixelCentral, incrementos.y)

  while (incrementos.x < incrementos.y) {
    circunferencia.pixels = circunferencia.pixels.concat(_desenharPontosDaCircunferencia(incrementos, pixelCentral, canvas))
    if (p < 0) {
      p += 4 * incrementos.x + 6
    } else {
      p += 4 * (incrementos.x - incrementos.y) + 10
      incrementos.y--
    }

    incrementos.x++
  }

  return circunferencia
}

function _desenharPontosDaCircunferencia(incrementos, pixelCentral, canvas) {
  const comprimento = canvas.pixels.length - 1
  const altura = canvas.pixels[0].length - 1
  const pontos = []

  if (pixelCentral.x + incrementos.x <= comprimento && pixelCentral.y + incrementos.y <= altura) {
    const ponto = canvas.pixels[pixelCentral.x + incrementos.x][pixelCentral.y + incrementos.y]
    pontos.push(new Pixel({ ...ponto, selecionado: true, estrutura: EstruturaAtual.estrutura, idEstrutura: EstruturaAtual.id }))
  }
  if (pixelCentral.x - incrementos.x >= 0 && pixelCentral.y + incrementos.y <= altura) {
    const ponto = canvas.pixels[pixelCentral.x - incrementos.x][pixelCentral.y + incrementos.y]
    pontos.push(new Pixel({ ...ponto, selecionado: true, estrutura: EstruturaAtual.estrutura, idEstrutura: EstruturaAtual.id }))
  }
  if (pixelCentral.x + incrementos.x <= comprimento && pixelCentral.y - incrementos.y >= 0) {
    const ponto = canvas.pixels[pixelCentral.x + incrementos.x][pixelCentral.y - incrementos.y]
    pontos.push(new Pixel({ ...ponto, selecionado: true, estrutura: EstruturaAtual.estrutura, idEstrutura: EstruturaAtual.id }))
  }
  if (pixelCentral.x - incrementos.x >= 0 && pixelCentral.y - incrementos.y >= 0) {
    const ponto = canvas.pixels[pixelCentral.x - incrementos.x][pixelCentral.y - incrementos.y]
    pontos.push(new Pixel({ ...ponto, selecionado: true, estrutura: EstruturaAtual.estrutura, idEstrutura: EstruturaAtual.id }))
  }
  if (pixelCentral.x + incrementos.y <= comprimento && pixelCentral.y + incrementos.x <= altura) {
    const ponto = canvas.pixels[pixelCentral.x + incrementos.y][pixelCentral.y + incrementos.x]
    pontos.push(new Pixel({ ...ponto, selecionado: true, estrutura: EstruturaAtual.estrutura, idEstrutura: EstruturaAtual.id }))
  }
  if (pixelCentral.x - incrementos.y >= 0 && pixelCentral.y + incrementos.x <= altura) {
    const ponto = canvas.pixels[pixelCentral.x - incrementos.y][pixelCentral.y + incrementos.x]
    pontos.push(new Pixel({ ...ponto, selecionado: true, estrutura: EstruturaAtual.estrutura, idEstrutura: EstruturaAtual.id }))
  }
  if (pixelCentral.x + incrementos.y <= comprimento && pixelCentral.y - incrementos.x >= 0) {
    const ponto = canvas.pixels[pixelCentral.x + incrementos.y][pixelCentral.y - incrementos.x]
    pontos.push(new Pixel({ ...ponto, selecionado: true, estrutura: EstruturaAtual.estrutura, idEstrutura: EstruturaAtual.id }))
  }
  if (pixelCentral.x - incrementos.y >= 0 && pixelCentral.y - incrementos.x >= 0) {
    const ponto = canvas.pixels[pixelCentral.x - incrementos.y][pixelCentral.y - incrementos.x]
    pontos.push(new Pixel({ ...ponto, selecionado: true, estrutura: EstruturaAtual.estrutura, idEstrutura: EstruturaAtual.id }))
  }

  return pontos
}

function _obterNovaMatrizPixels(canvas) {
  const novaMatrizPixels = []
  for (let i = 0; i < canvas.pixels.length; i++) {
    novaMatrizPixels[i] = canvas.pixels[i].map(pixel => {
      const novoPixel = { ...pixel }
      novoPixel.selecionado = false
      return novoPixel
    })
  }

  return novaMatrizPixels
}

function _multiplicarMatrizPontoPorTransformacao(matrizPonto, matrizTransformacao) {
  if (matrizPonto.length != matrizTransformacao.length) return []

  const matrizResultante = []
  for (let i = 0; i < matrizTransformacao.length; i++) {
    let resultado = 0
    for (let j = 0; j < matrizPonto.length; j++)
      resultado += matrizTransformacao[i][j] * matrizPonto[j]
    matrizResultante.push(resultado)
  }

  return matrizResultante
}

const _calcularDelta = (coordenadaFinal, coordernadaInicial) => coordenadaFinal - coordernadaInicial
const _obterDeltas = (pixelFinal, pixelInicial) => [_calcularDelta(pixelFinal.y, pixelInicial.y), _calcularDelta(pixelFinal.x, pixelInicial.x)]
const _obterDeltasAbsolutos = (deltaY, deltaX) => [Math.abs(deltaY), Math.abs(deltaX)]
const _obterQuantidadePassos = (deltaY, deltaX) => deltaX > deltaY ? deltaX : deltaY
const _obterIncrementos = (deltaY, deltaX, passos) => [deltaY / passos, deltaX / passos]
const _obterIncrementosEmBresenham = (deltaY, deltaX) => [deltaY < 0 ? -1 : 1, deltaX < 0 ? -1 : 1]
const _obterPInicial = (primeiroDelta, segundoDelta) => 2 * primeiroDelta - segundoDelta
const _obterPInicialCircunferencia = raio => 3 - 2 * raio
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
  desenharCircunferencia,
  EstruturaAtual
}