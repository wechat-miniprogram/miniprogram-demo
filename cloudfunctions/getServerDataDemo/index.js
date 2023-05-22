// 云函数入口文件
const cloud = require('wx-server-sdk')

// 云函数入口函数
exports.main = async () => {
  cloud.init({
    env: process.env.TCB_ENV,
  })
  const db = cloud.database()
  return db.collection('perm4').where({
    _openid: 'server'
  }).limit(1).get()
}
