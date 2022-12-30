import XrFrame from 'XrFrame';
const xrFrameSystem = wx.getXrFrameSystem();

const AutoRotateTouchableGLTFDefaultComponents: XrFrame.IEntityComponents = Object.assign({
  'mesh-shape': {},
  'auto-rotate': {}
}, xrFrameSystem.GLTFDefaultComponents);

const AutoRotateTouchableGLTFDataMapping: {[key: string]: string[];} = Object.assign({
  speed: ['auto-rotate', 'speed']
}, xrFrameSystem.GLTFDataMapping);

xrFrameSystem.registerElement('auto-rotate-touchable-gltf', class XRAutoRotateTouchableGLTF extends xrFrameSystem.Element {
  public readonly defaultComponents: XrFrame.IEntityComponents = AutoRotateTouchableGLTFDefaultComponents;
  public readonly dataMapping: {[key: string]: string[];} = AutoRotateTouchableGLTFDataMapping;
});
