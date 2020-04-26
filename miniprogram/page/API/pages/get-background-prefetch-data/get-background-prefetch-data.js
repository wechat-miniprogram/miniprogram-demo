// 使用预缓存数据的时候，需要先调用setBackgroundFetchToken, 可在 app.js 中查看具体例子

Date.prototype.Format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o){
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }				
  }
    
  return fmt;
}

Page({
  onLoad() {
    // 获取缓存的周期性更新数据
    this.getBackgroundFetchData();
  },
  data: {
    openid: '',
    appid: '',
    getDataTime: '',
  },
  getBackgroundFetchData() {
    console.log('读取周期性更新数据')
    const that = this;
    wx.getBackgroundFetchData({
      fetchType: 'pre',
      success(res) {
        console.log(res)
        const { fetchedData } = res;
        const result = JSON.parse(fetchedData)
        // 在 Iphone 下返回的 timeStamp 单位是秒
        const systemInfo = wx.getSystemInfoSync();
        const timeStamp = systemInfo.brand === 'iPhone' ? res.timeStamp * 1000 : res.timeStamp
        const time = new Date(timeStamp).Format("yyyy-MM-dd hh:mm:ss");
        that.setData({
          appid: result.appid,
          openid: result.openid,
          getDataTime: time,

        })
        console.log('读取周期性更新数据成功')
      },
      fail() {
        console.log('读取周期性更新数据失败')
        wx.showToast({
          title: '无缓存数据',
          icon: 'none'
        })
      },
      complete() {
        console.log('结束读取')
      }
    })
  }
})