import skinningDefines from './skinningDefine'

export default
/* glsl */
`#version 100

uniform highp mat4 u_view;
uniform highp mat4 u_viewInverse;
uniform highp mat4 u_vp;
uniform highp mat4 u_projection;
uniform mat4 u_lightSpaceMatrix;
uniform vec4 u_fogInfos;
uniform vec3 u_fogColor;
uniform float u_gameTime;
uniform float u_aspect;
uniform vec3 u_ambientLight;
uniform vec3 u_lightDir;
uniform vec3 u_lightColor;
uniform vec3 u_shadowColor;
uniform float u_shadowStrength;
uniform float u_shadowBias;
uniform float u_lightWidthPCSS;
uniform float u_blockSizePCSS;
uniform vec4 u_csmFarBounds;
uniform vec4 u_shadowTilingOffsets[4];
uniform mat4 u_csmLightSpaceMatrices[4];
uniform vec3 u_SH[9];

uniform highp mat4 u_world;

uniform float u_outlineWidth;
uniform float u_farthestDistance;
uniform float u_nearestDistance;
uniform float u_offsetZ;

${skinningDefines}

attribute vec3 a_position;

#ifdef WX_USE_NORMAL
  attribute highp vec3 a_normal;
#endif

void main()
{
  #ifdef WX_SKINNED
      mat4 boneMat = getBoneMat();
      mat4 modelViewMatrix = u_view * boneMat;
  #else
      mat4 modelViewMatrix = u_view * u_world;
  #endif

  vec4 worldPosition = getSkinningWorldPosition(vec4(a_position, 1.0));
  vec3 cameraPosWS = vec3(u_viewInverse[3][0], u_viewInverse[3][1], u_viewInverse[3][2]);

  vec4 posCS = u_projection *  u_view * worldPosition;

  vec3 zeroWS = (u_projection * u_view * getSkinningWorldPosition(vec4(0, 0, 0, 1))).xyz;

  float objectDistanceToCamera = distance(zeroWS, cameraPosWS);
  float outlineWidth = 0.01 * u_outlineWidth * smoothstep(u_farthestDistance, u_nearestDistance, objectDistanceToCamera);
  
  vec3 normalCS = mat3(u_projection) * (mat3(u_view) * (mat3(u_world) * a_normal));

  gl_Position = vec4(posCS.xy + outlineWidth * normalCS.xy, posCS.zw);

  float offsetZ = u_offsetZ * (- 0.01);
  vec4 cameraPosCS = u_projection * u_view * vec4(cameraPosWS.xyz, 1);

  gl_Position.z = gl_Position.z + offsetZ * cameraPosCS.z;
}
`
