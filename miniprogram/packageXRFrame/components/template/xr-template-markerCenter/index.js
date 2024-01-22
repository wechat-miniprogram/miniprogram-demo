Component({
  behaviors: [require('../../common/share-behavior').default],
  properties: {
    a: Number,
  },
  data: {
    loaded: false,
    arReady: false,
    markerMatch: false
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
            
            this.setData({
              markerMatch: true
            });

            // 去除tracker监听
            this.root.removeChild(lockTrackerEl);
          }, 30);

        }
      })
    }
  }
})