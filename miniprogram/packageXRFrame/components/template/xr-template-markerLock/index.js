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
    },

    handleARReady: async function({detail}) {
      console.log('arReady', this.scene.ar.arVersion);
      const xr = wx.getXrFrameSystem();

      // shadow root
      this.root = this.scene.getElementById('root');

      // 动态创建添加tracker
      const lockTrackerEl = this.scene.createElement(xr.XRNode);
      const lockTracker = lockTrackerEl.addComponent(xr.ARTracker, {
        mode: 'Marker',
        src: 'https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com/xr-frame/demo/marker/2dmarker-test.jpg',
      });
      
      this.root.addChild(lockTrackerEl);

      // 动态改动模型根节点
      const lockItemEle = this.scene.createElement(xr.XRNode, {
        position: '10000 0 0',
      });

      const {value: model} = await this.scene.assets.loadAsset({type: 'gltf', assetId: 'butterfly', src: 'https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com/xr-frame/demo/butterfly/index.glb'});

      // 添加蝴蝶
      const gltf1 = this.scene.createElement(xr.XRGLTF, {
        position: '0.2 0 -0.2',
        scale: '0.6 0.6 0.6',
        rotation: '0 -50 0',
        'anim-autoplay': '',
      });
      lockItemEle.addChild(gltf1);
      gltf1.getComponent(xr.GLTF).setData({
        model: model,
      });
      const gltf2 = this.scene.createElement(xr.XRGLTF, {
        position: '0.4 0 0.3',
        scale: '0.5 0.5 0.5',
        rotation: '0 -50 0',
        'anim-autoplay': '',
      });
      lockItemEle.addChild(gltf2);
      gltf2.getComponent(xr.GLTF).setData({
        model: model,
      });
      const gltf3 = this.scene.createElement(xr.XRGLTF, {
        position: '-0.3 0 0.3',
        scale: '0.4 0.4 0.4',
        rotation: '0 -50 0',
        'anim-autoplay': '',
      });
      lockItemEle.addChild(gltf3);
      gltf3.getComponent(xr.GLTF).setData({
        model: model,
      });
      // 先挂到场上，但是可以放在离屏
      this.root.addChild(lockItemEle);

      let waiting = false;
      
      lockTrackerEl.event.add('ar-tracker-state', tracker => {
        // 获取当前状态和错误信息
        const {state, errorMessage} = tracker;

        if (state === 2 && !waiting) {
          console.log('match')
          waiting = true;
          // 识别成功后切换到世界坐标
          
          // 延时保证坐标已经设置
          setTimeout(() => {
            // 将 lockTrackerEl 的世界矩阵信息同步到 lockItemEle
            const lockTrackerTrs = lockTrackerEl.getComponent(xr.Transform)
            const lockItemTrs = lockItemEle.getComponent(xr.Transform)
            lockItemTrs.setLocalMatrix(lockTrackerTrs.worldMatrix);
            
            // 去除tracker监听
            this.root.removeChild(lockTrackerEl);
          }, 30);

        }
      })
    }
  }
})