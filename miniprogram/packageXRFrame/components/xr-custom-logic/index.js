Component({
  behaviors: [require('../common/share-behavior').default],
  properties: {},
  data: {
    loaded: false
  },
  lifetimes: {},
  methods: {
    handleReady({ detail }) {
      this.scene = detail.value
      this.rotSpeed = 1
      this.rotAxis = 0
    },
    handleTouchStart({ detail }) {
      console.log('touch start', detail.value)
    },
    handleTouchEnd({ detail }) {
      console.log('touch end', detail.value)
      this.rotAxis += 1
      if (this.rotAxis >= 3) {
        this.rotAxis = 0
      }

      this.changeSpeed()
    },
    handleDrag({ detail }) {
      const info = detail.value
      console.log('drag', info)
      this.rotSpeed += info.deltaX / this.scene.width
      this.changeSpeed()
    },
    changeSpeed() {
      const xrSystem = wx.getXrFrameSystem()
      const el = this.scene.getElementById('artg')
      const comp = el.getComponent('auto-rotate')

      if (comp) {
        comp.setData({ speed: [0, 0, 0].map((_, i) => (i === this.rotAxis ? this.rotSpeed : 0)) })
      }
    },
    handleAssetsProgress({ detail }) {
      console.log('assets progress', detail.value)
    },
    handleAssetsLoaded({ detail }) {
      console.log('assets loaded', detail.value)
      this.setData({ loaded: true })
    },
    handleLog({ detail }) {
      console.log('log', detail.value)
    }
  }
})
