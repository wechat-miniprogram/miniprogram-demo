module.exports = Behavior({
  behaviors: [],
  properties: {
  },
  data: {
    left: 0,
    right: 0,
    width: 300,
    height: 300,
    renderWidth: 300,
    renderHeight: 300,
    windowHeight: 1000,
    activeValues: [1],
  },
  attached: function(){},
  ready() {
    const info = wx.getSystemInfoSync();
    const width = info.windowWidth;
    const windowHeight = info.windowHeight;
    const height = windowHeight * 0.6;
    const dpi = info.pixelRatio;
    this.setData({
      width,
      height,
      renderWidth: width * dpi,
      renderHeight: height * dpi,
      windowHeight
    });
  },
  methods: {
    onLoad(options) {
      wx.reportEvent("xr_frame", {
        "xr_page_path": options.path
      });
    },
    onShareAppMessage() {
      try {
        if (wx.xrScene) {
          const buffer = wx.xrScene.share.captureToArrayBuffer({quality: 0.5});
          const fp = `${wx.env.USER_DATA_PATH}/xr-frame-share.jpg`;
          wx.getFileSystemManager().writeFileSync(fp, buffer, 'binary');
          return {
            title: this.getTitle(),
            imageUrl: fp
          };
        }
      } catch (e) {
        return {
          title: this.getTitle()
        };
      }
    },
    onShareTimeline() {
      try {
        if (wx.xrScene) {
          const buffer = wx.xrScene.share.captureToArrayBuffer({quality: 0.5});
          const fp = `${wx.env.USER_DATA_PATH}/xr-frame-share.jpg`;
          wx.getFileSystemManager().writeFileSync(fp, buffer, 'binary');
          return {
            title: this.getTitle(),
            imageUrl: fp
          };
        }
      } catch (e) {
        return {
          title: this.getTitle()
        }
      }
    },
    getTitle() {
      return wx.xrTitle ? `XR - ${wx.xrTitle}` : 'XR-FRAME官方示例';
    },
    handleChange(e) {
      this.setData({
        activeValues: e.detail.value,
      });
    },
  }
})