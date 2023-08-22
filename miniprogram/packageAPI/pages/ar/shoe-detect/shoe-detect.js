import arBehavior from '../behavior/behavior-ar'
import yuvBehavior from '../behavior/behavior-yuv'
// import edgeBehavior from "../behavior/behavior-edge"

// VK 投影矩阵参数定义
const NEAR = 0.001
const FAR = 1000

let loggerOnce = false;

Component({
  behaviors: [arBehavior, yuvBehavior],
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
      // 初始化 Three.js，用于模型相关的渲染
      this.initTHREE()

      // 初始化 GL，基于 Three.js 的 Context，用于相机YUV渲染
      this.initYUV()

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
            console.log("addAnchor", anchors)
            // if (this.model) {
            //   this.model.scale.set(120, 120, 120);
            // }
        })

        // VKSession EVENT updateAnchors
        session.on('updateAnchors', anchors => {
            for (let i = 0; i < anchors.length; i++ ) {
              const anchor = anchors[i];
              // console.log('transform', anchor.transform);
              // console.log('points3d', anchor.points3d);
              this.shoeTransform = anchor.transform;
              this.points3d = anchor.points3d;
            }

        })
        
        // VKSession removeAnchors
        // 识别目标丢失时，会不断触发
        session.on('removeAnchors', anchors => {
          // if (this.model) {
          //   this.model.scale.set(0, 0, 0);
          // }
        })

        // Three 场景相关
        const THREE = this.THREE;
        
        // 控制容器节点
        this.modelWrap = new THREE.Object3D();
        this.scene.add( this.modelWrap );

        // 初始化提示点
        this.addShoeHintBox();

        // 加载模型
        // const loader = this.loader = new THREE.GLTFLoader()
        // loader.load( 'https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com/xr-frame/demo/shoe-1.glb', ( gltf ) =>{
        //   console.log('gltf loaded', gltf.scene);

        //   // 设置模型索引以及缩放比
        //   this.model = gltf.scene;
        //   this.model.position.set(0, 0, 0);
        //   this.model.scale.set(120, 120, 120);

        //   console.log('gltf set', this.model, this.modelWrap);

        //   // 模型加载到场上
        //   this.modelWrap.add(this.model);
        // });

        console.log('ready to initloop')
        // start 初始化完毕后，进行更新渲染循环
        this.initLoop();
      });

      } catch(e) {
        
      }

    },
    addShoeHintBox() {
      const THREE = this.THREE;

      const wrap = this.modelWrap;
      
      const geometry = new THREE.BoxGeometry( 1, 1, 1 );
      const boxScale = 0.3;

      const hintBoxList = [];
      for (let i = 0; i < 8; i++) {
        const colorHex = (i * 2).toString(16);
        const material = new THREE.MeshPhysicalMaterial( {
          metalness: 0.0,
          roughness: 0.5,
          color: parseInt(`${colorHex}${colorHex}${colorHex}${colorHex}${colorHex}${colorHex}`, 16),
        });
        const mesh = new THREE.Mesh( geometry, material );
        mesh.position.set(0, 0, 0);
        mesh.scale.set(boxScale, boxScale, boxScale);
        wrap.add( mesh );
        hintBoxList.push(mesh);
      }

      this.hintBoxList = hintBoxList;
    },
    loop() {
      // console.log('loop')

      // 获取 VKFrame
      const frame = this.session.getVKFrame(this.canvas.width, this.canvas.height)

      // 成功获取 VKFrame 才进行
      if(!frame) { return; }

      // 更新相机 YUV 数据
      this.renderYUV(frame)

      // 获取 VKCamera
      const VKCamera = frame.camera

      // 同步 VKCamera 矩阵信息到 Three Camera
      if (VKCamera) {
        // VK接管相机矩阵
        this.camera.matrixAutoUpdate = false

        // VK ViewMatrix 返回列主序
        this.camera.matrixWorldInverse.fromArray(VKCamera.viewMatrix)
        this.camera.matrixWorld.getInverse(this.camera.matrixWorldInverse)

        const projectionMatrix = VKCamera.getProjectionMatrix(NEAR, FAR)
        // VK 返回列主序
        // 设置 投影矩阵
        this.camera.projectionMatrix.fromArray(projectionMatrix)
        this.camera.projectionMatrixInverse.getInverse(this.camera.projectionMatrix)
      }

      // 存在model，更新矩阵
      if (this.modelWrap && this.points3d && this.shoeTransform) {
        // console.log('toUpdate')
        const THREE = this.THREE;

        // 顶点偏移矩阵
        const positionMat = new THREE.Matrix4();
        // 认为点 0 0 0
        positionMat.setPosition(0, 0, 0);

        // Anchor返回矩阵，实际上就是完整的 modelView matrix
        const anchorMatrix = new THREE.Matrix4();
        // 目前返回的是行主序矩阵
        anchorMatrix.set(
          this.shoeTransform[0], this.shoeTransform[1], this.shoeTransform[2], this.shoeTransform[3],
          this.shoeTransform[4], this.shoeTransform[5], this.shoeTransform[6], this.shoeTransform[7],
          this.shoeTransform[8], this.shoeTransform[9], this.shoeTransform[10], this.shoeTransform[11],
          this.shoeTransform[12], this.shoeTransform[13], this.shoeTransform[14], this.shoeTransform[15],
        );
        // 两者叠加
        // const modelWorld = positionMat.multiply(anchorMatrix);
        
        const modelWorld = anchorMatrix;

        const pos = new THREE.Vector3();
        const quaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3();

        // 解析出 实际的 信息
        modelWorld.decompose(pos, quaternion, scale );          
        // console.log(pos, quaternion, scale);

        // 设置到容器节点上
        this.modelWrap.position.set(pos.x, pos.y, pos.z);
        this.modelWrap.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
        this.modelWrap.scale.set(scale.x, scale.y, scale.z);

        if (this.model) {
          // 先把模型放置在脚踝
          // this.model.position.set(this.points3d[0].x, this.points3d[0].y, this.points3d[0].z);
        }

        if (this.hintBoxList && this.hintBoxList.length > 0) {
          // console.log('ready to set', this.hintBoxList);
          // 存在提示列表，则更新点信息
          for (let i = 0; i < this.hintBoxList.length; i++) {
            const hintBox = this.hintBoxList[i];
            hintBox.position.set(this.points3d[i].x, this.points3d[i].y, this.points3d[i].z);
          }
          // console.log('seted', this.hintBoxList);
        }


        // debug 用信息
        // if (!loggerOnce) {
        //   console.log('positionMat', positionMat);
        //   console.log('anchorMat', anchorMat);
        //   console.log('modelWorld', modelWorld);

        //   console.log('projectionMatrix', this.camera.projectionMatrix);

        //   console.log('this.modelWrap.position', this.modelWrap.position);
        //   console.log('this.modelWrap.quaternion', this.modelWrap.quaternion);
        //   console.log('this.modelWrap.scale', this.modelWrap.scale);
        //   loggerOnce = true;
        // }
      }

      // 渲染 Three 场景
      this.renderer.autoClearColor = false
      this.renderer.state.setCullFace(this.THREE.CullFaceBack)
      this.renderer.render(this.scene, this.camera);
      // 为什么去掉这句话会画不出来，我感觉大概率是YUV的面朝向错了
      this.renderer.state.setCullFace(this.THREE.CullFaceNone)

    },
  },
})