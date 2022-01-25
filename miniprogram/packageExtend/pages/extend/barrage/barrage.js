import CustomPage from '../../../base/CustomPage'

const {mockData} = require('./utils')

CustomPage({
  onShareAppMessage() {
    return {
      title: 'barrage',
      path: 'packageExtend/pages/extend/barrage/barrage'
    }
  },
  data: {
    src: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
    toggle: true,
    barrageValue: '',
    showBarrage: false,
  },
  onReady() {
    this.addBarrage()
  },
  addBarrage() {
    const barrageComp = this.selectComponent('.barrage')
    this.barrage = barrageComp.getBarrageInstance({
      font: 'bold 16px sans-serif', // 字体
      duration: 15, // 弹幕时间 （移动 2000px 所需时长）
      lineHeight: 2, // 弹幕行高
      mode: 'overlap', // 弹幕重叠 overlap 不重叠 separate
      padding: [10, 10, 10, 10], // 弹幕区四周
      range: [0, 1],
      tunnelShow: false,
    })
    // this.barrage.open()
    // const data = mockData(100)
    // this.barrage.addData(data)
    // this.timer = setInterval(() => {
    //   const data = mockData(100);
    //   this.barrage.addData(data);
    // }, 2000)
  },
  fullscreenchange() {
    this.setData({
      toggle: false
    })
    setTimeout(() => {
      if (this.barrage) this.barrage.close()
      this.setData({toggle: true})
      this.addBarrage()
    }, 1000)
  },
  handleOpenClick() {
    this.setData({
      showBarrage: true,
    })
    this.barrage.open()
    const data = mockData(3)
    this.barrage.addData(data)
    this.timer = setInterval(() => {
      const data = mockData(5)
      this.barrage.addData(data)
    }, 2000)
  },
  handleCloseClick() {
    this.barrage.close()
    this.setData({
      showBarrage: false,
    })
  },
  handleInput(e) {
    this.setData({
      barrageValue: e.detail.value,
    })
  },
  handleAddClick() {
    const data = mockData(1, [this.data.barrageValue])
    this.barrage.addData(data)
    this.setData({
      barrageValue: '',
    })
  },
  handleTunnelShowClick() {
    this.barrage.showTunnel()
  },
  handleTunnelHideClick() {
    this.barrage.hideTunnel()
  }
})
