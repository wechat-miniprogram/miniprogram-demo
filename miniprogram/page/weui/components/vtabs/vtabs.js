

Component({
    options: {
        addGlobalClass: true,
        pureDataPattern: /^_/,
        multipleSlots: true
    },
    properties: {
        vtabs: { type: Array, value: [] },
        tabBarClass: { type: String, value: '' },
        activeClass: { type: String, value: '' },
        tabBarLineColor: { type: String, value: '#07c160' },
        tabBarInactiveTextColor: { type: String, value: '#000000' },
        tabBarActiveTextColor: { type: String, value: '#07c160' },
        tabBarInactiveBgColor: { type: String, value: '#eeeeee' },
        tabBarActiveBgColor: { type: String, value: '#ffffff' },
        activeTab: { type: Number, value: 0 },
        animation: { type: Boolean, value: true }
    },
    data: {
        currentView: 0,
        contentScrollTop: 0,
        _heightRecords: [],
        _contentHeight: {}
    },
    observers: {
        activeTab: function activeTab(_activeTab) {
            this.scrollTabBar(_activeTab);
        }
    },
    relations: {
        '../vtabs-content/vtabs-content': {
            type: 'child',
            linked: function linked(target) {
                var _this = this;

                target.calcHeight(function (rect) {
                    _this.data._contentHeight[target.data.tabIndex] = rect.height;
                    if (_this._calcHeightTimer) {
                        clearTimeout(_this._calcHeightTimer);
                    }
                    _this._calcHeightTimer = setTimeout(function () {
                        _this.calcHeight();
                    }, 100);
                });
            },
            unlinked: function unlinked(target) {
                delete this.data._contentHeight[target.data.tabIndex];
            }
        }
    },
    lifetimes: {
        attached: function attached() {}
    },
    methods: {
        calcHeight: function calcHeight() {
            var length = this.data.vtabs.length;
            var _contentHeight = this.data._contentHeight;
            var _heightRecords = [];
            var temp = 0;
            for (var i = 0; i < length; i++) {
                _heightRecords[i] = temp + (_contentHeight[i] || 0);
                temp = _heightRecords[i];
            }
            this.data._heightRecords = _heightRecords;
        },
        scrollTabBar: function scrollTabBar(index) {
            var len = this.data.vtabs.length;
            if (len === 0) return;
            var currentView = index < 6 ? 0 : index - 5;
            if (currentView >= len) currentView = len - 1;
            this.setData({ currentView: currentView });
        },
        handleTabClick: function handleTabClick(e) {
            var _heightRecords = this.data._heightRecords;
            var index = e.currentTarget.dataset.index;
            var contentScrollTop = _heightRecords[index - 1] || 0;
            this.triggerEvent('tabclick', { index: index });
            this.setData({
                activeTab: index,
                contentScrollTop: contentScrollTop
            });
        },
        handleContentScroll: function handleContentScroll(e) {
            var _heightRecords = this.data._heightRecords;
            if (_heightRecords.length === 0) return;
            var length = this.data.vtabs.length;
            var scrollTop = e.detail.scrollTop;
            var index = 0;
            if (scrollTop >= _heightRecords[0]) {
                for (var i = 1; i < length; i++) {
                    if (scrollTop >= _heightRecords[i - 1] && scrollTop < _heightRecords[i]) {
                        index = i;
                        break;
                    }
                }
            }
            if (index !== this.data.activeTab) {
                this.triggerEvent('change', { index: index });
                this.setData({ activeTab: index });
            }
        }
    }
});
