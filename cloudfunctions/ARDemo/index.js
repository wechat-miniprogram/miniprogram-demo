// 云函数入口文件
const cloud = require('wx-server-sdk')
const wxgService = require('./wx-server-sdk-wxg-service')
const svrkitUtils = require('./svrkit-utils.js')

cloud.registerService(wxgService)
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const bizuin = wxContext.APPUIN
  switch (event.type) {
    case "GenerateARModel":
      return await cloud.callWXSvrkit({
        pbInstance: svrkitUtils.generate({
          serviceName: "Mmbizwxaintpar",
          funcName: "GenerateARModel",
          data: {
            bizuin: bizuin,
            name: event.name,
            url: event.url,
            algoType: event.algoType,
            getmesh: event.getMesh,
            gettexture: event.getTexture
          },
        }),
        timeout: 30000,
      });
    case "GetARModelList":
      return await cloud.callWXSvrkit({
        pbInstance: svrkitUtils.generate({
          serviceName: "Mmbizwxaintpar",
          funcName: "GetARModelList",
          data: {
            bizuin: bizuin,
            modelStatus: event.modelStatus,
            algoType: event.algoType
          },
        }),
        timeout: 30000,
      });
    case "GetARModel":
      return await cloud.callWXSvrkit({
        pbInstance: svrkitUtils.generate({
          serviceName: "Mmbizwxaintpar",
          funcName: "GetARModel",
          data: {
            bizuin: bizuin,
            cosid: event.cosid,
            modelType: event.modelType,
            needData: event.needData,
            useIntranet: event.useIntranet,
            expireTime: event.expireTime
          },
        }),
        timeout: 30000,
      });
  }

}