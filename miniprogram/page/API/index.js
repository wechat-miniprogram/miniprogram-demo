Page({
  onShareAppMessage() {
    return {
      title: '小程序接口能力展示',
      path: 'page/API/index'
    }
  },

  data: {
    list: [
      {
        id: 'api',
        name: '开放接口',
        open: false,
        pages: [
          {
            zh: '微信登录',
            url: 'login/login'
          }, {
            zh: '获取用户信息',
            url: 'get-user-info/get-user-info'
          }, {
            zh: '发起支付',
            url: 'request-payment/request-payment'
          }, {
            zh: '转发',
            url: 'share/share'
          }, {
            zh: '转发按钮',
            url: 'share-button/share-button'
          }, {
            zh: '客服消息',
            url: 'custom-message/custom-message'
          }, {
            zh: '模板消息',
            url: 'template-message/template-message'
          }, {
            zh: '订阅消息',
            url: 'subscribe-message/subscribe-message'
          }, {
            zh: '收货地址',
            url: 'choose-address/choose-address'
          }, {
            zh: '获取发票抬头',
            url: 'choose-invoice-title/choose-invoice-title'
          }, {
            zh: '生物认证',
            url: 'soter-authentication/soter-authentication'
          }, {
            zh: '设置',
            url: 'setting/setting'
          }
        ]
      }, {
        id: 'page',
        name: '界面',
        open: false,
        pages: [
          {
            zh: '设置界面标题',
            url: 'set-navigation-bar-title/set-navigation-bar-title'
          }, {
            zh: '标题栏加载动画',
            url: 'navigation-bar-loading/navigation-bar-loading'
          }, {
            zh: '设置TabBar',
            url: '@set-tab-bar'
          }, {
            zh: '页面跳转',
            url: 'navigator/navigator'
          }, {
            zh: '下拉刷新',
            url: 'pull-down-refresh/pull-down-refresh'
          }, {
            zh: '创建动画',
            url: 'animation/animation'
          }, {
            zh: '创建绘画',
            url: 'canvas/canvas'
          }, {
            zh: '显示操作菜单',
            url: 'action-sheet/action-sheet'
          }, {
            zh: '显示模态弹窗',
            url: 'modal/modal'
          }, {
            zh: '页面滚动',
            url: 'page-scroll/page-scroll'
          }, {
            zh: '显示消息提示框',
            url: 'toast/toast'
          }, {
            zh: '获取WXML节点信息',
            url: 'get-wxml-node-info/get-wxml-node-info'
          }, {
            zh: 'WXML节点布局相交状态',
            url: 'intersection-observer/intersection-observer'
          }
        ]
      }, {
        id: 'device',
        name: '设备',
        open: false,
        pages: [
          {
            zh: '获取手机网络状态',
            url: 'get-network-type/get-network-type'
          }, {
            zh: '监听手机网络变化',
            url: 'on-network-status-change/on-network-status-change'
          }, {
            zh: '获取手机系统信息',
            url: 'get-system-info/get-system-info'
          }, {
            zh: '监听重力感应数据',
            url: 'on-accelerometer-change/on-accelerometer-change'
          }, {
            zh: '监听罗盘数据',
            url: 'on-compass-change/on-compass-change'
          }, {
            zh: '打电话',
            url: 'make-phone-call/make-phone-call'
          }, {
            zh: '扫码',
            url: 'scan-code/scan-code'
          }, {
            zh: '剪切板',
            url: 'clipboard-data/clipboard-data'
          }, {
            zh: '蓝牙',
            url: 'bluetooth/bluetooth'
          }, {
            zh: 'iBeacon',
            url: 'ibeacon/ibeacon'
          }, {
            zh: '屏幕亮度',
            url: 'screen-brightness/screen-brightness'
          }, {
            zh: '用户截屏事件',
            url: 'capture-screen/capture-screen'
          }, {
            zh: '振动',
            url: 'vibrate/vibrate'
          }, {
            zh: '手机联系人',
            url: 'add-contact/add-contact'
          }, {
            zh: 'Wi-Fi',
            url: 'wifi/wifi'
          }
        ]
      }, {
        id: 'network',
        name: '网络',
        open: false,
        pages: [
          {
            zh: '发起一个请求',
            url: 'request/request'
          }, {
            zh: 'WebSocket',
            url: 'web-socket/web-socket'
          }, {
            zh: '上传文件',
            url: 'upload-file/upload-file'
          }, {
            zh: '下载文件',
            url: 'download-file/download-file'
          }
        ]
      }, {
        id: 'media',
        name: '媒体',
        open: false,
        pages: [
          {
            zh: '图片',
            url: 'image/image'
          }, {
            zh: '录音',
            url: 'voice/voice'
          }, {
            zh: '背景音频',
            url: 'background-audio/background-audio'
          }, {
            zh: '文件',
            url: 'file/file'
          }, {
            zh: '视频',
            url: 'video/video'
          }, {
            zh: '动态加载字体',
            url: 'load-font-face/load-font-face'
          }
        ]
      }, {
        id: 'location',
        name: '位置',
        open: false,
        pages: [
          {
            zh: '获取当前位置',
            url: 'get-location/get-location'
          }, {
            zh: '使用原生地图查看位置',
            url: 'open-location/open-location'
          }, {
            zh: '使用原生地图选择位置',
            url: 'choose-location/choose-location'
          }
        ]
      }, {
        id: 'storage',
        name: '数据',
        url: 'storage/storage'
      }, {
        id: 'worker',
        name: '多线程',
        url: 'worker/worker'
      }
    ],
    isSetTabBarPage: false,
  },
  onShow() {
    this.leaveSetTabBarPage()
  },
  onHide() {
    this.leaveSetTabBarPage()
  },
  kindToggle(e) {
    const id = e.currentTarget.id; const
      list = this.data.list
    for (let i = 0, len = list.length; i < len; ++i) {
      if (list[i].id === id) {
        if (list[i].url) {
          wx.navigateTo({
            url: 'pages/' + list[i].url
          })
          return
        }
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list
    })
  },
  enterSetTabBarPage() {
    this.setData({
      isSetTabBarPage: true
    })
  },
  leaveSetTabBarPage() {
    this.setData({
      isSetTabBarPage: false
    })
  },
})
