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

${skinningDefines}

attribute vec3 a_position;
attribute highp vec2 a_texCoord;
attribute highp vec2 a_texCoord_1;

varying highp vec2 v_UV;
varying highp vec2 v_UV1;
varying highp vec3 v_ViewPosition;

#ifdef WX_USE_COLOR_0
    attribute vec3 a_color;
    varying highp vec3 v_Color;
#endif

#ifdef WX_USE_NORMAL
    attribute highp vec3 a_normal;
    varying highp vec3 v_Normal;
#endif

void main()
{
#ifdef WX_SKINNED
    mat4 boneMat = getBoneMat();
    mat4 modelViewMatrix = u_view * boneMat;
#else
    mat4 modelViewMatrix = u_view * u_world;
#endif
    mat3 normalMatrix = mat3(modelViewMatrix);
    vec4 mvPosition = modelViewMatrix * vec4(a_position, 1.0);

    v_UV = a_texCoord;
    v_UV1 = a_texCoord_1;

#ifdef WX_USE_COLOR_0
    v_Color = a_color;
#endif

#ifdef WX_USE_NORMAL
    // v_Normal = normalize(vec3(normalMatrix * a_normal));
    v_Normal = normalize(a_normal);

#endif

    v_ViewPosition = mvPosition.xyz;

    gl_Position = u_projection * mvPosition;
}
`
