import Base from '../base'
import { getAlbum } from '../../utils/tool'
import { initRoute } from '../../utils/route'

Page({
  behaviors: [Base],

  data: {
    width: 0,
    imageWidth: 0,
    scrollIntoView: '',
    list: [],
  },

  onLoad() {
    initRoute()
    // 按每行 3 个图片排列
    const lineLimit = 3
    const cntMargin = 25
    const imgMargin = 12
    const { screenWidth } = wx.getSystemInfoSync()
    const width = screenWidth - cntMargin * 2
    const imageWidth = (screenWidth - cntMargin * 2 - imgMargin * 2) / lineLimit
    this.setData({ width, imageWidth })
  },

  onShow() {
    this.refreshAlbum()
  },

  refreshAlbum() {
    const imageList = getAlbum()
    this.setData({ list: imageList })
    this.imageList = imageList
  },

  onTapImage(evt) {
    const { index } = evt.detail || {}
    const image = this.data.list[index]
    if (!image) return

    wx.navigateTo({
      url: `/packageSkyline/pages/preview/index?imageid=${image.id}&sourcepageid=${this.getPageId()}`,
      routeType: 'fadeToggle',
    })
  },

  onBack() {
    wx.exitMiniProgram()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '图片预览',
      path: 'packageSkyline/pages/album/index'
    }
  },
})