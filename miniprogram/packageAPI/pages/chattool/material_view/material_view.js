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
      type: 'text/message',
      content: '阿尔山的秋天很美',
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
      type: 'image/png',
      name: '图片名称',
      path: '图片路径',
      size: '图片大小'
    },
    {
      groupOpenID: '',
      type: 'image/png',
      name: '图片名称',
      path: '图片路径',
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
    materials: []
  },

  onUnload() {
    if (wx.offThemeChange) {
      wx.offThemeChange()
    }
  },

  onLoad() {
    this.getMaterials()
    // this.formatMaterials(mockData.materials)

    this.setData({
      theme: wx.getSystemInfoSync().theme || 'light'
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
        res.materials = mockData.materials
        if (res.materials) {
          that.formatMaterials(res.materials)
        }
      }
    })
  },

  formatMaterials(forwardMaterials = []) {
    let id = 0
    const materials = []
    for (let item of forwardMaterials) {
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

  })
