import EventBus from '../../utils/event-bus'

let windowWidth = 0

function transformListToLineBlock(list, lineLimit) {
  const lineList = []
  for (let i = 0, len = list.length; i < len; i += lineLimit) {
    const line = { index: Math.floor(i / lineLimit), list: [] }
    for (let j = 0; j < lineLimit; j++) {
      const index = i + j
      const item = list[index]
      if (item) line.list.push({
        ...item,
        index,
      })
    }
    lineList.push(line)
  }
  return lineList
}

Component({
  properties: {
    list: {
      type: Array,
      value: [],
    },

    width: {
      type: Number,
      value: 0,
    },

    imageWidth: {
      type: Number,
      value: 0,
    },
  },

  data: {
    showWidth: 0,
    showImageWidth: 0,
    imageMargin: 0,
    lineLimit: 0,
    showList: [],
  },

  observers: {
    'list, width, imageWidth'() {
      this.renderList()
    },
  },

  lifetimes: {
    attached() {
      // 预览页切换时，要将对应 image 滚动到到可视范围内
      const pageId = this.getPageId()
      let scrollIntoViewTimer = null
      this._onPreviewerChange = image => {
        const list = this.data.list
        const index = list.findIndex(item => item.id === image.id)
  
        if (index !== -1) {
          if (scrollIntoViewTimer) clearTimeout(scrollIntoViewTimer)
          scrollIntoViewTimer = setTimeout(() => {
            let lineIndex = Math.floor(index / this.data.lineLimit)
            this.setData({ scrollIntoView: `line-${lineIndex}` })
          }, 500)
        }
      }
      EventBus.on(`${pageId}PreviewerChange`, this._onPreviewerChange)
    },

    detached() {
      const pageId = this.getPageId()
      EventBus.off(`${pageId}PreviewerChange`, this._onPreviewerChange)
    },
  },

  methods: {
    renderList() {
      const { list } = this.data
      let { width, imageWidth } = this.data
      if (!list.length) return

      if (!windowWidth) windowWidth = wx.getSystemInfoSync().windowWidth
      if (!width) width = windowWidth
      if (!imageWidth) imageWidth = (width - 30) / 3

      if (imageWidth > width) {
        console.error('imageWidth must be less than or equal to width')
        return
      }

      const lineLimit = Math.floor(width / imageWidth)
      this.setData({
        showWidth: width,
        showImageWidth: imageWidth,
        imageMargin: (width - (imageWidth * lineLimit)) / (lineLimit - 1),
        lineLimit,
        showList: transformListToLineBlock(list, lineLimit),
      })
    },

    onTapImage(evt) {
      const { index } = evt.currentTarget.dataset || {}
      this.triggerEvent('tapimage', { index })
    },
  },
})
