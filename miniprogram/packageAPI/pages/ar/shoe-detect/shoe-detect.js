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
          if (this.model) {
            this.model.scale.set(0, 0, 0);
          }
        })

        // Three 场景相关
        const THREE = this.THREE;
        const loader = this.loader = new THREE.GLTFLoader()
        // 加载模型
        loader.load( 'https://mmbizwxaminiprogram-1258344707.cos.ap-guangzhou.myqcloud.com/xr-frame/demo/shoe-1.glb', ( gltf ) =>{

          this.modelWrap =new THREE.Object3D();

          // 模型加载到场上
          this.scene.add( gltf.scene );

          console.log('gltf loaded', gltf.scene);
          // 设置模型索引
          this.model = gltf.scene;

          this.model.position.set(0, -0.5, 0);
          this.model.scale.set(120, 120, 120);

          // const hintWidth = 4;
          // // x
          // const xMaterial = new THREE.MeshPhongMaterial( {
          //   color: 0xFF0000,
          //   shininess: 150,
          //   specular: 0x222222
          // } );
          // const xGeometry = new THREE.BoxGeometry( 1, 1, 1 );
          // const xCube = new THREE.Mesh( xGeometry, xMaterial );
          // xCube.position.set( hintWidth / 2, 0, 0 );
          // xCube.scale.set(hintWidth, 0.1, 0.1);
          // this.modelWrap.add(xCube);
          
          // // y
          // const yMaterial = new THREE.MeshPhongMaterial( {
          //   color: 0x00FF00,
          //   shininess: 150,
          //   specular: 0x222222
          // } );
          // const yGeometry = new THREE.BoxGeometry( 1, 1, 1 );
          // const yCube = new THREE.Mesh( yGeometry, yMaterial );
          // yCube.position.set( 0, hintWidth/2, 0 );
          // yCube.scale.set( 0.1, hintWidth,  0.1);
          // this.modelWrap.add(yCube);
          
          // // z
          // const zMaterial = new THREE.MeshPhongMaterial( {
          //   color: 0x0000FF,
          //   shininess: 150,
          //   specular: 0x222222
          // } );
          // const zGeometry = new THREE.BoxGeometry( 1, 1, 1 );
          // const zCube = new THREE.Mesh( zGeometry, zMaterial );
          // zCube.position.set( 0, 0, hintWidth/2 );
          // zCube.scale.set( 0.1, 0.1, hintWidth);
          // this.modelWrap.add(zCube);

          // 模型加载到场上
          this.modelWrap.add(this.model);
          this.scene.add( this.modelWrap );
        });

        // 调试用 Cube
        // const material = new THREE.MeshPhongMaterial( {
				// 	color: 0xACFADF,
				// 	shininess: 150,
				// 	specular: 0x222222
				// } );
        // const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        // const cube = new THREE.Mesh( geometry, material );
				// cube.position.set( 0, 0, 0 );
        // cube.rotation.set(Math.PI / 6, Math.PI / 6, 0 )
        // cube.scale.set(0.5, 0.5, 0.5);
				// scene.add( cube );
        // this.model = cube;

        console.log('ready to initloop')
        // start 初始化完毕后，进行更新渲染循环
        this.initLoop();
      });

      } catch(e) {
        
      }

    },
    loop() {
      // console.log('loop')
      const gl = this.gl

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

        // 本案例 VK ViewMatrix 返回单位阵，可以不设
        // this.camera.matrixWorldInverse.fromArray(VKCamera.viewMatrix)
        // this.camera.matrixWorld.getInverse(this.camera.matrixWorldInverse)

        const projectionMatrix = VKCamera.getProjectionMatrix(NEAR, FAR)
        // VK 返回列主序
        // 设置 投影矩阵
        this.camera.projectionMatrix.fromArray(projectionMatrix)
        // this.camera.projectionMatrixInverse.getInverse(this.camera.projectionMatrix)
      }

      // 存在model，更新矩阵
      if (this.modelWrap && this.points3d && this.shoeTransform) {

        const THREE = this.THREE;

        // 顶点偏移矩阵
        const positionMat = new THREE.Matrix4();
        positionMat.setPosition(this.points3d[0].x, this.points3d[1].y, this.points3d[2].z);
        // positionMat.setPosition(-0.278, -1.1958, -2.89);

        // Anchor返回矩阵，实际上就是完整的 modelView matrix
        const anchorMat = new THREE.Matrix4();
        // 目前返回的是行主序矩阵
        anchorMat.set(
          this.shoeTransform[0], this.shoeTransform[1], this.shoeTransform[2], this.shoeTransform[3],
          this.shoeTransform[4], this.shoeTransform[5], this.shoeTransform[6], this.shoeTransform[7],
          this.shoeTransform[8], this.shoeTransform[9], this.shoeTransform[10], this.shoeTransform[11],
          this.shoeTransform[12], this.shoeTransform[13], this.shoeTransform[14], this.shoeTransform[15],
        )
        // anchorMat.set(
        //   -0.89, -0.04, 0.43, -0.06,
        //   0.43,   -0.18, 0.87,  -2.38,
        //   0.04,   0.98,  0.18,  -17.77,
        //   0.0,    0.0,   0.0,    1.0
        // );

        // 两者叠加
        const modelWorld = positionMat.multiply(anchorMat);
        
        const pos = new THREE.Vector3();
        const quaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3();

        // 解析出 实际的 信息
        modelWorld.decompose(pos, quaternion, scale );
          
        // console.log(pos, quaternion, scale)

        // 设置到渲染模型容器上
        this.modelWrap.position.set(pos.x, pos.y, pos.z);
        this.modelWrap.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
        this.modelWrap.scale.set(scale.x, scale.y, scale.z);

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
      this.renderer.render(this.scene, this.camera);
      // 为什么去掉这句话会画不出来，我感觉大概率是YUV的面朝向错了
      this.renderer.state.setCullFace(this.THREE.CullFaceNone)

    },
  },
})