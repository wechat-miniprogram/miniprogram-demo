export default `#version 100
precision mediump float;
precision highp int;
varying highp float v_shadowDepth;

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
    gl_FragData[0] = packDepth(v_shadowDepth * 0.5 + 0.5);
} 
    `
