const chatRecordTypes = ['text', 'image', 'video', 'other']

const mockData = {
  materials: [
    {
      groupOpenID: '',
      type: 'text/message',
      content: '大家想要中秋去哪玩呀',
    },
    {
      groupOpenID: '',
      type: 'text/message',
      content: '没想好呢，要不要去内蒙古',
    },
    {
      groupOpenID: '',
      type: 'text/message',
      content: '内蒙古有啥好玩的呀',
    },
    {
      groupOpenID: '',
      type: 'image/png',
      name: '图片名称',
      path: 'https://gips2.baidu.com/it/u=1651586290,17201034&fm=3028&app=3028&f=JPEG&fmt=auto&q=100&size=f600_800',
      size: '图片大小'
    },
    {
      groupOpenID: '',
      type: 'text/message',
      content: 'https://mp.weixin.qq.com/s/ZnR0kBKrC4el9aiYpitxHA',
    },
    {
      groupOpenID: '',
      type: 'text/message',
      content: '@欢乐马 的哥哥是不是去过呀',
    },
    {
      groupOpenID: '',
      type: 'text/message',
      content: '对的对的，他去年去过，我去要一下他去年的图片',
    },
    {
      groupOpenID: '',
      type: 'image/png',
      name: '图片名称',
      path: 'https://res.wx.qq.com/wxdoc/dist/assets/img/demo.ef5c5bef.jpg',
      size: '图片大小'
    },
    {
      groupOpenID: '',
      type: 'text/message',
      content: '哇看起来真不错',
    },
    {
      groupOpenID: '',
      type: 'video/mp4',
      name: '视频名称',
      path: '视频路径',
      size: '视频大小'
    },
    {
      groupOpenID: '',
      type: 'text/message',
      content: '视频看起来也很震撼',
    },
    {
      groupOpenID: '',
      type: 'text/message',
      content: '要不再问问行程规划！',
    },
    {
      groupOpenID: '',
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      name: '23中秋 阿尔山行程.xlsx',
      path: '文件路径',
      size: '文件大小',
    },
    {
      groupOpenID: '',
      type: 'application/pdf',
      name: '23中秋 阿尔山行程.pdf',
      path: '文件路径',
      size: '文件大小',
    },
  ]
}

Page({
  data: {
    materials: [],
    canvasWidth: 0,
    canvasHeight: 0
  },

  onUnload() {
    if (wx.offThemeChange) {
      wx.offThemeChange()
    }
  },

  onLoad() {
    this._forwardMaterials = []
    this.getMaterials()
    // this.formatMaterials(mockData.materials)

    this.setData({
      theme: getApp().globalData.theme || 'light'
    })

    if (wx.onThemeChange) {
      wx.onThemeChange(({ theme }) => {
        this.setData({ theme })
      })
    }
  },

  getMaterials() {
    const that = this
    wx.getChatForwardMaterials({
      needGroupOpenID: true,
      success(res) {
        if (res.materials) {
          that.formatMaterials(res.materials)
        }
      }
    })
  },

  formatMaterials(forwardMaterials = []) {
    this._forwardMaterials = forwardMaterials
    this.triggerMergedImage()

    const materials = []
    for (const item of forwardMaterials) {
      let recordType = ''
      if (item.type === 'text/message') {
        recordType = chatRecordTypes[0]
      } else if (item.type.startsWith('image/')) {
        recordType = chatRecordTypes[1]
      } else if (item.type.startsWith('video/')) {
        recordType = chatRecordTypes[2]
      } else {
        recordType = chatRecordTypes[3]
      }
      materials.push({
        ...item,
        recordType,
      })
    }
    this.setData({
      materials
    })
  },

  async triggerMergedImage() {
    try {
      const tempFilePaths = this._forwardMaterials
        .filter(item => item.type.startsWith('image'))
        .map(item => item.path)
      console.info('tempFilePaths: ', tempFilePaths)
      const shareImagePath = await this.mergeImages(tempFilePaths)
      this.setData({
        shareImagePath,
      })
      console.info('shareImagePath: ', shareImagePath)
    } catch (error) {
      console.error('mergeImages fail: ', error)
    }
  },

  shareMergedImage() {
    if (!this.data.shareImagePath) {
      wx.showToast({
        title: '拼图失败',
        icon: 'none'
      })
      this.triggerMergedImage()
      return
    }
    wx.shareImageToGroup({
      imagePath: this.data.shareImagePath,
      needShowEntrance: false,
      complete(res) {
        console.info('shareImageToGroup: ', res)
      }
    })
  },

  async mergeImages(tempFilePaths) {
    try {
      // 获取 canvas 节点
      const { node: canvas, width: cw, height: ch } = await this.getCanvasNode()

      // 获取 2D 上下文
      const ctx = canvas.getContext('2d')

      // 预加载所有图片
      const images = await this.loadAllImages(canvas, tempFilePaths)

      // 绘制图片
      this.drawImages(ctx, images, 400)

      // 生成临时文件
      return await this.canvasToTempFile(canvas)
    } catch (err) {
      console.error('合并失败:', err)
      return null
    }
  },

  // 获取 Canvas 节点（Promise 封装）
  getCanvasNode() {
    return new Promise((resolve, reject) => {
      wx.createSelectorQuery()
        .select('#myCanvas')
        .fields({ node: true, size: true })
        .exec(res => {
          if (res[0]) resolve(res[0])
          else reject(new Error('Canvas 节点获取失败'))
        })
    })
  },

  // 计算画布尺寸
  calculateLayout(paths) {
    const imgSize = 100
    const spacing = 10
    const perLine = 3

    const rows = Math.ceil(paths.length / perLine)
    return {
      canvasWidth: perLine * imgSize + (perLine - 1) * spacing,
      canvasHeight: rows * imgSize + (rows - 1) * spacing
    }
  },

  // 加载所有图片（Web Image 对象）
  loadAllImages(canvas, paths) {
    return Promise.all(paths.map(url => new Promise((resolve, reject) => {
      const image = canvas.createImage()
      image.onload = () => resolve(image)
      image.onerror = reject
      image.src = url // 支持本地路径和网络图片
    })))
  },

  // 执行图片绘制
  drawImages(ctx, images, canvasWidth) {
    const imgSize = 100
    const spacing = 10
    const perLine = 3

    images.forEach((image, index) => {
      const row = Math.floor(index / perLine)
      const col = index % perLine

      const x = col * (imgSize + spacing)
      const y = row * (imgSize + spacing)

      // 绘制图像（支持缩放裁剪）
      ctx.drawImage(
        image,
        0,
        0,
        image.width,
        image.height, // 源图裁剪区域
        x,
        y,
        imgSize,
        imgSize // 画布绘制区域
      )
    })
  },

  // Canvas 转临时文件
  canvasToTempFile(canvas) {
    return new Promise((resolve, reject) => {
      wx.canvasToTempFilePath({
        canvas,
        fileType: 'png',
        width: 400,
        height: 500,
        quality: 1,
        success: res => resolve(res.tempFilePath),
        fail: reject
      })
    })
  }

})
