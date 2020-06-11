
Component({
  options: {
    addGlobalClass: true,
    pureDataPattern: /^_/,
    multipleSlots: true
  },
  properties: {
    tabs: {type: Array, value: []},
    tabClass: {type: String, value: ''},
    swiperClass: {type: String, value: ''},
    activeClass: {type: String, value: ''},
    tabUnderlineColor: {type: String, value: '#07c160'},
    tabActiveTextColor: {type: String, value: '#000000'},
    tabInactiveTextColor: {type: String, value: '#000000'},
    tabBackgroundColor: {type: String, value: '#ffffff'},
    activeTab: {type: Number, value: 0},
    swipeable: {type: Boolean, value: true},
    animation: {type: Boolean, value: true},
    duration: {type: Number, value: 500},
    theme: {type: String, value: 'light'} // light dark
  },
  data: {
    currentView: 0
  },
  observers: {
    activeTab: function activeTab(_activeTab) {
      const len = this.data.tabs.length
      if (len === 0) return
      let currentView = _activeTab - 1
      if (currentView < 0) currentView = 0
      if (currentView > len - 1) currentView = len - 1
      this.setData({currentView})
    }
  },
  lifetimes: {
    created: function created() {}
  },
  methods: {
    handleTabClick: function handleTabClick(e) {
      const index = e.currentTarget.dataset.index
      this.setData({activeTab: index})
      this.triggerEvent('tabclick', {index})
    },
    handleSwiperChange: function handleSwiperChange(e) {
      const index = e.detail.current
      this.setData({activeTab: index})
      this.triggerEvent('change', {index})
    }
  }
})
