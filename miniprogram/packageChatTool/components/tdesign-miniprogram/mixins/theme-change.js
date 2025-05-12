import { appBaseInfo } from '../common/utils';
const themeChangeBehavior = Behavior({
    data: {
        theme: 'light',
    },
    attached() {
        this._initTheme();
    },
    methods: {
        _initTheme() {
            const that = this;
            that.setData({
                theme: appBaseInfo.theme,
            });
            wx.onThemeChange((res) => {
                that.setData({
                    theme: res.theme,
                });
            });
        },
    },
});
export default themeChangeBehavior;
