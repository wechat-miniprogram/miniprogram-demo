const xrFrameSystem = wx.getXrFrameSystem();

xrFrameSystem.registerEffect('removeBlack', scene => scene.createEffect({
  name: "removeBlack",
  images: [{
    key: 'u_videoMap',
    default: 'white',
    macro: 'WX_USE_VIDEOMAP'
  }],
  defaultRenderQueue: 2000,
  passes: [{
    "renderStates": {
      cullOn: false,
      blendOn: true,
      blendSrc: xrFrameSystem.EBlendFactor.SRC_ALPHA,
      blendDst: xrFrameSystem.EBlendFactor.ONE_MINUS_SRC_ALPHA,
      cullFace: xrFrameSystem.ECullMode.BACK,
    },
    lightMode: "ForwardBase",
    useMaterialRenderStates: true,
    shaders: [0, 1]
  }],
  shaders: [
`#version 100

uniform highp mat4 u_view;
uniform highp mat4 u_viewInverse;
uniform highp mat4 u_vp;
uniform highp mat4 u_projection;
uniform highp mat4 u_world;

attribute vec3 a_position;
attribute highp vec2 a_texCoord;

varying highp vec2 v_UV;

void main()
{
  v_UV = a_texCoord;
  vec4 worldPosition = u_world * vec4(a_position, 1.0);
  gl_Position = u_projection * u_view * worldPosition;
  }`,
`#version 100

precision mediump float;
precision highp int;
varying highp vec2 v_UV;

#ifdef WX_USE_VIDEOMAP
  uniform sampler2D u_videoMap;
#endif

void main()
{
#ifdef WX_USE_VIDEOMAP
  vec4 baseColor = texture2D(u_videoMap, v_UV);
#else
  vec4 baseColor = vec4(1.0, 1.0, 1.0, 1.0);
#endif
  float rgbSum = baseColor.r + baseColor.g + baseColor.b;
  // 设定阈值避免异常情况
  if (rgbSum < 0.1) {
    gl_FragData[0] = vec4(1.0, 1.0, 1.0, 0.0);
  } else {
    gl_FragData[0] = vec4(pow(baseColor.rgb, vec3(2.2)), 1.0);
  }
}
`],
}));