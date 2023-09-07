const STATE = {
  NONE: -1,
  MOVE: 0,
  ZOOM_OR_PAN: 1
}

Component({
  behaviors: [require('../../common/share-behavior').default],
  properties: {
    a: Number,
  },
  data: {
    loaded: false,
    arReady: false,
  },
  lifetimes: {
    async attached() {
      console.log('data', this.data)
    }
  },
  methods: {
    handleReady({detail}) {
      const xrScene = this.scene = detail.value;
      this.mat = new (wx.getXrFrameSystem().Matrix4)();
      console.log('xr-scene', xrScene);
      const { width, height } = this.scene
      // 旋转缩放相关配置
      this.radius = (width + height) / 4
      this.rotateSpeed = 5

      this.handleTouchStart = (event) => {
        this.mouseInfo = { startX: 0, startY: 0, isDown: false, startPointerDistance: 0, state: STATE.NONE }
        this.mouseInfo.isDown = true

        const touch0 = event.touches[0]
        const touch1 = event.touches[1]

        if (event.touches.length === 1) {
          this.mouseInfo.startX = touch0.pageX
          this.mouseInfo.startY = touch0.pageY
          this.mouseInfo.state = STATE.MOVE
        } else if (event.touches.length === 2) {
          const dx = (touch0.pageX - touch1.pageX)
          const dy = (touch0.pageY - touch1.pageY)
          this.mouseInfo.startPointerDistance = Math.sqrt(dx * dx + dy * dy)
          this.mouseInfo.startX = (touch0.pageX + touch1.pageX) / 2
          this.mouseInfo.startY = (touch0.pageY + touch1.pageY) / 2
          this.mouseInfo.state = STATE.ZOOM_OR_PAN
        }

        this.scene.event.add('touchmove', this.handleTouchMove.bind(this))
        this.scene.event.addOnce('touchend', this.handleTouchEnd.bind(this))

      },
      this.handleTouchMove = (event) => {
        const mouseInfo = this.mouseInfo
        if (!mouseInfo.isDown) {
          return
        }

        switch (mouseInfo.state) {
        case STATE.MOVE:
          if (event.touches.length === 1) {
            this.handleRotate(event)
          } else if (event.touches.length === 2) {
            // 支持单指变双指，兼容双指操作但是两根手指触屏时间不一致的情况
            this.scene.event.remove('touchmove', this.handleTouchMove)
            this.scene.event.remove('touchend', this.handleTouchEnd)
            this.handleTouchStart(event)
          }
          break
        case STATE.ZOOM_OR_PAN:
          if (event.touches.length === 1) {
            // 感觉双指松掉一指的行为还是不要自动切换成旋转了，实际操作有点奇怪
          }
          else if (event.touches.length === 2) {
            this.handleZoomOrPan(event)
          }
          break
        default:
          break
        }
      }

      this.handleTouchEnd = (event) => {
        this.mouseInfo.isDown = false
        this.mouseInfo.state = STATE.NONE

        this.scene.event.remove('touchmove', this.handleTouchMove)
        this.scene.event.addOnce('touchstart', this.handleTouchStart)
      }

      this.handleRotate = (event) => {
        const x = event.touches[0].pageX
        const y = event.touches[0].pageY

        const { startX, startY } = this.mouseInfo

        const theta = (x - startX) / this.radius * - this.rotateSpeed
        const phi = (y - startY) / this.radius * - this.rotateSpeed
        if (Math.abs(theta) < .01 && Math.abs(phi) < .01) {
          return
        }
        this.gltfItemTRS.rotation.x -= phi
        this.gltfItemSubTRS.rotation.y -= theta
        this.mouseInfo.startX = x
        this.mouseInfo.startY = y
      }

      this.handleZoomOrPan = (event) => {
        const touch0 = event.touches[0]
        const touch1 = event.touches[1]

        const dx = (touch0.pageX - touch1.pageX)
        const dy = (touch0.pageY - touch1.pageY)
        const distance = Math.sqrt(dx * dx + dy * dy)

        let deltaScale = distance - this.mouseInfo.startPointerDistance
        this.mouseInfo.startPointerDistance = distance
        this.mouseInfo.startX = (touch0.pageX + touch1.pageX) / 2
        this.mouseInfo.startY = (touch0.pageY + touch1.pageY) / 2
        if (deltaScale < -2) {
          deltaScale = -2
        } else if (deltaScale > 2) {
          deltaScale = 2
        }

        const s = deltaScale * 0.02 + 1
        // 缩小
        this.gltfItemTRS.scale.x *= s
        this.gltfItemTRS.scale.y *= s
        this.gltfItemTRS.scale.z *= s
      }
    },
    handleAssetsProgress: function({detail}) {
      console.log('assets progress', detail.value);
    },
    handleAssetsLoaded: function({detail}) {
      console.log('assets loaded', detail.value);
      // this.setData({loaded: true});
      this.placedFlag = false;
      this.scene.event.addOnce('touchstart', this.placeNode.bind(this));
    },
    handleARReady: function({detail}) {
      console.log('arReady', this.scene.ar.arVersion);
    },
    placeNode(event) {
      if (this.placedFlag) {
        return;
      }
      const xrFrameSystem = wx.getXrFrameSystem()
      this.placedFlag = true;
      this.scene.ar.placeHere('setitem', true)
      const anchorTRS = this.scene.getElementById('anchor').getComponent(xrFrameSystem.Transform)
      anchorTRS.setData({ visible: false })
      anchorTRS.scale.x = 0
      anchorTRS.scale.y = 0
      anchorTRS.scale.z = 0
      wx.setKeepScreenOn({ keepScreenOn: true })


      // 获取改动元素
      this.gltfItemTRS = this.scene.getElementById('preview-model').getComponent(xrFrameSystem.Transform)
      this.gltfItemSubTRS = this.scene.getElementById('preview-model-sub').getComponent(xrFrameSystem.Transform)



      // 开启旋转缩放逻辑
      this.scene.event.addOnce('touchstart', this.handleTouchStart)
    }
  }
})