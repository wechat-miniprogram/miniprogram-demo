import XrFrame from 'XrFrame';
const xrFrameSystem = wx.getXrFrameSystem();

xrFrameSystem.registerEffect('shining', scene => scene.createEffect({
  name: "shining",
  properties: [
    {
      key: 'u_color',
      type: xrFrameSystem.EUniformType.FLOAT4,
      default: [1, 1, 1, 1]
    },
    {
      key: 'u_range',
      type: xrFrameSystem.EUniformType.FLOAT2,
      default: [0.5, 1]
    },
    {
      key: 'u_speed',
      type: xrFrameSystem.EUniformType.FLOAT,
      default: [1]
    },
  ],
  images: [
    {
      key: 'u_reflection',
      default: 'white',
      macro: 'WX_USE_REFLECTION'
    }
  ],
  defaultRenderQueue: 2000,
  passes: [{
    "renderStates": {
      cullOn: false,
      blendOn: false,
      depthWrite: true,
    },
    lightMode: "ForwardBase",
    useMaterialRenderStates: true,
    shaders: [0, 1]
  }],
  shaders: [`#version 100
uniform mat4 u_world;
uniform mat4 u_view;
uniform mat4 u_projection;
uniform mat4 u_viewInverse;

attribute vec3 a_position;
attribute vec3 a_normal;

#ifdef WX_USE_NORMAL
varying highp vec3 v_normal;
varying highp vec3 v_viewDir;
#endif

void main()
{
  vec4 worldP = u_world * vec4(a_position, 1.0);
  #ifdef WX_USE_NORMAL
  v_normal = normalize(mat3(u_world) * a_normal);
  v_viewDir = normalize(worldP.xyz - u_viewInverse[3].xyz);
  #endif
  gl_Position = u_projection * u_view * worldP;
}
  `,
    `#version 100
#define RECIPROCAL_PI 0.3183098861837907
precision highp float;
precision highp int;

#ifdef WX_USE_NORMAL
varying highp vec3 v_normal;
varying highp vec3 v_viewDir;
#endif

uniform float u_gameTime;
uniform vec4 u_color;
uniform vec2 u_range;
uniform float u_speed;
uniform sampler2D u_reflection;

vec4 textureBilinearEnvMap(sampler2D texture, vec3 direction){
  float uvX = (atan(direction.x, direction.z) ) * RECIPROCAL_PI * 0.5 + 0.5;
  float uvY = acos(direction.y) * RECIPROCAL_PI;
  vec2 uv = vec2(uvX, uvY);
  vec4 envmap = texture2D(texture, uv);

  return envmap;
}

void main()
{
  vec4 color;
#if defined(WX_USE_REFLECTION) && defined(WX_USE_NORMAL)
  vec3 reflectVec = reflect(-v_viewDir, v_normal);
  color = textureBilinearEnvMap(u_reflection, reflectVec) * u_color;
#else
  color = u_color;
#endif
  gl_FragData[0] = (u_range.x + sin(mod(u_gameTime * u_speed, 3.14)) * (u_range.y - u_range.x)) * color;
} 
    `],
}));

