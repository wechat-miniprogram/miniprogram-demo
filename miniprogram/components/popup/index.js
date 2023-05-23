Component({
  properties: {
    maskClosable: {
      type: Boolean,
      value: true,
    },
    mask: {
      // 是否需要 遮罩层
      type: Boolean,
      value: true,
    },
    maskStyle: {
      // 遮罩层的样式
      type: String,
      value: '',
    },
    show: {
      // 是否开启弹窗
      type: Boolean,
      value: false,
    },
  },
  data: {
    enable: true,
  },
  methods: {
    close() {
      const { data } = this;
      console.log('@@@ close', data.maskClosable)
      if (!data.maskClosable) return;
      this.setData({
        enable: !this.data.enable
      });
      this.triggerEvent('close', {}, {});
    },
    // stopEvent() {},
  },
});
