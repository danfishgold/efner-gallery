export async function ditherImageOnCanvas(
  file: File,
  canvas: HTMLCanvasElement,
): Promise<ImageData> {
  const ctx = canvas.getContext('2d')!
  const image = await loadImage(file)
  const offsetX = Math.floor(canvas.width - image.width) / 2
  const offsetY = Math.floor(canvas.height - image.height) / 2
  ctx.drawImage(image, offsetX, offsetY)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  dither(imageData, 'luminance')
  ctx.putImageData(imageData, 0, 0)
  return imageData
}

async function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.src = URL.createObjectURL(file)
  })
}

function dither(
  image: ImageData,
  grayscaleMethod: 'luminance' | 'average' | null,
) {
  if (grayscaleMethod === 'luminance') {
    greyscaleLuminance(image)
  } else if (grayscaleMethod === 'average') {
    greyscaleAverage(image)
  }

  ditherAtkinson(image, image.width, !grayscaleMethod)

  return image
}

// Convert image data to greyscale based on luminance.
function greyscaleLuminance(image: ImageData) {
  for (let i = 0; i <= image.data.length; i += 4) {
    image.data[i] =
      image.data[i + 1] =
      image.data[i + 2] =
        image.data[i] * 0.21 +
        image.data[i + 1] * 0.71 +
        image.data[i + 2] * 0.07
  }

  return image
}

// Convert image data to greyscale based on average of R, G and B values.
function greyscaleAverage(image: ImageData) {
  for (let i = 0; i <= image.data.length; i += 4) {
    image.data[i] =
      image.data[i + 1] =
      image.data[i + 2] =
        (image.data[i] + image.data[i + 1] + image.data[i + 2]) / 3
  }

  return image
}

// Apply Atkinson Dither to Image Data
function ditherAtkinson(
  image: ImageData,
  imageWidth: number,
  drawColour: boolean,
) {
  let skipPixels = 4

  if (drawColour) {
    skipPixels = 1
  }

  const imageLength = image.data.length

  for (
    let currentPixel = 0;
    currentPixel <= imageLength;
    currentPixel += skipPixels
  ) {
    const newPixelColour = image.data[currentPixel] <= 128 ? 0 : 255

    const err = (image.data[currentPixel] - newPixelColour) / 8
    image.data[currentPixel] = newPixelColour

    image.data[currentPixel + 4] += err
    image.data[currentPixel + 8] += err
    image.data[currentPixel + 4 * imageWidth - 4] += err
    image.data[currentPixel + 4 * imageWidth] += err
    image.data[currentPixel + 4 * imageWidth + 4] += err
    image.data[currentPixel + 8 * imageWidth] += err

    if (!drawColour)
      image.data[currentPixel + 1] = image.data[currentPixel + 2] =
        image.data[currentPixel]
  }

  return image.data
}
