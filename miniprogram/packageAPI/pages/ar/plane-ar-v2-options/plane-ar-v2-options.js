import arBehavior from '../behavior/behavior-ar'
import threeBehavior from '../behavior/behavior-three'

// VK 投影矩阵参数定义
const NEAR = 0.01
const FAR = 1000

Component({
  behaviors: [arBehavior, threeBehavior],
  data: {
    theme: 'light',
    widthScale: 1,      // canvas宽度缩放值
    heightScale: 0.6,   // canvas高度缩放值
    markerImgList: [],  // 使用的 marker 列表
    chooseImgList: [], // 使用的 图片 列表
  },
  markerIndex: 0,  // 使用的 marker 索引
  showBoxList: [], // 提示盒子列表
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
          wx.onThemeChange(({theme}) => {
            this.setData({theme})
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

      this.markerIndex = 0;

      this.showBoxList = [];

    },
    initVK() {
      // VKSession 配置
      const session = this.session = wx.createVKSession({
        track: {
          plane: {
            mode: 1
          },
          marker: true,
        },
        version: 'v2',
        gl: this.gl
      });

      session.start(err => {
        if (err) return console.error('VK error: ', err)

        console.log('@@@@@@@@ VKSession.version', session.version)

        //  VKSession EVENT resize
        session.on('resize', () => {
          this.calcCanvasSize();
        })

        // VKSession EVENT addAnchors
        session.on('addAnchors', anchors => {
          // console.log("addAnchor", anchors);

          anchors.forEach(anchor => {
            const showBox = {
              id: anchor.id,
              size: anchor.size,
              transform: anchor.transform
            };
            
            switch(anchor.type) {
              case 0:
                // plane Anchor
                const boxPlane = this.createBox(0xffffff, anchor.type);
                boxPlane.box.scale.set(showBox.size.width, 0.02, showBox.height);
                console.log('boxPlane.size', showBox.size);

                showBox.type = 'Plane';
                showBox.wrap = boxPlane.wrap;
                showBox.box = boxPlane.box;
                break;
              case 1:
                // marker Anchor
                const boxMarker = this.createBox(0x55cc55, anchor.type);
                boxMarker.box.scale.set(1, 0.15, 1);
                console.log('boxMarker.size', showBox.size);


                showBox.type = 'Marker';
                showBox.wrap = boxMarker.wrap;
                showBox.box = boxMarker.box;
                break;
            }
            
            this.showBoxList.push(showBox);
          });

          console.log('this.showBoxList', this.showBoxList)
        })

        // VKSession EVENT updateAnchors
        session.on('updateAnchors', anchors => {
          // plane + marker 模式下，可以有多个识别目标
          // console.log('this.showBoxList', this.showBoxList)

          // 仅更新已经添加的Anchor
          this.showBoxList.forEach(showBox => {
            for(let i = 0; i < anchors.length; i++) {
              if (showBox.id === anchors[i].id) {
                // 匹配
                if (showBox.size !== anchors[i].size) {
                  switch(showBox.type) {
                    case 'Plane':
                      showBox.box.scale.set(anchors[i].size.width, 0.02, anchors[i].size.height);
                      break;
                    case 'Marker':
                      break;
                  }
                }
                showBox.size =  anchors[i].size;
                showBox.transform = anchors[i].transform;
                break;
              }
            }
          });
        })
        
        // VKSession removeAnchors
        // 识别目标丢失时，会触发一次
        session.on('removeAnchors', anchors => {

          // 存在要删除的 Anchor
          if (anchors.length > 0) {
            this.showBoxList = this.showBoxList.filter((showBox) => {
              let flag = true;
              for(let i = 0; i < anchors.length; i++) {
                if (showBox.id === anchors[i].id) {
                  // 从three里面去掉
                  this.scene.remove(showBox.wrap);
                  // 标记删除
                  flag = false;
                  break;
                }
              }
              return flag;

            })
          }
        });


        console.log('ready to initloop')
        // start 初始化完毕后，进行更新渲染循环
        this.initLoop();
      });

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

      // 相机
      if (VKCamera) {
        // 接管 ThreeJs 相机矩阵更新，Marker模式下，主要由视图和投影矩阵改变渲染效果
        this.camera.matrixAutoUpdate = false

        // 视图矩阵
        this.camera.matrixWorldInverse.fromArray(VKCamera.viewMatrix);
        this.camera.matrixWorld.getInverse(this.camera.matrixWorldInverse);

        // 投影矩阵
        const projectionMatrix = VKCamera.getProjectionMatrix(NEAR, FAR)
        this.camera.projectionMatrix.fromArray(projectionMatrix)
        this.camera.projectionMatrixInverse.getInverse(this.camera.projectionMatrix)
      }

      // 更新提示盒子 位置
      if (this.showBoxList) {
        this.showBoxList.forEach(showBox => {
          showBox.wrap.matrix.fromArray(showBox.transform);
        });
      }

      this.renderer.autoClearColor = false
      this.renderer.state.setCullFace(this.THREE.CullFaceBack)
      this.renderer.render(this.scene, this.camera)
      this.renderer.state.setCullFace(this.THREE.CullFaceNone)
    },
    createBox(color, type) {
      const THREE = this.THREE;
      const scene = this.scene;

      const material = new THREE.MeshPhysicalMaterial( {
        metalness: 0.0,
        roughness: 0.1,
        color: color,
        transparent: true,
        opacity: 0.6
      } );
      const geometry = new THREE.BoxGeometry( 1, 1, 1 );

      const wrap = new THREE.Object3D();
      // 禁止矩阵自动更新，只能手动写入信息
      wrap.matrixAutoUpdate = false;

      // 绘制区域的box
      const box = new THREE.Mesh( geometry, material );
      wrap.add(box);

      // 根据类型添加不一样的行为
      switch(type) {
        case 0:
          // plane Anchor

          // 平面添加中心提示点
          const materialHint = new THREE.MeshPhysicalMaterial( {
            metalness: 0.0,
            roughness: 0.1,
            color: 0xaa3333,
            transparent: true,
            opacity: 0.99
          } );
          const geometryHint =  new THREE.SphereGeometry( 0.03, 32, 32 );
          const hint = new THREE.Mesh( geometryHint, materialHint );
          hint.position.set(0, 0.04, 0);
          wrap.add(hint);
          break;
        case 1:
          // marker Anchor
          break;
      }
      scene.add( wrap );

      box.visible = true;

      return {
        wrap: wrap,
        box: box,
      };
    },
    chooseMedia() { 
      // marker图片上传逻辑
      wx.chooseMedia({
        count: 9,
        mediaType: ['image'],
        sizeType: ['original'],
        success: res => {
          console.log('chooseMedia res', res)

          const chooseImgListRes = [];
          for (let i = 0; i < res.tempFiles.length; i++) {
            const imgUrl = res.tempFiles[i].tempFilePath;
            chooseImgListRes.push(imgUrl);
          }

          console.log('set chooseImgList', chooseImgListRes)
          this.setData({
            chooseImgList: chooseImgListRes,
          })
        },
        fail: res => {
          console.error(res)
        }
      })
    },
    async addMarker() {
      console.log('addMarker')
      const fs = wx.getFileSystemManager()
      
      const markerImgListRes = this.data.markerImgList.concat([]);
      const preMarkerIndex = this.markerIndex;

      console.log('pre markerImgList', preMarkerIndex, markerImgListRes);
      
      // 检查与添加 marker 函数
      const chooseImgCount = this.data.chooseImgList.length;
      let handledCount = 0;
      const checkMarkerAdded = () => {
        if (handledCount === chooseImgCount) {
          this.markerIndex = markerImgListRes.length;

          console.log('markerImgList set', markerImgListRes, this.markerIndex);
          this.setData({
            chooseImgList: [],
            markerImgList: markerImgListRes
          });
        }
      }
      
      // 准备进行choose的图片保存到fs
      for (let i = 0; i < chooseImgCount; i++) {
        const chooseImgUrl = this.data.chooseImgList[i];
        const fileEnd = chooseImgUrl.split('.').slice(-1)[0];
        const fileIndex = preMarkerIndex + i;
        // 算法侧目前只认 map png jpg jpeg 后缀文件
        const filePath = `${wx.env.USER_DATA_PATH}/marker-ar-${fileIndex}.${fileEnd}`;

        const saveAndAddMarker = () => {
          console.log('saveFileSync start', filePath, chooseImgUrl);
          // 存入文件系统，并添加到marker
          fs.saveFile({
            filePath,
            tempFilePath: chooseImgUrl,
            success: ()=> {
              console.log('[addMarker] --> ', filePath)
              const markerId = this.session.addMarker(filePath)
              markerImgListRes.push({
                markerId: markerId,
                filePath: filePath
              })
              handledCount++;
              checkMarkerAdded();
            },
            fail: res => {
              console.error(res)
              console.log('文件保存失败', filePath);
              handledCount++;
              checkMarkerAdded();
            }
          })
        }

        console.log('uploadFile Path', filePath);
        // 确定文件，存在即删除
        fs.stat({
          path: filePath,
          success: (res) => {
            if (res.stats.isFile()) {
              fs.unlinkSync(filePath);
              console.log('fs unlinkSync', filePath);
            }
            saveAndAddMarker();
          },
          fail: (res) => {
            console.error(res)
            console.log('fs中不存在，直接写入', filePath);

            saveAndAddMarker();
          }
        })
      }

    },
    removeMarker() {
      if (this.data.markerImgList) {
        for (let i = 0; i < this.data.markerImgList.length; i++) {
          const markerImg = this.data.markerImgList[i];
          this.session.removeMarker(markerImg.markerId);
        }
        this.markerIndex = 0;
        this.setData({
          markerImgList: [],
        })
      }
    },
    placePlane() {

    },
    changeDepthFlag() {
    },
  },
})