
Component({
  behaviors: [require('../../common/share-behavior').default],
  properties: {
    a: Number,
    messageData: {
      type: Object,
      value: {
        moveX: 0,
        moveZ: 0,
      },
      observer(newVal, oldVal) {
        this.speedX = Math.sign(this.speedX) !== 0 ? Math.sign(this.speedX) * Math.abs(newVal.moveX) * 0.01 : newVal.moveX * 0.01;
        this.speedZ = Math.sign(this.speedZ) !== 0 ? Math.sign(this.speedZ) * Math.abs(newVal.moveZ) * 0.01 : newVal.moveZ * 0.01;
      }
    }
  },
  data: {
    loaded: false,
  },
  lifetimes: {},
  methods: {
    handleReady({detail}) {
      const xrScene = this.scene = detail.value;
      console.log('xr-scene', xrScene);
      const xrSystem = wx.getXrFrameSystem();

      // 绑定运动目标
      this.moveSphereTRS = this.scene.getElementById('move-sphere').getComponent(xrSystem.Transform);
      // 绑定内置变量
      this.speedX = 0;
      this.speedZ = 0;
      this.planeWidth = 5;
      // 绑定tick事件
      xrScene.event.add('tick', this.handleTick.bind(this));
    },
    handleAssetsProgress: function({detail}) {
      console.log('assets progress', detail.value);
    },
    handleAssetsLoaded: function({detail}) {
      console.log('assets loaded', detail.value);
      this.setData({loaded: true});
    },
    handleTick: function () {
      if (this.moveSphereTRS) {
        const nowPos = this.moveSphereTRS.position;
        if(nowPos.x > this.planeWidth) {
          this.speedX = -this.speedX;
        } else if (nowPos.x < -this.planeWidth){
          this.speedX = -this.speedX;
        }
        if(nowPos.z > this.planeWidth) {
          this.speedZ = -this.speedZ;
        } else if (nowPos.z < -this.planeWidth){
          this.speedZ = -this.speedZ;
        }
        nowPos.x += this.speedX;
        nowPos.z += this.speedZ;

        this.triggerEvent('infoListener', { 
          speedX: this.speedX,
          speedZ: this.speedZ,
          posX: nowPos.x.toFixed(2),
          posZ: nowPos.z.toFixed(2),
         });
      }

    }
  }
})