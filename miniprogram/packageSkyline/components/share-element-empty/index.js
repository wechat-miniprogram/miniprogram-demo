import { getRectInfo } from '../../utils/tool'
import { THUMBNAIL_CNT_HEIGHT } from '../../utils/constant'

Component({
  data: {
    safeAreaInsetBottom: 0,
    statusBarHeight: 0,
    navigationBarHeight: 0,
    THUMBNAIL_CNT_HEIGHT,
  },

  lifetimes: {
    attached() {
      const { statusBarHeight, navigationBarHeight, safeAreaInsetBottom } = getRectInfo()
      this.setData({
        statusBarHeight,
        navigationBarHeight,
        safeAreaInsetBottom,
      })
    },
  },
})
