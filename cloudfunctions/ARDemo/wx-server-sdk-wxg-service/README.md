# WXG Service for Mini Program Server SDK

## wx-server-sdk 插件使用方式

需同时安装依赖 `wx-server-sdk` 和 `@tencent/wx-server-sdk-wxg-service`，后者必须使用 `tnpm` 安装。

注册 SDK 插件的示例代码：

```js
const cloud = require('wx-server-sdk')
const wxgService = require('@tencent/wx-server-sdk-wxg-service')

// 将 wxg service 注册到 cloud 上，获得 callWXSvrkit, callTencentInnerAPI 等内部接口
cloud.registerService(wxgService)

exports.main = async (event, context) => {
  // 现在可以使用 callWXSvrkit 等内部接口了
  cloud.callWXSvrkit({
    // ....
  })
}
```

## 兼容性说明

从 `0.6.1` 起，需搭配 `wx-server-sdk` `2.0.3` 或以上使用。

## 接口

WXG Service 包含以下接口

### callTencentInnerAPI：调用腾讯内部服务

```js
const cloud = require('wx-server-sdk')
const wxgService = require('@tencent/wx-server-sdk-wxg-service')

// 将 wxg service 注册到 cloud 上，获得 callWXSvrkit 接口
cloud.registerService(wxgService)

exports.main = async (event, context) => {
  const callResult = await cloud.callTencentInnerAPI({
    cmdid: 12345, // 必填
    modid: 67890, // 必填
    path: '/aaa/bbb?xxx=1', // 必填，除域名外 URL 路径。URL 参数选填
    https: false, // 选填，是否使用 https
    method: 'post', // 必填，HTTP Method
    // 选填，HTTP 头部
    headers: {
      'Content-Type': 'application/json'
    },
    // 选填，body 可以是 string 类型或 Buffer 类型
    body: JSON.stringify({
      x: 1,
      y: 2,
    }),
    /**
     * autoParse:
     * 是否自动 parse 回包包体，如果是，则：
     *   在 content-type 为 application/json 时自动 parse JSON
     *   在 content-type 为 text/plain 时自动转为 string
     *   其余情况不 parse，返回原始包体 buffer
     */
    autoParse: true,
  })

  console.log(callResult)

  /**
   * callResult:
   * {
   *    errCode: 0,
   *    errMsg: 'callTencetnInnerAPI:ok',
   *    contentType: 'application/json',   // 回包 content-type
   *    body: { x: 1 },                    // 回包 http response body
   *    statusCode: 200,                   // 回包 http status code
   *    rawHeaders: [                      // 回包 http headers
   *      {
   *        key: 'content-type',
   *        value: 'application'
   *      },
   *      // ...
   *    ]
   * }
   */
  return callResult
}
```

### callWXSvrkit：调用微信 Svrkit 服务

供 WXG 内部小程序通过云函数调用微信 svrkit 模块。

因为 svrkit 的数据交换协议是 `protobuf`，且 svrkit 的模块调用需要一些模块信息，因此为了简化前端调用方式、省去接口数据处理和调用信息处理（pb 序列化与反序列化、模块信息传入）、我们也提供了一个  `@tencent/cloud-functions-tools` 工具用于将 svrkit 的调用流程配置化、标准化，开发者只需填写配置文件和放置 `proto` 文件，即可用工具生成辅助模块，实际调用时即可传入 `JSON` 对象获取 `JSON` 返回值。


示例云函数已放置在公开的内部 git 仓库，仓库 `cloudfunctions` 目录下有两个子目录分别是 `svrkit-echo` 和 `svrkit-check-developer`这两个示例云函数，仓库地址 ：https://git.code.oa.com/mp-public/cloud-demos


### Step 1：安装  `@tencent/cloud-functions-tools`

首先在需要使用该能力的云函数的目录下安装 `@tencent/cloud-functions-tools`：

```shell
npm install --save-dev @tencent/cloud-functions-tools@latest
```

注意，云函数中同时需安装 `wx-server-sdk` 和 `@tencent/wx-server-sdk-wxg-service`

```bash
npm install --save wx-server-sdk@latest
npm install --save @tencent/wx-server-sdk-wxg-service@latest
```



### Step 2：配置

