import {
  mesh4DPlayer
} from './mesh4DPlayer'

const ROOTURL = 'https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com'
const DIRROOT = '/xr-frame/demo/'

Component({
  behaviors: [require('../../common/share-behavior').default],
  properties: {
    markerImg: {
      type: String
    },
    isShowRecord: {
      type: Boolean
    },
    isFocusTips: {
      type: Boolean
    },

    width: {
      type: Number
    },
    height: {
      type: Number
    }
  },
  data: {
    loaded: false,
    arReady: false,
    firstPlay: true,
    markerList: [
      {
        name: 'videoData',
        type: 'gltf',
      },
    ]
  },
  lifetimes: {
    async attached() {
      console.log('data', this.data)
      wx.setKeepScreenOn({
        keepScreenOn: true
      })
    },
    detached() {
      this.releaseAll()
    }
  },
  pageLifetimes: {
    hide() {
      this.pause()
    },
    show() {
      this.play()
    }
  },
  methods: {
    releaseAll() {
      // 释放资源
      for (let i = 0, len = markerList.length; i < len; i++) {
        const markerInfo = markerList[i];
        let meshPlayer = this.meshPlayObj[markerInfo.name].meshPlayer
        meshPlayer && meshPlayer.release('all')
      }
    },

    handleArError(e) {
      console.log(e.detail);
      let errormsg = '当前设备不支持AR'
      if (String(e.detail.value).indexOf('2003002') > -1) {
        errormsg = '未开启小程序相机权限，打开右上角“设置”选项，开启小程序相机权限'
      }
      wx.showModal({
        title: '提示',
        content: errormsg,
        showCancel: false
      })
    },

    handleReady({
      detail
    }) {
      this.scene = detail.value;
      this.camera = this.scene.getElementById('camera')

      // 绑定tick事件
      this.scene.event.add('tick', this.handleTick.bind(this));

      this.meshPlayObj = {}
      for (let i = 0, len = this.data.markerList.length; i < len; i++) {
        const markerInfo = this.data.markerList[i];
        this.meshPlayObj[markerInfo.name] = {
          meshPlayer: new mesh4DPlayer({
            scene: this.scene,
            urlRoot: ROOTURL + DIRROOT + markerInfo.name,
            name: markerInfo.name,
            preStart: true,
            loop: true,
            mountedComplete: () => {
              this.camera.addChild(this.meshPlayer.manElem);
            }
          })
        }
      }
      
      this.meshPlayer = this.meshPlayObj[this.data.markerList[0].name].meshPlayer

      setTimeout(() => {
      this.play()
      }, 2000);
    },

    play() {
      if (this.meshPlayer) {
        this.meshPlayer.play()
      }
    },

    resume() {
      if (this.meshPlayer) {
        this.meshPlayer.resume()
      }
    },

    pause() {
      if (this.meshPlayer) {
        this.meshPlayer.pause()
      }
    },

    handleTick(delta) {
      //更新体积视频
      if (this.meshPlayer) {
        this.meshPlayer.update();
      }
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

    handleARReady: function ({
      detail
    }) {
      console.log('arReady');
      this.setData({
        arReady: true
      })
    }
  }
})