const defaultTabBarStyle = {
  color: '#7A7E83',
  selectedColor: '#3cc51f',
  backgroundColor: '#ffffff',
}
const darkDefaultTabBarStyle = {
  color: '#FFFFFF',
  selectedColor: '#51A937',
  backgroundColor: '#1F1F1F',
}

const defaultItemName = '接口'

Component({
  data: {
    hasSetTabBarBadge: false,
    hasShownTabBarRedDot: false,
    hasCustomedStyle: false,
    hasCustomedItem: false,
    hasHiddenTabBar: false,
    theme: 'light'
  },

  attached() {
    this.setData({
      theme: wx.getSystemInfoSync().theme || 'light'
    })

    if (wx.onThemeChange) {
      wx.onThemeChange(({theme}) => {
        this.setData({theme})
        if (this.data.theme == 'dark') {
          wx.setTabBarStyle(darkDefaultTabBarStyle)
        } else {
          wx.setTabBarStyle(defaultTabBarStyle)
        }
      })
    }
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
  },

  detached() {
    this.removeTabBarBadge()
    this.hideTabBarRedDot()
    this.showTabBar()
    this.removeCustomStyle()
    this.removeCustomItem()
  },

  methods: {
    navigateBack() {
      this.triggerEvent('unmount')
    },

    setTabBarBadge() {
      if (this.data.hasSetTabBarBadge) {
        this.removeTabBarBadge()
        return
      }
      this.setData({
        hasSetTabBarBadge: true
      })
      wx.setTabBarBadge({
        index: 1,
        text: '1',
      })
    },

    removeTabBarBadge() {
      this.setData({
        hasSetTabBarBadge: false
      })
      wx.removeTabBarBadge({
        index: 1,
      })
    },

    showTabBarRedDot() {
      if (this.data.hasShownTabBarRedDot) {
        this.hideTabBarRedDot()
        return
      }
      this.setData({
        hasShownTabBarRedDot: true
      })
      wx.showTabBarRedDot({
        index: 1
      })
    },

    hideTabBarRedDot() {
      this.setData({
        hasShownTabBarRedDot: false
      })
      wx.hideTabBarRedDot({
        index: 1
      })
    },

    showTabBar() {
      this.setData({hasHiddenTabBar: false})
      wx.showTabBar()
    },

    hideTabBar() {
      if (this.data.hasHiddenTabBar) {
        this.showTabBar()
        return
      }
      this.setData({hasHiddenTabBar: true})
      wx.hideTabBar()
    },

    customStyle() {
      if (this.data.hasCustomedStyle) {
        this.removeCustomStyle()
        return
      }
      this.setData({hasCustomedStyle: true})
      wx.setTabBarStyle({
        color: '#FFF',
        selectedColor: '#1AAD19',
        backgroundColor: '#000000',
      })
    },

    removeCustomStyle() {
      this.setData({hasCustomedStyle: false})
      if (this.data.theme == 'dark') {
        wx.setTabBarStyle(darkDefaultTabBarStyle)
      } else {
        wx.setTabBarStyle(defaultTabBarStyle)
      }
    },

    customItem() {
      if (this.data.hasCustomedItem) {
        this.removeCustomItem()
        return
      }
      this.setData({hasCustomedItem: true})
      wx.setTabBarItem({
        index: 1,
        text: 'API'
      })
    },

    removeCustomItem() {
      this.setData({hasCustomedItem: false})
      wx.setTabBarItem({
        index: 1,
        text: defaultItemName
      })
    }
  }
})
