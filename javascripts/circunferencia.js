/**
 * Estrutura de dados responsável pela definição da 'circunferencia', 
 * elementos que a integram e características.
 */
import Estrutura from './estrutura.js'

export default class Circunferencia extends Estrutura {
  pontoCentral
  raio

  constructor() {
    super()
    this.pontoCentral = null
    this.raio = 0
  }
}