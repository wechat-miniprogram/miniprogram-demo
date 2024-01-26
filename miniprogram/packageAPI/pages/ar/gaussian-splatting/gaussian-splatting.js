import arBehavior from '../behavior/behavior-ar'
import xrFrameBehavior from '../behavior/behavior-xrframe'
import { loadPly } from './lib/handler-ply'

// VK 投影矩阵参数定义
const NEAR = 0.01
const FAR = 1000

let loggerOnce = false;

Component({
  behaviors: [arBehavior, xrFrameBehavior],
  data: {
    theme: 'light',
    widthScale: 1,      // canvas宽度缩放值
    heightScale: 0.9,   // canvas高度缩放值
    hintBoxList: [],  // 显示提示盒子列表,
    cameraPosition: 1 // 默认前置
  },
  markerIndex: 0,  // 使用的 marker 索引
  hintInfo: undefined, // 提示框信息
  lifetimes: {
      /**
      * 生命周期函数--监听页面加载
      */
      detached() {
      console.log("页面detached")
      if (wx.offThemeChange) {
        wx.offThemeChange()
      }
      },
      ready() {
      console.log("页面准备完全")
        this.setData({
          theme: wx.getSystemInfoSync().theme || 'light'
        })

        if (wx.onThemeChange) {
          wx.onThemeChange(({theme}) => {
            this.setData({theme})
          })
        }
      },
  },

  methods: {
    // 对应案例的初始化逻辑，由统一的 behavior 触发
    init() {

      console.log('start init');

      // const plyLoader = new PLYLoader();
      // console.log('plyLoader', plyLoader)

      // const plySrc = 'http://10.9.169.135:8000/ply/point_cloud_7000.ply';

      const filePath = wx.env.USER_DATA_PATH + '/point.ply';
      wx.downloadFile({
        filePath: filePath,
        url: plySrc,
        success: (res) => {
          console.log("下载回调", res);
          const fs = wx.getFileSystemManager()
          fs.readFile({
            filePath: res.filePath,
            position: 0,
            success: async (res) => {
              console.log("读文件回调，结果返回为", res)

              // const plyInfo = plyLoader.parsePLYBuffer(res.data);

              const plyInfo = loadPly(res.data);

              console.log("plyLoader return", plyInfo)

            },
            fail(res) {
              wx.hideLoading();
              wx.showToast({
                title: res.errMsg,
                icon: 'none',
                duration: 2000
              })
              console.error(res)
            }
          });
        },
        fail(res) {
          wx.hideLoading();
          wx.showToast({
            title: res.errMsg,
            icon: 'none',
            duration: 2000
          })
          console.error(res)
        }
      });
    },

    loop() {

    }
  },
})