Component({
  behaviors: [require('../common/share-behavior').default],
  properties: {
    throwing: {
      type: Boolean,
      value: false,
      observer(newVal, oldVal) {
        if (newVal !== oldVal) {
          if (newVal) this.startThrowing()
          else this.endThrowing()
        }
      }
    }
  },
  data: {
    showTarget: false
  },
  lifetimes: {},
  methods: {
    handleReady({ detail }) {
      const xrScene = this.scene = detail.value

      this.vQueueLength = 5
      this.vQueue = []
      this.vQueueHead = 0
    },
    handleAssetsProgress({ detail }) {
      console.log('assets progress', detail.value)
    },
    handleAssetsLoaded({ detail }) {
      console.log('assets loaded', detail.value)
      this.setData({ loaded: true })
    },
    handleARTrackerState({ detail }) {
      // 事件的值即为`ARTracker`实例
      const tracker = detail.value
      // 获取当前状态和错误信息
      const { state, errorMessage } = tracker
      if (state == 2) {
        this.handleARDetected()
      }
    },
    handleARDetected() {
      this.scene.event.addOnce('touchstart', this.placeTarget.bind(this))
    },
    placeTarget() {
      this.scene.ar.placeHere('targetTransform')
      this.setData({
        showTarget: true
      })
      this.triggerEvent('ar_detected')
    },
    startThrowing() {
      if (!this.data.showTarget) return
      this.makeBall()
    },
    endThrowing() {
      this.releaseBall()
    },
    makeBall() {
      const xr = wx.getXrFrameSystem()
      const el = this.scene.createElement(xr.XRMesh, {
        geometry: 'sphere',
        scale: '0.1 0.1 0.1',
        'sphere-shape': 'autoFit: true',
        rigidbody: 'disabled: true',
        'shape-interact': 'collide: true; bounciness: 0.5;'
      })
      const root = this.scene.getElementById('ballRoot')
      root.addChild(el)
      this.placeBall(el.getComponent('transform'))
      this.currentBall = el
    },
    placeBall(transform) {
      const camera = this.scene.getElementById('camera')
      const cam_trans = camera.getComponent('transform')
      transform.position.set(cam_trans.position.add(cam_trans.worldForward.scale(-1)))
    },
    handleTick({ detail }) {
      if (this.currentBall) {
        this.placeBall(this.currentBall.getComponent('transform'))
        this.recordPosition(detail)
      }
    },
    releaseBall() {
      if (!this.currentBall) return
      this.currentBall.getComponent('rigidbody').setData({
        disabled: false
      })
      const r1 = this.vQueue[(this.vQueueHead - 1 + this.vQueueLength) % this.vQueueLength]
      const r2 = this.vQueue[this.vQueueHead]
      if (r1 && r2) {
        const vscale = 1.3 // 初始速度调节
        const v = r1[0].sub(r2[0]).scale(vscale * 1000 / (r1[1] - r2[1]))
        this.currentBall.getComponent('rigidbody').velocity = v
      }

      this.currentBall = undefined
      this.vQueue = []
      this.vQueueHead = 0
    },
    recordPosition() {
      const transform = this.currentBall.getComponent('transform')
      this.vQueue[this.vQueueHead] = [transform.position.clone(), Date.now()]
      this.vQueueHead = (this.vQueueHead + 1) % this.vQueueLength
    }
  }
})
