// 模块导出一个数组，每个元素是一个模块配置项
module.exports = [
    {
      // 模块对应的 proto 文件相对于该文件的路径
      proto: './proto/mmbizwxaintparDemo.proto',
      // 模块 service name
      serviceName: 'Mmbizwxaintpar',
      // 模块 magic 数字
      magic: 11081,
      // 模块导出的接口方法
      functions: {
        // 接口名字及其对应的接口调用信息
        GenerateARModel: {
          // 接口的 cmdid
          cmdid: 1,
          // 接口的 request 对应的 protobuf message 名字，需在 proto 文件中定义
          req: 'GenerateARModelReq',
          // 接口的 response 对应的 protobuf message 名字，需在 proto 文件中定义
          res: 'GenerateARModelResp',
        },
        // 接口的名字及其对应的接口调用信息
        GetARModelList: {
          cmdid: 3,
          req: 'GetARModelListReq',
          res: 'GetARModelListResp',
        },
        GetARModel: {
          cmdid: 4,
          req: 'GetARModelReq',
          res: 'GetARModelResp',
        }
      }
    }
  ]