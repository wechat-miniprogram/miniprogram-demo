var touch = false;
Component({
  behaviors: [require('../../common/share-behavior').default],
  properties: {
    itemIndex: {
      type: Number,
      observer(newVal, oldVal) {
        if (newVal != undefined) {
          switch (newVal) {
            case 0:
              this.pause()
              break;
            case 1:
              this.resume()
              break;
            default:
              //前两位给了暂停、继续状态, 这里需要-2
              this.play(newVal - 2)
              this.itemIndex = newVal - 2;
              break;
          }
        }
      },
    },
  },
  data: {
    loaded: false,
  },
  lifetimes: {},
  methods: {
    handleReady({
      detail
    }) {
      const xrScene = this.scene = detail.value;
      console.log('xr-scene', xrScene);
    },
    handleAssetsProgress: function ({
      detail
    }) {
      console.log('assets progress', detail.value);
    },
    handleAssetsLoaded: function ({
      detail
    }) {
      console.log('assets loaded', detail.value);
      this.setData({
        loaded: true
      });
    },
    handleTouchModel(e) {
      touch = true
      const xrScene = this.scene;
      const xrFrameSystem = wx.getXrFrameSystem();
      const myModel = xrScene.getElementById('myModel');
      this.myModelAnimator = myModel.getComponent(xrFrameSystem.Animator);
      const clips = this.myModelAnimator._clips;
      this.clipName = []

      clips.forEach((v, key) => {
        if (key.indexOf('pose') == -1) {
          this.clipName.push(key)
        }
      })

      this.triggerEvent('infoListener', {
        clipName: this.clipName,
      });
    },

    handleTick: function (dt) {
      if (touch) {
        const xrFrameSystem = wx.getXrFrameSystem();
        const camera = this.scene.getElementById('camera').getComponent(xrFrameSystem.Camera)
        const myModel = this.scene.getElementById('myModel');
        const modelTRS = myModel.getComponent(xrFrameSystem.Transform)
        const trackerPos = camera.convertWorldPositionToClip(modelTRS.worldPosition.add(xrFrameSystem.Vector3.createFromNumber(0, 2, 0)))


        const dirX = camera.convertWorldPositionToClip(xrFrameSystem.Vector3.createFromNumber(1, 0, 0))
        const dirO = camera.convertWorldPositionToClip(xrFrameSystem.Vector3.createFromNumber(0, 0, 0))
        const dirZ = camera.convertWorldPositionToClip(xrFrameSystem.Vector3.createFromNumber(0, 0, 1))
        var len1 = dirX.sub(dirO).length()
        var len2 = dirZ.sub(dirO).length()
        var lenRes = len1 > len2 ? len1 : len2
        lenRes = lenRes < 0 ? 0 : lenRes > 1 ? 1 : lenRes

        this.triggerEvent('infoListener', {
          position: {
            'x': trackerPos.x,
            'y': trackerPos.y,
          },
          len: 0.5 + lenRes
        });
      }
    },

    handleGltfLoaded: async function () {
      const xrScene = this.scene;
      const xrFrameSystem = wx.getXrFrameSystem();
      const myModel = xrScene.getElementById('myModel');
      const shadowNode = myModel.getComponent("gltf").getInternalNodeByName("mixamorig:RightHandIndex1")
      const el = this.scene.createElement(xrFrameSystem.XRMesh, {
        geometry: "cube",
        scale: "20 20 20",
        uniforms: "u_baseColorFactor:1 0 0 1",
        position: "0 0 0",
        rotation: "0 0 0"
      });

      shadowNode.addChild(el);
    },
    play(index) {
      console.log("play:", this.clipName[index])
      if (this.clipName.length != 0) {
        this.myModelAnimator.play(this.clipName[index], {
          loop: 10,
        });
      }
    },
    pause() {
      console.log("pause:", this.clipName[this.itemIndex])
      //   this.myModelAnimator.pause(this.clipName[this.itemIndex])
      this.myModelAnimator.pause()
    },
    resume() {
      console.log("resume:", this.clipName[this.itemIndex])
      //   this.myModelAnimator.resume(this.clipName[this.itemIndex])
      this.myModelAnimator.resume()
    }
  }
})