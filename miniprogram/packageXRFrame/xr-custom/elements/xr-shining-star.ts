import XrFrame from 'XrFrame';
const xrFrameSystem = wx.getXrFrameSystem();

xrFrameSystem.registerMaterial('shining', scene => {
  return scene.createMaterial(scene.assets.getAsset<XrFrame.Effect>('effect', 'shining'));
});

const ShiningStarDefaultComponents: XrFrame.IEntityComponents = Object.assign({
  mesh: {
    geometry: 'star',
    material: 'shining'
  }
}, xrFrameSystem.NodeDefaultComponents);

const ShiningStarDataMapping: {[key: string]: string[];} = Object.assign({
  uniforms: ['mesh', 'uniforms']
}, xrFrameSystem.NodeDataMapping);

xrFrameSystem.registerElement('shining-star', class XRShiningStar extends xrFrameSystem.Element {
  public readonly defaultComponents: XrFrame.IEntityComponents = ShiningStarDefaultComponents;
  public readonly dataMapping: {[key: string]: string[];} = ShiningStarDataMapping;
});
