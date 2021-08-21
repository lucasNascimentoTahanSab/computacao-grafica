import Pixel from "./pixel.js";

export default class PixelController {
  gerarMalhaDePixelsAPartirDoTemplate(template) {
    let pixels = []
    for (let x = 0; x < template.quantidadePixelsHorizontal; x++) {
      pixels[x] = []
      for (let y = 0; y < template.quantidadePixelsVertical; y++) {
        pixels[x][y] = new Pixel({
          comprimento: template.comprimentoPixel,
          altura: template.alturaPixel,
          x,
          y
        })
      }
    }

    return pixels
  }

  inserirPixelsEm(linha) {
    for (let y = 0; y < parseInt(linha.dataset.comprimento); y++) {
      const pixel = this._gerarPixelNasCoordenadas(parseInt(linha.dataset.posicao), y)
      pixel.addEventListener('click', this._selecionarPixel)
      linha.appendChild(pixel)
    }

    return linha
  }

  _gerarPixelNasCoordenadas(x, y) {
    const pixel = document.createElement('div')
    pixel.className = 'pixel'
    pixel.dataset.x = x
    pixel.dataset.y = y

    return pixel
  }

  _selecionarPixel(event) {
    const pixel = document.querySelector(`[data-x="${event.target.dataset.x}"][data-y="${event.target.dataset.y}"`)
    if (pixel.classList.contains('selected')) pixel.classList.remove('selected')
    else pixel.classList.add('selected')
  }
}