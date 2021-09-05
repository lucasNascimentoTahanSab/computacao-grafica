export default class Pixel {
  visivel
  estrutura
  idEstrutura
  selecionado
  comprimento
  altura
  x
  y

  constructor(pixel) {
    this.visivel = pixel.visivel ?? true
    this.estrutura = pixel.estrutura ?? ''
    this.idEstrutura = pixel.idEstrutura ?? ''
    this.selecionado = pixel.selecionado ?? false
    this.comprimento = pixel.comprimento ?? 0
    this.altura = pixel.altura ?? 0
    this.x = pixel.x ?? 0
    this.y = pixel.y ?? 0
  }

  /**
   * @param {{ estrutura: String; idEstrutura: String; selecionado: Boolean; comprimento: Number; altura: Number; x: Number; y: Number; }} campos
   */
  set campos(campos) {
    this.visivel = campos.visivel ?? this.visivel
    this.estrutura = campos.estrutura ?? this.estrutura
    this.idEstrutura = campos.idEstrutura ?? this.idEstrutura
    this.selecionado = campos.selecionado ?? this.selecionado
    this.comprimento = campos.comprimento ?? this.comprimento
    this.altura = campos.altura ?? this.altura
    this.x = campos.x ?? this.x
    this.y = campos.y ?? this.y
  }
}