// packageSkyline/pages/tab/index.ts
import { shared } from '../../common/worklet-api';

enum ScrollState {
  scrollStart,
  scrollUpdate,
  scrollEnd
}

const tabs = [
  {
    title: '性能优化',
    title2: '小程序性能优化实践',
    img: 'http://mmbiz.qpic.cn/mmbiz_jpg/PxLPibq1ibyh0U4e0qLqNrULAUzW5UbWbicUN5GyJqd24GR0Ricg5q14VGGBWlicNca8x4xelvDrM1r0ibwAjAsR0bOA/0?wx_fmt=jpeg',
    desc: '小程序性能优化课程基于实际开发场景，由资深开发者分享小程序性能优化的各项能力及应用实践，提升小程序性能表现，满足用户体验。',
  },
  {
    title: '新能力解读',
    title2: '小程序开发新能力解读',
    img: 'http://mmbiz.qpic.cn/sz_mmbiz_png/GEWVeJPFkSH05EZMIBafqzpoZVSXtCE47V7icf0gru4KPUzMjIcIibJPUlXqbZib4VNmTecxef987XEWib2vhwuqbQ/0?wx_fmt=png',
    desc: '这个月小程序释放了什么新能力？又有哪些新规则？收藏课程，及时了解小程序开发动态，听官方为你解读新能力。',
  },
  {
    title: '基础开发',
    title2: '小程序基础开发之架构、框架、组件',
    img: 'http://mmbiz.qpic.cn/sz_mmbiz_jpg/GEWVeJPFkSEz7tgvlaTtv2MYO01RZr0yNgtbEZJzcbRl0deOWmSbX0UfRHPt78UCOxPIVYnhAiaJVib40SviaV1Vw/0?wx_fmt=jpeg',
    desc: '小程序基础开发之架构、框架、组件，更多课程正在制作中...',
  },
]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tabList: ['gallery', 'media', 'souvenir'],
    selectedTab: 'gallery',
    swiperSelect: 0,
    tabs: tabs
  },

  onTapTab(evt: any) {
    const { tab } = evt.currentTarget.dataset || {}
    this.setData({
      selectedTab: tab,
      swiperSelect: tab === 'gallery' ? 0 : tab === 'media' ? 1 : 2,
    })
  },

  onTabChanged(evt: any) {
    const index = evt.detail.current
    this.setData({
      selectedTab: index === 0 ? 'gallery' : index === 1 ? 'media' : 'souvenir',
      swiperSelect: index,
    })
  },

  onTabTransition(evt: any) {
    'worklet'
    const translateRatio = evt.detail.dx / this._windowWidth.value
    this._translateX.value = this._lastTranslateX.value + translateRatio * this._tabWidth.value

    // 控制 scale 值，拖到中间时 scale 处于最大值 1，两端递减
    const scaleRatio = (this._translateX.value / this._tabWidth.value) % 1
    const changedScale = scaleRatio <= 0.5 ? scaleRatio : (1 - scaleRatio)
    this._scaleX.value = Math.abs(changedScale) * 0.6 + 0.7

    if (evt.detail.state === ScrollState.scrollEnd) {
      this._lastTranslateX.value = this._translateX.value
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // const { screenWidth, windowWidth } = wx.getSystemInfoSync()
    // this._translateX = shared(0)
    // this._lastTranslateX = shared(0)
    // this._scaleX = shared(0.7)
    // this._tabWidth = shared(windowWidth / 3)
    // this._windowWidth = shared(windowWidth)

    // this.applyAnimatedStyle('.tab-border', () => {
    //   'worklet'
    //   return {
    //     transform: `translateX(${this._translateX.value}px) scaleX(${this._scaleX.value})`,
    //   }
    // })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: 'Tab 组件',
      path: 'packageSkyline/pages/tabs/index'
    }
  },
})