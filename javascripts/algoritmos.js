import Pixel from './pixel.js'
import Reta from './reta.js'
import Circunferencia from './circunferencia.js'

class EstruturaAtual {
  static estrutura
  static id
}

function transladarEstrutura(matrizTransformacao, estrutura, canvas) {
  for (let i = 0; i < estrutura.pixels.length; i++) {
    const [antigoX, antigoY] = [estrutura.pixels[i].x, estrutura.pixels[i].y]
    canvas.pixels[antigoX][antigoY] = new Pixel({ ...canvas.pixels[antigoX][antigoY], estrutura: '', idEstrutura: '', selecionado: false })

    const matrizPonto = [antigoX, antigoY, 1]
    const [novoX, novoY] = _multiplicarMatrizPontoPorTransformacao(matrizPonto, matrizTransformacao)

    if ((novoX < 0 || novoX >= canvas.pixels.length) || (novoY < 0 || novoY >= canvas.pixels[0].length)) {
      estrutura.pixels.splice(i--, 1)
      continue
    }

    estrutura.pixels[i].x = novoX
    estrutura.pixels[i].y = novoY
    canvas.pixels[novoX][novoY] = estrutura.pixels[i]
  }
}

function rotacionarEstrutura(matrizTransformacao, estrutura, canvas) {
  for (let i = 0; i < estrutura.pixels.length; i++) {
    const [antigoX, antigoY] = [estrutura.pixels[i].x, estrutura.pixels[i].y]
    canvas.pixels[antigoX][antigoY] = new Pixel({ ...canvas.pixels[antigoX][antigoY], estrutura: '', idEstrutura: '', selecionado: false })

    const matrizPonto = [antigoX, antigoY, 1]
    const [xResultante, yResultante] = _multiplicarMatrizPontoPorTransformacao(matrizPonto, matrizTransformacao)
    const [novoX, novoY] = [Math.round(xResultante), Math.round(yResultante)]

    if ((novoX < 0 || novoX >= canvas.pixels.length) || (novoY < 0 || novoY >= canvas.pixels[0].length)) {
      estrutura.pixels.splice(i--, 1)
      continue
    }

    estrutura.pixels[i].x = novoX
    estrutura.pixels[i].y = novoY
    canvas.pixels[novoX][novoY] = estrutura.pixels[i]
  }
}

function escalarEstrutura(matrizTransformacao, estrutura, canvas) {
  for (let i = 0; i < estrutura.pixels.length; i++) {
    const [antigoX, antigoY] = [estrutura.pixels[i].x, estrutura.pixels[i].y]
    canvas.pixels[antigoX][antigoY] = new Pixel({ ...canvas.pixels[antigoX][antigoY], estrutura: '', idEstrutura: '', selecionado: false })

    const matrizPonto = [antigoX, antigoY, 1]
    const [xResultante, yResultante] = _multiplicarMatrizPontoPorTransformacao(matrizPonto, matrizTransformacao)
    const [novoX, novoY] = [Math.round(xResultante), Math.round(yResultante)]

    if ((novoX < 0 || novoX >= canvas.pixels.length) || (novoY < 0 || novoY >= canvas.pixels[0].length)) {
      estrutura.pixels.splice(i--, 1)
      continue
    }

    estrutura.pixels[i].x = novoX
    estrutura.pixels[i].y = novoY
    canvas.pixels[novoX][novoY] = estrutura.pixels[i]
  }
}

function refletirEstrutura(matrizTransformacao, estrutura, canvas) {
  for (let i = 0; i < estrutura.pixels.length; i++) {
    const [antigoX, antigoY] = [estrutura.pixels[i].x, estrutura.pixels[i].y]
    canvas.pixels[antigoX][antigoY] = new Pixel({ ...canvas.pixels[antigoX][antigoY], estrutura: '', idEstrutura: '', selecionado: false })

    const matrizPonto = [antigoX, antigoY, 1]
    const matrizResultante = _multiplicarMatrizPontoPorTransformacao(matrizPonto, matrizTransformacao)
    const [xResultante, yResultante] = [matrizResultante[0], matrizResultante[1]]
    const novoX = xResultante < 0 ? xResultante + (canvas.pixels.length - 1) : xResultante === 0 && matrizTransformacao[0][0] < 0 ? canvas.pixels.length - 1 : xResultante
    const novoY = yResultante < 0 ? yResultante + (canvas.pixels[0].length - 1) : yResultante === 0 && matrizTransformacao[1][1] < 0 ? canvas.pixels[0].length - 1 : yResultante

    if ((novoX < 0 || novoX >= canvas.pixels.length) || (novoY < 0 || novoY >= canvas.pixels[0].length)) {
      estrutura.pixels.splice(i--, 1)
      continue
    }

    estrutura.pixels[i].x = novoX
    estrutura.pixels[i].y = novoY
    canvas.pixels[novoX][novoY] = estrutura.pixels[i]
  }
}

