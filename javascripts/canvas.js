/**
 * Estrutura de dados responsável pela definição do 'canvas', 
 * elementos que o integram e características.
 */
export default class Canvas {
  comprimento
  altura
  pixels
  zoom

  /**
   * A variável 'zoom' pode ser ajustada para melhor
   * resolução do 'canvas'.
   */
  constructor() {
    this.comprimento = 31.25
    this.altura = 31.25
    this.pixels = []
    this.zoom = 0.05
  }
}