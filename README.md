# 微信小程序示例
微信小程序示例源码，欢迎扫描以下小程序码体验。

> 提示：请使用微信开发者工具或微信客户端 6.7.2 及以上版本运行。

<img width="200" src="https://res.wx.qq.com/op_res/QqOF7ydl0dkpq-orpebXL-gBspr08VjoFOFGrWvKF9IULLhfT9XhnsSKlvc0gI8d">

## 使用

```
npm run init
```
完成上述步骤后，使用微信开发者工具，点击【工具-构建npm】

使用[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)打开该示例代码，云开发环境搭建请参考[云开发示例说明](https://github.com/wechat-miniprogram/miniprogram-demo/blob/master/miniprogram/page/cloud/README.md)。


## 贡献

如果你有 bug 反馈或其他任何建议，欢迎提 issue 给我们。

如果你愿意一起来完善小程序示例，欢迎通过 PR 的方式贡献代码。为了保证代码风格的统一，在编写代码之前，请在项目根目录miniprogram下运行以下命令安装依赖：

```
npm install
```
同时，确保你的代码可以通过 Lint 检查：
```
npm run lint
```

## Agent Demo

| 路径 | 说明 |
|------|------|
| `miniprogram/skills/drink-skill` | WeStoreCafe 点单：搜索 / 选规格 / 下单 / 地址，小微 handoff 进业务页 |
| `miniprogram/packageWeStoreCoffee` | WeStoreCafe 点单分包：首页 / 选规格 / 结算 + 目录数据 |
| `miniprogram/packageWeStoreCoffee/pages/home/home` | 点单首页（searchDrinks 接力页） |
| `miniprogram/packageWeStoreCoffee/pages/sku-picker/sku-picker` | 选规格接力页 |
| `miniprogram/packageWeStoreCoffee/pages/checkout/checkout` | 结算接力页 |
| `miniprogram/skills/agent-auth-skill` | 授权卡片 + 订阅消息 / 蓝牙授权 / 微信运动 / 收货地址 |
| `miniprogram/pages/protocol/user-service` | 用户服务协议页 |
| `miniprogram/pages/protocol/privacy` | 隐私政策页 |

协议名称与详情页由原子接口调用 `wx.requestAgentPrivacyAuthorization({ privacyAgreements })` 时传入，不再在 `app.json` 中静态声明。接口不再接收 `type`，统一使用 default 文案模板。

## 截图

<img width="375" src="https://res.wx.qq.com/op_res/0_vsSii5DaG-1hoXcqmBCT_tPShgSPKi3_FBVuVj1tu1ZdZD8lwYNrSQm3mdswI2">