function desenharRetaComAlgoritmoDDA(pixelFinal, pixelInicial, canvas) {
  const [deltaY, deltaX] = _obterDeltas(pixelFinal, pixelInicial)
  const [deltaYAbsoluto, deltaXAbsoluto] = _obterDeltasAbsolutos(deltaY, deltaX)
  const passos = _obterQuantidadePassos(deltaYAbsoluto, deltaXAbsoluto)
  const [incrementoEmY, incrementoEmX] = _obterIncrementos(deltaY, deltaX, passos)

  return _calcularPontosDaReta(pixelInicial, [incrementoEmY, incrementoEmX], passos, canvas)
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
      pixelInicial, pInicial, [incrementoEmY, incrementoEmX, incrementoDePNegativo, incrementoDePPositivo], passos, canvas
    )
    : _calcularPontosDaRetaEmBresenhamDeltaYMaiorQueDeltaX(
      pixelInicial, pInicial, [incrementoEmY, incrementoEmX, incrementoDePNegativo, incrementoDePPositivo], passos, canvas
    )
}

function desenharCircunferencia(pixelCentral, raio, canvas) {
  const pInicial = _obterPInicialCircunferencia(raio)
  const incrementos = { x: 0, y: raio }

  return _calcularPontosDaCircunferenciaEmBresenham(incrementos, pixelCentral, pInicial, canvas)
}

function recorteCohenSutherland(limiteInferior, limiteSuperior, retas) {
  for (let i = 0; i < retas.length; i++)
    _analisarRetaParaRecorteCohenSutherland(retas[i], limiteInferior, limiteSuperior)
}

function recorteLiangBarsky(limiteInferior, limiteSuperior, retas) {
  for (let i = 0; i < retas.length; i++)
    _analisarRetaParaRecorteLiangBarsky(retas[i], limiteInferior, limiteSuperior)
}

