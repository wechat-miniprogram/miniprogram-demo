import { wxDecodeAdapter, computeCov3D } from '../util-loader.js'

const RowSizeBytes = 32
const CenterSizeBytes = 12
const ScaleSizeBytes = 12
const RotationSizeBytes = 4
const ColorSizeBytes = 4

const perPI = Math.PI / 180

export function loadSplat(content, maxGaussians) {
  console.log('loadSplat', content)

  const start = new Date().getTime()

  // Create arrays for gaussian properties
  const positions = []
  const opacities = []
  const colors = []
  const cov3Ds = []

  const inBuffer = content

  let splatCount = inBuffer.byteLength / RowSizeBytes
  console.log(`load splatCount: ${splatCount}`)

  splatCount = Math.min(splatCount, maxGaussians)

  // splatCount = 10;

  for (let i = 0; i < splatCount; i++) {
    // Standard .splat row layout:
    // XYZ - Position (Float32)
    // XYZ - Scale (Float32)
    // RGBA - colors (uint8)
    // IJKL - quaternion/rot (uint8)
    const inBase = i * RowSizeBytes

    const inCenter = new Float32Array(inBuffer, inBase, 3)
    const inScale = new Float32Array(inBuffer, inBase + CenterSizeBytes, 3)
    const inColor = new Uint8Array(inBuffer, inBase + CenterSizeBytes + ScaleSizeBytes, 4)
    const inRotation = new Uint8Array(inBuffer, inBase + CenterSizeBytes +
                                      ScaleSizeBytes + ColorSizeBytes, 4)

    let rotation = [(inRotation[0] - 128) / 128, (inRotation[1] - 128) / 128, (inRotation[2] - 128) / 128, (inRotation[3] - 128) / 128]

    // Normalize quaternion
    let length2 = 0
    for (let j = 0; j < 4; j++) length2 += rotation[j] * rotation[j]
    const length = Math.sqrt(length2)
    rotation = rotation.map(v => v / length)

    // console.log('scale', inScale[0], inScale[1], inScale[2]);
    // console.log('rotation', rotation[0], rotation[1], rotation[2], rotation[3]);

    // Activate alpha
    const opacity = inColor[3] / 255

    opacities.push(opacity)
    colors.push(inColor[0] / 255, inColor[1] / 255, inColor[2] / 255)

    const cov3D = computeCov3D(inScale, 1, rotation)
    cov3Ds.push(...cov3D)

    positions.push(...inCenter)
  }

  const end = new Date().getTime()

  const sortTime = `${((end - start) / 1000).toFixed(3)}s`
  console.log(`parse ${splatCount} gaussians in ${sortTime}.`)

  return {
    positions, opacities, colors, cov3Ds, count: splatCount
  }
}
