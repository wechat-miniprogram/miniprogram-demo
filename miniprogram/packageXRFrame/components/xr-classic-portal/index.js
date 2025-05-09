Component({
  behaviors: [require('../common/share-behavior').default],
  properties: {
  },
  data: {
    loaded: false,
    arReady: false,
  },
  lifetimes: {
    detached() {
      wx.setKeepScreenOn({ keepScreenOn: false })
    }
  },
  methods: {
    handleReady({ detail }) {
      const xrScene = this.scene = detail.value
      this.inRealWorld = true
      console.log('xr-scene', xrScene)
    },
    handleAssetsProgress({ detail }) {
      console.log('assets progress', detail.value)
    },
    handleAssetsLoaded({ detail }) {
      console.log('assets loaded', detail.value)
      this.setData({ loaded: true })
      this.scene.event.addOnce('touchstart', this.placeNode.bind(this))
      wx.showToast({ title: '点击屏幕放置' })
    },
    handleTick() {
      if (!this.placed) {
        return
      }

      const xrSystem = wx.getXrFrameSystem()
      const mainCamEl = this.scene.getElementById('main-camera')
      const magicCamEl = this.scene.getElementById('magic-camera')
      const mainTrs = mainCamEl.getComponent(xrSystem.Transform)
      const door = this.scene.getElementById('door').getComponent(xrSystem.Transform)

      let forward = door.worldForward
      forward = xrSystem.Vector2.createFromNumber(forward.x, forward.z)
      let diff = mainTrs.worldPosition.sub(door.worldPosition)
      diff = xrSystem.Vector2.createFromNumber(diff.x, diff.z)
      const preDiff = this.diff || diff
      this.diff = diff

      const dis = diff.length()
      const preDis = preDiff.length()
      const dir = forward.dot(diff)

      // @todo: 等待物理加上碰撞检测，替换
      if (preDis <= 0.2 || dis > 0.2) {
        return
      }

      if (this.inRealWorld && dir >= 0) {
        return
      }

      if (!this.inRealWorld && dir <= 0) {
        return
      }

      const mainCam = mainCamEl.getComponent(xrSystem.Camera)
      const magicCam = magicCamEl.getComponent(xrSystem.Camera)
      const doorMesh = this.scene.getElementById('door-mesh').getComponent(xrSystem.Mesh)
      const sceneMesh = this.scene.getElementById('scene-mesh').getComponent(xrSystem.GLTF)

      if (!this.inRealWorld) {
        // 现实世界
        // mainCam: ar -> stencil -> scene
        // magicCam: nothing
        this.inRealWorld = true
        mainCam.setData({ background: 'ar' })
        magicCam.setData({ background: 'default' })
        magicCam.setData({ isClearDepth: false })
        magicCam.clearBackgroundRenderStates()
        doorMesh.material.renderQueue = 1
        doorMesh.material.setRenderState('cullFace', 2)
        sceneMesh.meshes.forEach(mesh => mesh.material.setRenderState('stencilComp', 3))
      } else {
        // 虚拟世界
        // mainCam: scene -> stencil
        // magicCam: ar
        this.inRealWorld = false
        mainCam.setData({ background: 'default' })
        magicCam.setData({ background: 'ar' })
        magicCam.setData({ isClearDepth: true })
        magicCam.setBackgroundRenderStates({
          stencilComp: 3,
          stencilRef: 1,
          stencilReadMask: 1
        })
        doorMesh.material.renderQueue = 9999
        doorMesh.material.setRenderState('cullFace', 1)
        sceneMesh.meshes.forEach(mesh => mesh.material.setRenderState('stencilComp', 0))
      }
    },
    placeNode(event) {
      const { clientX, clientY } = event.touches[0]
      const { frameWidth: width, frameHeight: height } = this.scene

      if (clientY / height > 0.8 && clientX / width > 0.8) {
        this.scene.getNodeById('setitem').visible = false
        this.scene.ar.resetPlane()
        this.scene.event.addOnce('touchstart', this.placeNode.bind(this))
      } else {
        this.scene.ar.placeHere('setitem', true)
        this.scene.getElementById('anchor').getComponent(wx.getXrFrameSystem().Transform).setData({ visible: false })
        this.placed = true
        wx.setKeepScreenOn({ keepScreenOn: true })
      }
    },
  }
})
