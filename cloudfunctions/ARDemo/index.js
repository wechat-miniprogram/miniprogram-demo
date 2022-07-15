// 云函数入口文件
const cloud = require('wx-server-sdk')
const wxgService = require('@tencent/wx-server-sdk-wxg-service')
const svrkitUtils = require('./svrkit-utils.js')

cloud.registerService(wxgService)
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const bizuin = wxContext.APPUIN
    console.log(bizuin)
    console.log(event)
    switch(event.type){
        case "GenerateARModel":
            return await cloud.callWXSvrkit({
                pbInstance: svrkitUtils.generate({
                    serviceName: "Mmbizwxaintpar",
                    funcName: "GenerateARModel",
                    data:{
                        bizuin: bizuin,
                        name: event.name,
                        url: event.url,
                        algoType: event.algoType
                    },
                })
            });
        case "GetARModelList":
            return await cloud.callWXSvrkit({
                pbInstance: svrkitUtils.generate({
                    serviceName: "Mmbizwxaintpar",
                    funcName: "GetARModelList",
                    data:{
                        bizuin: bizuin,
                        modelStatus: event.modelStatus,
                        algoType: event.algoType
                    },
                })
            });
        case "GetARModel":
            return await cloud.callWXSvrkit({
                pbInstance: svrkitUtils.generate({
                    serviceName: "Mmbizwxaintpar",
                    funcName: "GetARModel",
                    data:{
                        bizuin: bizuin,
                        cosid: event.cosid,
                        modelType: event.modelType,
                        needData: event.needData,
                        useIntranet: event.useIntranet,
                        expireTime: event.expireTime
                    },
                })
            });
    }
  
}