import CustomPage from '../../base/CustomPage'

CustomPage({
    onShareAppMessage() {
        return {
          title: 'searchbar',
          path: 'page/weui/example/searchbar/searchbar'
        }
      },
    data: {
        inputShowed: false,
        inputVal: "",
        i: 0
    },
    onLoad() {
        this.setData({
            search: this.search.bind(this)
        })
    },
    search: function (value) {
        return new Promise((resolve, reject) => {
            if (this.data.i % 2 === 0) {
                setTimeout(() => {
                    resolve([{text: '搜索结果', value: 1}, {text: '搜索结果2', value: 2}])
                }, 200)
            } else {
                setTimeout(() => {
                    resolve([])
                }, 200)

            }
            this.setData({
                i: this.data.i + 1
            })
        })
    },
    selectResult: function (e) {
        console.log('select result', e.detail)
    },
});