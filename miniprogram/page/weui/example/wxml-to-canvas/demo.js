const wxml = (url) => `
  <image class="img" mode="aspectFit" src="${url}"></image>
`


const style = {
  
  img: {
    width: 300,
    height: 200,
  }
}

module.exports = {
  wxml,
  style
}
