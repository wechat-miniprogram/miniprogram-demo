const info = wx.getSystemInfoSync()
const dpi = info.pixelRatio
const width = info.windowWidth * dpi
const height = info.windowHeight * dpi

Component({
  scene: null,
  properties: {},
  data: {
    width,
    height,
    loaded: false,
    arReady: false,
    placed: false,
    gateClosed: false
  },
  lifetimes: {
    attached() {
      wx.reportEvent('xr_frame', {
        xr_page_path: '/pages/scene-last-record/index',
        xr_last_record_click: 1
      })
    },
    detached() {
      this.bgm.stop()
      wx.setKeepScreenOn({ keepScreenOn: false })
    }
  },
  methods: {
    handleReady({ detail }) {
      this.scene = detail.value
      this.scene.event.add('tick', this.handleTick.bind(this))
      this.inRealWorld = true
      this.texts = {}
      this.textsIndex = {}
      this.bgm = wx.createInnerAudioContext({})
      this.bgm.src = 'https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com/xr-frame/demo/xr-frame-team/bgm.mp3'
      this.bgm.loop = true
    },
    handleAssetsProgress({ detail }) {
      console.log('assets progress', detail.value)
    },
    handleARReady() {
      this.setData({ arReady: true })
    },
    handleAssetsLoaded({ detail }) {
      console.log('assets loaded', detail.value)
      this.records = JSON.parse(this.scene.assets.getAsset('raw', 'records'))
      this.note = this.scene.assets.getAsset('raw', 'note')
      this.setData({ loaded: true })
    },
    handleTick(dt) {
      this.syncTexts()

      if (!this.data.placed || !this.inRealWorld) {
        return
      }

      const xrSystem = wx.getXrFrameSystem()
      const mainCamEl = this.scene.getElementById('main-camera')
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
      this.startDis = this.startDis || dis

      const blurAsset = this.scene.assets.getAsset('post-process', 'blur')
      const vignetteAsset = this.scene.assets.getAsset('post-process', 'vignette')
      const bloomAsset = this.scene.assets.getAsset('post-process', 'bloom')
      const edgeEnv1 = 0.5
      const edgeEnv2 = 0.8
      const edgeDoor1 = 0.3
      const edgeDoor2 = 0.7

      if (this.blurDuration) {
        this.blurDuration = Math.max(0, this.blurDuration - dt)
        const p = 1 - this.blurDuration / this.blurTotal

        if (p <= edgeEnv1) {
          const progress = xrSystem.noneParamsEaseFuncs['ease-in-out'](p / edgeEnv1)
          vignetteAsset.data.intensity = progress * 2
          blurAsset.data.radius = progress * 86 + 10
        } else if (p > edgeEnv2) {
          const progress = xrSystem.noneParamsEaseFuncs['ease-in-out']((1 - p) / (1 - edgeEnv2))
          vignetteAsset.data.intensity = progress * 2
          blurAsset.data.radius = progress * 96
        }

        if (p >= edgeDoor1 && p < edgeDoor2) {
          const progress = xrSystem.noneParamsEaseFuncs['ease-in-out']((p - edgeDoor1) / (edgeDoor2 - edgeDoor1))
          door.scale.setValue(progress, 1, 1)
        }
      } else if (this.blurTotal) {
        let progress = (1 - Math.max(0, Math.min(dis / this.startDis, 0.8)))
        if (progress >= 0.2) {
          progress = (progress - 0.2) / 0.6
          blurAsset.data.radius = progress * 96
          vignetteAsset.data.intensity = progress * 2
          bloomAsset.data.threshold = 0.5 + progress * 2
        }
      }

      // @todo: 等待物理加上碰撞检测，替换
      if (dir >= 0 || preDis <= 0.2 || dis > 0.2) {
        return
      }

      ['sky', 'scene-mesh', 'hikari', 'roam', 'xinyi'].forEach(id => {
        this.scene
          .getElementById(id)
          .getComponent(xrSystem.GLTF).meshes.forEach(mesh => mesh.material.setRenderState('stencilComp', 0))
      })
      mainCamEl.getComponent(xrSystem.Camera).setData({
        renderTarget: null,
        postProcess: ['tone']
      })
      this.setData({ gateClosed: true })
      this.inRealWorld = false
    },
    handleShowDoor({ detail }) {
      if (detail.value.camera.el.id !== 'main-camera') {
        return
      }

      const success = this.scene.ar.placeHere('setitem', true)
      if (!success) {
        return
      }

      setTimeout(() => {
        this.blurTotal = this.blurDuration = 1700
      }, 300)
      wx.setKeepScreenOn({ keepScreenOn: true })
      this.bgm.play()
      this.setData({ placed: true })
    },
    handleResume() {
      if (this.data.placed) {
        this.bgm.play()
      }
    },
    handleTouchNote({ detail }) {
      if (detail.value.camera.el.id !== 'main-camera') {
        return
      }

      this.triggerEvent('showNote', this.note)
    },
    handleTouchObj({ detail }) {
      if (detail.value.camera.el.id !== 'main-camera') {
        return
      }

      const xrSystem = wx.getXrFrameSystem()
      const { el, value } = detail
      const { camera, target } = value
      const id = target.id
      const text = this.texts[id]
      const camTrs = camera.el.getComponent(xrSystem.Transform)
      const targetTrs = target.getComponent(xrSystem.Transform)
      const diff = camTrs.worldPosition.sub(targetTrs.worldPosition)
      const distance = Math.sqrt(diff.x * diff.x + diff.z * diff.z)

      if (!this.records[id]) {
        return
      }

      const { y, d, texts: records } = this.records[id]

      if (distance > (d || 1.5)) {
        return
      }

      if (text) {
        clearTimeout(text.timerId)
      }

      let index = this.textsIndex[id] === undefined ? -1 : this.textsIndex[id]
      if (index >= records.length - 1) {
        index = 0
      } else {
        index += 1
      }
      this.textsIndex[id] = index

      this.texts[id] = {
        content: records[index],
        camera,
        target,
        y,
        timerId: setTimeout(() => {
          delete this.texts[id]
        }, 4000)
      }
    },
    syncTexts() {
      const texts = Object.keys(this.texts).map(id => {
        const {
          camera, target, content, y
        } = this.texts[id]
        const xrSystem = wx.getXrFrameSystem()
        const trs = target.getComponent(xrSystem.Transform)
        const tmp = trs.worldPosition.clone()
        tmp.y += y
        const clipPos = camera.convertWorldPositionToClip(tmp)
        const { frameWidth, frameHeight } = this.scene

        return {
          content,
          id,
          x: ((clipPos.x + 1) / 2) * frameWidth,
          y: (1 - (clipPos.y + 1) / 2) * frameHeight
        }
      })

      this.triggerEvent('changeTexts', texts)
    }
  }
})
