export function getGroupEnterInfo() {
  return new Promise((resolve, reject) => {
    wx.getGroupEnterInfo({
      allowSingleChat: true,
      needGroupOpenID: true,
      success(res) {
        const cloudID = res.cloudID
        wx.cloud.callFunction({
          name: 'quickstartFunctions',
          data: {
            type: 'getGroupEnterInfo',
            groupInfo: wx.cloud.CloudID(cloudID)
          }
        }).then(resp => {
          const groupInfo = resp.result.groupInfo
          if (groupInfo && groupInfo.data) {
            const openid = resp.result.openid
            const opengid = groupInfo.data.opengid
            const openSingleRoomID = groupInfo.data.open_single_roomid
            const groupOpenID = groupInfo.data.group_openid
            const data = {
              openid,
              groupOpenID,
              roomid: opengid || openSingleRoomID,
              chatType: groupInfo.data.chat_type
            }
            resolve(data)
          } else {
            reject()
          }
        }).catch(err => {
          reject(err)
        })
      },
      fail(res) {
        reject(res)
      },
      complete(res) {
        console.info('getGroupEnterInfo complete: ', res)
      }
    })
  })
}
