import XrFrame from 'XrFrame';
const xrFrameSystem = wx.getXrFrameSystem();

export const CustomParticleDefaultComponents: XrFrame.IEntityComponents = Object.assign({
    'custom-particle': {}
  }, xrFrameSystem.NodeDefaultComponents);
  
  export const CustomParticleDataMapping: { [key: string]: string[] } = Object.assign({
    'never-cull': ['custom-particle', 'neverCull'],
    uniforms: ['custom-particle', 'uniforms'],
    states: ['custom-particle', 'states'],
    'atlas': ['custom-particle', 'atlas'],
    'atlas-frames': ['custom-particle', 'atlasFrames'],
    'atlas-loop': ['custom-particle', 'atlasLoop'],
    'atlas-speed': ['custom-particle', 'atlasSpeed'],
    'atlas-random': ['custom-particle', 'atlasRandom'],
    angle: ['custom-particle', 'angle'],
    'angular-speed': ['custom-particle', 'angularSpeed'],
    'burst-count': ['custom-particle', 'burstCount'],
    'burst-time': ['custom-particle', 'burstTime'],
    'burst-cycle': ['custom-particle', 'burstCycle'],
    'burst-interval': ['custom-particle', 'burstInterval'],
    capacity: ['custom-particle', 'capacity'],
    delay: ['custom-particle', 'delay'],
    'emit-rate': ['custom-particle', 'emitRate'],
    'emitter-type': ['custom-particle', 'emitterType'],
    'emitter-props': ['custom-particle', 'emitterProps'],
    'emitter-position': ['custom-particle', 'emitterPosition'],
    'end-color': ['custom-particle', 'endColor'],
    gravity: ['custom-particle', 'gravity'],
    'life-time': ['custom-particle', 'lifeTime'],
    'render-mode': ['custom-particle', 'renderMode'],
    'render-model': ['custom-particle', 'renderModel'],
    size: ['custom-particle', 'size'],
    'stop-duration': ['custom-particle', 'stopDuration'],
    speed: ['custom-particle', 'speed'],
    'start-color': ['custom-particle', 'startColor'],
    'start-color2': ['custom-particle', 'startColor2'],
    texture: ['custom-particle', 'texture'],
    'scale-x': ['custom-particle', 'scaleX'],
    'scale-y': ['custom-particle', 'scaleY'],
    'prewarm-cycles': ['custom-particle', 'prewarmCycles'],
    'speed-dampen': ['custom-particle', 'speedDampen'],
    'mesh': ['custom-particle', 'mesh'],
    'size-change': ['custom-particle', 'sizeChange'],
    'color-change': ['custom-particle', 'colorChange'],
    'speed-change': ['custom-particle', 'speedChange'],
  }, xrFrameSystem.NodeDataMapping);
  
  xrFrameSystem.registerElement('custom-particle', class XRCustomParticle extends xrFrameSystem.Element {
    public readonly defaultComponents: XrFrame.IEntityComponents = CustomParticleDefaultComponents;
    public readonly dataMapping: { [key: string]: string[] } = CustomParticleDataMapping;
  })