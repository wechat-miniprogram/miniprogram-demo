let camera;
let player;
let xrFrameSystem;
// 位移速度
let speed = 5;
// 视角旋转的速度
let smoothSpeed = 8;

// 世界坐标系下的标准方位
let up;
let left;

// player相关
let position;
let quaternionP; //player的四元数
let quaternionPIni; //player每次转动开始时的角度
let quaternionPRes; //player每次需要转动到的角度
let quaternionPTemp; //旋转四元数的临时变量

// camera相关
let quaternionC; //camera的四元数
let quaternionCIni;  //camera每次转动开始时的角度
let quaternionCRes;  //camera每次需要转动到的角度

// 初始化是否完成的标记
let initFinish = false;

Component({
  behaviors: [require('../../common/share-behavior').default],
  properties: {
    width:Number,
    height:Number,
    transferData: {
      type:Object,
      observer(newVal, oldVal){
        if(newVal.biasRotX != undefined){
          this.biasRotX = newVal.biasRotX;
          this.biasRotY = newVal.biasRotY;
        }

        if(newVal.initRotX != undefined){
          this.initRotX = newVal.initRotX;
          this.initRotY = newVal.initRotY;
        }

        if(newVal.biasX != undefined){
          this.biasX = newVal.biasX;
          this.biasY = newVal.biasY;
        }
      },
    },
    reset: {
      type: Number,
      observer(newVal, oldVal) {
        //监听发生变化的reset后，执行重置逻辑
        position.set(xrFrameSystem.Vector3.createFromNumber(0, 1.6, 1));
        quaternionC.setFromYawRollPitch(0, 0, 0);
        quaternionP.setFromYawRollPitch(Math.PI, 0, 0);
      }
    }
  },
  data: {
    loaded: false
  },
  lifetimes: {},
  methods: {
    handleReady({
      detail
    }) {
      const xrScene = this.scene = detail.value;
      console.log('xr-scene', xrScene);

      xrFrameSystem = wx.getXrFrameSystem();
      camera = xrScene.getElementById("camera");
      player = xrScene.getElementById("player");

      up = xrFrameSystem.Vector3.createFromNumber(0, 1, 0);
      left = xrFrameSystem.Vector3.createFromNumber(1, 0, 0);

      quaternionC = camera.getComponent(xrFrameSystem.Transform).quaternion;
      quaternionP = player.getComponent(xrFrameSystem.Transform).quaternion;
      position = player.getComponent(xrFrameSystem.Transform).position;

      quaternionPIni = new xrFrameSystem.Quaternion();
      quaternionPIni.set(quaternionP);
      quaternionPRes = new xrFrameSystem.Quaternion();
      quaternionPRes.set(quaternionP);
      quaternionPTemp = new xrFrameSystem.Quaternion();
      quaternionPTemp.setFromYawRollPitch(0, 0, 0);

      quaternionCIni = new xrFrameSystem.Quaternion();
      quaternionCIni.set(quaternionC);
      quaternionCRes = new xrFrameSystem.Quaternion();
      quaternionCRes.set(quaternionC);

      this.biasRotX = 0;
      this.biasRotY = 0;
      this.initRotX = 0;
      this.initRotY = 0;
      this.biasX = 0;
      this.biasY = 0;

      initFinish = true;
    },
    handleAssetsProgress: function ({
      detail
    }) {
      console.log('assets progress', detail.value);
    },
    handleAssetsLoaded: function ({
      detail
    }) {
      console.log('assets loaded', detail.value);

      this.setData({
        loaded: true
      });
    },
    handleTick: function (dt) {

      //确保handleReady时期的初始化完成
      if (!initFinish)
        return;

      var deltaTime = dt.detail.value / 1000;

      //------摄像头旋转逻辑------//
      let rotX = (this.biasRotX - this.initRotX) / this.data.width * Math.PI;
      let rotY = (this.biasRotY - this.initRotY) / this.data.height * Math.PI;

      //水平方向旋转player node
      if (this.biasRotX == 0) {
       quaternionPIni.set(quaternionPTemp);
       quaternionPRes.set(quaternionPTemp);
      } else {
        quaternionPIni.multiply(xrFrameSystem.Quaternion.createFromAxisAngle(up, -rotX), quaternionPRes);
      }

      //垂直方向旋转camera node
      if (this.biasRotY == 0) {
        quaternionCIni.set(quaternionCRes);
        quaternionCRes.set(quaternionCRes);
      } else {
        quaternionCIni.multiply(xrFrameSystem.Quaternion.createFromAxisAngle(left, rotY), quaternionCRes);   
      }

      quaternionPTemp.slerp(quaternionPRes, smoothSpeed * deltaTime, quaternionPTemp);
      quaternionC.slerp(quaternionPTemp.multiply(quaternionCRes), smoothSpeed * deltaTime, quaternionC);

       //------摄像头位移逻辑------//
      var x = this.biasX;
      var y = this.biasY;

      if (x || y) {
        var z = Math.sqrt(x * x + y * y);
        var ratio = z / 50; //此处除以50，因为摇杆盘半径为50
        ratio = ratio > 1 ? 1 : ratio < 0 ? 0 : ratio;
        var temp = xrFrameSystem.Vector3.createFromNumber(-x / z, 0, -y / z);
        temp = temp.scale(ratio * speed * deltaTime);
        //位移需要根据旋转角度做转化, 这里需要取得camera的世界旋转矩阵
        temp.applyQuaternion(camera.getComponent(xrFrameSystem.Transform).worldQuaternion);
        position.set(position.add(temp));
      }
    },
  }
})