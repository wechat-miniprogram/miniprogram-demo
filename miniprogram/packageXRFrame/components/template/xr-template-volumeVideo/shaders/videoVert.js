export default `#version 100
uniform highp mat4 u_view;
uniform highp mat4 u_projection;
uniform highp mat4 u_world;
attribute vec3 a_position;
attribute highp vec2 a_texCoord;
attribute highp vec4 a_boneIndices;
attribute highp vec4 a_weights;

uniform sampler2D texture2;

varying highp vec2 v_UV;

highp float width = 4.0;
highp float height = 60.0;
vec4 texelFetch1(int x, int y) {
      return texture2D(texture2, vec2((float(x) + 0.5) / width, (float(y) + 0.5) / height));
}
mat4 getBoneMatrix(int boneNdx) {
  return mat4(
    texelFetch1(0, boneNdx),
    texelFetch1(1, boneNdx),
    texelFetch1(2, boneNdx),
    texelFetch1(3, boneNdx));
}
void main(){
  v_UV = a_texCoord;
  vec4 totalPosition = vec4(0.0);

  for(int i = 0; i < 4; i++) {
    int boneId = int(a_boneIndices[i]);
    vec4 localPosition = getBoneMatrix(boneId) * vec4(a_position.xyz, 1.0);
    totalPosition += localPosition * a_weights[i];
  }

  vec4 worldPosition = u_world * vec4(totalPosition.xyz, 1.0);

  gl_Position = u_projection * u_view * worldPosition;
}
`
