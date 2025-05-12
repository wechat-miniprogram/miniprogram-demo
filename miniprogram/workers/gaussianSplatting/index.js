const data = {}
let gaussians
let depthIndex

const sortingAlgorithm = 'count sort'

let loopTime = 0

function init(plyInfo, config) {
  console.log('[Worker] gaussianSplatting init')

  // console.log('plyInfo', plyInfo);
  gaussians = plyInfo
  gaussians.totalCount = plyInfo.count
  gaussians.count = gaussians.totalCount

  depthIndex = new Uint32Array(gaussians.count)

  console.log(`[Worker] Received ${gaussians.count} gaussians`)

  data.positions = new Float32Array(gaussians.count * 3)
  data.opacities = new Float32Array(gaussians.count)
  data.cov3Da = new Float32Array(gaussians.count * 3)
  data.cov3Db = new Float32Array(gaussians.count * 3)
  data.colors = new Float32Array(gaussians.count * 3)

  // data.positions = new Float32Array(config.sabPositions.buffer);
  // data.opacities = new Float32Array(config.sabOpacities.buffer);
  // data.cov3Da = new Float32Array(config.sabCov3Da.buffer);
  // data.cov3Db = new Float32Array(config.sabCov3Db.buffer);
  // data.colors = new Float32Array(config.sabcolors.buffer);

  // console.log(`[Worker] init data positions`, data.positions)
  // console.log(`[Worker] init data opacities`, data.opacities)
  // console.log(`[Worker] init data cov3Da`,data.cov3Da)
  // console.log(`[Worker] init data cov3Db`, data.cov3Db)
  // console.log(`[Worker] init data colors`, data.colors)
}

function sort(params) {
  // console.log('[worker] gaussianSplatting sort');

  loopTime++

  const { viewProjectionMatrix } = params

  const start = new Date().getTime()

  // console.log('viewProjectionMatrix', viewProjectionMatrix)
  // console.log('viewProjectionMatrix 2 6 10', viewProjectionMatrix[2], viewProjectionMatrix[6], viewProjectionMatrix[10])
  // console.log('viewProjectionMatrix 8 9 10', viewProjectionMatrix[8], viewProjectionMatrix[9], viewProjectionMatrix[10])

  // Sort the gaussians!
  sortGaussiansByDepth(depthIndex, gaussians, viewProjectionMatrix)

  const sortEnd = new Date().getTime()

  const sortTime = `${((sortEnd - start) / 1000).toFixed(3)}s`

  // Update arrays containing the data
  for (let j = 0; j < gaussians.count; j++) {
    const i = depthIndex[j]

    data.colors[j * 3] = gaussians.colors[i * 3]
    data.colors[j * 3 + 1] = gaussians.colors[i * 3 + 1]
    data.colors[j * 3 + 2] = gaussians.colors[i * 3 + 2]

    data.positions[j * 3] = gaussians.positions[i * 3]
    data.positions[j * 3 + 1] = gaussians.positions[i * 3 + 1]
    data.positions[j * 3 + 2] = gaussians.positions[i * 3 + 2]

    data.opacities[j] = gaussians.opacities[i]

    // Split the covariance matrix into two vec3
    // so they can be used as vertex shader attributes
    data.cov3Da[j * 3] = gaussians.cov3Ds[i * 6]
    data.cov3Da[j * 3 + 1] = gaussians.cov3Ds[i * 6 + 1]
    data.cov3Da[j * 3 + 2] = gaussians.cov3Ds[i * 6 + 2]

    data.cov3Db[j * 3] = gaussians.cov3Ds[i * 6 + 3]
    data.cov3Db[j * 3 + 1] = gaussians.cov3Ds[i * 6 + 4]
    data.cov3Db[j * 3 + 2] = gaussians.cov3Ds[i * 6 + 5]
  }

  const end = new Date().getTime()

  const writeTime = `${((end - sortEnd) / 1000).toFixed(3)}s`
  // console.log(`[Worker] Sorted ${gaussians.count} gaussians in ${sortTime}.`)
  // console.log(`[Worker] Writed ${gaussians.count} gaussians in ${writeTime}.`)

  return {
    data: {
      colors: data.colors.buffer,
      positions: data.positions.buffer,
      opacities: data.opacities.buffer,
      cov3Da: data.cov3Da.buffer,
      cov3Db: data.cov3Db.buffer,
      gaussiansCount: gaussians.count,
    }
  }
}

// count排序， 这里本质就是从近到远排序
function sortGaussiansByDepth(depthIndex, gaussians, viewProjectionMatrix) {
  const calcDepth = (i) => gaussians.positions[i * 3] * viewProjectionMatrix[2] +
                             gaussians.positions[i * 3 + 1] * viewProjectionMatrix[6] +
                             gaussians.positions[i * 3 + 2] * viewProjectionMatrix[10]

  let maxDepth = -Infinity
  let minDepth = Infinity
  const sizeList = new Int32Array(gaussians.count)

  for (let i = 0; i < gaussians.count; i++) {
    const depth = (calcDepth(i) * 4096) | 0

    sizeList[i] = depth
    maxDepth = Math.max(maxDepth, depth)
    minDepth = Math.min(minDepth, depth)
  }

  const depthInv = (256 * 256) / (maxDepth - minDepth)
  const counts0 = new Uint32Array(256 * 256)
  for (let i = 0; i < gaussians.count; i++) {
    sizeList[i] = ((sizeList[i] - minDepth) * depthInv) | 0
    counts0[sizeList[i]]++
  }
  const starts0 = new Uint32Array(256 * 256)
  for (let i = 1; i < 256 * 256; i++) starts0[i] = starts0[i - 1] + counts0[i - 1]
  for (let i = 0; i < gaussians.count; i++) depthIndex[starts0[sizeList[i]]++] = i
}

worker.onMessage(function (msg) {
  if (msg.type === 'execFunc_init') {
    worker.postMessage({
      type: 'execFunc_init',
      result: init(msg.params[0], msg.params[1])
    })
  } else if (msg.type === 'execFunc_sort') {
    worker.postMessage({
      type: 'execFunc_sort',
      result: sort(msg.params[0])
    })
  }
})