function _calcularPontosDaReta(pixelInicial, incrementos, passos, canvas) {
  let [x, y] = [pixelInicial.x, pixelInicial.y]
  const [incrementoEmY, incrementoEmX] = incrementos
  const reta = new Reta()

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

function _calcularPontosDaRetaEmBresenhamDeltaYMenorQueDeltaX(pixelInicial, p, incrementos, passos, canvas) {
  let [x, y] = [pixelInicial.x, pixelInicial.y]
  const [incrementoEmY, incrementoEmX, incrementoDePNegativo, incrementoDePPositivo] = incrementos
  const reta = new Reta()

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

function _calcularPontosDaRetaEmBresenhamDeltaYMaiorQueDeltaX(pixelInicial, p, incrementos, passos, canvas) {
  let [x, y] = [pixelInicial.x, pixelInicial.y]
  const [incrementoEmY, incrementoEmX, incrementoDePNegativo, incrementoDePPositivo] = incrementos
  const reta = new Reta()

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
  const circunferencia = new Circunferencia()

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

function _analisarRetaParaRecorteCohenSutherland(reta, limiteInferior, limiteSuperior) {
  let analiseConcluida = false, pixelFora
  const [pixelInicial, pixelFinal] = [new Pixel(reta.pixels[0]), new Pixel(reta.pixels[reta.pixels.length - 1])]
  while (!analiseConcluida) {
    const codigoPorRegiaoPixelInicial = _obterCodigoPorRegiaoDoPixel(limiteInferior, limiteSuperior, pixelInicial)
    const codigoPorRegiaoPixelFinal = _obterCodigoPorRegiaoDoPixel(limiteInferior, limiteSuperior, pixelFinal)
    if (codigoPorRegiaoPixelInicial === '0000' && codigoPorRegiaoPixelFinal === '0000') {
      analiseConcluida = true
      pixelInicial.x = Math.round(pixelInicial.x)
      pixelInicial.y = Math.round(pixelInicial.y)
      pixelFinal.x = Math.round(pixelFinal.x)
      pixelFinal.y = Math.round(pixelFinal.y)
      _atualizarPontosRetaEmRecorte(reta, pixelInicial, pixelFinal)
    } else if ((parseInt(codigoPorRegiaoPixelInicial, 2) & parseInt(codigoPorRegiaoPixelFinal, 2)) !== 0) {
      analiseConcluida = true
      _atualizarPontosRetaEmRecorte(reta, { x: -1, y: -1 }, { x: -1, y: -1 })
    } else {
      pixelFora = codigoPorRegiaoPixelInicial !== '0000' ? codigoPorRegiaoPixelInicial : codigoPorRegiaoPixelFinal
      const [novoX, novoY] = _calcularNovoPontoParaRecorte(pixelFora, pixelFinal, pixelInicial, limiteInferior, limiteSuperior)
      if (codigoPorRegiaoPixelInicial === pixelFora) {
        pixelInicial.x = novoX
        pixelInicial.y = novoY
      } else {
        pixelFinal.x = novoX
        pixelFinal.y = novoY
      }
    }
  }
}

function _analisarRetaParaRecorteLiangBarsky(reta, limiteInferior, limiteSuperior) {
  let desenharReta = false
  const variaveisParametricas = { inicio: 0, fim: 1 }
  const [deltaY, deltaX] = _obterDeltas(limiteInferior, limiteSuperior)
  const [pixelInicial, pixelFinal] = [new Pixel(reta.pixels[0]), new Pixel(reta.pixels[reta.pixels.length - 1])]
  if (_analisarRetaEmRelacaoFronteira(-deltaX, pixelInicial.x - limiteSuperior.x, variaveisParametricas))
    if (_analisarRetaEmRelacaoFronteira(deltaX, limiteInferior.x - pixelInicial.x, variaveisParametricas))
      if (_analisarRetaEmRelacaoFronteira(-deltaY, pixelInicial.y - limiteSuperior.y, variaveisParametricas))
        if (_analisarRetaEmRelacaoFronteira(deltaY, limiteInferior.y - pixelInicial.y, variaveisParametricas)) {
          if (variaveisParametricas.fim < 1)
            [pixelFinal.x, pixelFinal.y] = _calcularNovoPixelParametrico(pixelFinal, variaveisParametricas.fim, deltaY, deltaX)
          if (variaveisParametricas.inicio > 0)
            [pixelInicial.x, pixelInicial.y] = _calcularNovoPixelParametrico(pixelInicial, variaveisParametricas.inicio, deltaY, deltaX)
          desenharReta = true
        }

  desenharReta
    ? _atualizarPontosRetaEmRecorte(reta, pixelInicial, pixelFinal)
    : _atualizarPontosRetaEmRecorte(reta, { x: -1, y: -1 }, { x: -1, y: -1 })
}

function _analisarRetaEmRelacaoFronteira(p, q, variaveisParametricas) {
  const r = q / p
  if (p < 0) {
    if (r > variaveisParametricas.fim) return false
    else if (r > variaveisParametricas.inicio) variaveisParametricas.inicio = r
  } else if (p > 0) {
    if (r < variaveisParametricas.inicio) return false
    else if (r < variaveisParametricas.fim) variaveisParametricas.fim = r
  } else if (q < 0) return false

  return true
}

function _atualizarPontosRetaEmRecorte(reta, limiteInferior, limiteSuperior) {
  const [deltaY, deltaX] = _obterDeltas(limiteInferior, limiteSuperior)
  for (let i = 0; i < reta.pixels.length; i++) {
    if (_pixelDentroLimites(reta.pixels[i], deltaY, deltaX, limiteInferior, limiteSuperior)) continue
    reta.pixels[i].visivel = false
  }
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
const _obterCodigoPorRegiaoDoPixel = (limiteInferior, limiteSuperior, pixel) =>
  (pixel.y > limiteInferior.y ? '1' : '0') +
  (pixel.y < limiteSuperior.y ? '1' : '0') +
  (pixel.x > limiteInferior.x ? '1' : '0') +
  (pixel.x < limiteSuperior.x ? '1' : '0')
const _calcularNovoPontoParaRecorte = (codigo, pixelFinal, pixelInicial, limiteInferior, limiteSuperior) =>
  codigo[3] === '1' ? [limiteSuperior.x, _calcularYParaRecorte(pixelFinal, pixelInicial, limiteSuperior)] :
    codigo[2] === '1' ? [limiteInferior.x, _calcularYParaRecorte(pixelFinal, pixelInicial, limiteInferior)] :
      codigo[1] === '1' ? [_calcularXParaRecorte(pixelFinal, pixelInicial, limiteSuperior), limiteSuperior.y] :
        codigo[0] === '1' ? [_calcularXParaRecorte(pixelFinal, pixelInicial, limiteInferior), limiteInferior.y] :
          []
const _calcularXParaRecorte = (pixelFinal, pixelInicial, limite) =>
  pixelInicial.x + (pixelFinal.x - pixelInicial.x) * (limite.y - pixelInicial.y) / (pixelFinal.y - pixelInicial.y)
const _calcularYParaRecorte = (pixelFinal, pixelInicial, limite) =>
  pixelInicial.y + (pixelFinal.y - pixelInicial.y) * (limite.x - pixelInicial.x) / (pixelFinal.x - pixelInicial.x)
const _pixelDentroLimites = (pixel, deltaY, deltaX, limiteInferior, limiteSuperior) =>
  ((deltaX > 0 ? pixel.x < limiteInferior.x : pixel.x >= limiteInferior.x) && (deltaY > 0 ? pixel.y < limiteInferior.y : pixel.y >= limiteInferior.y)) &&
  ((deltaX > 0 ? pixel.x > limiteSuperior.x : pixel.x <= limiteSuperior.x) && (deltaY > 0 ? pixel.y > limiteSuperior.y : pixel.y <= limiteSuperior.y))
const _calcularNovoPixelParametrico = (ponto, parametro, deltaY, deltaX) => [ponto.x + parametro * deltaX, ponto.y + parametro * deltaY]

export default {
  transladarEstrutura,
  rotacionarEstrutura,
  escalarEstrutura,
  refletirEstrutura,
  desenharRetaComAlgoritmoDDA,
  desenharRetaComAlgoritmoBresenham,
  desenharCircunferencia,
  recorteCohenSutherland,
  recorteLiangBarsky,
  EstruturaAtual
}