const config = require('./svrkit.config.js')
const proto = require('./bundle.js')

function generate(options) {
  if (!options) {
    throw new Error('options must be provided')
  }

  const { serviceName, funcName, data } = options

  const serviceConfig = config.find(c => c.serviceName === serviceName) 
  if (!serviceConfig) {
    throw new Error('service not found')
  }

  if (!serviceConfig.functions[funcName]) {
    throw new Error('function not found')
  }

  const reqProto = proto[serviceConfig.functions[funcName].req]
  const resProto = proto[serviceConfig.functions[funcName].res]

  return {
    data: {
      serviceName,
      funcName,
      magic: serviceConfig.magic,
      cmdid: serviceConfig.functions[funcName].cmdid,
      existResp: serviceConfig.functions[funcName].existResp,
      reqBodyBuffer: reqProto.encode(data),
    },
    decode: buf => resProto.decode(resProto)
  }
}

module.exports = {
  generate,
}
