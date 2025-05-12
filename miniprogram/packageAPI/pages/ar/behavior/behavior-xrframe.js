const xrFrameBehavior = Behavior({
  yuvMat: undefined, // yuv纹理
  yuvMatInit: undefined, // yuv纹理是否已经初始化
  DT: undefined, // 缓存displayMatrix
  methods: {
    // xrScene Ready 事件回调
    handleXRSceneReady(detail) {
      console.log('handleXRSceneReady', detail)
      const xrFrameSystem = wx.getXrFrameSystem()

      this.xrCamera = detail.detail.camera
      this.xrCameraTrs = this.xrCamera.el.getComponent(xrFrameSystem.Transform)
      this.xrScene = detail.detail.scene
      this.xrFrameReady = true
      if (this.initXRFrame) {
        this.initXRFrame()
      }
    },
    // 绑定自定义 YUV effect
    registerYUVEffect() {
      const xrFrameSystem = wx.getXrFrameSystem()
      xrFrameSystem.registerEffect('ar-yuv-self', scene => scene.createEffect({
        properties: [
          {
            key: 'u_displayMatrix',
            type: 6,
            default: [
              1, 0, 0, 0,
              0, 1, 0, 0,
              0, 0, 1, 0,
              0, 0, 0, 1
            ]
          }
        ],
        images: [
          {
            key: 'u_yTexture',
            default: 'black',
            macro: 'WX_AR_CAMERA_READY'
          },
          {
            key: 'u_uvTexture',
            default: 'white'
          },
          {
            key: 'u_depthTexture',
            default: 'white',
            macro: 'WX_AR_CAMERA_DEPTH'
          }
        ],
        defaultRenderQueue: 2000,
        passes: [{
          renderStates: {
            cullOn: false,
            blendOn: false,
            depthWrite: false
          },
          lightMode: 'ForwardBase',
          useMaterialRenderStates: true,
          shaders: [0, 1]
        }],
        shaders:
[
  `#version 100
attribute vec3 a_position;
attribute vec2 a_texCoord;

precision highp float;

uniform highp mat4 u_view;
uniform highp mat4 u_viewInverse;
uniform highp mat4 u_vp;
uniform highp mat4 u_projection;

uniform highp mat4 u_world;


uniform highp mat4 u_displayMatrix;
varying highp vec2 v_texCoord;

void main() {
    v_texCoord = a_texCoord;
    vec4 pos = u_displayMatrix * vec4(a_position.xy, 1., 1.);

    gl_Position =  pos;
}
`,
  `#version 100
precision mediump float;
precision highp int;

uniform sampler2D u_yTexture;
uniform sampler2D u_uvTexture;
varying highp vec2 v_texCoord;

float unpack(float h, float l) {
    return h * 0.94117647 + l * 0.0588235;
}

void main()
{
    vec4 yColor = texture2D(u_yTexture, v_texCoord);
    vec4 uvColor = texture2D(u_uvTexture, v_texCoord);

#ifdef WX_AR_CAMERA_READY

    float Y, U, V;
    float R, G, B;
    Y = yColor.r;
    U = unpack(uvColor.r, uvColor.g) - 0.5;
    V = unpack(uvColor.b, uvColor.a) - 0.5;
    
    R = Y + 1.402 * V;
    G = Y - 0.344 * U - 0.714 * V;
    B = Y + 1.772 * U;

    gl_FragData[0] = vec4(B, G, R, 1.0);
#else
    gl_FragData[0] = vec4(0.0, 0.0, 0.0, 1.0);

#endif
}
`
]
      }))
    },
    // 初始化 xr-frame 相机 YUV 数据绘制流程节点
    initXRYUVCamera() {
      const xrFrameSystem = wx.getXrFrameSystem()
      const scene = this.xrScene
      const { assets, rootShadow } = scene

      const el = scene.createElement(xrFrameSystem.XRNode, {
        layer: 1
      })

      const yuvGeometry = assets.getAsset('geometry', 'ar-camera-plane')
      let yuvEffect = assets.getAsset('effect', 'ar-yuv-self')

      if (!yuvEffect) {
        this.registerYUVEffect()
        yuvEffect = assets.getAsset('effect', 'ar-yuv-self')
      }

      const yuvMat = scene.createMaterial(yuvEffect)
      yuvMat.renderQueue = 1 // 第一个绘制
      const mesh = el.addComponent(xrFrameSystem.Mesh, {
        geometry: yuvGeometry,
        material: yuvMat
      })

      // 相机yuv纹理
      this.yuvMat = yuvMat
      this.yuvMatInit = false

      // 不进入正常的剔除
      rootShadow.addChild(el)

      console.log('initXRYUVCamera end')
    },
    updataXRYUV(frame) {
      // console.log('update yuv')
      const xrFrameSystem = wx.getXrFrameSystem()
      const scene = this.xrScene
      const yuv = frame.getCameraRawTextureData()
      // 未创建相机贴图缓存，先创建
      if (!this.cameraTexures) {
        this.cameraTexures = {
          y: scene.createTexture({
            width: yuv.width,
            height: yuv.height,
            source: [yuv.yAddress],
            pixelFormat: xrFrameSystem.ETextureFormat.R8
          }),
          uv: scene.createTexture({
            width: yuv.width / 2,
            height: yuv.height / 2,
            source: [yuv.uvAddress],
            pixelFormat: xrFrameSystem.ETextureFormat.RGBA4
          })
        }
      }
      const { y, uv, depth } = this.cameraTexures

      const cameraYUVMat = this.yuvMat
      // 未绑定贴图的情况下，绑定贴图
      if (!this.yuvMatInit) {
        cameraYUVMat.setTexture('u_yTexture', y)
        cameraYUVMat.setTexture('u_uvTexture', uv)
        // depth && cameraYUVMat.setTexture('u_depthTexture', depth);
        this.yuvMatInit = true
      }

      // 更新displayMat
      const dt = frame.getDisplayTransform()
      if (!this.DT) { this.DT = new xrFrameSystem.Matrix4() }
      this.DT.setArray([
        dt[0], dt[1], dt[2], 0,
        dt[3], dt[4], dt[5], 0,
        dt[6], dt[7], dt[8], 0,
        0, 0, 0, 1
      ])
      cameraYUVMat.setMatrix('u_displayMatrix', this.DT)

      // YUV纹理更新
      y.update({ buffer: yuv.yAddress })
      uv.update({ buffer: yuv.uvAddress })

      // console.log('update yuv end')
    },
    updataXRCameraMatrix(VKCamera, near, far) {
      // 同步 VKCamera 矩阵信息到 xrFrame Camera
      if (VKCamera) {
        const viewMat = VKCamera.viewMatrix
        const projMat = VKCamera.getProjectionMatrix(near, far)

        // 更新 viewMatrix
        this.xrCamera.changeViewMatrix(true, viewMat)

        // 更新 projectMatrix
        const halfFov = Math.atan(1 / projMat[5]) * 180 / Math.PI
        this.xrCamera.setData({ near, far, fov: 2 * halfFov })
        this.xrCamera.changeProjectMatrix(true, projMat)
      }
    },
  },
})

export default xrFrameBehavior
