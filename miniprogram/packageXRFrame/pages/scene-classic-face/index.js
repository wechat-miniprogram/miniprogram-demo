Page({
  behaviors: [],
  data: {
  },
  onLoad() {
    const info = wx.getSystemInfoSync();
    const width = info.windowWidth;
    const height = info.windowHeight;
    const dpi = info.pixelRatio;
    this.setData({
      width, height,
      renderWidth: width * dpi,
      renderHeight: height * dpi
    });
    wx.reportEvent("xr_frame", {
      "xr_page_path": options.path
    });
  }
});