export default
/* glsl */
`#version 100

precision highp float;
precision highp int;

uniform float u_gameTime;
uniform highp mat4 u_world;
uniform highp mat4 u_view;
uniform highp mat4 u_projection;
uniform highp mat4 u_viewInverse;

uniform vec4 u_outlineColor;

void main()
{
    gl_FragData[0] = u_outlineColor;
}
`
