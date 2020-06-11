const app = getApp();
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
  onShow() {
    // 获取缓存的预拉取数据
    this.getBackgroundFetchData();
  },
  onShareAppMessage() {
    return {
      title: '预拉取',
      path: 'packageAPI/pages/get-background-prefetch-data/get-background-prefetch-data'
    }
  },
  data: {
    openid: '',
    appid: '',
    getDataTime: '',
    canIUse: true,
  },
  getBackgroundFetchData() {
    if (wx.getBackgroundFetchData) {
      console.log('读取预拉取数据')
      const res = app.globalData.backgroundFetchData;
      const { fetchedData } = res;
      const result = JSON.parse(fetchedData)
      const systemInfo = wx.getSystemInfoSync();
      const timeStamp = systemInfo.brand === 'iPhone' ? res.timeStamp * 1000 : res.timeStamp
      const time = new Date(timeStamp).Format("yyyy-MM-dd hh:mm:ss");
      this.setData({
        appid: result.appid,
        openid: result.openid,
        getDataTime: time,
  
      })
    } else {
      this.setData({
        canIUse: false,
      })
      wx.showModal({
        title: '微信版本过低，暂不支持本功能',
      })
    }
    
  }
})