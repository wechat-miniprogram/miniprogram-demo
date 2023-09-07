
import XrFrame from 'XrFrame';
const xrFrameSystem = wx.getXrFrameSystem();

xrFrameSystem.registerEffect('plane-shadow', scene => scene.createEffect({
  name: "plane-shadow",
  properties: [
    // 需保证，至少存在一个properties用于创建effect共享内存
    {
      key: 'u_holder',
      type: xrFrameSystem.EUniformType.FLOAT4,
      default: [1, 1, 1, 1]
    }
  ],
  images: [],
  defaultRenderQueue: 3000,
  passes: [{
    "renderStates": {
      cullOn: false,
      blendOn: true,
    },
    lightMode: "ForwardBase",
    useMaterialRenderStates: true,
    shaders: [0, 1]
  }],
  shaders: [
// Vertex
`#version 100

uniform highp mat4 u_view;
uniform highp mat4 u_viewInverse;
uniform highp mat4 u_vp;
uniform highp mat4 u_projection;
uniform highp mat4 u_world;

attribute vec3 a_position;
attribute highp vec2 a_texCoord;

varying highp vec2 v_UV;

#ifdef WX_RECEIVE_SHADOW
    varying highp vec3 v_WorldPosition;
#endif

void main()
{
  v_UV = a_texCoord;
  vec4 worldPosition = u_world * vec4(a_position, 1.0);

  #ifdef WX_RECEIVE_SHADOW
      v_WorldPosition = worldPosition.xyz;
  #endif

  gl_Position = u_projection * u_view * worldPosition;
}`,
// Fragemenet
`#version 100

precision mediump float;
precision highp int;
varying highp vec2 v_UV;

uniform vec4 u_ambientLightColorIns;
uniform vec3 u_mainLightDir;
uniform vec4 u_mainLightColorIns;


#ifdef WX_RECEIVE_SHADOW
    varying highp vec3 v_WorldPosition;

    uniform float u_shadowStrength;
    uniform float u_shadowBias;
    uniform vec3 u_shadowColor;
    uniform sampler2D u_shadowMap;

    uniform mat4 u_csmLightSpaceMatrices[4];
    uniform vec4 u_csmFarBounds;
    uniform vec4 u_shadowTilingOffsets[4];
#endif

float unpackDepth(const in vec4 rgbaDepth)
{
  vec4 bitShift = vec4(1.0 / (256.0 * 256.0 * 256.0), 1.0 / (256.0 * 256.0), 1.0 / 256.0, 1.0);
  float depth = dot(rgbaDepth, bitShift);
  return depth;
}

float shadowCalculation(vec3 posWorld) {
  float srcShadow = 1.0;

  vec4 shadowCoord = u_csmLightSpaceMatrices[0] * vec4(posWorld, 1.0);
  shadowCoord.xyz = shadowCoord.xyz / shadowCoord.w;
  shadowCoord = shadowCoord * 0.5 + 0.5;
  shadowCoord.z = shadowCoord.z + step(shadowCoord.x, 0.001) + step(shadowCoord.y, 0.001) + step(0.999, shadowCoord.x) + step(0.999, shadowCoord.y);
  shadowCoord.xy = shadowCoord.xy * u_shadowTilingOffsets[0].xy + u_shadowTilingOffsets[0].zw;

  if (shadowCoord.z > 1.0)
  {
    shadowCoord.z = 1.0;
  }

  float currentDepth = shadowCoord.z;

  float bias = u_shadowBias;
  float zRef = currentDepth - bias;

  float sourceVal = float(zRef < unpackDepth(texture2D(u_shadowMap, shadowCoord.xy)));
  srcShadow = sourceVal;

  return srcShadow;
  }

void main()
{
  vec4 result = vec4(0.0);
  
  // MainLights
  #ifdef WX_USE_MAIN_DIR_LIGHT
        vec3 mainLightColor = u_mainLightColorIns.rgb * u_mainLightColorIns.a;

      #ifdef WX_RECEIVE_SHADOW
          float shadowScale = shadowCalculation(v_WorldPosition);
          result = vec4(mainLightColor * shadowScale, 1.0 - shadowScale);
      #endif
  #endif

  gl_FragData[0] = result;


}
`],
}));