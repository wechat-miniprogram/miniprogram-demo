export default `#version 100
precision mediump float;
precision highp int;
varying highp vec2 v_UV;

uniform float u_threshold;
uniform float u_edgeWidth; // 边缘宽度
uniform vec4 u_firstColor;
uniform vec4 u_secondColor;

uniform sampler2D u_mainTexture;
uniform sampler2D u_mainTexture2;
uniform sampler2D u_noiseTexture;

void main()
{
  float cutout = texture2D(u_noiseTexture, v_UV).r;
  vec4 mainColor;
  vec4 color;
  if (cutout < u_threshold)
  {
    mainColor = texture2D(u_mainTexture2, v_UV);
    color = mainColor;
  }
  else
  {
    mainColor = texture2D(u_mainTexture, v_UV);
    float factor = clamp((cutout - u_threshold) / u_edgeWidth, 0.0, 1.0);
    vec4 edgeColor = mix(u_firstColor, u_secondColor, factor);
    color = mix(edgeColor, mainColor, factor);
  }
  gl_FragColor = vec4(color.rgb, 1.0);
} 

    `
