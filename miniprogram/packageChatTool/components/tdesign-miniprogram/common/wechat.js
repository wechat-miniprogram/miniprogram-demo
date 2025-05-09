export const getObserver = (context, selector) => new Promise((resolve, reject) => {
  context
    .createIntersectionObserver(context)
    .relativeToViewport()
    .observe(selector, (res) => {
      resolve(res)
    })
})
export const getWindowInfo = () => (wx.getWindowInfo ? wx.getWindowInfo() || wx.getSystemInfoSync() : wx.getSystemInfoSync())
export const getAppBaseInfo = () => (wx.getAppBaseInfo ? wx.getAppBaseInfo() || wx.getSystemInfoSync() : wx.getSystemInfoSync())
export const getDeviceInfo = () => (wx.getDeviceInfo ? wx.getDeviceInfo() || wx.getSystemInfoSync() : wx.getSystemInfoSync())
