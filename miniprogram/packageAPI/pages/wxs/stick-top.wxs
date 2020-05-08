var funcA = function (e, ins) {
  // console.log('source is', JSON.stringify(e))
  var scrollTop = e.detail.scrollTop
  if (scrollTop > 100) {
    ins.selectComponent('.page-group').setStyle({
      "background-color": 'black'
    }).addClass('page-group-position')
    ins.selectComponent('.page-banner .image').setStyle({
      opacity: 0
    })
  } else {
    ins.selectComponent('.page-group').setStyle({
      "background-color": 'rgba(00, 00, 00, ' + Math.max(0, (scrollTop) / 100) + ')'
    }).removeClass('page-group-position')
    ins.selectComponent('.page-banner .image').setStyle({
      opacity: 1 - Math.max(0, (scrollTop) / 100)
    })
  }
}
module.exports = {
  funcA: funcA
}