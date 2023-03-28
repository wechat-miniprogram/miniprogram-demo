// 云函数入口文件
const cloud = require('wx-server-sdk')

// 云函数入口函数
exports.main = async (event) => {
  cloud.init({
    env: process.env.TCB_ENV,
  })
  const fileList = event.fileIdList
  const result = await cloud.getTempFileURL({
    fileList,
  })
  return result.fileList
}
