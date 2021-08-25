import CanvasController from './canvasController.js';
import PixelController from './pixelController.js';
import FormularioController from './formularioController.js';

const canvasController = new CanvasController
const pixelController = new PixelController
const formularioController = new FormularioController

window.addEventListener('load', () => {
  carregarCanvas()
  document.getElementById('tranformacoes-geometricas').addEventListener('click', () => {
    fecharGuiaLateral('home')
    abrirGuiaLateral('transformacao-geometrica-opcoes')
  })
  document.getElementById('desenhar-reta').addEventListener('click', () => {
    fecharGuiaLateral('home')
    abrirGuiaLateral('desenhar-reta-opcoes')
  })
  document.getElementById('desenhar-circunferencia').addEventListener('click', () => {
    fecharGuiaLateral('home')
    abrirGuiaLateral('desenhar-circunferencia-dados')
  })
  document.getElementById('translacao').addEventListener('click', () => {
    fecharGuiaLateral('transformacao-geometrica-opcoes')
    abrirGuiaLateral('transformacao-geometrica-fatores')
  })
  document.getElementById('rotacao').addEventListener('click', () => {
    fecharGuiaLateral('transformacao-geometrica-opcoes')
    abrirGuiaLateral('transformacao-geometrica-fator-rotacao')
  })
  document.getElementById('escala').addEventListener('click', () => {
    fecharGuiaLateral('transformacao-geometrica-opcoes')
    abrirGuiaLateral('transformacao-geometrica-fatores')
  })
  document.getElementById('reflexao').addEventListener('click', () => {
    fecharGuiaLateral('transformacao-geometrica-opcoes')
    abrirGuiaLateral('transformacao-geometrica-fatores')
  })
  document.getElementById('dda').addEventListener('click', () => {
    fecharGuiaLateral('desenhar-reta-opcoes')
    abrirGuiaLateral('desenhar-reta-pontos')
  })
  document.getElementById('bresenham').addEventListener('click', () => {
    fecharGuiaLateral('desenhar-reta-opcoes')
    abrirGuiaLateral('desenhar-reta-pontos')
  })
  document.getElementById('transformacao-geometrica-opcoes-para-home').addEventListener('click', () => {
    fecharGuiaLateral('transformacao-geometrica-opcoes')
    abrirGuiaLateral('home')
  })
  document.getElementById('transformacao-geometrica-fatores-para-opcoes').addEventListener('click', () => {
    fecharGuiaLateral('transformacao-geometrica-fatores')
    abrirGuiaLateral('transformacao-geometrica-opcoes')
  })
  document.getElementById('transformacao-geometrica-fatores-para-home').addEventListener('click', () => {
    fecharGuiaLateral('transformacao-geometrica-fatores')
    abrirGuiaLateral('home')
  })
  document.getElementById('transformacao-geometrica-fator-rotacao-para-opcoes').addEventListener('click', () => {
    fecharGuiaLateral('transformacao-geometrica-fator-rotacao')
    abrirGuiaLateral('transformacao-geometrica-opcoes')
  })
  document.getElementById('transformacao-geometrica-fator-rotacao-para-home').addEventListener('click', () => {
    fecharGuiaLateral('transformacao-geometrica-fator-rotacao')
    abrirGuiaLateral('home')
  })
  document.getElementById('desenhar-reta-opcoes-para-home').addEventListener('click', () => {
    fecharGuiaLateral('desenhar-reta-opcoes')
    abrirGuiaLateral('home')
  })
  document.getElementById('desenhar-reta-pontos-para-opcoes').addEventListener('click', () => {
    fecharGuiaLateral('desenhar-reta-pontos')
    abrirGuiaLateral('desenhar-reta-opcoes')
  })
  document.getElementById('desenhar-reta-pontos-para-home').addEventListener('click', () => {
    fecharGuiaLateral('desenhar-reta-pontos')
    abrirGuiaLateral('home')
  })
  document.getElementById('desenhar-circunferencia-dados-para-home').addEventListener('click', () => {
    fecharGuiaLateral('desenhar-circunferencia-dados')
    abrirGuiaLateral('home')
  })
  document.getElementById('fator-transformacao-x').addEventListener('input', event => {
    preencherCampoDoFormularioTransformacoesGeometricas({ fatorTransformacaoEmX: event.target.value })
  })
  document.getElementById('fator-transformacao-y').addEventListener('input', event => {
    preencherCampoDoFormularioTransformacoesGeometricas({ fatorTransformacaoEmY: event.target.value })
  })
  document.getElementById('angulacao').addEventListener('input', event => {
    preencherCampoDoFormularioTransformacoesGeometricas({ angulacaoDaRotacao: event.target.value })
  })
  document.getElementById('x-inicial-reta').addEventListener('input', event => {
    preencherCampoDoFormularioDesenharReta({ coordenadaXInicial: event.target.value })
  })
  document.getElementById('y-inicial-reta').addEventListener('input', event => {
    preencherCampoDoFormularioDesenharReta({ coordenadaYInicial: event.target.value })
  })
  document.getElementById('x-final-reta').addEventListener('input', event => {
    preencherCampoDoFormularioDesenharReta({ coordenadaXFinal: event.target.value })
  })
  document.getElementById('y-final-reta').addEventListener('input', event => {
    preencherCampoDoFormularioDesenharReta({ coordenadaYFinal: event.target.value })
  })
  document.getElementById('x-central-circunferencia').addEventListener('input', event => {
    preencherCampoDoFormularioDesenharCircunferencia({ coordenadaXCentral: event.target.value })
  })
  document.getElementById('y-central-circunferencia').addEventListener('input', event => {
    preencherCampoDoFormularioDesenharCircunferencia({ coordenadaYCentral: event.target.value })
  })
  document.getElementById('raio').addEventListener('input', event => {
    preencherCampoDoFormularioDesenharCircunferencia({ raio: event.target.value })
  })
})

