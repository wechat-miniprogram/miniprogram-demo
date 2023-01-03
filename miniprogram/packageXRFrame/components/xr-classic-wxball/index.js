Component({
  behaviors: [require('../common/share-behavior').default],
  wxball: null,
  wxballTransform: null,
  wxballAnimator: null,
  animationRuning: false,
  properties: {
  },
  data: {
    loaded: false,
    arReady: false,
  },
  lifetimes: {
    async attached() {
      console.log('data', this.data);
    }
  },
  methods: {
    handleReady({
      detail
    }) {
      const xrScene = this.scene = detail.value;
      console.log('xr-scene', xrScene);

      const xrFrameSystem = wx.getXrFrameSystem();

      this.wxball = xrScene.getElementById('wxball');

      this.wxballTransform = this.wxball.getComponent(xrFrameSystem.Transform);
      this.wxballTransform.visible = false;


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
    handleGltfLoaded: function() {
      const xrScene = this.scene;

      const xrFrameSystem = wx.getXrFrameSystem();
      
      this.wxball = xrScene.getElementById('wxball');

      this.wxballAnimator = this.wxball.getComponent(xrFrameSystem.Animator);

      this.wxballAnimator.play('gltfAnimation', {
        loop: 0,
      });

      this.wxballAnimator.play('gltfAnimation#0', {
        loop: 0,
      });

      this.wxballAnimator.pauseToFrame('gltfAnimation', 1);
      this.wxballAnimator.pauseToFrame('gltfAnimation#0', 1);

      this.wxballTransform.visible = true;

    },
    handleTouchWXball: function() {
     
      if (!this.animationRuning) {
        console.log('WXBALL TOUCH');

        this.animationRuning = true;

        this.wxballAnimator.pauseToFrame('gltfAnimation', 1);
        this.wxballAnimator.pauseToFrame('gltfAnimation#0', 1);
        
        this.wxballAnimator.resume('gltfAnimation');
        this.wxballAnimator.resume('gltfAnimation#0');
      }
    },
    handleAnimationStop: function() {
      console.log('animation Stop');
    }
  }
})