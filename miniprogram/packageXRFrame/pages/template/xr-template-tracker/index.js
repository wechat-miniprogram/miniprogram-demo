const sceneReadyBehavior = require('../../behavior-scene/scene-ready')

Page({
  behaviors: [sceneReadyBehavior],
  moveTimes: 0,
  data: {
    // 内置
    height: 600,
    heightScale: 0.85,
    showBackBtn: true,
    // 页面
    useScan: true,
    useGLTF: false,
    useVideo1: false,
    useVideo2: false,
    markerList: [],
    // scan 相关
    showMarkerWrap: false,
    markerLeft: -50,
    markerTop: 50,
    markerWidth: 0,
    markerHeight: 0,
    // 全局状态
    dataReady: false,
    // Debug
    debugMsg: 'Defalut Words',
  },
  onLoad() {
    this.refreshData()
  },
  resetData() {
    this.setData({
      dataReady: false,
      showMarkerWrap: false,
      markerLeft: -50,
      markerTop: 50,
      markerWidth: 0,
      markerHeight: 0,
    })
  },
  refreshData() {
    this.resetData()
    // 模拟用的数据集合，可以跟进需要切换为后端接口
    const mockDataList = []

    // 识别框
    if (this.data.useScan) {
      mockDataList.push({
        name: '微信球',
        markerImg: 'https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com/xr-frame/demo/wxball.jpg',
        type: 'scan',
        src: '',
      })
    }

    // glTF模型
    if (this.data.useGLTF) {
      mockDataList.push({
        name: '扫描画',
        markerImg: 'https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com/xr-frame/demo/portalImage.jpg',
        type: 'gltf',
        src: 'https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com/xr-frame/demo/fiesta_tea/scene.gltf',
      })
    }

    // 视频
    if (this.data.useVideo1) {
      mockDataList.push({
        name: '2Dmarker',
        markerImg: 'https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com/xr-frame/demo/marker/2dmarker-test.jpg',
        type: 'video',
        src: 'https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com/xr-frame/demo/videos/cat.mp4',
      })
    }

    if (this.data.useVideo2) {
      mockDataList.push({
        name: '虎年企鹅',
        markerImg: 'https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com/xr-frame/demo/marker/osdmarker-test.jpg',
        type: 'video',
        src: 'https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com/xr-frame/demo/videos/paris.mp4',
      })
    }

    // 需要使用的marker
    const markerList = []

    let scanIndex = 0
    let videoIndex = 0
    let gltfIndex = 0

    for (let i = 0; i < mockDataList.length; i++) {
      const mockItem = mockDataList[i]
      switch (mockItem.type) {
        case 'scan': // scan
          const scanId = 'scan' + scanIndex
          markerList.push({
            id: scanId,
            name: mockItem.name,
            renderType: mockItem.type,
            markerImage: mockItem.markerImg,
            src: mockItem.src,
          })
          scanIndex++
          break
        case 'video': // video
          const videoId = 'video' + videoIndex
          markerList.push({
            id: videoId,
            name: mockItem.name,
            renderType: mockItem.type,
            markerImage: mockItem.markerImg,
            src: mockItem.src,
          })
          videoIndex++
          break
        case 'gltf': // gltf
          const gltfId = 'gltf' + gltfIndex
          markerList.push({
            id: gltfId,
            name: mockItem.name,
            renderType: mockItem.type,
            markerImage: mockItem.markerImg,
            src: mockItem.src,
          })
          gltfIndex++
          break
      }
    }

    console.log('markerList', markerList)

    this.setData({
      dataReady: true,
      markerList
    })

    this.setData({
      debugMsg: 'markerList:' + markerList.length
    })
  },
  tapScan() {
    this.setData({
      useScan: !this.data.useScan
    })

    this.refreshData()
  },
  tapGLTF() {
    this.setData({
      useGLTF: !this.data.useGLTF
    })

    this.refreshData()
  },
  tapVideo1() {
    this.setData({
      useVideo1: !this.data.useVideo1
    })

    this.refreshData()
  },
  tapVideo2() {
    this.setData({
      useVideo2: !this.data.useVideo2
    })

    this.refreshData()
  },
  handleTrackerChange(cur) {
    const item = cur.detail
    this.setData({
      debugMsg: 'handleTrackerChange:' + item.name
    })
  },
  handleTrackerMove(cur) {
    const detail = cur.detail
    const trackerInfo = detail.trackerInfo

    this.moveTimes++

    if (detail.type === 'scan') {
      if (detail.active) {
        this.setData({
          showMarkerWrap: true,
          markerLeft: Math.floor((trackerInfo.x) * 100),
          markerTop: Math.floor((trackerInfo.y) * 100) * this.data.heightScale,
          markerWidth: Math.floor(trackerInfo.halfWidth * 2 * this.data.width),
          markerHeight: Math.floor(trackerInfo.halfWidth * 2 * this.data.width / trackerInfo.widthDivideHeight),
          // debugMsg: 'pos:' + trackerInfo.x + '\n' + trackerInfo.y + '\n halfWidth:' + trackerInfo.halfWidth + '\nmoveTimes:' + this.moveTimes
        })
      } else {
        this.setData({
          showMarkerWrap: false,
        })
      }
    }
  },
})
