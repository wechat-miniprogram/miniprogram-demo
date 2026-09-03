# drink-skill WeStoreCafe 点单场景（小微 AI Handoff 模式）

> 本 SKILL 已适配「小微 SubAgent handoff」：对话内只展示**文本回复 + 小程序卡片**，
> 用户点击小程序卡片后 **handoff 接力**进入开发者业务页（接力页），在小程序内完成后续操作。
> 小微对话内**不渲染原子组件**；组件代码与 `componentPath` 保留以便后续复用 / 小程序内 Agent 场景。

## 业务流程图（handoff 模式）

```
用户意图
  │
  ├─ 明确关键词/品类（"拿铁"/"果汁"）─→ searchDrinks ──┐  文本 + 小程序卡片
  │    （模糊意图 keyword 留空，返回全部饮品）          │  （点击 handoff 进列表页）
  │                                                  │
  │                              点击卡片 → 接力页 home（首页浏览/搜索/筛选）
  │                                            │ navigateTo（小程序内）
  │                                            ↓
  ├─ 已知 drinkId（看详情）──→ selectDrink ──→ 文本 + 小程序卡片
  │                                            点击卡片 → 接力页 sku-picker（详情/选规格）
  │                                                          │ 加入订单 → navigateTo（小程序内）
  │                                                          ↓
  ├─ 新点一杯 / 换一杯（新建订单）─→ createOrder ─→ 文本 + 小程序卡片
  │                                            点击卡片 → 接力页 checkout（地址 + 支付，展示全部已选商品）
  │                                                          ↑
  ├─ 再加一杯 / 追加（已有订单）──→ addToOrder ──→ 文本 + 小程序卡片（同上，商品列表已含追加项）
  │                                                          │
  ├─ 删掉某杯（订单>1件）──────→ removeOrderItem ─→ 文本 + 小程序卡片（同上，商品列表已移除该项）
  │                                                          ↓
  │                                                    完成下单（小程序内 wx.chooseAddress / wx.requestPayment）
  │
  └─ 对话中直接给出地址 ────→ saveAddress ──→ 文本 + 小程序卡片
                                               点击卡片 → 接力页 checkout（预填地址，确认支付）
```

> 注：上图中 `createOrder` / `addToOrder` 并非独立入口，均需**先经 `selectDrink`** 拿到目标饮品的 drinkId 与规格后才能调用（见「业务约束 2. 执行顺序」）。

## 原子接口 ↔ 接力页映射

| 接口 | 作用 | handoff.query | 接力页 pagePath |
|------|------|---------------|-----------------|
| searchDrinks | 关键词搜索 / 浏览全部 | `keyword=拿铁`（可留空=全部） | /packageWeStoreCoffee/pages/home/home |
| selectDrink | 饮品详情 + 规格 | `drinkId=289` | /packageWeStoreCoffee/pages/sku-picker/sku-picker |
| createOrder | 新建订单（首杯/换一杯） | `orderId=xxx` | /packageWeStoreCoffee/pages/checkout/checkout |
| addToOrder | 追加商品到当前订单 | `orderId=xxx` | /packageWeStoreCoffee/pages/checkout/checkout |
| removeOrderItem | 删除订单内某商品（至少保留一件） | `orderId=xxx` | /packageWeStoreCoffee/pages/checkout/checkout |
| viewOrder | 查看当前进行中的订单 | `orderId=xxx` | /packageWeStoreCoffee/pages/checkout/checkout |
| cancelOrder | 取消/清空整单 | 空（回首页） | /packageWeStoreCoffee/pages/home/home |
| saveAddress | 保存地址 → 结算页 | `orderId=xxx` | /packageWeStoreCoffee/pages/checkout/checkout |

> Agent 授权卡片能力已拆至独立 skill：`skills/agent-auth-skill`（`wx.requestAgentPrivacyAuthorization`）。

## 业务约束（跨接口铁律）

### 0. 能力边界（最高优先级）
- 本 skill 只能完成「饮品检索 / 看详情选规格 / 下单 / 追加或删除订单商品 / 查看订单 / 取消整单 / 保存地址 → 结算」这条点单链路。以下原子接口是**全部能力**：`searchDrinks`、`selectDrink`、`createOrder`、`addToOrder`、`removeOrderItem`、`viewOrder`、`cancelOrder`、`saveAddress`。
- **当用户意图无法用上述接口完成时（超出点单范围，或需要本 skill 不具备的能力），必须直接用一句话如实回复用户"该能力暂不支持 / 无法完成"，禁止为了"凑一个动作"而擅自调用任何原子接口。**
- 典型不支持场景（示例，非穷举）：查询/取消/退款历史订单、修改已支付订单、申请发票、查配送进度、改店铺/门店、会员积分/优惠券、投诉客服、菜单以外的商品等。遇到这类请求 → 直接文本说明不支持，不要硬套 searchDrinks/createOrder 等接口。
- 判断依据：**只有当用户意图能明确对应到某个接口的真实语义时才调用**；无法对应就回复用户，宁可不调用，也不要用错接口或编造参数去调用。

