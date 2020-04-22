const createRecycleContext = require
('miniprogram-recycle-view')

// fakeList
const newList = new Array(300).fill(0);
for(let i = 0; i < newList.length; i++) {
  newList[i] = {
    idx: i,
    title: '列表标题',
    image_url: './images/list-img.png'
  }
}

const rpx2px = (rpx) => {
  return (rpx / 750) * wx.getSystemInfoSync().windowWidth
}
Page({
  data: {

  },
  onLoad(options) {

  },
  onReady() {
    const ctx = createRecycleContext({
      id: 'recycleId',
      dataKey: 'recycleList',
      page: this,
      itemSize: {
        height: rpx2px(300),
        width: rpx2px(750)
      }
    })
    ctx.append(newList)
  },
  
})
