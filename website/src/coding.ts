export function encodeImageData(imageData: ImageData) {
  const byteCount = Math.ceil(imageData.data.length / 8 / 4)
  const bytes = new Uint8Array(byteCount)
  for (let byteIndex = 0; byteIndex < byteCount; byteIndex += 1) {
    const bits = Array.from(
      imageData.data
        .slice(byteIndex * 8 * 4, (byteIndex + 1) * 8 * 4)
        .filter((_, pixelIndex) => pixelIndex % 4 === 0),
    )
    const byte = parseInt(
      bits.map((pixel) => (pixel === 0 ? '0' : '1')).join(''),
      2,
    )
    bytes[byteIndex] = byte
  }

  const string = Array.from(bytes)
    .map((byte) => String.fromCharCode(byte))
    .join('')
  const base64 = window.btoa(string)
  return base64
}

export function decodeImageData(
  base64String: string,
  width: number,
  height: number,
) {
  const stringBits = Array.from(window.atob(base64String))
    .slice(0, (width * height) / 8)
    .map((byteChar) => leftPad(byteChar.charCodeAt(0).toString(2), '0', 8))
    .join('')
  const colors = Array.from(stringBits).map((stringBit) =>
    stringBit === '0' ? 0 : 255,
  )
  const imageData = new ImageData(
    new Uint8ClampedArray(
      colors.flatMap((color) => [color, color, color, 255]),
    ),
    width,
  )
  console.log({
    stringBits,
    colors,
    collen: colors.length,
    bitleng: stringBits.length,
  })
  return imageData
}

function leftPad(str: string, char: string, upToLength: number): string {
  if (str.length >= upToLength) {
    return str
  } else {
    return new Array(upToLength - str.length).fill(char).join('') + str
  }
}
