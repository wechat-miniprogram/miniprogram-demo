Page({
  onShareAppMessage() {
    return {
      title: '小程序接口能力展示',
      path: 'page/API/index'
    }
  },

  data: {
    list: [{
      id: 'chattool',
      name: '聊天工具',
      open: false,
      pages: [{
        zh: '活动签到',
        url: 'activity_assist/activity_assist'
      }]
    }, {
      id: 'api',
      name: '开放接口',
      open: false,
      pages: [{
        zh: '微信登录',
        url: 'login/login'
      }, {
        zh: '获取用户信息',
        url: 'get-user-info/get-user-info'
      }, {
        zh: '发起支付',
        url: 'request-payment/request-payment'
      }, {
        zh: '跳转',
        url: 'jump/jump'
      }, {
        zh: '公众号',
        url: 'official-account/official-account'
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
      }]
    }, {
      id: 'page',
      name: '界面',
      open: false,
      pages: [{
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
      }]
    }, {
      id: 'device',
      name: '设备',
      open: false,
      pages: [{
        zh: '获取手机网络状态',
        url: 'get-network-type/get-network-type'
      }, {
        zh: '监听手机网络变化',
        url: 'on-network-status-change/on-network-status-change'
      }, {
        zh: '获取手机系统信息',
        url: 'get-system-info/get-system-info'
      }, {
        zh: '获取手机设备电量',
        url: 'get-battery-info/get-battery-info'
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
      }]
    }, {
      id: 'performance',
      name: '性能',
      open: false,
      pages: [{
        zh: '获取性能数据',
        url: 'get-performance/get-performance'
      }]
    }, {
      id: 'network',
      name: '网络',
      open: false,
      pages: [{
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
      }, {
        zh: 'UDPSocket',
        url: 'udp-socket/udp-socket'
      }, {
        zh: 'mDNS',
        url: 'mdns/mdns'
      }]
    }, {
      id: 'media',
      name: '媒体',
      open: false,
      pages: [{
        zh: '图片',
        url: 'image/image'
      }, {
        zh: '音频',
        url: 'audio/audio'
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
        zh: '音视频合成',
        url: 'media-container/media-container'
      }, {
        zh: '动态加载字体',
        url: 'load-font-face/load-font-face'
      }]
    }, {
      id: 'location',
      name: '位置',
      open: false,
      pages: [{
        zh: '获取当前位置',
        url: 'get-location/get-location'
      }, {
        zh: '使用原生地图查看位置',
        url: 'open-location/open-location'
      }, {
        zh: '使用原生地图选择位置',
        url: 'choose-location/choose-location'
      }]
    }, {
      id: 'storage',
      name: '数据',
      pages: [{
        zh: '本地存储',
        url: 'storage/storage'
      }, {
        zh: '周期性更新',
        url: 'get-background-fetch-data/get-background-fetch-data'

      }, {
        zh: '数据预拉取',
        url: 'get-background-prefetch-data/get-background-prefetch-data'
      }],
    }, {
      id: 'worker',
      name: '多线程',
      url: 'worker/worker'
    }, {
      id: 'framework',
      name: '框架',
      pages: [{
        zh: '双向绑定',
        url: 'two-way-bindings/two-way-bindings',
      }, {
        zh: 'WXS',
        url: 'wxs/wxs'
      }, {
        zh: '屏幕旋转',
        url: 'resizable/resizable'
      }]
    }, {
      id: 'ai',
      name: '通用AI推理能力',
      pages: [{
        zh: 'mobileNet',
        url: 'mobilenet/index',
      },
      {
        zh: 'style transfer',
        url: 'style-trans/index',
      },
      {
        zh: 'mobileNetInt8',
        url: 'mobilenet_int8/index',
      }
      ]
    }, {
      id: 'ar',
      name: 'VisionKit视觉能力',
      pages: [{
        zh: 'VisionKit基础',
        url: 'visionkit-basic/visionkit-basic'
      },
      {
        zh: 'VisionKit基础-v2',
        url: 'visionkit-basic-v2/visionkit-basic-v2'
      },
      {
        zh: '水平面AR',
        url: 'plane-ar/plane-ar'
      },
      {
        zh: '水平面AR-v2',
        url: 'plane-ar-v2/plane-ar-v2'
      },
      {
        zh: '水平面AR-v2-marker识别',
        url: 'plane-ar-v2-marker/plane-ar-v2-marker'
      },
      // {
      //   zh: '水平面AR-v2-虚实遮挡',
      //   url: 'plane-ar-v2-depth/plane-ar-v2-depth'
      // },
      {
        zh: '水平面AR-v2-附加能力',
        url: 'plane-ar-v2-options/plane-ar-v2-options'
      },
      {
        zh: '水平面旋转AR',
        url: 'plane-ar-3dof/plane-ar-3dof'
      },
      {
        zh: '2DMarkerAR',
        url: '2dmarker-ar/2dmarker-ar'
      },
      {
        zh: '3DMarkerAR-三维识别与重建',
        url: '3dmarker-ar/3dmarker-ar'
      },
      {
        zh: '单样本检测(OSD)',
        url: 'osd-ar/osd-ar'
      },
      {
        zh: '相机帧测试',
        url: 'cameraBuffer-detect/cameraBuffer-detect'
      },
      {
        zh: '相机帧获取jpg图片',
        url: 'cameraBuffer-jpg/cameraBuffer-jpg'
      },
      {
        zh: '实时深度图检测',
        url: 'depth-detect/depth-detect'
      },
      {
        zh: '照片深度图检测',
        url: 'photo-depth-detect/photo-depth-detect'
      },
      {
        zh: '照片OCR检测',
        url: 'photo-ocr-detect/photo-ocr-detect'
      },
      {
        zh: '照片身份证检测',
        url: 'photo-idcard-detect/photo-idcard-detect'
      },
      {
        zh: '实时人脸检测',
        url: 'face-detect/face-detect'
      },
      {
        zh: '实时人脸检测3D',
        url: 'face-detect-3d/face-detect-3d'
      },
      {
        zh: '实时人脸检测3D-眼镜试戴',
        url: 'face-detect-3d-glasses/face-detect-3d-glasses'
      },
      {
        zh: '照片人脸检测',
        url: 'photo-face-detect/photo-face-detect'
      },
      {
        zh: '实时人体检测',
        url: 'body-detect/body-detect'
      },
      {
        zh: '实时人体检测3D',
        url: 'body-detect-3d/body-detect-3d'
      },
      {
        zh: '照片人体检测',
        url: 'photo-body-detect/photo-body-detect'
      },
      {
        zh: '实时手势检测',
        url: 'hand-detect/hand-detect'
      },
      {
        zh: '实时手势检测3D',
        url: 'hand-detect-3d/hand-detect-3d'
      },
      {
        zh: '照片手势检测',
        url: 'photo-hand-detect/photo-hand-detect'
      },
      {
        zh: '实时鞋部检测-AR试鞋',
        url: 'shoe-detect/shoe-detect'
      },
      {
        zh: 'GassianSplatting 预览',
        url: 'gaussian-splatting/gaussian-splatting'
      },
      {
        zh: 'GassianSplatting AR预览',
        url: 'gaussian-splatting/gaussian-splatting-ar'
      },
      ],
    }],
    isSetTabBarPage: false,
    theme: 'light'
  },
  onUnload() {
    if (wx.offThemeChange) {
      wx.offThemeChange()
    }
  },
  onLoad() {
    this.setData({
      theme: getApp().globalData.theme || 'light'
    })

    if (wx.onThemeChange) {
      wx.onThemeChange(({
        theme
      }) => {
        this.setData({
          theme
        })
      })
    }
  },
  onShow() {
    this.leaveSetTabBarPage()
  },
  onHide() {
    this.leaveSetTabBarPage()
  },
  kindToggle(e) {
    const id = e.currentTarget.id
    const
      list = this.data.list
    for (let i = 0, len = list.length; i < len; ++i) {
      if (list[i].id === id) {
        if (list[i].url) {
          wx.navigateTo({
            url: `../../packageAPI/pages/${list[i].id}/${list[i].url}`
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
