module.exports = [
  {
    proto: './proto/demo.proto',
    apiName: 'demo',
    req: 'ApiDemoReq',
    res: 'ApiDemoResp'
  },
  {
    proto: './proto/mmbizwxatmpcode.proto',
    serviceName: 'MMBizWxaCloud',
    magic: 13299,
    functions: {
      GenWxaCloudTmpCode: {
        cmdid: 3,
        req: 'GenWxaCloudTmpCodeReq',
        res: 'GenWxaCloudTmpCodeResp',
      },
    }
  },
  {
    proto: './proto/mmbizsafecenter.proto',
    serviceName: 'mmbizsafecenter',
    magic: 12085,
    functions: {
      GetWeAppMemberByUser: {
        cmdid: 73,
        req: 'GetWeAppMemberByUserReq',
        res: 'WeAppMemberInfoList',
      },
    }
  },
]