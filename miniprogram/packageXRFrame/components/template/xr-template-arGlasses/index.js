Component({
  behaviors: [require('../../common/share-behavior').default],
  data: {
    loaded: false,
    arReady: false,
  },
  methods: {
    handleReady({detail}) {
      const xrScene = this.scene = detail.value;
      xrScene.event.add('tick', this.handleTick.bind(this));
      console.log('xr-scene', xrScene);
    },
    handleAssetsProgress: function ({detail}) {
      console.log('assets progress', detail.value);
    },
    handleAssetsLoaded: function ({detail}) {
      console.log('assets loaded', detail.value);
      this.setData({loaded: true});

      // 延时保证场上存在脸模
      setTimeout(()=>{
        const xrSystem = wx.getXrFrameSystem();

        // 替换状态
        const faceElm = this.scene.getElementById('face');
        const faceGLTF = faceElm.getComponent(xrSystem.GLTF);

        for(const mesh of faceGLTF.meshes) {  
          // 通过alphaMode 的 Setter 设置，或者写入renderState，但需要手动控制宏
          mesh.material.alphaMode = "BLEND";
          mesh.material.setVector('u_baseColorFactor', xrSystem.Vector4.createFromNumber(1, 1, 1, 0.0));
        }
      }, 33);
    },
    handleARReady: function ({detail}) {
      console.log('arReady');
      this.setData({arReady: true});
    },
    handleTick: function () {
      const xrSystem = wx.getXrFrameSystem();
      const trackerEl = this.scene.getElementById('tracker');
      if (!trackerEl) {
        return;
      }

      const tracker = trackerEl.getComponent(xrSystem.ARTracker);
      if (!tracker.arActive) {
        return
      }

      // 这里只是例子，实际上用的是`ARTracker`的`autoSync`属性。
      // 但也是一个更高自由度的选项。
      // 视情况需要自己同步`tracker`的`scale`和`rotation`特定节点。
      // 第一个参数是特征点编好，第二个是可选的复用结果，第三个是可选的是否相对于`ARTracker`。
      // 为`false`为世界空间的位置，需要配合`scale`自己使用
      const position = tracker.getPosition(98, new xrSystem.Vector3(), false);
      
    }
  }
})