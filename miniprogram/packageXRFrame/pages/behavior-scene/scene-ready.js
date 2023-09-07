module.exports = Behavior({
  behaviors: [],
  properties: {
  },
  data: {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    renderWidth: 0,
    renderHeight: 0,
    windowHeight: 1000,
    heightScale: 0.75,
    dpiScale: 1,
    showBackBtn: false,
    activeValues: [1],
    arTrackerShow: false,
    arTrackerState: 'Init',
    arTrackerError: ''
  },
  attached: function(){},
  ready() {
    const info = wx.getSystemInfoSync();
    const width = info.windowWidth;
    const windowHeight = info.windowHeight;
    const height = windowHeight * this.data.heightScale;
    const dpi = info.pixelRatio;
    this.setData({
      width,
      height,
      renderWidth: width * dpi * this.data.dpiScale,
      renderHeight: height * dpi * this.data.dpiScale,
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
    handleARTrackerState({detail}) {
      const {state, error} = detail;
      this.setData({
        arTrackerShow: true,
        arTrackerState: wx.getXrFrameSystem().EARTrackerState[state],
        arTrackerError: error
      });
    }
  }
})