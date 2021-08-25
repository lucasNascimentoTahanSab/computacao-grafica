export default class FormularioTransformacoesGeometricas {
  fatorTransformacaoEmX
  fatorTransformacaoEmY
  angulacaoDaRotacao

  constructor() {
    this.fatorTransformacaoEmX = ''
    this.fatorTransformacaoEmY = ''
    this.angulacaoDaRotacao = ''
  }

  /**
   * @param {Object} campos
   */
  set campos(campos) {
    this.fatorTransformacaoEmX = campos.fatorTransformacaoEmX ?? this.fatorTransformacaoEmX
    this.fatorTransformacaoEmY = campos.fatorTransformacaoEmY ?? this.fatorTransformacaoEmY
    this.angulacaoDaRotacao = campos.angulacaoDaRotacao ?? this.angulacaoDaRotacao
  }
}