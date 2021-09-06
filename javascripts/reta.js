/**
 * Estrutura de dados responsável pela definição da 'reta', 
 * elementos que a integram e características.
 */
import Estrutura from './estrutura.js'

export default class Reta extends Estrutura {
  pontoInicial
  pontoFinal

  constructor() {
    super()
    this.pontoInicial = null
    this.pontoFinal = null
  }
}