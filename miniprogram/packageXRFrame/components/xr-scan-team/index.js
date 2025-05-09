import XrTeamCameraAnimation from '../../xr-custom/animations/XrTeamCameraAnimation'

Component({
  behaviors: [require('../common/share-behavior').default],
  properties: {
    loaded: false,
    run: {
      type: Boolean,
      value: false,
      observer(newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          this.requireRun = true
        }
      }
    }
  },
  lifetimes: {
    detached() {
      this.voice.stop()
      this.bgm.stop()
    },
  },
  methods: {
    handleReady({ detail }) {
      const xrScene = this.scene = detail.value
      console.log('xr-scene', xrScene)
      this.bgm = wx.createInnerAudioContext({})
      this.bgm.src = 'https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com/xr-frame/demo/kaqituolitai.mp3'
      this.bgm.volume = 0.5
      this.voice = wx.createInnerAudioContext({ useWebAudioImplement: true })
      this.voice.src = 'https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com/xr-frame/demo/homo.m4a'
      this.voiceFrag = {
        xinyi: [4, 2],
        roam: [6.8, 2],
        hikari: [53.9, 2],
        jump: [8.9, 1.5]
      }
      this.tmpV3 = new (wx.getXrFrameSystem().Vector3)()
    },
    handleAssetsLoaded({ detail }) {
      this.triggerEvent('assetsLoaded', detail.value)
    },
    handleRaf({ detail }) {
      if (!this.init()) {
        return
      }

      if (this.requireRun) {
        this.requireRun = false
        this.run()
      }

      this.triggerEvent('syncPositions', [
        this.getScreenPosition(this.hikari, '瞬光'),
        this.getScreenPosition(this.roam, 'roam'),
        this.getScreenPosition(this.xinyi, 'xinyi')
      ])
    },
    getScreenPosition(char, name) {
      this.tmpV3.set(char.worldPosition)
      this.tmpV3.x += -0.1
      this.tmpV3.y += 1.2
      const clipPos = this.camera.convertWorldPositionToClip(this.tmpV3)
      const { frameWidth, frameHeight } = this.scene
      return [((clipPos.x + 1) / 2) * frameWidth, (1 - (clipPos.y + 1) / 2) * frameHeight, name]
    },
    init() {
      if (!this.camera) {
        const camEl = this.scene.getElementById('camera')
        this.camera = camEl.getComponent(wx.getXrFrameSystem().Camera)
        this.cameraCtrl = camEl.getComponent('camera-orbit-control')
      }

      const inited = this.camera && this.hikari && this.roam && this.xinyi

      if (inited && !this.cameraAnim) {
        this.cameraAnim = this.camera.el.addComponent(wx.getXrFrameSystem().Animator)
        this.cameraAnim.createAnimation(XrTeamCameraAnimation, {
          targets: {
            hikari: this.hikari.position,
            roam: this.roam.position,
            xinyi: this.xinyi.position,
            final: this.hikari.position
          },
          startY: 1.2,
          finalY: 0.8
        })
      }

      return inited
    },
    handleModelLoaded({ detail }) {
      const { target } = detail.value
      this[target.id] = target.getComponent(wx.getXrFrameSystem().Transform)
    },
    async run() {
      this.cameraCtrl.disable()

      await this.prepareRun('xinyi')
      await this.prepareRun('roam')
      await this.prepareRun('hikari')

      await this.prepareCamera()

      this.runOne(this.hikari)
      this.runOne(this.roam)
      this.runOne(this.xinyi)

      this.cameraCtrl.enable()
    },
    async prepareRun(char) {
      const voiceFrag = this.voiceFrag[char]

      return new Promise(resolve => {
        const animator = this[char].el.getComponent(wx.getXrFrameSystem().Animator)

        this.cameraAnim.play(char)
        this.cameraAnim.el.event.addOnce('anim-stop', () => {
          this.voice.seek(voiceFrag[0])
          this.voice.play()

          setTimeout(() => {
            this.voice.stop()
            animator.stop()
            animator.pauseToFrame('Run', 0)
            setTimeout(() => resolve(), 200)
          }, voiceFrag[1] * 1000)
        })
      })
    },
    async prepareCamera() {
      this.bgm.play()
      this.bgm.seek(46)

      return new Promise(resolve => {
        this.cameraAnim.play('final')
        this.cameraAnim.el.event.addOnce('anim-stop', () => {
          setTimeout(() => {
            resolve()
          }, 1000)
        })
      })
    },
    runOne(char) {
      const animator = char.el.getComponent(wx.getXrFrameSystem().Animator)
      animator.resume()

      const jump = () => {
        this.voice.seek(this.voiceFrag.jump[0])
        this.voice.play()
        animator.stop()
        animator.play('Jump', { loop: 0 })
        animator.el.event.addOnce('anim-stop', () => {
          animator.play('Run')
          this.voice.stop()
        })
        char.el.event.addOnce('touch-shape', jump)
      }

      char.el.event.addOnce('touch-shape', jump)
    }
  }
})
