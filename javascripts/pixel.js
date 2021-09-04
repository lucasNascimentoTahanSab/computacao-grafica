export default class Pixel {
  selecionado
  comprimento
  altura
  x
  y

  constructor(pixel) {
    this.selecionado = false
    this.comprimento = pixel.comprimento
    this.altura = pixel.altura
    this.x = pixel.x
    this.y = pixel.y
  }
}