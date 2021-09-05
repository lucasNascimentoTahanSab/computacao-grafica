import CanvasController from './canvasController.js';
import FormularioController from './formularioController.js';

const canvasController = new CanvasController
const formularioController = new FormularioController

let operacao = ''
let estruturaAtual = ''
let idEstruturaAtual = ''

window.addEventListener('load', () => {
  canvasController.carregarCanvas()
  carregarMalhaDePixels()
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
    registrarOperacaoEscolhida('desenhar-circunferencia')
  })
  document.getElementById('translacao').addEventListener('click', () => {
    fecharGuiaLateral('transformacao-geometrica-opcoes')
    abrirGuiaLateral('transformacao-geometrica-fatores')
    registrarOperacaoEscolhida('translacao')
  })
  document.getElementById('rotacao').addEventListener('click', () => {
    fecharGuiaLateral('transformacao-geometrica-opcoes')
    abrirGuiaLateral('transformacao-geometrica-fator-rotacao')
    registrarOperacaoEscolhida('rotacao')
  })
  document.getElementById('escala').addEventListener('click', () => {
    fecharGuiaLateral('transformacao-geometrica-opcoes')
    abrirGuiaLateral('transformacao-geometrica-fatores')
    registrarOperacaoEscolhida('escala')
  })
  document.getElementById('reflexao').addEventListener('click', () => {
    fecharGuiaLateral('transformacao-geometrica-opcoes')
    abrirGuiaLateral('transformacao-geometrica-fatores-reflexao')
    registrarOperacaoEscolhida('reflexao')
  })
  document.getElementById('dda').addEventListener('click', () => {
    fecharGuiaLateral('desenhar-reta-opcoes')
    abrirGuiaLateral('desenhar-reta-pontos')
    registrarOperacaoEscolhida('dda')
  })
  document.getElementById('bresenham').addEventListener('click', () => {
    fecharGuiaLateral('desenhar-reta-opcoes')
    abrirGuiaLateral('desenhar-reta-pontos')
    registrarOperacaoEscolhida('bresenham')
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
  document.getElementById('transformacao-geometrica-fatores-reflexao-para-opcoes').addEventListener('click', () => {
    fecharGuiaLateral('transformacao-geometrica-fatores-reflexao')
    abrirGuiaLateral('transformacao-geometrica-opcoes')
  })
  document.getElementById('transformacao-geometrica-fatores-reflexao-para-home').addEventListener('click', () => {
    fecharGuiaLateral('transformacao-geometrica-fatores-reflexao')
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
  document.getElementById('refletir-em-x').addEventListener('input', event => {
    preencherCampoDoFormularioTransformacoesGeometricas({ refletirEmX: event.target.checked })
  })
  document.getElementById('refletir-em-y').addEventListener('input', event => {
    preencherCampoDoFormularioTransformacoesGeometricas({ refletirEmY: event.target.checked })
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
  document.getElementById('confirmar-transformacao').addEventListener('click', () => {
    executarOperacaoEscolhidaEmFormulario(operacao, 'transformacoes-geometricas')
  })
  document.getElementById('confirmar-rotacao').addEventListener('click', () => {
    executarOperacaoEscolhidaEmFormulario(operacao, 'transformacoes-geometricas')
  })
  document.getElementById('confirmar-reflexao').addEventListener('click', () => {
    executarOperacaoEscolhidaEmFormulario(operacao, 'transformacoes-geometricas')
  })
  document.getElementById('confirmar-reta').addEventListener('click', () => {
    executarOperacaoEscolhidaEmFormulario(operacao, 'desenhar-reta')
  })
  document.getElementById('confirmar-circunferencia').addEventListener('click', () => {
    executarOperacaoEscolhidaEmFormulario(operacao, 'desenhar-circunferencia')
  })
  window.addEventListener('click', event => {
    if (!document.getElementById('canvas').contains(event.target)) removerDestaquesDasEstruturas()
  })
})

function carregarMalhaDePixels() {
  const canvas = document.getElementById('canvas')
  const matrizPixels = canvasController.matrizPixels
  canvas.innerHTML = ''
  for (let x = 0; x < matrizPixels.length; x++) {
    const coluna = gerarColunaEm(x)
    const colunaPreenchida = inserirPixelsEm(matrizPixels[x], coluna)
    canvas.appendChild(colunaPreenchida)
  }
}

function inserirPixelsEm(pixels, coluna) {
  for (let y = 0; y < pixels.length; y++) {
    const pixel = gerarPixel(pixels[y])
    coluna.appendChild(pixel)
  }

  return coluna
}

function gerarColunaEm(posicao) {
  const linha = document.createElement('div')
  linha.dataset.posicao = posicao
  linha.className = 'column'

  return linha
}

function gerarPixel(pixel) {
  const pixelGerado = document.createElement('div')
  pixelGerado.className = `pixel ${pixel.selecionado ? 'selected' : ''}`
  pixelGerado.dataset.x = pixel.x
  pixelGerado.dataset.y = pixel.y
  if (pixel.estrutura) {
    pixelGerado.classList.add('clickable')
    pixelGerado.dataset.estrutura = pixel.estrutura
    pixelGerado.dataset.idEstrutura = pixel.idEstrutura
    pixelGerado.addEventListener('mouseover', controlarDestaqueDaEstrutura)
    pixelGerado.addEventListener('mouseleave', controlarDestaqueDaEstrutura)
    pixelGerado.addEventListener('click', selecionarEstrutura)
  }

  return pixelGerado
}

function controlarDestaqueDaEstrutura(pixel) {
  if (!pixel.target.dataset.estrutura) return

  const estrutura = pixel.target.dataset.estrutura
  const idEstrutura = pixel.target.dataset.idEstrutura
  const pixelsDaEstrutura = document.querySelectorAll(`[data-estrutura="${estrutura}"][data-id-estrutura="${idEstrutura}"]`)
  Array.from(pixelsDaEstrutura).forEach(pixel => {
    if (idEstrutura === idEstruturaAtual && estrutura === estruturaAtual) return

    if (pixel.classList.contains('highlighted')) pixel.classList.remove('highlighted')
    else pixel.classList.add('highlighted')
  })
}

function selecionarEstrutura(pixel) {
  removerDestaquesDasEstruturas()
  destacarEstruturaDoPixel(pixel)
}

function removerDestaquesDasEstruturas() {
  estruturaAtual = ''
  idEstruturaAtual = ''
  const estruturas = document.getElementsByClassName('highlighted')
  Array.from(estruturas).forEach(pixel => pixel.classList.remove('highlighted'))
}

function destacarEstruturaDoPixel(pixel) {
  estruturaAtual = pixel.target.dataset.estrutura
  idEstruturaAtual = pixel.target.dataset.idEstrutura
  const pixelsDaEstrutura = document.querySelectorAll(`[data-estrutura="${estruturaAtual}"][data-id-estrutura="${idEstruturaAtual}"]`)
  Array.from(pixelsDaEstrutura).forEach(pixel => pixel.classList.add('highlighted'))
}

function fecharGuiaLateral(nomeGuia) {
  document.getElementById(nomeGuia).classList.add('navbar--closed')
}

function abrirGuiaLateral(nomeGuia) {
  document.getElementById(nomeGuia).classList.remove('navbar--closed')
}

function registrarOperacaoEscolhida(nomeOperacao) {
  operacao = nomeOperacao
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

function executarOperacaoEscolhidaEmFormulario(operacao, formulario) {
  const informacoes = formularioController.obterFormulario(formulario)
  canvasController.executarOperacaoPorMeioDasInformacoes(operacao, informacoes)
  carregarMalhaDePixels()
}