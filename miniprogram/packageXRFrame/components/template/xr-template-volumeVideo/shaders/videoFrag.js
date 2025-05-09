export default `#version 100
precision mediump float;
precision highp int;
varying highp vec2 v_UV;

uniform sampler2D u_baseColorMap;
void main()
{
  vec4 color = texture2D(u_baseColorMap, v_UV);

  // gl_FragColor = vec4(1.0,1.0,1.0,1.0);
  gl_FragColor = vec4(color.rgb, 1.0);
} 
    `
