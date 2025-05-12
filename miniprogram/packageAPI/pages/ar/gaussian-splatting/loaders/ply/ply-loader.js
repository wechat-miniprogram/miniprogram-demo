import { wxDecodeAdapter, computeCov3D } from '../util-loader.js'

// implementation from https://github.com/kishimisu/Gaussian-Splatting-WebGL
export function loadPly(content, maxGaussians) {
  // Read header
  console.log('loadPly', content)
  const contentStart = wxDecodeAdapter(content.slice(0, 2000), true)
  // const contentStart = new TextDecoder('utf-8').decode(content.slice(0, 2000))
  const headerEnd = contentStart.indexOf('end_header') + 'end_header'.length + 1
  const [header] = contentStart.split('end_header')

  console.log('header', header)

  // Get number of gaussians
  const regex = /element vertex (\d+)/
  const match = header.match(regex)
  let gaussianCount = parseInt(match[1])

  console.log(`load splatCount: ${gaussianCount}`)

  gaussianCount = Math.min(gaussianCount, maxGaussians)

  // Create arrays for gaussian properties
  const positions = []
  const opacities = []
  const colors = []
  const cov3Ds = []

  // Helpers
  const sigmoid = (m1) => 1 / (1 + Math.exp(-m1))
  const NUM_PROPS = 62

  // Create a dataview to access the buffer's content on a byte levele
  const view = new DataView(content)

  // Get a slice of the dataview relative to a splat index
  const fromDataView = (splatID, start, end) => {
    const startOffset = headerEnd + splatID * NUM_PROPS * 4 + start * 4

    if (end == null) return view.getFloat32(startOffset, true)

    return new Float32Array(end - start).map((_, i) => view.getFloat32(startOffset + i * 4, true))
  }

  // Extract all properties for a gaussian splat using the dataview
  const extractSplatData = (splatID) => {
    const position = fromDataView(splatID, 0, 3)
    // const n = fromDataView(splatID, 3, 6) // Not used
    const harmonic = fromDataView(splatID, 6, 9)

    const H_END = 6 + 48 // Offset of the last harmonic coefficient
    const opacity = fromDataView(splatID, H_END)
    const scale = fromDataView(splatID, H_END + 1, H_END + 4)
    const rotation = fromDataView(splatID, H_END + 4, H_END + 8)

    return {
      position, harmonic, opacity, scale, rotation
    }
  }

  // gaussianCount = 10;

  for (let i = 0; i < gaussianCount; i++) {
    // Extract data for current gaussian
    let {
      position, harmonic, opacity, scale, rotation
    } = extractSplatData(i)

    // Normalize quaternion
    let length2 = 0

    for (let j = 0; j < 4; j++) length2 += rotation[j] * rotation[j]

    const length = Math.sqrt(length2)

    // console.log('scale', scale[0], scale[1], scale[2]);
    // console.log('rotation', rotation[0], rotation[1], rotation[2], rotation[3]);

    rotation = rotation.map(v => v / length)

    // Exponentiate scale
    scale = scale.map(v => Math.exp(v))

    // console.log('scalee', scale[0], scale[1], scale[2]);
    // console.log('rotatione', rotation[0], rotation[1], rotation[2], rotation[3]);

    // Activate alpha
    opacity = sigmoid(opacity)
    opacities.push(opacity)

    // (Webgl-specific) Equivalent to computeColorFromSH() with degree 0:
    // Use the first spherical harmonic to pre-compute the color.
    // This allow to avoid sending harmonics to the web worker or GPU,
    // but removes view-dependent lighting effects like reflections.
    // If we were to use a degree > 0, we would need to recompute the color
    // each time the camera moves, and send many more harmonics to the worker:
    // Degree 1: 4 harmonics needed (12 floats) per gaussian
    // Degree 2: 9 harmonics needed (27 floats) per gaussian
    // Degree 3: 16 harmonics needed (48 floats) per gaussian
    const SH_C0 = 0.28209479177387814
    const color = [
      0.5 + SH_C0 * harmonic[0],
      0.5 + SH_C0 * harmonic[1],
      0.5 + SH_C0 * harmonic[2]
    ]
    colors.push(...color)
    // harmonics.push(...harmonic)

    // (Webgl-specific) Pre-compute the 3D covariance matrix from
    // the rotation and scale in order to avoid recomputing it at each frame.
    // This also allow to avoid sending rotations and scales to the web worker or GPU.
    const cov3D = computeCov3D(scale, 1, rotation)
    cov3Ds.push(...cov3D)
    // rotations.push(...rotation)
    // scales.push(...scale)

    positions.push(...position)
  }

  return {
    positions, opacities, colors, cov3Ds, count: gaussianCount
  }
}
