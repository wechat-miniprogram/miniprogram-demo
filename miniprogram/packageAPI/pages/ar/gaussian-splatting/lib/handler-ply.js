// global
let gaussianCount;
let sceneMin, sceneMax;

// Converts scale and rotation properties of each
// Gaussian to a 3D covariance matrix in world space.
// Original CUDA implementation: https://github.com/graphdeco-inria/diff-gaussian-rasterization/blob/main/cuda_rasterizer/forward.cu#L118
const Mat3 = function() {}
Mat3.prototype.create = function(){
    let out = new Float32Array(9);
    out[0] = 1;
    out[4] = 1;
    out[8] = 1;
    return out;
}
Mat3.prototype.set = function(out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m10;
    out[4] = m11;
    out[5] = m12;
    out[6] = m20;
    out[7] = m21;
    out[8] = m22;
    return out;
}
Mat3.prototype.multiply = function(out, a, b) {
    let a00 = a[0],
      a01 = a[1],
      a02 = a[2];
    let a10 = a[3],
      a11 = a[4],
      a12 = a[5];
    let a20 = a[6],
      a21 = a[7],
      a22 = a[8];
  
    let b00 = b[0],
      b01 = b[1],
      b02 = b[2];
    let b10 = b[3],
      b11 = b[4],
      b12 = b[5];
    let b20 = b[6],
      b21 = b[7],
      b22 = b[8];
  
    out[0] = b00 * a00 + b01 * a10 + b02 * a20;
    out[1] = b00 * a01 + b01 * a11 + b02 * a21;
    out[2] = b00 * a02 + b01 * a12 + b02 * a22;
  
    out[3] = b10 * a00 + b11 * a10 + b12 * a20;
    out[4] = b10 * a01 + b11 * a11 + b12 * a21;
    out[5] = b10 * a02 + b11 * a12 + b12 * a22;
  
    out[6] = b20 * a00 + b21 * a10 + b22 * a20;
    out[7] = b20 * a01 + b21 * a11 + b22 * a21;
    out[8] = b20 * a02 + b21 * a12 + b22 * a22;
    return out;
}
Mat3.prototype.transpose = function(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
      let a01 = a[1],
        a02 = a[2],
        a12 = a[5];
      out[1] = a[3];
      out[2] = a[6];
      out[3] = a01;
      out[5] = a[7];
      out[6] = a02;
      out[7] = a12;
    } else {
      out[0] = a[0];
      out[1] = a[3];
      out[2] = a[6];
      out[3] = a[1];
      out[4] = a[4];
      out[5] = a[7];
      out[6] = a[2];
      out[7] = a[5];
      out[8] = a[8];
    }
  
    return out;
}
const mat3 = new Mat3();
const tmp = mat3.create()
const S = mat3.create()
const R = mat3.create()
const M = mat3.create()
const Sigma = mat3.create()
function computeCov3D(scale, mod, rot) {
    // Create scaling matrix
    mat3.set(S,
        mod * scale[0], 0, 0,
        0, mod * scale[1], 0,
        0, 0, mod * scale[2]
    )

    const r = rot[0]
    const x = rot[1]
    const y = rot[2]
    const z = rot[3]

    // Compute rotation matrix from quaternion
    mat3.set(R,
        1. - 2. * (y * y + z * z), 2. * (x * y - r * z), 2. * (x * z + r * y),
        2. * (x * y + r * z), 1. - 2. * (x * x + z * z), 2. * (y * z - r * x),
        2. * (x * z - r * y), 2. * (y * z + r * x), 1. - 2. * (x * x + y * y)
    )

    mat3.multiply(M, S, R)  // M = S * R

    // Compute 3D world covariance matrix Sigma
    mat3.multiply(Sigma, mat3.transpose(tmp, M), M)  // Sigma = transpose(M) * M

    // Covariance is symmetric, only store upper right
    const cov3D = [
        Sigma[0], Sigma[1], Sigma[2],
        Sigma[4], Sigma[5], Sigma[8]
    ]

    return cov3D
}

// implementation from https://github.com/kishimisu/Gaussian-Splatting-WebGL
export function loadPly(content) {
    // Read header
    const start = performance.now()
    const contentStart = new TextDecoder('utf-8').decode(content.slice(0, 2000))
    const headerEnd = contentStart.indexOf('end_header') + 'end_header'.length + 1
    const [ header ] = contentStart.split('end_header')

    // Get number of gaussians
    const regex = /element vertex (\d+)/
    const match = header.match(regex)
    gaussianCount = parseInt(match[1])

    console.log('gaussianCount', gaussianCount)

    // Create arrays for gaussian properties
    const positions = []
    const opacities = []
    const rotations = []
    const scales = []
    const harmonics = []
    const colors = []
    const cov3Ds = []

    // Scene bouding box
    sceneMin = new Array(3).fill(Infinity)
    sceneMax = new Array(3).fill(-Infinity)

    // Helpers
    const sigmoid = (m1) => 1 / (1 + Math.exp(-m1))
    const NUM_PROPS = 62

    // Create a dataview to access the buffer's content on a byte levele
    const view = new DataView(content)

     // Get a slice of the dataview relative to a splat index
     const fromDataView = (splatID, start, end) => {
        const startOffset = headerEnd + splatID * NUM_PROPS * 4 + start * 4

        if (end == null) 
            return view.getFloat32(startOffset, true)

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
    
        return { position, harmonic, opacity, scale, rotation }
    }


    for (let i = 0; i < gaussianCount; i++) {
        // Extract data for current gaussian
        let { position, harmonic, opacity, scale, rotation } = extractSplatData(i)
        
        // Update scene bounding box
        sceneMin = sceneMin.map((v, j) => Math.min(v, position[j]))
        sceneMax = sceneMax.map((v, j) => Math.max(v, position[j]))

        // Normalize quaternion
        let length2 = 0

        for (let j = 0; j < 4; j++)
            length2 += rotation[j] * rotation[j]

        const length = Math.sqrt(length2)

        rotation = rotation.map(v => v / length)  

        // Exponentiate scale
        scale = scale.map(v => Math.exp(v))

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

    console.log(`Loaded ${gaussianCount} gaussians in ${((performance.now() - start)/1000).toFixed(3)}s`)
    
    return { positions, opacities, colors, cov3Ds }
}