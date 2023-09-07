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
    imageLoaded: false,
    gltfIdList: [],
    videoIdList: [],
    imageIdList: [],
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
    imageListRaw: {
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
    imageListRaw(newVal) {
      this.releaseImage();
      this.loadImage(newVal);
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

        // 声明使 gltf Mesh 移除
        this.setData({
          gltfLoaded: false
        });

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

        // 声明使视频 Mesh 移除
        this.setData({
          videoLoaded: false
        });

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
            options: { autoPlay: true, loop: true, abortAudio: false },
          })
        }))
        videos.map((videoTexture, index) => {
          const videoMat = scene.createMaterial(
            scene.assets.getAsset('effect', 'simple'),
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
    releaseImage() {
      if (this.data.imageIdList && this.data.imageIdList.length > 0) {
        const scene = this.scene

        // 声明使视频 Mesh 移除
        this.setData({
          imageLoaded: false
        });

        this.data.imageIdList.map((id) => {
          // 释放加载过的资源
          scene.assets.releaseAsset('texture', `texture-${id}`);
          scene.assets.releaseAsset('material', `texture-mat-${id}`);
        })
      }
    },
    async loadImage(imageList) {
      const scene = this.scene
      if (imageList.length > 0) {
        const xrFrameSystem = wx.getXrFrameSystem();

        const imageIdList = [];
        const images = await Promise.all(imageList.map((imageItem) =>{
          const id = imageItem.id;
          console.log(imageItem, id);
          imageIdList.push(id);
          if (id === 2) {
            // 走 asset 直接加载方式
            return scene.assets.loadAsset({
              type: 'texture',
              assetId: `texture-${imageItem.id}`,
              src: imageItem.src,
            })

          } else if (id === 3) {
            // 走 createImage 方式
            return new Promise(resolve => {
              const image = scene.createImage();
              image.src = imageItem.src;
              image.onload = () => {
                resolve({
                  value: scene.createTexture({
                    source: [image],
                    width: image.width,
                    height: image.height,
                    // 按需加后面的
                    magFilter: xrFrameSystem.EFilterMode.LINEAR_MIPMAP_LINEAR,
                    minFilter: xrFrameSystem.EFilterMode.LINEAR_MIPMAP_LINEAR,
                    wrapU: xrFrameSystem.EWrapMode.CLAMP_TO_EDGE,
                    wrapV: xrFrameSystem.EWrapMode.CLAMP_TO_EDGE,
                    anisoLevel:1
                  })
                });
              };
              image.onerror = error => {};
            });
          }
        }));

        console.log(images);
        
        images.map((texture, index) => {
          const textureMat = scene.createMaterial(
            scene.assets.getAsset('effect', 'simple'),
            { u_baseColorMap: texture.value }
          )
          scene.assets.addAsset('material', `texture-mat-${imageList[index].id}`, textureMat)
        })

        this.setData({
          imageIdList: imageIdList,
          imageLoaded: true
        })
      } else {
        this.setData({
          imageIdList: [],
          imageLoaded: false
        })
      }
    }
  }
})