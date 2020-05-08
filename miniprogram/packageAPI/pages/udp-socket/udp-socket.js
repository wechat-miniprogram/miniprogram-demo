const remoteUDPSocket = wx.createUDPSocket();

const AB2String = (arrayBuffer) => {
  let unit8Arr = new Uint8Array(arrayBuffer) ;
  let encodedString = String.fromCharCode.apply(null, unit8Arr),
  decodedString = decodeURIComponent(escape((encodedString)));//没有这一步中文会乱码
  return decodedString;
}

Page({
  data: {
    port: undefined,
    remote_port: undefined,
    startUDP: false,
    mode: 'local',
    address: 'localhost',
  },

  handleCreateUDPTap() {
    this.UDPSocket = wx.createUDPSocket();
    this.remoteUDPSocket = wx.createUDPSocket();
    this.port = this.UDPSocket.bind();
    this.remote_port = this.remoteUDPSocket.bind();
    this.setData({
      port: this.port,
      remote_port: this.remote_port,
      startUDP: true,
    })
    this.remoteUDPSocket.onMessage((res) => {
      const { remoteInfo } = res; 
      console.log(res);
      wx.showModal({
        title: `IP:${remoteInfo.address}发来的信息`,
        content: AB2String(res.message),
      })
    })
  },

  handleCloseUDPTap () {
    this.setData({
      startUDP: false,
      mode: 'local',
    })
    console.log(this.data);
    this.UDPSocket.close();
    this.remoteUDPSocket.close();
  },
  handleSendRemoteMessage() {
    this.UDPSocket.send({
      address: this.data.address || 'localhost', // 可以是任意 ip 和域名 
      port: this.remote_port,
      message: `port[${this.port}] 向 remote-port[${this.remote_port}] 发送信息: Hello Wechat!`,
    })
  },
  changeMode() {
    this.setData({
      mode: 'remote',
    })
  },
  handleInputChange(e) {
    this.setData({
      address: e.detail.value,
    })
  },
  handleSendMessage() {
    this.UDPSocket.send({
      address: 'localhost', // 可以是任意 ip 和域名 
      port: this.remote_port,
      message: `port[${this.port}] 向 remote-port[${this.remote_port}] 发送信息: Hello Wechat!`,
    })
  },


})