const urls = [

  'cloud://release-b86096.7265-release-b86096-1258211818/微信小程序直播.mp4',
  'cloud://release-b86096.7265-release-b86096-1258211818/小程序直播2.mp4',
  'cloud://release-b86096.7265-release-b86096-1258211818/小程序直播预告.mp4',
  'cloud://release-b86096.7265-release-b86096-1258211818/小程序订单管理功能02.mp4',
  'cloud://release-b86096.7265-release-b86096-1258211818/微信小程序直播.mp4'

]
Page({
  data: {
    videoList: [],
  },
  onLoad() {

    const that = this;
    wx.cloud.getTempFileURL({
      fileList: urls,
      success: res => {
        if (res.fileList && res.fileList.length) {
          const videoList = res.fileList.map((item, index) => ({ id: index + 1, url: item.tempFileURL }))
          console.log(videoList)
          that.setData({
            videoList,
            show: true,
          }, () => {
            console.log(that.data)
          })
        }
      },
      fail: err => {
        console.error(err)
      },
    })
    
  },
  onReady() {

  },
  onShow() {

  },
  onHide() {

  },
  onUnload() {

  },
  onPlay(e) {},

  onPause(e) {
    //  console.log('pause', e.detail.activeId)
  },

  onEnded(e) {},

  onError(e) {},

  onWaiting(e) {},

  onTimeUpdate(e) {},

  onProgress(e) {},

  onLoadedMetaData(e) {
    console.log('LoadedMetaData', e)
  }
});