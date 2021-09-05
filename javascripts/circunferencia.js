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