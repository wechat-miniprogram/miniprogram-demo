Page({
    data: {
        list: [{
            "text": "对话",
            "iconPath": global.isDemo ? '/page/weui/example/images/tabbar_icon_chat_default.png' : "/example/images/tabbar_icon_chat_default.png",
            "selectedIconPath": global.isDemo ? '/page/weui/example/images/tabbar_icon_chat_active.png' : "/example/images/tabbar_icon_chat_active.png",
            dot: true
        },
        {
            "text": "设置",
            "iconPath": global.isDemo ? '/page/weui/example/images/tabbar_icon_setting_default.png' : "/example/images/tabbar_icon_setting_default.png",
            "selectedIconPath": global.isDemo ? '/page/weui/example/images/tabbar_icon_setting_active.png' : "/example/images/tabbar_icon_setting_active.png",
            badge: 'New'
        }]
    },
    tabChange(e) {
        console.log('tab change', e)
    }
});