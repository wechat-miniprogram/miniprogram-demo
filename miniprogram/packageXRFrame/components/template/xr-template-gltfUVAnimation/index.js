Component({
  behaviors: [require('../../common/share-behavior').default],
  properties: {
    a: Number,
  },
  data: {
    loaded: false
  },
  lifetimes: {},
  methods: {
    handleReady({detail}) {
      const xrScene = this.scene = detail.value;
      console.log('xr-scene', xrScene);
    },
    handleAssetsProgress: function({detail}) {
      console.log('assets progress', detail.value);
    },
    handleAssetsLoaded: function({detail}) {
      console.log('assets loaded', detail.value);
      this.setData({loaded: true});
      // 做个简单的延时，保证glTF构建完成
      setTimeout(()=>{
        this.setUVAnimation();
      },200);
    },
    setUVAnimation() {
      const scene = this.scene;
      const xrSystem = wx.getXrFrameSystem();

      // 获取元素
      const twaElm = this.scene.getElementById('twa');
      const twaGLTF = twaElm.getComponent(xrSystem.GLTF);

      // console.log(twaGLTF);

      const changeMesh = twaGLTF.getPrimitivesByNodeName('Cube_0')[0];
      const changeMaterial = changeMesh.material;

      let offsetX = 0;
      let offsetY = 0;
      let scaleX = 1;
      let scaleY = 1;
      let rotation = 0;

      // 这里采用一个固定计时器方便编写，建议使用tick
      setInterval(()=>{
        // 这里做一个 1% 每帧的偏移。
        offsetX = offsetX > 1 ? 0 : offsetX + 0.01;
        offsetY = offsetY > 1 ? 0 : offsetY + 0.01;
        // 这里做一个每帧的缩放
        // scaleX = scaleX > 2 ? 1 : scaleX + 0.01;
        // scaleY = scaleY > 2 ? 1 : scaleY + 0.01;
        // 这里做一个每帧的旋转。
        // rotation = rotation > Math.PI ? 0 : rotation + Math.PI / 360;
        const uvMatrix = xrSystem.Matrix4.createFromArray(this.getUvTransform(offsetX, offsetY, scaleX, scaleY, rotation))
        // 设置uv矩阵
        changeMaterial.setMatrix('u_uvTransform', uvMatrix);
      }, 40);

      const uvMatrix = xrSystem.Matrix4.createFromArray(this.getUvTransform(offsetX, offsetY, scaleX, scaleY, rotation))
      // 设置uv矩阵
      changeMaterial.setMatrix('u_uvTransform', uvMatrix);
      // 开启使用uv矩阵的宏
      changeMaterial.setMacro('WX_USE_UVTRANSFORM', true );
      changeMaterial.setMacro('WX_USE_UVTRANSFORM_BASECOLOR', true );
    }
    ,
    /**
     * 获取UV变化矩阵，列主序
     * 
     * @param {number} tx x轴偏移
     * @param {number} ty y轴偏移
     * @param {number} sx x轴缩放
     * @param {number} sy y轴缩放
     * @param {number} rotation 旋转
     * @return {Array} uvMatrixArray
     */
    getUvTransform(tx, ty, sx, sy, rotation) {
      const c = Math.cos( rotation );
      const s = Math.sin( rotation );

      return [
        sx * c, -sx * s, 0, 0,
        sy * s, sy * c, 0, 0,
        0, 0, 1, 0,
        tx, ty, 0, 1,
      ];
    }
  }
})