import Pixel from './pixel.js'
import { desenharRetaComAlgoritmoDDA } from './algoritmos.js'

export default class PixelController {
  _pixelFinal
  _pixelInicial

  selecionarPixel(pixel) {
    if (this._pixelInicial) this._pixelFinal = pixel
    else this._pixelInicial = pixel
  }

  desenharRetaComAlgoritmoDDA() {
    desenharRetaComAlgoritmoDDA(this._pixelFinal, this._pixelInicial);
  }
}