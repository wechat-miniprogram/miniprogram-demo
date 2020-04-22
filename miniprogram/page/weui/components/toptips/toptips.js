
Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    type: {
      type: String,
      value: 'error',
      observer: '_typeChange'
    },
    show: {
      type: Boolean,
      value: false,
      observer: '_showChange'
    },
    msg: {
      type: String,
      value: ''
    },
    delay: {
      type: Number,
      value: 2000
    },
    extClass: {
      type: String,
      value: ''
    }
  },
  data: {
    typeClassMap: {
      warn: 'weui-toptips_warn',
      info: 'weui-toptips_info',
      success: 'weui-toptips_success',
      error: 'weui-toptips_error'
    }
  },
  lifetimes: {
    attached: function attached() {
      const data = this.data
      this.setData({
        className: data.typeClassMap[data.type] || ''
      })
    },
  },

  methods: {
    _typeChange: function _typeChange(newVal) {
      this.setData({
        className: this.data.typeClassMap[newVal] || ''
      })
      return newVal
    },
    _showChange: function _showChange(newVal) {
      this._showToptips(newVal)
    },
    _showToptips: function _showToptips(newVal) {
      const _this = this

      if (newVal && this.data.delay) {
        setTimeout(function () {
          _this.setData({
            show: false
          }, function () {
            _this.triggerEvent('hide', {}, {})
          })
        }, this.data.delay)
      }
      this.setData({
        show: newVal
      })
    }
  }
})
