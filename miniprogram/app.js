const config = require('./config')

const themeListeners = []
global.isDemo = true
App({

  onLaunch(opts, data) {
    const that = this
    const canIUseSetBackgroundFetchToken = wx.canIUse('setBackgroundFetchToken')
    if (canIUseSetBackgroundFetchToken) {
      wx.setBackgroundFetchToken({
        token: 'getBackgroundFetchToken',
      })
    }
    if (wx.getBackgroundFetchData) {
      wx.getBackgroundFetchData({
        fetchType: 'pre',
        success(res) {
          that.globalData.backgroundFetchData = res
          console.log('读取预拉取数据成功', res)
        },
        fail() {
          console.log('读取预拉取数据失败')
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
    console.log('App Launch', opts)
    if (data && data.path) {
      wx.navigateTo({
        url: data.path,
      })
    }
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: config.envId,
        traceUser: true,
      })
    }
    const getSystemInfo = [
      'getSystemSetting',
      'getAppAuthorizeSetting',
      'getDeviceInfo',
      'getAppBaseInfo',
      'getWindowInfo'
    ]

    getSystemInfo.forEach(apiName => {
      if (wx[apiName]) {
        Object.assign(this.globalData, wx[apiName]())
      }
    })
    // eslint-disable-next-line promise/always-return
    require.async('./packageSkyline/common/custom-route/index.js').then(utils => {
      console.log('--------begin installRouteBuilder')
      utils.installRouteBuilder() // 'common'
    }).catch(({ mod, errMsg }) => {
      console.error(`installRouteBuilder path: ${mod}, ${errMsg}`)
    })
    this.registerAgentHandoff()
    this.ensureCafeDemoUser()
  },

  onShow(opts) {
    console.log('App Show', opts)
    console.log('USER_DATA_PATH', wx.env.USER_DATA_PATH)
    // console.log(wx.getSystemInfoSync())
  },
  onHide() {
    console.log('App Hide')
  },
  onThemeChange({ theme }) {
    this.globalData.theme = theme
    themeListeners.forEach((listener) => {
      listener(theme)
    })
  },
  watchThemeChange(listener) {
    if (themeListeners.indexOf(listener) < 0) {
      themeListeners.push(listener)
    }
  },
  unWatchThemeChange(listener) {
    const index = themeListeners.indexOf(listener)
    if (index > -1) {
      themeListeners.splice(index, 1)
    }
  },
  globalData: {
    theme: wx.getAppBaseInfo().theme,
    hasLogin: false,
    openid: null,
    iconTabbar: '/page/extend/images/icon_tabbar.png',
    systemInfo: {},
    agentHandoffs: {}
  },

  registerAgentHandoff() {
    if (!wx.onAgentHandoff) {
      console.warn('[App] 当前基础库不支持 wx.onAgentHandoff，请使用支持小微 handoff 的版本')
      return
    }
    wx.onAgentHandoff(({ pageId, path, query, payload }) => {
      console.log('[App] onAgentHandoff', { pageId, path, query, payload })
      this.globalData.agentHandoffs = this.globalData.agentHandoffs || {}
      this.globalData.agentHandoffs[pageId] = { path, query, payload }
    })
  },

  takeAgentHandoff(pageId) {
    const map = this.globalData.agentHandoffs || {}
    const handoff = map[pageId]
    if (handoff) delete map[pageId]
    return handoff || null
  },

  ensureCafeDemoUser() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo && userInfo.openid) {
      this.globalData.userInfo = userInfo
      return
    }
    const mockOpenid = `mock_${Date.now()}`
    const next = {
      openid: mockOpenid,
      unionid: `union_${mockOpenid}`,
      nickname: `用户${Math.floor(Math.random() * 10000)}`,
      avatarUrl: '',
      loginTime: new Date().toISOString()
    }
    wx.setStorageSync('userInfo', next)
    this.globalData.userInfo = next
    const initialized = wx.getStorageSync(`initialized_${mockOpenid}`)
    if (!initialized) {
      wx.setStorageSync(`address_${mockOpenid}`, null)
      wx.setStorageSync(`orders_${mockOpenid}`, [])
      wx.setStorageSync(`pending_order_${mockOpenid}`, null)
      wx.setStorageSync(`active_order_${mockOpenid}`, null)
      wx.setStorageSync(`initialized_${mockOpenid}`, true)
    }
  },
  // lazy loading openid
  getUserOpenId(callback) {
    const self = this

    if (self.globalData.openid) {
      callback(null, self.globalData.openid)
    } else {
      wx.login({
        success() {
          wx.cloud.callFunction({
            name: 'login',
            data: {
              action: 'openid'
            },
            success: res => {
              console.log('拉取openid成功', res)
              self.globalData.openid = res.result.openid
              callback(null, self.globalData.openid)
            },
            fail: err => {
              console.log('拉取用户openid失败，将无法正常使用开放接口等服务', err)
              callback(err)
            }
          })
        },
        fail(err) {
          console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
          callback(err)
        }
      })
    }
  },
  // 通过云函数获取用户 openid，支持回调或 Promise
  getUserOpenIdViaCloud() {
    return wx.cloud.callFunction({
      name: 'wxContext',
      data: {}
    }).then(res => {
      this.globalData.openid = res.result.openid
      return res.result.openid
    })
  }
})
