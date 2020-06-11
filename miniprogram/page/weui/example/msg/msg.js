import CustomPage from '../../base/CustomPage'

CustomPage({   
    onShareAppMessage() {
        return {
          title: 'msg',
          path: 'page/weui/example/msg/msg'
        }
      }, 
    openSuccess: function () {
        wx.navigateTo({
            url: 'msg_success'
        })
    },
    openText: function () {
        wx.navigateTo({
            url: 'msg_text'
        })
    },
    openTextPrimary: function () {
        wx.navigateTo({
            url: 'msg_text_primary'
        })
    },
    openFail: function () {
        wx.navigateTo({
            url: 'msg_fail'
        })
    }
});
