const sceneReadyBehavior = require('../../behavior-scene/scene-ready')

Page({
  behaviors: [sceneReadyBehavior],
  data: {
    showBackBtn: true,
    resourceData: {
    },
    onFlags: [
      false, false, // gltf
      false, false, // image
      false, false, false // video
    ],
    gltfList: [],
    imageList: [],
    videoList: [],
  },
  onLoad() {
    // 准备加载数据
  },
  tapResBtn(event) {
    const dataSet = event.target.dataset
    // console.log(event);

    const onFlags = this.data.onFlags

    const src = dataSet.src
    const index = parseInt(dataSet.index)

    onFlags[index] = !onFlags[index]

    switch (dataSet.type) {
      case 'gltf':
        let gltfListNew
        if (onFlags[index]) {
          gltfListNew = this.data.gltfList
          gltfListNew.push({
            id: index,
            src
          })
        } else {
          let matchIndex = -1
          for (let i = 0; i < this.data.gltfList.length; i++) {
            if (this.data.gltfList[i] && src === this.data.gltfList[i].src) {
              matchIndex = i
              break
            }
          }
          this.data.gltfList.splice(matchIndex, 1)
          gltfListNew = this.data.gltfList
        }
        this.setData({
          gltfList: gltfListNew,
          onFlags
        })
        break
      case 'image':
        let imageListNew
        if (onFlags[index]) {
          imageListNew = this.data.imageList
          imageListNew.push({
            id: index,
            src
          })
        } else {
          let matchIndex = -1
          for (let i = 0; i < this.data.imageList.length; i++) {
            if (this.data.imageList[i] && src === this.data.imageList[i].src) {
              matchIndex = i
              break
            }
          }
          this.data.imageList.splice(matchIndex, 1)
          imageListNew = this.data.imageList
        }
        this.setData({
          imageList: imageListNew,
          onFlags
        })
        break
      case 'video':
        let videoListNew
        if (onFlags[index]) {
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
        break
      default:
        break
    }
  },
  handleInfoListener(cur) {
    const detail = cur.detail

    this.setData({
    })
  }

})
