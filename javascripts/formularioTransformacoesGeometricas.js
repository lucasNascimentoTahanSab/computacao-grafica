export default class FormularioTransformacoesGeometricas {
  fatorTransformacaoEmX
  fatorTransformacaoEmY
  angulacaoDaRotacao
  refletirEmX
  refletirEmY

  constructor() {
    this.fatorTransformacaoEmX = ''
    this.fatorTransformacaoEmY = ''
    this.angulacaoDaRotacao = ''
    this.refletirEmX = false
    this.refletirEmY = false
  }

  /**
   * @param {Object} campos
   */
  set campos(campos) {
    this.fatorTransformacaoEmX = campos.fatorTransformacaoEmX ?? this.fatorTransformacaoEmX
    this.fatorTransformacaoEmY = campos.fatorTransformacaoEmY ?? this.fatorTransformacaoEmY
    this.angulacaoDaRotacao = campos.angulacaoDaRotacao ?? this.angulacaoDaRotacao
    this.refletirEmX = campos.refletirEmX ?? this.refletirEmX
    this.refletirEmY = campos.refletirEmY ?? this.refletirEmY
  }
}