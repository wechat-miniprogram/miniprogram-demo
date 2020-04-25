const uuid1 = '844F4F10-C9A7-4FA2-9A4D-84B55B4BDA7F'
const uuid2 = '86026734-9356-0152-f726-02232202F9DF'
const uuid3 = '0c76801a-62eb-45e5-96a8-37c8882abb2b'

// ArrayBuffer转16进制字符串示例
function ab2hex(buffer) {
  let hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}

function inArray(arr, key, val) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return i;
    }
  }
  return -1;
}

// slave/slave.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    connects: [],
    servers: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.onBLEPeripheralConnectionStateChanged(res => {
      console.log('123')
      console.log('ConnectionStateChanged', res)
      const connects = this.data.connects
      const idx = inArray(connects, 'deviceId', res.deviceId)
      if (idx >= 0) {
        connects[idx] = res
      } else {
        connects.push(res)
      }
      this.setData({ connects })
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
      this.setData({serverId: this.server.serverId})
      this.server.onCharacteristicReadRequest(res => {
        console.log('123')
        const { serviceId, characteristicId, callbackId } = res
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

      this.server.onCharacteristicWriteRequest(res => {
        console.log('onCharacteristicWriteRequest', res)
        const { serviceId, characteristicId, value, callbackId } = res
        this.server.writeCharacteristicValue({
          serviceId,
          characteristicId,
          value,
          needNotify: true,
          callbackId
        })
      })
    })
  },
  closeServer() {
    this.server.close()
  },
  chaneMode() {
    wx.navigateBack();
  },
  onConfirm(e) {
    console.log('onConfirm')
    const n = e.detail.value * 1
    const buffer = new ArrayBuffer(1)
    const dataView = new DataView(buffer)
    dataView.setUint8(0, n)
    this.server.writeCharacteristicValue({
      serviceId: uuid1,
      characteristicId: uuid2,
      value: buffer,
      needNotify: true
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
      uuid: uuid1,
      characteristics: [{
        uuid: uuid2,
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
    this.server.addService({
      service
    }).then(res => {
      console.log('add Service', res)
    })
  },
  removeService() {
    this.server.removeService({
      serviceId: uuid1
    }).then(res => {
      console.log('removeService', res)
    })
  },
  startAdvertising() {
    const buffer = new ArrayBuffer(1)
    const dataView = new DataView(buffer)
    dataView.setInt8(0, 4)
    this.server.startAdvertising({
      advertiseRequest: {
        connectable: true,
        deviceName: 'sanford',
        serviceUuids: [uuid1],
        manufacturerData: [{
          manufacturerId: 'sanfordsun-pc0',
          manufacturerSpecificData: buffer
        }]
      },
      powerLevel: 'medium'
    }).then(res => {
      console.log('startAdvertising', res)
    })
  },
  stopAdvertising() {
    this.server.stopAdvertising()
  },

  closeBluetoothAdapter() {
    wx.closeBluetoothAdapter()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.data.servers.forEach(server => {
      // server.close()
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})