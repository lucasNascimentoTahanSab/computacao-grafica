export default class Pixel {
  estrutura
  idEstrutura
  selecionado
  comprimento
  altura
  x
  y

  constructor(pixel) {
    this.estrutura = pixel.estrutura ?? ''
    this.idEstrutura = pixel.idEstrutura ?? ''
    this.selecionado = pixel.selecionado ?? false
    this.comprimento = pixel.comprimento ?? 0
    this.altura = pixel.altura ?? 0
    this.x = pixel.x ?? 0
    this.y = pixel.y ?? 0
  }
}