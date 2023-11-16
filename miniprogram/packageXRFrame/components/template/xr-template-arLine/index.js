const colorPattern1 = [
  [0.129, 0.612, 0.565],
  [0.914, 0.722, 0.141],
  [0.933, 0.576, 0.133],
  [0.847, 0.247, 0.192],
]
const colorPattern2 = [
  [0.392, 0.6, 0.914],
  [0.62, 0.867, 1],
  [0.651, 0.965, 1],
  [0.745, 1, 0.969],
]
Component({
  behaviors: [require('../../common/share-behavior').default],
  properties: {
    a: Number,
  },
  data: {
    loaded: false,
    arReady: false,
  },
  lifetimes: {
    async attached() {
      console.log('data', this.data)
    }
  },
  methods: {
    handleReady({detail}) {
      const xrScene = this.scene = detail.value;
      console.log('xr-scene', xrScene);
    },
    handleARReady: function({detail}) {
      console.log('arReady', this.scene.ar.arVersion);

      const xr = wx.getXrFrameSystem();
      const scene = this.scene;

      const root = scene.getElementById('root');
      const cursor = scene.getElementById('cursor');
      const cursorTrs = cursor.getComponent(xr.Transform);

      const geometryPoint = scene.assets.getAsset('geometry', 'sphere');
      const geometryLine = scene.assets.getAsset('geometry', 'cube');
      const effectStandard = scene.assets.getAsset('effect', 'standard');

      let preCubeTrs = undefined;
      let touchFlag = false;

      // 缓存这些常量
      const forward = xr.Vector3.createFromNumber(0,0,0);
      const up =  xr.Vector3.createFromNumber(0, 1, 0);
      const useQuaternion = xr.Quaternion.createFromNumber(0, 0, 0, 0);

      scene.event.add('touchstart', (e) => {
        // 点击开始后，放置

        if (touchFlag) {
          // 控制点击频率
          return;
        }
        touchFlag = true;

        // 新的cube
        const cubeEle = scene.createElement(xr.XRNode, {
        });
        const cubeTrs = cubeEle.getComponent(xr.Transform);
        const mat = scene.createMaterial(effectStandard);
        const color1 = colorPattern1[Math.floor(Math.random() * colorPattern1.length)];
        mat.setVector('u_baseColorFactor', xr.Vector4.createFromNumber(color1[0], color1[1], color1[2], 1.0));
        mat.setRenderState('cullFace', xr.ECullMode.BACK);
        const mesh = cubeEle.addComponent(xr.Mesh, {
          geometry: geometryPoint,
          material: mat,
        });
        // 加到场上
        root.addChild(cubeEle);

        // 获取相机 cursor 位置，并设置到新元素
        cubeTrs.setLocalMatrix(cursorTrs.worldMatrix);

        // 延时，控制点击频率，并保证矩阵信息完备
        setTimeout(() => {
          touchFlag = false;

          if (preCubeTrs) {
            // 存在上一个，进行连线
            const preWorldPosition = preCubeTrs.worldPosition;
            const worldPosition = cubeTrs.worldPosition;
            // console.log(preWorldPosition.x, preWorldPosition.y, preWorldPosition.z, worldPosition.x, worldPosition.y, worldPosition.z)
            
            // 算中点
            const posX = (preWorldPosition.x + worldPosition.x) / 2
            const posY = (preWorldPosition.y + worldPosition.y) / 2
            const posZ = (preWorldPosition.z + worldPosition.z) / 2

            // forwad 向量
            preWorldPosition.sub(worldPosition, forward);
            console.log(forward.x, forward.y, forward.z);

            // 向量的模
            const module = preWorldPosition.distanceTo(worldPosition);

            // 方向四元数
            xr.Quaternion.lookRotation(forward, up, useQuaternion);
            console.log(useQuaternion.x, useQuaternion.y, useQuaternion.z, useQuaternion.w)

            const lineSize = 0.02;
            // line
            const lineEle = scene.createElement(xr.XRNode, {
              position: `${posX} ${posY} ${posZ}`,
              scale: `${lineSize} ${lineSize} ${module}`
            });
            // 加到场上
            root.addChild(lineEle);
            const lineTrs = lineEle.getComponent(xr.Transform);
            lineTrs.quaternion.x = useQuaternion.x;
            lineTrs.quaternion.y = useQuaternion.y;
            lineTrs.quaternion.z = useQuaternion.z;
            lineTrs.quaternion.w = useQuaternion.w;

            const matLine = scene.createMaterial(effectStandard);
            const color2 = colorPattern2[Math.floor(Math.random() * colorPattern2.length)];

            matLine.setVector('u_baseColorFactor', xr.Vector4.createFromNumber(color2[0], color2[1], color2[2], 1.0));
            matLine.setRenderState('cullFace', xr.ECullMode.FRONT);
            const meshLine = lineEle.addComponent(xr.Mesh, {
              geometry: geometryLine,
              material: matLine,
            });
            
            preCubeTrs = cubeTrs
          }else {
            preCubeTrs = cubeTrs
          }
        }, 100);


      });

    }
  }
})