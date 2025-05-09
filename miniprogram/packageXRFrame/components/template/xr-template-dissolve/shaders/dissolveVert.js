export default `#version 100
uniform highp mat4 u_view;
uniform highp mat4 u_projection;
uniform highp mat4 u_world;

attribute vec3 a_position;
attribute highp vec2 a_texCoord;

varying highp vec2 v_UV;

void main(){
  v_UV = a_texCoord;
  gl_Position = u_projection * u_view * u_world * vec4(a_position, 1.0);
}
`
