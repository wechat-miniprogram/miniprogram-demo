const sceneReadyBehavior = require('../../behavior-scene/scene-ready')

Page({
  behaviors: [sceneReadyBehavior],
  data: {
    showBackBtn: true,
    resourceData: {
    },
    onFlags: false,
    gltfList: [],
    imageList: [],
    videoList: [],
  },
  onLoad() {
    // 准备加载数据
  },
  tapResBtn(event) {
    const dataSet = event.target.dataset
    const src = dataSet.src
    const index = dataSet.index
    let onFlags = this.data.onFlags
    onFlags = !onFlags
    let videoListNew
    if (onFlags) {
      videoListNew = this.data.videoList
      videoListNew.push({
        id: index,
        src
      })
    } else {
      let matchIndex = -1
      for (let i = 0; i < this.data.videoList.length; i++) {
        if (this.data.videoList[i] && src === this.data.videoList[i].src) {
          matchIndex = i
          break
        }
      }
      this.data.videoList.splice(matchIndex, 1)
      videoListNew = this.data.videoList
    }

    this.setData({
      videoList: videoListNew,
      onFlags
    })
  },
  handleInfoListener(cur) {
    const detail = cur.detail

    this.setData({
    })
  }

})
