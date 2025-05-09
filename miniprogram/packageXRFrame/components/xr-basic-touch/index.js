Component({
  behaviors: [require('../common/share-behavior').default],
  properties: {
    a: Number,
  },
  data: {
    loaded: false,
    touchingMoon: false,
    touchingEarth: false,
    θ: Math.PI,
    r: 10,
    ω: 5e-4,
    outerRing: 20,
    innerRing: 10
  },
  lifetimes: {},
  methods: {
    handleReady({ detail }) {
      const xrScene = this.scene = detail.value
      console.log('xr-scene', xrScene)
    },
    handleAssetsProgress({ detail }) {
      console.log('assets progress', detail.value)
    },
    handleAssetsLoaded({ detail }) {
      console.log('assets loaded', detail.value)
      this.setData({ loaded: true })
    },
    handleTouchEarth() {
      this.setData({
        touchingEarth: true
      })
    },
    handleUntouchEarth() {
      this.setData({
        touchingEarth: false
      })
    },
    handleEarthRotation({ detail }) {
      const { target, deltaX } = detail.value
      target._components.transform.rotation.y += deltaX / 100
    },
    handleDragMoon({ detail }) {
      const { dir, target, camera } = detail.value
      const cameraPos = camera.el._components.transform.worldPosition
      const k = -cameraPos.y / dir[1]
      const x = cameraPos.x + k * dir[0]
      const z = cameraPos.z + k * dir[2]
      const len = Math.sqrt(x * x + z * z)
      if (len > this.data.innerRing) {
        const transform = target._components.transform
        const scale = len > this.data.outerRing ? this.data.outerRing / len : 1.0
        transform.position.x = x * scale
        transform.position.z = z * scale
      }
    },
    handleTouchMoon() {
      this.setData({ touchingMoon: true })
    },
    handleUntouchMoon() {
      const moon = this.scene.getNodeById('mesh-moon')
      const transform = moon.el._components.transform
      const x = transform.position.x
      const z = transform.position.z
      const len = Math.sqrt(x * x + z * z)
      this.setData({
        r: len,
        θ: x < 0 ? Math.atan(z / x) + Math.PI : Math.atan(z / x),
        ω: Math.sqrt(2.5e-4 / (len * len * len))
      })
      this.setData({ touchingMoon: false })
    },
    handleTick({ detail }) {
      if (this.data.touchingMoon || !this.scene) return
      const deltaTime = detail.value
      const moon = this.scene.getNodeById('mesh-moon')
      const transform = moon.el._components.transform
      const x = Math.cos(this.data.θ) * this.data.r
      const z = Math.sin(this.data.θ) * this.data.r
      transform.position.x = x
      transform.position.z = z
      transform.rotation.y -= this.data.ω * deltaTime
      this.setData({
        θ: this.data.θ + this.data.ω * deltaTime
      })
    }
  }
})
