# 云开发示例说明

## 如何使用

要在微信开发者工具上体验云开发示例，请按如下步骤准备所需环境，否则可能报错。

1. 参考 [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html#%E5%BC%80%E9%80%9A%E4%BA%91%E5%BC%80%E5%8F%91) 开通云开发环境。如果已开通，请忽略此步
2. 开微信开发者工具中，将 `/cloudfunctions/` 下的云函数上传到云端，具体操作方式可参考文档中的云函数相关章节
3. 打开云开发控制台，进入数据库标签页，添加如下集合：
  - todos
  - perm1
  - perm2
  - perm3
  - perm4
  - serverDate
4. 对如下集合设置权限：
  - perm1：所有用户可读，仅创建者及管理员可写
  - perm2：仅创建者及管理员可读写
  - perm3：所有用户可读，仅管理员可写
  - perm4：仅管理员可读写
5. 部分集合需要初始记录，请把 `resources/db_dump` 下的文件导入到对应集合
6. 在 `/miniprogram/config.js` 中，修改 `envId` 字段为当前云开发环境 ID
7. 如要体验存储的相关功能，请在云开发控制台的文件管理标签页中上传自己的 demo 文件（图片、视频），并将文件 ID 填入到 `/miniprogram/config.js` 的相关字段上
