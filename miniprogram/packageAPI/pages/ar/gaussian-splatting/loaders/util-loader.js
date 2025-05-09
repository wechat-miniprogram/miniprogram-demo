import * as glMatrix from '../util/gl-matrix-min'

const { mat3 } = glMatrix
const tmp = mat3.create()
const S = mat3.create()
const R = mat3.create()
const M = mat3.create()
const Sigma = mat3.create()

function computeCov3D(scale, mod, rot) {
  // Create scaling matrix
  mat3.set(
    S,
    mod * scale[0],
    0,
    0,
    0,
    mod * scale[1],
    0,
    0,
    0,
    mod * scale[2]
  )

  const r = rot[0]
  const x = rot[1]
  const y = rot[2]
  const z = rot[3]

  // Compute rotation matrix from quaternion
  mat3.set(
    R,
    1.0 - 2.0 * (y * y + z * z),
    2.0 * (x * y - r * z),
    2.0 * (x * z + r * y),
    2.0 * (x * y + r * z),
    1.0 - 2.0 * (x * x + z * z),
    2.0 * (y * z - r * x),
    2.0 * (x * z - r * y),
    2.0 * (y * z + r * x),
    1.0 - 2.0 * (x * x + y * y)
  )

  mat3.multiply(M, S, R) // M = S * R

  // Compute 3D world covariance matrix Sigma
  mat3.multiply(Sigma, mat3.transpose(tmp, M), M) // Sigma = transpose(M) * M

  // Covariance is symmetric, only store upper right
  const cov3D = [
    Sigma[0], Sigma[1], Sigma[2],
    Sigma[4], Sigma[5], Sigma[8]
  ]
  return cov3D
}

function wxDecodeAdapter(buffer, isUTF8) {
  const array = new Uint8Array(buffer)
  let str = ''

  for (let i = 0; i < array.length; i++) {
    str += String.fromCharCode(array[i])
  }

  if (isUTF8) {
    // utf8 str fix
    // https://developer.mozilla.org/zh-CN/docs/Web/API/WindowBase64/btoa
    str = decodeURIComponent(encodeURIComponent(str))
  }

  return str
}

export {
  wxDecodeAdapter,
  computeCov3D
}
