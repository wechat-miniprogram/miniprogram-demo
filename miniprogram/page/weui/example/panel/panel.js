var base64 = require("../images/base64");

import CustomPage from '../../base/CustomPage'
CustomPage({
    onShareAppMessage() {
        return {
          title: 'panel',
          path: 'page/weui/example/panel/panel'
        }
      },
    onLoad: function(){
        this.setData({
            icon20: base64.icon20,
            icon60: base64.icon60
        });
    }
});