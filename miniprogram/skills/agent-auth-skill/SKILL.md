# agent-auth-skill Agent 隐私授权卡片

> 本 SKILL 覆盖小微场景的隐私授权卡片，以及订阅消息、蓝牙授权、微信运动、收货地址。
> 隐私授权调用 `wx.requestAgentPrivacyAuthorization` 拉起客户端授权窗，**不走 handoff、不出小程序卡片**。

## 原子接口

| 接口 | 覆盖点 |
|------|--------|
| requirePrivacyAuthWithAgreements | 调用时传入两项协议 |
| requirePrivacyAuthWithoutAgreements | 不传协议，仅显示描述文案 |
| requirePrivacyAuthInvalidAgreements | trim 合法项并丢弃非法协议项 |
| requirePrivacyAuthConcurrent | 并发共享、首发协议决定卡片内容 |
| requestSubscribeMessage | `wx.requestSubscribeMessage`，tmplId 固定 |
| authorizeBluetooth | `wx.authorize({ scope: 'scope.bluetooth' })` |
| getWeRunData | `wx.login` + `scope.werun` + `wx.getWeRunData` |
| chooseAddress | `wx.chooseAddress` |

## 契约约定（与基础库一致）

- 开发者调用 `wx.requestAgentPrivacyAuthorization({ privacyAgreements })` 时直接传入协议列表；不再从 `app.json` 读取协议。
- `privacyAgreements` 每项格式为 `{ name: string, path: string }`。基础库负责 trim、丢弃非法项、为 path 补 `.html`、Base64 编码并生成受控协议链接。
- 不再支持 `type`，不区分 `default` / `phoneLogin`，统一使用 default 文案模板。
- 卡片正文只包含统一描述与可选协议链接行，不再包含 notice 段。
- `privacyAgreements` 缺省或清洗后为空时，卡片只显示描述文案。
- 同一批并发调用只展示一张卡；首发调用的协议列表决定卡片内容，后续调用仅订阅结果。
- 开发者不能传标题、正文、按钮文案、富文本或协议 URL。
- 仅原子接口 SubContext 可用（Render / DynamicRender 域不提供）；原子接口全局 TTL 到期后卡片置为已过期并 reject。

## 能力边界

- 本 skill 负责：Agent 隐私授权卡片、订阅消息、蓝牙授权、微信运动、收货地址选择。
- 正常隐私授权使用 `requirePrivacyAuthWithAgreements` 或 `requirePrivacyAuthWithoutAgreements`。
- `requirePrivacyAuthInvalidAgreements` / `requirePrivacyAuthConcurrent` 是验证用接口，只在用户明确要求对应验证时调用。
- 用户拒绝授权、订阅或取消选择地址后，一句话告知结果，禁止重复拉起对应面板。

## 用户意图分流

- 拉起包含协议链接的隐私授权卡片 → `requirePrivacyAuthWithAgreements`
- 验证无协议列表的卡片 → `requirePrivacyAuthWithoutAgreements`
- 验证协议参数清洗 → `requirePrivacyAuthInvalidAgreements`
- 验证并发共享与首发协议生效 → `requirePrivacyAuthConcurrent`
- 订阅消息 / 消息通知 → `requestSubscribeMessage`（tmplId 固定，禁止改）
- 蓝牙授权 / 打开蓝牙权限 → `authorizeBluetooth`
- 微信运动 / 步数 → `getWeRunData`
- 选择收货地址 / 打开地址选择器 → `chooseAddress`
