export default class Pixel {
  estrutura
  idEstrutura
  selecionado
  comprimento
  altura
  x
  y

  constructor(pixel) {
    this.estrutura = ''
    this.idEstrutura = ''
    this.selecionado = false
    this.comprimento = pixel.comprimento
    this.altura = pixel.altura
    this.x = pixel.x
    this.y = pixel.y
  }
}