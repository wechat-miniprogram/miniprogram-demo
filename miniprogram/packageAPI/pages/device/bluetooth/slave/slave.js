
const uuid3 = '0C76801A-62EB-45E5-96A8-37C8882ABB2B'
const serviceId = 'D0611E78-BBB4-4591-A5F8-487910AE4366'
const characteristicId = '8667556C-9A37-4C91-84ED-54EE27D90049'
// 上面需要配置主机的 serviceId 和 characteristicId


// ArrayBuffer转16进制字符串示例
// function ab2hex(buffer) {
//   const hexArr = Array.prototype.map.call(
//     new Uint8Array(buffer),
//     function (bit) {
//       return ('00' + bit.toString(16)).slice(-2)
//     }
//   )
//   return hexArr.join('')
// }

function inArray(arr, key, val) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return i
    }
  }
  return -1
}

// slave/slave.js
Page({
  onShareAppMessage() {
    return {
      title: '蓝牙',
      path: 'packageAPI/pages/device/slave/slave'
    }
  },
  data: {
    theme: 'light',
    connects: [],
    servers: []
  },

  onLoad() {
    this.setData({
      theme: wx.getSystemInfoSync().theme || 'light'
    })

    if (wx.onThemeChange) {
      wx.onThemeChange(({theme}) => {
        this.setData({theme})
      })
    }
    wx.onBLEPeripheralConnectionStateChanged(res => {
      console.log('connect')
      const connects = this.data.connects
      const idx = inArray(connects, 'deviceId', res.deviceId)
      if (idx >= 0) {
        connects[idx] = res
      } else {
        connects.push(res)
      }
      this.setData({connects})
    })
  },

  openBluetoothAdapter() {
    // 初始化蓝牙模块
    wx.openBluetoothAdapter({
      mode: 'peripheral',
      success: (res) => {
        console.log('openBluetoothAdapter success', res)
        this.createBLEPeripheralServer()
      },
      fail: (res) => {
        console.log(res)
        wx.showToast({
          title: `创建失败 错误码: ${res.errCode}`,
          icon: 'none'
        })
        if (res.errCode === 10001) {
          wx.onBluetoothAdapterStateChange(function (res) {
            console.log('onBluetoothAdapterStateChange', res)
            if (res.available) {
              this.createBLEPeripheralServer()
            }
          })
        }
      }
    })
  },

  createBLEPeripheralServer() {
    //
    wx.createBLEPeripheralServer().then(res => {
      console.log('createBLEPeripheralServer', res)
      this.data.servers.push(res.server)
      this.server = res.server
      this.setData({
        serverId: this.server.serverId
      })
      wx.showToast({
        title: '创建 server ',
      })
      this.server.onCharacteristicReadRequest(res => {
        const {serviceId, characteristicId, callbackId} = res
        const buffer = new ArrayBuffer(1)
        const dataView = new DataView(buffer)
        const newValue = Math.ceil(Math.random() * 10)
        dataView.setUint8(0, newValue)
        console.log('onCharacteristicReadRequest', res, newValue)
        this.server.writeCharacteristicValue({
          serviceId,
          characteristicId,
          value: buffer,
          needNotify: true,
          callbackId
        })
      })
      // 监听收到数据
      this.server.onCharacteristicWriteRequest(res => {
        console.log('onCharacteristicWriteRequest', res)
        const {
          serviceId, characteristicId, value, callbackId
        } = res
        wx.showToast({
          title: '收到主机数据'
        })
        this.server.writeCharacteristicValue({
          serviceId,
          characteristicId,
          value,
          needNotify: true,
          callbackId
        })
      })
      return res
    }).catch(() => {})
  },
  closeServer() {
    if (this.server) { 
      this.server.close()
      wx.showToast({
        title: '关闭 server',
      })
    }
  },
  chaneMode() {
    wx.navigateBack()
  },
  onConfirm(e) {
    console.log('onConfirm')
    const n = e.detail.value * 1
    const buffer = new ArrayBuffer(1)
    const dataView = new DataView(buffer)
    dataView.setUint8(0, n)
    if (!this.server) {
      wx.showModal({
        title: '请先创建server',
      })
      return
    }
    this.server.writeCharacteristicValue({
      serviceId,
      characteristicId,
      value: buffer,
      needNotify: true
    })
    wx.showModal({
      title: '写入成功',
      content: '请在主机查看'
    })
  },
  showInput() {
    this.setData({
      input: !this.data.input
    })
  },
  addService() {
    const buffer = new ArrayBuffer(1)
    const dataView = new DataView(buffer)
    dataView.setUint8(0, 2)
    const descriptorBuffer = new ArrayBuffer(1)
    const dataView2 = new DataView(descriptorBuffer)
    dataView2.setInt8(0, 3)
    const service = {
      uuid: serviceId,
      characteristics: [{
        uuid: characteristicId,
        properties: {
          write: true,
          read: true,
          notify: true,
          indicate: true
        },
        permission: {
          readable: true,
          writeable: true,
          readEncryptionRequired: true,
          writeEncryptionRequired: true
        },
        value: buffer,
        descriptors: [{
          uuid: uuid3,
          permission: {
            write: true,
            read: true
          },
          value: descriptorBuffer
        }]
      }]
    }
    if (!this.server) {
      wx.showModal({
        title: '请先创建server',
      })
      return
    }
    this.server.addService({
      service
    }).then(res => {
      console.log('add Service', res)
      wx.showToast({
        title: '创建服务',
      })
      return res
    }, (rej) => {
      console.log(rej)
      if (rej.errCode === 10001) {
        wx.showToast({
          title: '请打开蓝牙',
        })
      } else {
        wx.showModal({
          title: '创建失败',
          content: `错误码: ${rej.errCode}`
        })
      }
    }).catch(() => {})
  },
  removeService() {
    if (!this.server) return
    this.server.removeService({
      serviceId
    }).then(res => {
      wx.showToast({
        title: '关闭服务',
      })
      console.log('removeService', res)
      return res
    }).catch(() => {})
  },
  startAdvertising() {
    if (!this.server) {
      wx.showModal({
        title: '请先创建server',
      })
      return
    }
    const buffer = new ArrayBuffer(1)
    const dataView = new DataView(buffer)
    dataView.setInt8(0, 4)
    this.server.startAdvertising({
      advertiseRequest: {
        connectable: true,
        deviceName: 'sanford',
        serviceUuids: [serviceId],
        manufacturerData: [{
          manufacturerId: 'sanfordsun-pc0',
          manufacturerSpecificData: buffer
        }]
      },
      powerLevel: 'medium'
    }).then(res => {
      console.log('startAdvertising', res)
      wx.showToast({
        title: '开启广播',
      })
      return res
    }).catch(() => {})
  },

  stopAdvertising() {
    if (!this.server) {
      wx.showModal({
        title: '请先创建server',
      })
      return
    }
    this.server.stopAdvertising()
    wx.showToast({
      title: '关闭广播',
    })
  },

  closeBluetoothAdapter() {
    wx.showToast({
      title: '结束流程',
    })
    wx.closeBluetoothAdapter()
  },

  onUnload() {
    this.data.servers.forEach(() => {
      // server.close()
    })
  },
})
