import Estrutura from "./estrutura.js"

export default class Reta extends Estrutura {
  pontoInicial
  pontoFinal

  constructor(pontoInicial, pontoFinal) {
    super()
    this.pontoInicial = pontoInicial
    this.pontoFinal = pontoFinal
  }
}