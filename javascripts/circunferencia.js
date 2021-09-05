import Estrutura from './estrutura.js'

export default class Circunferencia extends Estrutura {
  pontoCentral
  raio

  constructor(pontoCentral, raio) {
    super()
    this.pontoCentral = pontoCentral
    this.raio = raio
  }
}