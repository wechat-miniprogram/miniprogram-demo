import outlineVert from './toon-shader/outlineVert'
import outlineFrag from './toon-shader/outlineFrag'
import toonVert from './toon-shader/toonVert'
import toonFrag from './toon-shader/toonFrag'

const xrFrameSystem = wx.getXrFrameSystem()

xrFrameSystem.registerEffect('toon-user', scene => scene.createEffect(
  {
    name: 'toon',
    defaultRenderQueue: 2000,
    passes: [
      // Outline
      {
        renderStates: {
          blendOn: false,
          depthWrite: true,
          // Default FrontFace is CW
          cullOn: true,
          cullFace: xrFrameSystem.ECullMode.BACK,
        },
        lightMode: 'ForwardBase',
        useMaterialRenderStates: false,
        shaders: [0, 1]
      },
      // ForwardBase
      {
        renderStates: {
          blendOn: false,
          depthWrite: true,
          // Default FrontFace is CW
          cullOn: false,
          cullFace: xrFrameSystem.ECullMode.NONE,
        },
        lightMode: 'ForwardBase',
        useMaterialRenderStates: true,
        shaders: [2, 3]
      },
      {
        renderStates: {
          cullOn: true,
          blendOn: false,
          depthWrite: true,
          cullFace: xrFrameSystem.ECullMode.FRONT,
        },
        lightMode: 'ShadowCaster',
        useMaterialRenderStates: false,
        shaders: [4, 5]
      },
    ],
    properties: [
      { key: 'u_baseColorFactor', type: xrFrameSystem.EUniformType.FLOAT4, default: [1, 1, 1, 1] },
      { key: 'u_outlineColor', type: xrFrameSystem.EUniformType.FLOAT4, default: [0.0, 0.0, 0.0, 0.0] },
      // { key: 'u_outlineWidth', type: xrFrameSystem.EUniformType.FLOAT, default: [0.3]},
      { key: 'u_outlineWidth', type: xrFrameSystem.EUniformType.FLOAT, default: [1.0] },
      { key: 'u_farthestDistance', type: xrFrameSystem.EUniformType.FLOAT, default: [100] },
      { key: 'u_nearestDistance', type: xrFrameSystem.EUniformType.FLOAT, default: [0.5] },
      { key: 'u_offsetZ', type: xrFrameSystem.EUniformType.FLOAT, default: [2.0] }
    ],
    images: [
      { key: 'u_baseColorMap', default: 'white', macro: 'WX_USE_BASECOLORMAP' },
      { key: 'u_gradientMap', default: 'white' }
    ],
    shaders: [
      // === Outline ===
      // Vertex Shader Outline
      outlineVert,
      // Fragment Shader Outline
      outlineFrag,
      // === Toon ===
      // Vertex Shader Toon
      toonVert,
      // Fragment Shader Toon
      toonFrag,
      `#version 100
  uniform highp mat4 u_world;
  uniform highp mat4 u_lightSpaceMatrix;

  
  attribute vec3 a_position;
  attribute highp vec2 a_texCoord;
  varying highp vec2 v_uv;
  varying highp float v_z;
  
  void main()
  {
      v_uv = a_texCoord;

      vec4 worldPosition = u_world * vec4(a_position, 1.0);
      vec4 lightPos = u_lightSpaceMatrix * worldPosition;
      v_z = lightPos.z / lightPos.w;
      v_z = lightPos.z / lightPos.w;

      gl_Position = lightPos;
  }`,
      `#version 100
  precision mediump float;
  precision highp int;
  varying highp vec2 v_uv;
  varying highp float v_z;
  
  uniform highp vec4 u_baseColorFactor;
  uniform sampler2D u_baseColorMap;

  vec4 packDepth(float depth)
  {
    vec4 bitShift = vec4(256.0 * 256.0 * 256.0, 256.0 * 256.0, 256.0, 1.0);
    vec4 bitMask = vec4(0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0);
    vec4 res = mod(
      depth * bitShift * vec4(255.0, 255.0, 255.0, 255.0),
      vec4(256.0, 256.0, 256.0, 256.0)) / vec4(255.0, 255.0, 255.0, 255.0);
    res -= res.xxyz * bitMask;
    return res;
  }

  void main()
  {

    gl_FragData[0] = packDepth(v_z * 0.5 + 0.5);

    // gl_FragData[0] = vec4(v_z * 0.5 + 0.5, 0.0, 0.0, 1.0);

  }  
    `
    ]
  }
))
