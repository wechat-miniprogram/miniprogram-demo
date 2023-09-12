import arBehavior from '../behavior/behavior-ar'
import xrFrameBehavior from '../behavior/behavior-xrFrame'

// VK 投影矩阵参数定义
const NEAR = 0.01
const FAR = 1000

let loggerOnce = false;

Component({
  behaviors: [arBehavior, xrFrameBehavior],
  data: {
    theme: 'light',
    cameraPosition: 0,
    buttonDisable: true,
  },
  hintBoxList: [], // 提示点集合
  lifetimes: {
    /**
     * 生命周期函数--监听页面加载
     */
    detached() {
      console.log("页面detached")
      if (wx.offThemeChange) {
        wx.offThemeChange()
      }
    },
    ready() {
      console.log("页面准备完全")
      this.setData({
        theme: wx.getSystemInfoSync().theme || 'light'
      })

      if (wx.onThemeChange) {
        wx.onThemeChange(({
          theme
        }) => {
          this.setData({
            theme
          })
        })
      }
    },
  },
  methods: {
    // 对应案例的初始化逻辑，由统一的 behavior 触发
    init() {
      // 初始化VK
      // start完毕后，进行更新渲染循环
      this.initVK();
    },
    initVK() {
      // VKSession 配置
      const session = this.session = wx.createVKSession({
          track: {
              shoe: {
                  mode: 1
              }
          },
          cameraPosition: 0,
          version: 'v1',
          gl: this.gl
      })

      try{

      // VKSession start
      session.start(err => {
        if (err) return console.error('VK error: ', err)

        console.log('@@@@@@@@ VKSession.version', session.version)

        //  VKSession EVENT resize
        session.on('resize', () => {
            this.calcCanvasSize();
        })

        // VKSession EVENT addAnchors
        session.on('addAnchors', anchors => {
            // console.log("addAnchor", anchors)
        })

        // VKSession EVENT updateAnchors
        session.on('updateAnchors', anchors => {
          // console.log("updateAnchors")
            for (let i = 0; i < anchors.length; i++ ) {
              const anchor = anchors[i];
              // console.log('transform', anchor.transform);
              // console.log('points3d', anchor.points3d);
              this.shoeTransform = anchor.transform;
              this.points3d = anchor.points3d;

              if (!this.modelShow) {
                const modelScale = 240;
                this.modelTrs.scale.x = modelScale;
                this.modelTrs.scale.y = modelScale;
                this.modelTrs.scale.z = modelScale;

                if (this.hintBoxList && this.hintBoxList.length > 0) {
                  // 存在提示列表，则更新点信息
                  for (let i = 0; i < this.hintBoxList.length; i++) {
                    const hintBox = this.hintBoxList[i];
                    hintBox.visible = true;
                  }
                }
                this.modelShow = true;
              }
            }

        })
        
        // VKSession removeAnchors
        // 识别目标丢失时，会不断触发
        session.on('removeAnchors', anchors => {
          // console.log("removeAnchors")
          if (this.modelShow) {
            const modelScale = 0;
            this.modelTrs.scale.x = modelScale;
            this.modelTrs.scale.y = modelScale;
            this.modelTrs.scale.z = modelScale;

            if (this.hintBoxList && this.hintBoxList.length > 0) {
              // 存在提示列表，则更新点信息
              for (let i = 0; i < this.hintBoxList.length; i++) {
                const hintBox = this.hintBoxList[i];
                hintBox.visible = false;
              }
            }
            this.modelShow = false;
          }
        })

        console.log('ready to initloop')
        // start 初始化完毕后，进行更新渲染循环
        this.initLoop();
      });

      } catch(e) {
      }
    },
    // 针对 xr-frame 的初始化逻辑
    async initXRFrame() {
      const xrFrameSystem = wx.getXrFrameSystem();
      const scene = this.xrScene;
      const {rootShadow} = scene;
      
      // 初始化YUV相机配置
      this.initXRYUVCamera();

      // 初始化挂载点
      this.modelWrap = scene.createElement(xrFrameSystem.XRNode);
      this.modelWrapTrs = this.modelWrap.getComponent(xrFrameSystem.Transform);
      rootShadow.addChild(this.modelWrap );

      console.log('modelWrap ready');

      // 加载鞋子模型
      const shoeModel = await scene.assets.loadAsset({
        type: 'gltf',
        assetId: `gltf-shoe`,
        src: 'https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com/xr-frame/demo/shoe-1.glb',
      })
      console.log('shoeModel', shoeModel.value);
      const el = scene.createElement(xrFrameSystem.XRGLTF, {
        model: "gltf-shoe",
        position: "0 0 0",
        scale: "0 0 0",
      });
      this.model = el;
      this.modelTrs = el.getComponent(xrFrameSystem.Transform);
      this.modelShow = false;

      console.log('this.modelTrs', this.modelTrs);

      this.modelWrap.addChild(el);

      console.log('shoeModel ready');


      // 初始化提示点
      const wrap = this.modelWrap;
      const geometryCube = scene.assets.getAsset('geometry', 'cube');
      const effectCube = scene.assets.getAsset('effect', 'standard');
      const boxScale = 0.2;
      const hintBoxList = [];
      for (let i = 0; i < 8; i++) {
        const colorFloat =  i / 16;
        const el = scene.createElement(xrFrameSystem.XRNode, {
          position: "0 0 0",
          scale: `${boxScale} ${boxScale} ${boxScale}`,
        });
        const elTrs = el.getComponent(xrFrameSystem.Transform);
        const mat = scene.createMaterial(effectCube);
        mat.setVector('u_baseColorFactor', xrFrameSystem.Vector4.createFromNumber(colorFloat + 0.3, 0.2, 0.2, 1.0));
        mat.renderQueue = 9990;
        mat.setRenderState('depthTestOn', false);

        const mesh = el.addComponent(xrFrameSystem.Mesh, {
          geometry: geometryCube,
          material: mat,
        });

        wrap.addChild( el );
        hintBoxList.push( elTrs );
      }

      this.hintBoxList = hintBoxList;

      console.log('hintBoxList ready');

    },
    loop() {
      // console.log('loop')

      // 获取 VKFrame
      const frame = this.session.getVKFrame(this.data.domWidth, this.data.domHeight)

      // 成功获取 VKFrame 才进行
      if(!frame) { return; }

      // 更新相机 YUV 数据
      this.updataXRYUV(frame);

      // 获取 VKCamera
      const VKCamera = frame.camera

      // 更新 xrFrame 相机矩阵
      this.updataXRCameraMatrix(VKCamera, NEAR, FAR);

      // 存在model，更新矩阵
      if (this.modelWrap && this.points3d && this.shoeTransform) {
        const xrFrameSystem = wx.getXrFrameSystem();
        const scene = this.xrScene;

        if (!this.DT) { this.DT = new xrFrameSystem.Matrix4(); }
        if (!this.DT2) { this.DT2= new xrFrameSystem.Matrix4(); }

        // 目前VK返回的是行主序矩阵
        // xrframe 矩阵存储为列主序
        this.DT.setArray(this.shoeTransform);
        this.DT.transpose(this.DT2);
        this.modelWrapTrs.setLocalMatrix(this.DT2);

        // 放置鞋子
        this.modelTrs.position.x = (this.points3d[3].x + this.points3d[4].x ) / 2;
        this.modelTrs.position.y = (this.points3d[3].y + this.points3d[4].y ) / 2;
        this.modelTrs.position.y -= 0.2; // 额外下移0.2，适配鞋底
        this.modelTrs.position.z = (this.points3d[0].z + this.points3d[1].z ) / 2;

        if (this.hintBoxList && this.hintBoxList.length > 0) {
          // console.log('ready to set', this.hintBoxList);
          // 存在提示列表，则更新点信息
          for (let i = 0; i < this.hintBoxList.length; i++) {
            const hintBox = this.hintBoxList[i];
            hintBox.position.x = this.points3d[i].x;
            hintBox.position.y = this.points3d[i].y;
            hintBox.position.z = this.points3d[i].z;
          }
        }

        // debug 用信息
        if (!loggerOnce) {
          // console.log('xrCamera._viewMatrix', this.xrCamera._viewMatrix.toArray());
          // console.log('xrCamera._projMatrix', this.xrCamera._projMatrix.toArray());
          
          // VK 直接数值
          // console.log('joints',  Array.from(this.points3d))
          // console.log('viewMatrix',  Array.from(VKCamera.viewMatrix))
          // console.log('projectionMatrix',  Array.from(VKCamera.getProjectionMatrix(NEAR, FAR)))
          // console.log('anchorTransform',  Array.from(this.shoeTransform));
          loggerOnce = true;
        }

      }
    },
  },
})