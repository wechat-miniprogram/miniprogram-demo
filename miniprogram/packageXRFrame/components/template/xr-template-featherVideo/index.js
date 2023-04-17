Component({
  behaviors: [require('../../common/share-behavior').default],
  properties: {
    a: Number,
  },
  data: {
    loaded: false,
    loading: false,
    gltfLoaded: false,
    videoLoaded: false,
    gltfIdList: [],
    videoIdList: [],
  },
  properties: {
    gltfListRaw: {
      type: Array,
      value: [],
    },
    videoListRaw: {
      type: Array,
      value: [],
    },
  },
  observers: {
    gltfListRaw(newVal) {
      this.releaseGLTF();
      this.loadGLTF(newVal);
    },
    videoListRaw(newVal) {
      this.releaseVideo();
      this.loadVideo(newVal);
    },
  },
  lifetimes: {},
  methods: {
    handleReady({detail}) {
      const xrScene = this.scene = detail.value;
      console.log('xr-scene', xrScene);
      // 绑定tick事件
      xrScene.event.add('tick', this.handleTick.bind(this));
    },
    handleAssetsProgress: function({detail}) {
      console.log('assets progress', detail.value);
    },
    handleAssetsLoaded: function({detail}) {
      console.log('assets loaded', detail.value);
      this.setData({loaded: true});
    },
    handleTick: function () {
    },
    releaseGLTF() {
      if (this.data.gltfIdList && this.data.gltfIdList.length > 0) {
        const scene = this.scene

        this.data.gltfIdList.map((id) => {
          // 释放加载过的资源
          scene.assets.releaseAsset('gltf',`gltf-${id}`);
        })
      }
    },
    async loadGLTF(gltfList) {
      const scene = this.scene

      if (gltfList.length > 0) {
        const gltfIdList = [];
        const gltfModel = await Promise.all(gltfList.map( (gltfItem) => {
          gltfIdList.push(gltfItem.id)
          const gtltfPromise = scene.assets.loadAsset({
            type: 'gltf',
            assetId: `gltf-${gltfItem.id}`,
            src: gltfItem.src,
          })
          return gtltfPromise;
        }));
        
        console.log('glTF asset loaded')
        this.setData({ 
          gltfIdList: gltfIdList,
          gltfLoaded: true
        })
      } else {
        this.setData({ 
          gltfIdList: [],
          gltfLoaded: false,
        });
      }
    },
    releaseVideo() {
      if (this.data.videoIdList && this.data.videoIdList.length > 0) {
        const scene = this.scene

        this.data.videoIdList.map((id) => {
          // 释放加载过的资源
          scene.assets.releaseAsset('video-texture', `video-${id}`);
          scene.assets.releaseAsset('material', `video-mat-${id}`);
        })
      }
    },
    async loadVideo(videoList) {
      const scene = this.scene
      if (videoList.length > 0) {
        const videoIdList = [];
        const videos = await Promise.all(videoList.map((videoItem) =>{
          videoIdList.push(videoItem.id);
          return scene.assets.loadAsset({
            type: 'video-texture',
            assetId: `video-${videoItem.id}`,
            src: videoItem.src,
            options: { autoPlay: true, loop: true },
          })
        }))

        videos.map((videoTexture, index) => {
          const videoMat = scene.createMaterial(
            scene.assets.getAsset('effect', 'standard'),
            { u_baseColorMap: videoTexture.value.texture }
          )
          scene.assets.addAsset('material', `video-mat-${videoList[index].id}`, videoMat)
        })
        console.log('video asset loaded')
        this.setData({
          videoIdList: videoIdList,
          videoLoaded: true
        })
      } else {
        this.setData({
          videoIdList: [],
          videoLoaded: false
        })
      }
    },
  }
})