### 1. 输出形态（小微）
- 对话内**只输出文本 + 小程序卡片**，禁止以 markdown 列表展开商品名 / 价格 / 规格等详情。
- 已进入点单流程（调用了原子接口）时：只用一句简短话术引导用户，具体商品 / 订单详情交给小程序卡片与接力页展示。
- 用户诉求与点单无关时：正常用文本回复即可。

### 2. 执行顺序
- `createOrder` / `addToOrder` 必须在 `selectDrink` 成功后调用（上下文中需有目标饮品的 drinkId 与 specOptions）。
- **单次仅支持单杯**：`createOrder` / `addToOrder` 每次调用**只处理一杯饮品**（一个 drinkId + 一套 specs），不支持在一次调用里下多杯或多款。用户一次要多杯时，需**逐杯依次调用**——第一杯用 `createOrder`（或 addToOrder 新建），其余每杯各调一次 `addToOrder` 追加；不要试图用数量字段或数组一次性下单。
- `addToOrder`：有进行中的活动订单则追加；**若当前没有活动订单，则以本杯新建订单**（追加意图下调用总是安全的，不会因无订单而报错）。
- `drinkId` 来自 searchDrinks / selectDrink 的返回值（createOrder / addToOrder 用上一步 `selectDrink` 返回的 drinkId）；`orderId` 来自 createOrder / addToOrder 的返回值。禁止编造。
- 规格值用英文枚举（如 `ice` / `hot`），禁止用中文。

### 3. 进小程序后的后续
- 选规格、补地址、支付等后续操作**均在小程序接力页内完成**，不再回到对话调用原子接口。
- 例外：用户在**进小程序前的对话中**就直接给出了完整收货地址，则走 `saveAddress` 在对话侧保存（见「用户意图分流」）；进接力页后以页面内选择的地址为准。

### 4. 单次购买语义（整链路只维护一个活动订单，可含多杯）
- 整个点单链路（searchDrinks → selectDrink → createOrder / addToOrder → saveAddress）**只针对单次购买**：同一时刻只存在一个「活动订单」，但该订单**可以包含多杯饮品**（items 列表）。
- `createOrder`：**新建**订单，以当前饮品为首个商品项，并**覆盖**之前的活动订单。用户「就要这一杯 / 换一杯 / 重新点」走这里。
- `addToOrder`：向**当前活动订单**追加一杯；若当前没有活动订单则以本杯新建订单。用户「再加一杯 / 还要一个 / 顺便来个X」走这里。
- `removeOrderItem`：从当前活动订单删除一件商品，按 `itemId` 定位（itemId 来自订单接口返回的商品项）。**铁律：订单至少保留一件**，仅剩一件时禁止删除，直接告知用户「仅剩一件，无法删除」。
- 活动订单从建单起一直有效，直到用户在结算页**支付完成**才失效；之后再 addToOrder 会开一个新订单。
- `saveAddress` 只会把地址写入**当前**活动订单并更新为 confirmed。

### 5. 修改商品规格（先删后加，单件例外）
- 用户要改某已选商品的规格（如「把美式换成大杯」）时：
  - **订单有多件** → 先 `removeOrderItem`（旧商品项的 itemId）→ 再 `addToOrder`（同一 drinkId + 新规格）。
  - **订单仅此一件** → 最后一件删不掉，直接用 `createOrder`（同一 drinkId + 新规格）**覆盖**整单，不要调用 removeOrderItem。
- `addToOrder` / `createOrder` 用到的 drinkId 沿用被改商品的 drinkId（已在订单/上下文中），新规格取用户本次表达的值。

## 用户意图分流

- 模糊表达（"想喝/推荐/随便看看"）→ `searchDrinks`（keyword 留空返回全部）
- 具体品名 / 品类 → `searchDrinks`（keyword 填用户原话）
- 已知某饮品要看详情 → `selectDrink`
- 新点一杯 / 换一杯 / 重新点（无进行中订单，或明确要重来）→ `selectDrink` 后 `createOrder`
- 再加一杯 / 还要一个 / 顺便来个X（追加到订单）→ `selectDrink` 后 `addToOrder`（有活动订单则追加，无则以本杯新建，调用总是安全的）
- 删掉/去掉/不要某杯 → `removeOrderItem`（按 itemId）；**仅剩一件时告知用户无法删除**
- 取消订单 / 不要了 / 清空购物车 / 全部删掉 → `cancelOrder`（清空整单，回首页）；这也是"删最后一件/清空全部"的正确出口
- 查看订单 / 我点了啥 / 购物车里有什么 / 一共多少钱 → `viewOrder`（无进行中订单则告知用户暂无订单）
- 改某杯规格 → 见「5. 修改商品规格」：多件先删后加，单件用 createOrder 覆盖
- 对话中直接给出收货地址 → `saveAddress`（保存后接力进结算页确认支付）
- 只表达『改/换收货地址』意图但未给出新地址 → **先追问用户新的收货人+手机号+详细地址，禁止直接调用 `saveAddress`**、禁止沿用旧地址占位
- 歧义短语（"那个"）→ 先反问澄清，禁止猜测
