var func = function (e, instance) {
  var dataset = e.instance.getDataset()
  var st = e.instance.getState()
  var current = st.current || 0
  var imgsize = dataset.imgsize
  var width = dataset.width
  var detail = e.detail
  var dx = e.detail.dx
  // 相比上次没有任何改变, 直接返回
  var diff = typeof st.lastx !== 'undefined' ? (dx - st.lastx) : (dx - 0)
  if (diff === 0) return
  st.continueCount = st.continueCount || 1
  // 连续滑动过程中, 且到达下一个swiper-item的transition开始了, 修正一下current值
  if (Math.abs(dx) > width * st.continueCount && st.tmpcurrent != -1) {
    console.log('mod is 0 some info', st.tmpcurrent, current)
    current = st.tmpcurrent
    st.current = st.tmpcurrent
    st.tmpcurrent = -1
    st.continueCount++
  }
  // 连续滑动dx的值会比width大，这时候要减去多余的width值
  var setToWidth = false
  var dir = dx > 0
  if (dx !== 0 && Math.abs(dx) >= width) {
    setToWidth = true
  }
  dx = dx - width * parseInt(dx / width)
  if (dx === 0 && setToWidth) {
    dx = dir ? width : -width
  }
  // 先判断下方向对不对
  if (current >= imgsize.length - 1 && dx > 0) return
  if (current <= 0 && dx < 0) return
  var currentSize = imgsize[current]
  var nextSize = dx > 0 ? imgsize[current + 1] : imgsize[current - 1]
  var currentHeight = st.currentHeight || currentSize.height
  var diffHeight = Math.abs((nextSize.height - currentSize.height) * (dx / width))
  var realheight = currentSize.height + (nextSize.height - currentSize.height > 0 ? diffHeight : -diffHeight)
  st.currentHeight = realheight
  e.instance.setStyle({
    height: realheight + 'px'
  })
  st.lastdir = dx > 0
  console.log('111', realheight, dx, current, nextSize.height, currentSize.height)
}
module.exports = {
  func: func,
  change: function(e, instance) {
    var st = e.instance.getState()
    console.log('=====change detail is', e.detail.current)
    st.tmpcurrent = e.detail.current
  },
  animationFinish: function(e) {
    var st = e.instance.getState()
    if (typeof st.tmpcurrent === 'undefined' || st.tmpcurrent === -1) return
    console.log('====animation finish is', st.tmpcurrent)
    st.current = st.tmpcurrent
    st.tmpcurrent = -1
    st.continueCount = 1
  }
}