import outlineVert from './toon-shader/outlineVert';
import outlineFrag from './toon-shader/outlineFrag';
import toonVert from './toon-shader/toonVert';
import toonFrag from './toon-shader/toonFrag';
const xrFrameSystem = wx.getXrFrameSystem();

xrFrameSystem.registerEffect('toon-user', scene => scene.createEffect(
  {
    name: "toon",
    defaultRenderQueue: 2000,
    passes: [
        // Outline
        {
            renderStates: {
              blendOn: false,
              depthWrite: true,
              // Default FrontFace is CW
              cullOn: true,
              cullFace: xrFrameSystem.ECullMode.BACK,
            },
            lightMode: "ForwardBase",
            useMaterialRenderStates: false,
            shaders: [0, 1]
        },
        // ForwardBase
        {
            renderStates: {
              blendOn: false,
              depthWrite: true,
              // Default FrontFace is CW
              cullOn: false,
              cullFace: xrFrameSystem.ECullMode.NONE,
            },
            lightMode: "ForwardBase",
            useMaterialRenderStates: true,
            shaders: [2, 3]
        }
    ],
    properties: [
        { key: 'u_baseColorFactor', type: xrFrameSystem.EUniformType.FLOAT4, default: [1, 1, 1, 1] },
        { key: 'u_outlineColor', type: xrFrameSystem.EUniformType.FLOAT4, default: [0.0, 0.0, 0.0, 0.0]},
        // { key: 'u_outlineWidth', type: xrFrameSystem.EUniformType.FLOAT, default: [0.3]},
        { key: 'u_outlineWidth', type: xrFrameSystem.EUniformType.FLOAT, default: [1.0]},
        { key: 'u_farthestDistance', type: xrFrameSystem.EUniformType.FLOAT, default: [100]},
        { key: 'u_nearestDistance', type: xrFrameSystem.EUniformType.FLOAT, default: [0.5]},
        { key: 'u_offsetZ', type: xrFrameSystem.EUniformType.FLOAT, default: [2.0]}
    ],
    images: [
        { key: 'u_baseColorMap', default: 'white', macro: 'WX_USE_BASECOLORMAP' },
        { key: 'u_gradientMap', default: 'white' }
    ],
    shaders: [
        // === Outline ===
        // Vertex Shader Outline
        outlineVert,
        // Fragment Shader Outline
        outlineFrag,
        // === Toon ===
        // Vertex Shader Toon
        toonVert,
        // Fragment Shader Toon
        toonFrag
    ]
}
));