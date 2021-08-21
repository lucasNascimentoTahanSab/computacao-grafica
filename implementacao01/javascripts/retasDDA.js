const _calcularDeltaY = (pixelInicial, pixelFinal) => (pixelFinal.y - pixelInicial.y)
const _calcularDeltaX = (pixelInicial, pixelFinal) => (pixelFinal.x - pixelInicial.x)

export function desenharReta(pixelInicial, pixelFinal) {
  const deltaY = _calcularDeltaY(pixelInicial, pixelFinal)
  const deltaX = _calcularDeltaX(pixelInicial, pixelFinal)
  const deltaYAbsoluto = Math.abs(deltaY)
  const deltaXAbsoluto = Math.abs(deltaX)
  const passos = deltaXAbsoluto > deltaYAbsoluto ? deltaXAbsoluto : deltaYAbsoluto
  const incrementoEmX = deltaX / passos
  const incrementoEmY = deltaY / passos
  let x = pixelInicial.x
  let y = pixelInicial.y
  for (let i = 1; i < passos; i++) {
    x += incrementoEmX
    y += incrementoEmY
    _desenharPixel(Math.round(x), Math.round(y))
  }
}

function _desenharPixel(x, y) {
  const pixel = document.querySelector(`[data-x='${x}'][data-y='${y}'`)
  pixel?.classList.add('selected')
}