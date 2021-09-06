/**
 * Módulo responsável pelas comunicações diretas com o DOM a
 * partir da manipulação das estruturas de dados calculadas por
 * 'canvasController' e 'formularioController'.
 */
import CanvasController from './canvasController.js';
import FormularioController from './formularioController.js';

const canvasController = new CanvasController
const formularioController = new FormularioController

let operacao = ''
let estruturaAtual = ''
let idEstruturaAtual = ''
let emTelaDeRecorte = false
let xInicialRecorte = 0
let xFinalRecorte = 0
let yInicialRecorte = 0
let yFinalRecorte = 0

/**
 * Definição de 'listeners' sobre elementos do DOM para
 * possibilitar interação do usuário com a plataforma.
 */
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
  document.getElementById('recortes').addEventListener('click', () => {
    fecharGuiaLateral('home')
    abrirGuiaLateral('recortes-opcoes')
    registrarOperacaoEscolhida('recortes')
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
  document.getElementById('cohen-sutherland').addEventListener('click', () => {
    alterarCursorParaSelecionarRecorte()
    registrarOperacaoEscolhida('cohen-sutherland')
    emTelaDeRecorte = true
  })
  document.getElementById('liang-barsky').addEventListener('click', () => {
    alterarCursorParaSelecionarRecorte()
    registrarOperacaoEscolhida('liang-barsky')
    emTelaDeRecorte = true
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
  document.getElementById('recortes-opcoes-para-home').addEventListener('click', () => {
    fecharGuiaLateral('recortes-opcoes')
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
  document.getElementById('main-page').addEventListener('click', event => {
    if (!emTelaDeRecorte && !document.getElementById('canvas').contains(event.target))
      removerDestaquesDasEstruturas()
  })
  document.getElementById('canvas').addEventListener('mousedown', event => {
    if (emTelaDeRecorte) {
      esconderApresentarAreaSelecionada()
      xInicialRecorte = event.clientX;
      yInicialRecorte = event.clientY;
      definirAreaSelecionada()
    }
  })
  window.addEventListener('mousemove', event => {
    if (emTelaDeRecorte) {
      xFinalRecorte = event.clientX;
      yFinalRecorte = event.clientY;
      definirAreaSelecionada();
    }
  })
  document.getElementById('canvas').addEventListener('mouseup', () => {
    if (emTelaDeRecorte) {
      esconderApresentarAreaSelecionada()
      alterarCursorParaSelecionarRecorte()
      obterLimitesRecorteAPartirDaSelecao()
      executarOperacaoEscolhidaEmFormulario(operacao, 'recortes')
      emTelaDeRecorte = false
    }
  })
})

/**
 * Método responsável pelo carregamento da malha de
 * pixels na estrutura 'canvas', no DOM, para apresentação
 * das estruturas de dados e sua manipulação.
 */
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

/**
 * Método responsável pela geração de pixels no DOM
 * a partir das estruturas de pixels geradas pela
 * instância de 'canvasController'. Os pixels são
 * interpretados, instanciados e inseridos em
 * colunas.
 */
function inserirPixelsEm(pixels, coluna) {
  for (let y = 0; y < pixels.length; y++) {
    const pixel = gerarPixel(pixels[y])
    coluna.appendChild(pixel)
  }

  return coluna
}

/**
 * Método responsável pela geração das colunas
 * na malha de pixels do 'canvas'.
 */
function gerarColunaEm(posicao) {
  const linha = document.createElement('div')
  linha.dataset.posicao = posicao
  linha.className = 'column'

  return linha
}

/**
 * Método responsável pela geração de uma representação
 * gráfico dos pixels no canvas a partir da estrutura calculada.
 * Possibilita estilização e agrupamento da estrutura de forma
 * diferenciada de acordo com definições estruturais, como visibilidade,
 * destaque e estrutura à qual pertence, por exemplo.
 */
function gerarPixel(pixel) {
  const pixelGerado = document.createElement('div')
  pixelGerado.className = `pixel ${pixel.selecionado && pixel.visivel ? 'selected' : ''}`
  pixelGerado.dataset.x = pixel.x
  pixelGerado.dataset.y = pixel.y
  if (pixel.estrutura) {
    if (pixel.estrutura === estruturaAtual && pixel.idEstrutura === idEstruturaAtual) pixelGerado.classList.add('highlighted')
    pixelGerado.classList.add('clickable')
    pixelGerado.dataset.estrutura = pixel.estrutura
    pixelGerado.dataset.idEstrutura = pixel.idEstrutura
    pixelGerado.addEventListener('mouseover', controlarDestaqueDaEstrutura)
    pixelGerado.addEventListener('mouseleave', controlarDestaqueDaEstrutura)
    pixelGerado.addEventListener('click', selecionarEstrutura)
  }

  return pixelGerado
}

/**
 * Método responsável por destacar ou remover destaque 
 * de pixels de estrutura no DOM de acordo com movimento
 * do mouse.
 */
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

/**
 * Método responsável pela seleção da estrutura à qual o
 * pixel passado pertence. Apenas uma estrutura pode ser
 * selecionada por vez e é necessário que exista uma estrutura
 * selecionada para que as transformações possam ser realizadas.
 */
function selecionarEstrutura(pixel) {
  removerDestaquesDasEstruturas()
  destacarEstruturaDoPixel(pixel)
}

/**
 * Método responsável pelo remoção de destaque de
 * todas as estruturas cadastradas.
 */
function removerDestaquesDasEstruturas() {
  estruturaAtual = ''
  idEstruturaAtual = ''
  const estruturas = document.getElementsByClassName('highlighted')
  Array.from(estruturas).forEach(pixel => pixel.classList.remove('highlighted'))
}

/**
 * Método responsável pelo destaque da estrutura
 * à qual o pixel selecionado pertence.
 */
function destacarEstruturaDoPixel(pixel) {
  estruturaAtual = pixel.target.dataset.estrutura
  idEstruturaAtual = pixel.target.dataset.idEstrutura
  const pixelsDaEstrutura = document.querySelectorAll(`[data-estrutura="${estruturaAtual}"][data-id-estrutura="${idEstruturaAtual}"]`)
  Array.from(pixelsDaEstrutura).forEach(pixel => pixel.classList.add('highlighted'))
}

/**
 * Método responsável por esconder ou apresentar
 * área de seleção para operações de recorte.
 */
function esconderApresentarAreaSelecionada() {
  const areaSelecionada = document.getElementById('region-selected')
  if (areaSelecionada.classList.contains('hidden')) areaSelecionada.classList.remove('hidden')
  else areaSelecionada.classList.add('hidden')
}

/**
 * Método responsável pela definição da área selecionada
 * para operações de recorte a partir de pontos demarcados
 * pelo mouse.
 */
function definirAreaSelecionada() {
  const areaSelecionada = document.getElementById('region-selected')
  const xMinimoRecorte = Math.min(xInicialRecorte, xFinalRecorte);
  const xMaximoRecorte = Math.max(xInicialRecorte, xFinalRecorte);
  const yMinimoRecorte = Math.min(yInicialRecorte, yFinalRecorte);
  const yMaximoRecorte = Math.max(yInicialRecorte, yFinalRecorte);
  areaSelecionada.style.left = xMinimoRecorte + 'px';
  areaSelecionada.style.top = yMinimoRecorte + 'px';
  areaSelecionada.style.width = xMaximoRecorte - xMinimoRecorte + 'px';
  areaSelecionada.style.height = yMaximoRecorte - yMinimoRecorte + 'px';
}

/**
 * Método responsável pela obtenção dos pontos final e
 * inicial da região selecionada para recorte e cadastro
 * destas informações no formulário de recortes.
 */
function obterLimitesRecorteAPartirDaSelecao() {
  const areaSelecionada = document.getElementById('region-selected')
  const coordenadaXInicial = parseInt(areaSelecionada.style.left.replace('px'))
  const coordenadaYInicial = parseInt(areaSelecionada.style.top.replace('px'))
  const coordenadaXFinal = coordenadaXInicial + parseInt(areaSelecionada.style.width.replace('px'))
  const coordenadaYFinal = coordenadaYInicial + parseInt(areaSelecionada.style.height.replace('px'))
  const limiteSuperior = document.elementFromPoint(coordenadaXInicial, coordenadaYInicial)
  const limiteInferior = document.elementFromPoint(coordenadaXFinal, coordenadaYFinal)

  preencherCampoDoFormularioRecortes({
    coordenadaXInicial: limiteSuperior.dataset.x,
    coordenadaYInicial: limiteSuperior.dataset.y,
    coordenadaXFinal: limiteInferior.dataset.x,
    coordenadaYFinal: limiteInferior.dataset.y
  })
}

/**
 * Método responsável pela estilização do ponteiro do
 * mouse quando em modo de recorte.
 */
function alterarCursorParaSelecionarRecorte() {
  const container = document.getElementById('container')
  if (container.classList.contains('cursor-select')) container.classList.remove('cursor-select')
  else container.classList.add('cursor-select')
}

/**
 * Método responsável pelo fechamento da guia
 * selecionada.
 */
function fecharGuiaLateral(nomeGuia) {
  document.getElementById(nomeGuia).classList.add('navbar--closed')
}

/**
 * Método responsável pela abertura da guia
 * selecionada.
 */
function abrirGuiaLateral(nomeGuia) {
  document.getElementById(nomeGuia).classList.remove('navbar--closed')
}

/**
 * Método responsável pelo registro da última 
 * operação escolhida. 
 */
function registrarOperacaoEscolhida(nomeOperacao) {
  operacao = nomeOperacao
}

/**
 * Método responsável pelo preenchimento dos formulários
 * de transformações geométricas.
 */
function preencherCampoDoFormularioTransformacoesGeometricas(campo) {
  formularioController.preencherCamposDoFormulario('transformacoes-geometricas', campo)
}

/**
 * Método responsável pelo preenchimento dos formulários
 * de desenho de retas.
 */
function preencherCampoDoFormularioDesenharReta(campo) {
  formularioController.preencherCamposDoFormulario('desenhar-reta', campo)
}

/**
 * Método responsável pelo preenchimento do formulário
 * de desenho de circunferência.
 */
function preencherCampoDoFormularioDesenharCircunferencia(campo) {
  formularioController.preencherCamposDoFormulario('desenhar-circunferencia', campo)
}

/**
 * Método responsável pelo preenchimento do formulário
 * de recortes. O formulário de recortes não possui representação
 * visual, uma vez que é preenchido a partir da seleção do mouse
 * no 'canvas'.
 */
function preencherCampoDoFormularioRecortes(campo) {
  formularioController.preencherCamposDoFormulario('recortes', campo)
}

/**
 * Método responsável pela execução da operação escolhida
 * na 'canvasController' a partir do formulário preenchido.
 * Após execução da operação, a malha de pixels é recarregada.
 */
function executarOperacaoEscolhidaEmFormulario(operacao, formulario) {
  const informacoes = obterInformacoesParaOperacao(formulario)
  canvasController.executarOperacaoPorMeioDasInformacoes(operacao, informacoes)
  carregarMalhaDePixels()
}

/**
 * Método responsável pela obtenção do formulário correspondente
 * ao pedido por meio da 'formularioController'. É necessário que,
 * para execução de transformações geométricas uma estrutura tenha
 * sido previamente escolhida.
 */
function obterInformacoesParaOperacao(formulario) {
  if (formulario !== 'transformacoes-geometricas') return formularioController.obterFormulario(formulario)
  if (!estruturaAtual || !idEstruturaAtual) return {}

  return { ...formularioController.obterFormulario(formulario), estruturaAtual, idEstruturaAtual }
}