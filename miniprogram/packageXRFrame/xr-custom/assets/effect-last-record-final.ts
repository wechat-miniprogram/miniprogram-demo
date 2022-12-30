import XrFrame from 'XrFrame';
const xrFrameSystem = wx.getXrFrameSystem();

xrFrameSystem.registerEffect('last-record-final', scene => scene.createEffect({
  name: "last-record-final",
  properties: [],
  images: [
    {
      key: 'u_arBg',
      default: 'white'
    },
    {
      key: 'u_main',
      default: 'white'
    }
  ],
  defaultRenderQueue: 2000,
  passes: [{
    "renderStates": {
      cullOn: false,
      blendOn: false,
      depthWrite: false,
      depthTestOn: false
    },
    lightMode: "ForwardBase",
    useMaterialRenderStates: false,
    shaders: [0, 1]
  }],
  shaders: [`#version 100
  attribute vec3 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;

  void main() {
    v_texCoord = a_texCoord;
    gl_Position = vec4(a_position.xy, 1.0, 1.0);
  }
  `,
    `#version 100
precision mediump float;
precision highp int;
varying highp vec2 v_texCoord;

uniform sampler2D u_arBg;
uniform sampler2D u_main;

void main()
{
  vec2 uv = v_texCoord.xy;
  vec4 bgColor = texture2D(u_arBg, uv);
  vec4 mainColor = texture2D(u_main, uv);
  gl_FragData[0] = vec4(bgColor.rgb * (1. - mainColor.a) + mainColor.rgb * mainColor.a, 1.);
  // gl_FragData[0] = vec4(pow(mainColor.a, 1. / 2.2), 0., 0., 1.);
  // gl_FragData[0] = mainColor;
} 
    `],
}));