function carregarCanvas() {
  canvasController.carregarCanvas()
  carregarMalhaDePixels()
}

function carregarMalhaDePixels() {
  const canvas = document.getElementById('canvas')
  for (let x = 0; x < canvasController.quantidadePixelsHorizontal; x++) {
    const coluna = gerarColunaEm(x)
    const colunaPreenchida = inserirPixelsEm(coluna)
    canvas.appendChild(colunaPreenchida)
  }
}

function inserirPixelsEm(coluna) {
  for (let y = 0; y < canvasController.quantidadePixelsVertical; y++) {
    const pixel = gerarPixelNasCoordenadas(parseInt(coluna.dataset.posicao), y)
    pixel.addEventListener('click', selecionarPixel)
    coluna.appendChild(pixel)
  }

  return coluna
}

function selecionarPixel(pixel) {
  if (pixel.target.classList.contains('selected')) pixel.target.classList.remove('selected')
  else pixel.target.classList.add('selected')

  const [x, y] = [pixel.target.dataset.x, pixel.target.dataset.y]
  pixelController.selecionarPixel(canvasController.obterPixelNasCoordenadas(x, y))
}

function gerarColunaEm(posicao) {
  const linha = document.createElement('div')
  linha.dataset.posicao = posicao
  linha.className = 'column'

  return linha
}

function gerarPixelNasCoordenadas(x, y) {
  const pixel = document.createElement('div')
  pixel.className = 'pixel'
  pixel.dataset.x = x
  pixel.dataset.y = y

  return pixel
}

function fecharGuiaLateral(nomeGuia) {
  document.getElementById(nomeGuia).classList.add('navbar--closed')
}

function abrirGuiaLateral(nomeGuia) {
  document.getElementById(nomeGuia).classList.remove('navbar--closed')
}

function preencherCampoDoFormularioTransformacoesGeometricas(campo) {
  formularioController.preencherCamposDoFormulario('transformacoes-geometricas', campo)
}

function preencherCampoDoFormularioDesenharReta(campo) {
  formularioController.preencherCamposDoFormulario('desenhar-reta', campo)
}

function preencherCampoDoFormularioDesenharCircunferencia(campo) {
  formularioController.preencherCamposDoFormulario('desenhar-circunferencia', campo)
}