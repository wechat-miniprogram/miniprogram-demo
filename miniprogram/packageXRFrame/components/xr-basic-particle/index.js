import cont from './earring'

Component({
  behaviors: [require('../common/share-behavior').default],
  properties: {
    capacity: {
      type: Number,
      value: 20
    },
    emitRate: {
      type: Number,
      value: 5
    },
    lifeTime:{
      type: Number,
      value: 3
    }
  },
  data: {
    loaded: false
  },
  lifetimes: {},
  methods: {
    handleReady({detail}) {
      const xrScene = this.scene = detail.value;
      console.log('xr-scene', xrScene);
      const xrFrameSystem = wx.getXrFrameSystem()

      let tempSystem


      // const el = this.scene.getElementById('lightray');
      // el.event.add('stop', handleTest);

      // const sizeChange = xrScene.getElementById("size-change");
      // sizeChange.getComponent(xrFrameSystem.Particle).addSizeGradient(0,0.1,0.1);
      // sizeChange.getComponent(xrFrameSystem.Particle).addSizeGradient(0.5,0.3,0.3);
      // sizeChange.getComponent(xrFrameSystem.Particle).addSizeGradient(1,0.6,0.6);


      const magicField = xrScene.getElementById("magicField");
      tempSystem = magicField.getComponent(xrFrameSystem.Particle)
      tempSystem.addSizeGradient(0,0.7);
      tempSystem.addSizeGradient(0.5,1.0);
      tempSystem.addColorGradient(0, xrFrameSystem.Vector4.createFromNumber(1,0.89,0.27,1));
      tempSystem.addColorGradient(1, xrFrameSystem.Vector4.createFromNumber(1,0.64,0,1));
      tempSystem.addAlphaGradient(0,0,0);
      tempSystem.addAlphaGradient(0.5,1,1);
      tempSystem.addAlphaGradient(1,0,0);

      const portal = xrScene.getElementById("portal");
      tempSystem = portal.getComponent(xrFrameSystem.Particle)
      tempSystem.addSizeGradient(0,1,1);
      tempSystem.addSizeGradient(0.5,0.8,0.8);
      tempSystem.addSizeGradient(0.75,0.5,0.5);
      tempSystem.addSizeGradient(0.9,0.2,0.2);
      tempSystem.addSizeGradient(1,0,0);


      //orb vfx
      const orb = xrScene.getElementById("orb");
      tempSystem = orb.getComponent(xrFrameSystem.Particle);
      tempSystem.addAlphaGradient(0,0,0);
      tempSystem.addAlphaGradient(0.5,1,1);
      tempSystem.addAlphaGradient(1,0,0);
      tempSystem.addSizeGradient(0,1,1);
      tempSystem.addSizeGradient(1,0,0);

      //orbline vfx
      const orbLine = xrScene.getElementById("orbLine");
      tempSystem = orbLine.getComponent(xrFrameSystem.Particle);
      tempSystem.addColorGradient(0, xrFrameSystem.Vector4.createFromNumber(1,1,0,1));
      tempSystem.addColorGradient(1, xrFrameSystem.Vector4.createFromNumber(1,0.68,0,1));
      tempSystem.addAlphaGradient(0,0,0);
      tempSystem.addAlphaGradient(0.5,1,1);
      tempSystem.addAlphaGradient(1,0,0);
      tempSystem.addSizeGradient(0,1,1);
      tempSystem.addSizeGradient(1,0,0);
      
      const particle = xrScene.getElementById("human-face");
      // // 来自图片数据的二元数组content
      var content = cont
      // // 影响画作的大小与粒子疏密程度的因子
      var step = 0.02
      var height = Math.floor(step * content.length)
      //设置箱型发射器的发射方向，与粒子初始位置范围
      particle.getComponent(xrFrameSystem.Particle).createBoxEmitter(xrFrameSystem.Vector3.createFromNumber(1.0, 0.0, 0), xrFrameSystem.Vector3.createFromNumber(1.0, 0.0, 0),
      xrFrameSystem.Vector3.createFromNumber(0, 0, 0.5), xrFrameSystem.Vector3.createFromNumber(0, height, 0.0));
      //实现发射器的自定义粒子运作接口
      particle.getComponent(xrFrameSystem.Particle).particleEmitter.processInstance =  (instance, deltaTime)=> {
        var contentTemp = content
        var cellNumY = contentTemp.length
        var cellNumX = contentTemp[0].length
        var width =  Math.floor(step * cellNumX)
        if(instance.position.x - instance.particleSystem.emitterPosition.x> width){
          instance.age = instance.lifeTime;
              return;
          }
          instance.age = 0;
          const posX = Math.floor((instance.position.x -  instance.particleSystem.emitterPosition.x)/ step);
          const posY = Math.floor(instance.position.y/ step);
          const speed = contentTemp[cellNumY-1-posY][posX] * 0.97;
          instance.position.x += ( 1 - speed * 0.97 ) * 0.03 + Math.random() * 0.007;
          instance.color.w = speed * 0.3;
      };


      //case subEmitter
      // particle.getComponent(xrFrameSystem.Particle).createSphereEmitter(1, 0, 360, 0)
      // particle.getComponent(xrFrameSystem.Particle).subEmitters = [particle.getComponent(xrFrameSystem.Particle).createSubEmitter(
      //   [["stopDuration", "3"], ["minLifeTime", "3"], ["maxLifeTime", "3"], ["minSize", "0.1"], ["maxSize", "0.1"],
      // ["capacity", "20"], ["emitRate", "100"], ["particleEmitterType", "SphereShape"], ["particleEmitterStates", "radius=0.1"]]
      // )]

      //case colorRemap
      // const colorRemap = xrScene.getElementById("colorGradient");
      // colorRemap.getComponent(xrFrameSystem.Particle).useRampGradients = true;
      // colorRemap.getComponent(xrFrameSystem.Particle).addRampGradient(0.0, xrFrameSystem.Vector3.createFromNumber(1.0, 1.0, 1.0));
      // colorRemap.getComponent(xrFrameSystem.Particle).addRampGradient(0.2, xrFrameSystem.Vector3.createFromNumber(0.8, 0.8, 0.05));
      // colorRemap.getComponent(xrFrameSystem.Particle).addRampGradient(0.4, xrFrameSystem.Vector3.createFromNumber(0.86, 0.5, 0.05));
      // colorRemap.getComponent(xrFrameSystem.Particle).addRampGradient(0.6, xrFrameSystem.Vector3.createFromNumber(0.75, 0.18, 0.07));
      // colorRemap.getComponent(xrFrameSystem.Particle).addRampGradient(0.8, xrFrameSystem.Vector3.createFromNumber(0.45, 0.08, 0.06));
      // colorRemap.getComponent(xrFrameSystem.Particle).addRampGradient(1.0, xrFrameSystem.Vector3.createFromNumber(0.05, 0.05, 0.05));
    },

    handleAssetsProgress: function({detail}) {
      console.log('assets progress', detail.value);
      
    },
    handleAssetsLoaded: function({detail}) {
      console.log('assets loaded', detail.value);
      this.setData({loaded: true});
    }
  }
})