在云函数目录下建立 `svrkit.config.js` 文件，用于填写 `svrkit` 调用的配置信息，并放置好相应 proto 文件，示例如下（从后台的原始 pb 文件提取模块调用信息的方法参见底部的[svrkit 调用信息提取](#extract_pb_info)）：

```js
// 模块导出一个数组，每个元素是一个模块配置项
module.exports = [
  {
    // 模块对应的 proto 文件相对于该文件的路径
    proto: './proto/mmbizwxaqbasedemo.proto',
    // 模块 service name
    serviceName: 'MMBizWxaQbaseDemo',
    // 模块 magic 数字
    magic: 18501,
    // 模块导出的接口方法
    functions: {
      // 接口 EchoTest 的名字及其对应的接口调用信息
      EchoTest: {
        // 接口的 cmdid
        cmdid: 1,
        // 接口的 request 对应的 protobuf message 名字，需在 proto 文件中定义
        req: 'EchoTestRequest',
        // 接口的 response 对应的 protobuf message 名字，需在 proto 文件中定义
        res: 'EchoTestResponse',
      },
      // 接口 CheckWxaDeveloper 的名字及其对应的接口调用信息
      CheckWxaDeveloper: {
        cmdid: 2,
        req: 'CheckWxaDeveloperRequest',
      }
    }
  }
]
```



示例的 `./proto/mmbizwxaqbasedemo.proto` 文件：

```
message MessageData
{
	optional string Data = 1;
}

message EchoTestRequest
{
	required bool        OpenTime = 1; // 是否需要服务端返回时间戳，required 必填

	// 以下 optional 字段如果有填，在Resp中返回对应字段
	optional int32       IntData = 2;
	optional string      StringData = 3;
	repeated uint32      UintListData = 4;
	optional MessageData MessageData = 5;
}

message EchoTestResponse
{
	optional uint32      TimeStamp = 1;

	optional int32       IntRespData = 2;
	optional string      StringRespData = 3;
	repeated uint32      UintListRespData = 4;
	optional MessageData MessageRespData = 5;
}

// 校验是否为小程序开发者, 接口返回：0 是，1 否
message CheckWxaDeveloperRequest
{
	optional uint32 appuin = 1;
	optional uint32 useruin = 2;
}
```



### Step 3：用工具生成辅助类

用 `@tencent/cloud-functions-tools` 提供的工具根据 `svrkit.config.js` 生成辅助的 `svrkit-utils.js` 模块：

```bash
# 在云函数目录执行以下命令，--config （或 -c） 对应的路径如果不同则替换为自己的路径
./node_modules/.bin/svrkit-utils --config ./svrkit.config.js
# 如需自定义输出文件的路径，可以传入 --output （或 -o）
./node_modules/.bin/svrkit-utils --config ./svrkit.config.js --output ./svrkit-utils.js
```

> 注：可用此命令查看 cloud-functions-tools 的用法：./node_modules/.bin/svrkit-utils -h

可以在 `package.json` 中添加一个 `script` 命令自动化这个流程：

```json
{
  "scripts": {
    "svrkit": "svrkit-utils --config ./svrkit.config.js --output ./svrkit-utils.js"
  }
}
```

然后之后就可以用如下命令生成 js 模块了：

```bash
npm run svrkit
```



### Step 4：发起调用



用 `callWXSvrkit` 方法配合生成的 `svrkit-utils.js` 模块发起 svrkit 调用



**callWXSvrkit 接口参数说明**

| 参数       | 类型 | 必填 | 说明                                                |
| ---------- | ---- | ---- | --------------------------------------------------- |
| pbInstance |      | 是   | 通过 `svrkit-utils.js` 的 `generate` 方法生成的对象 |
| timeout | number | 否   | 超时失败时间 |

**callWXSvrkit 接口返回值说明**

| 参数           | 类型   | 说明                                                         | 最低版本 |
| -------------- | ------ | ------------------------------------------------------------ | -------- |
| errMsg         | String | 通用返回结果                                                 |          |
| ret            | Number | svrkit 模块调用结果，0 表示成功调到了目标模块，-306 表示小程序未在内部小程序登记平台登记，-307 表示小程序没有调用目标模块的权限 |          |
| result         | Number | 目标模块的调用返回码                                         |          |
| respBody       | Object | 目标模块返回的最终 JSON 对象                                 |          |
| respBodyBuffer | Buffer | 目标模块返回的 pb buffer，有 respBody 可不用关注             |          |



调用代码示例：

```js
const cloud = require('wx-server-sdk')
const wxgService = require('@tencent/wx-server-sdk-wxg-service')

cloud.registerService(wxgService)
cloud.init()

const svrkitUtils = require('./svrkit-utils.js')

exports.main = async (event, context) => {

  return await cloud.callWXSvrkit({
    pbInstance: svrkitUtils.generate({
      serviceName: 'MMBizWxaQbaseDemo',
      funcName: 'EchoTest',
      data: {
        OpenTime: event.OpenTime || true,
        IntData: event.IntData || 10,
        StringData: event.StringData || 'default_string',
        UintListData: event.UintListData || [1, 2, 3],
        MessageData: event.MessageData || {
          Data: 'default_data_string'
        },
      }
    })
  })

}
```

预期返回：

```js
{
  "ret": 0,
  "result": 0,
  "respBodyBuffer": Buffer,
  "respBody": {
    "TimeStamp": 1543501760,
    "IntRespData": 10,
    "StringRespData": "default_string",
    "UintListRespData": [
      1,
      2,
      3
    ],
    "MessageRespData": {
      "Data": "default_data_string"
    }
  },
  "errMsg": "callWXSvrkit:ok"
}
```

调用数据流如图：

![svrkit 调用数据流](http://km.oa.com/files/photos/pictures//20181130//1543559018_58.png)

<a id="extract_pb_info"></a>
从后台原始 svrkit pb 信息中提取模块调用信息：

1. `message` 定义的是 pb 数据接口体的定义，通常即是请求包与回包的定义
2. `service` 定义的是 svrkit 模块的 `serviceName`
3. `tlvpickle.Magic` 定义的是模块 `magic`
4. `rpc` 后跟的词即是模块暴露的接口方法名，即 `funcName`
5. `rpc` 定义中包含了请求体结构和返回体结构，如 `EchoTest` 方法的请求体结构为 `EchoTestRequest`，返回体结构为 `EchoTestResponse`
6. `tlvpickle.SKBuiltinEmpty_PB` 是特殊的结构体，表示空结构体

![svrkit 模块调用信息](http://km.oa.com/files/photos/captures/201812/1543846169_62_w1668_h2228.png)


### callSvrkit: 调用微信 Svrkit 服务

> 已废弃，请使用 callWXSvrkit
