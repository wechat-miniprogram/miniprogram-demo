// 自定义组件
import '../../xr-custom/components/AutoRotate'
import '../../xr-custom/components/Particle/SystemProperty/BasicParticle'
import '../../xr-custom/components/Particle/index'
import '../../xr-custom/elements/xr-auto-rotate-touchable-gltf'
import '../../xr-custom/elements/xr-custom-particle'
// 自定义Geometry
import '../../xr-custom/assets/geometry-star'
import '../../xr-custom/assets/geometry-specialCylinder'
// 自定义材质
import '../../xr-custom/elements/xr-shining-star'
// 自定义effect
import '../../xr-custom/assets/effect-shining'
import '../../xr-custom/assets/effect-last-record-final'

import list from './data/index'

let first = true

Page({
  data: {
    list,
    root: '/packageXRFrame'
  },
  onLoad() {
    if (first) {
      console.log('Entry xr-frame index page')
      wx.reportEvent('xr_frame', {
        xr_page_path: '/pages/index/index'
      })
      first = false
    }
  },
  onShareAppMessage() {
    return {
      title: 'XR-FRAME官方示例'
    }
  },
  onShareTimeline() {
    return {
      title: 'XR-FRAME官方示例'
    }
  },
  clickHandle(e) {
    const root = this.data.root
    const { name, path } = e.detail.item

    if (!path) {
      return
    }

    if (path === '/pages/scene-last-record/index') {
      return
    }

    if (path) {
      wx.navigateTo({
        url: root + path + `?path=${path}`,
        success: () => {
        },
        fail: () => {
        },
      })
    }
  }
})
