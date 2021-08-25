export default class FormularioDesenharCircunferencia {
  coordenadaXCentral
  coordenadaYCentral
  raio

  constructor() {
    this.coordenadaXCentral = ''
    this.coordenadaYCentral = ''
    this.raio = ''
  }

  /**
   * @param {Object} campos
   */
  set campos(campos) {
    this.coordenadaXCentral = campos.coordenadaXCentral ?? this.coordenadaXCentral
    this.coordenadaYCentral = campos.coordenadaYCentral ?? this.coordenadaYCentral
    this.raio = campos.raio ?? this.raio
  }
}