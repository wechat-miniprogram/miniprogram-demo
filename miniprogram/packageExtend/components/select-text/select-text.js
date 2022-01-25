
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    space: {
      type: String,
      value: ''
    },
    decode: {
      type: Boolean,
      value: false
    },
    placement: {
      type: String,
      value: 'top'
    },
    showCopyBtn: {
      type: Boolean,
      value: false
    },
    value: {
      type: String,
      value: ''
    }
  },
  observers: {
    onDocumentTap() {
      this.setData({
        showToolTip: false
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showToolTip: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleLongPress() {
      if (!this.data.showCopyBtn) return
      this.setData({
        showToolTip: true,
      })
    },
    handleCopy() {
      this.setData({
        showToolTip: false
      })
      wx.setClipboardData({
        data: this.data.value,
      })
      this.triggerEvent('copy', {})
    },
    stopPropagation: function stopPropagation(e) {}
  }
})
