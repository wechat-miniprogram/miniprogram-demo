import XrFrame from 'XrFrame';
const xrFrameSystem = wx.getXrFrameSystem();

export interface IAutoRotateData {
  speed: number[];
}

const AutoRotateSchema: XrFrame.IComponentSchema = {
  speed: {type: 'number-array', defaultValue: [1, 1, 1]}
}

xrFrameSystem.registerComponent('auto-rotate', class AutoRotate extends xrFrameSystem.Component<IAutoRotateData> {
  public readonly schema: XrFrame.IComponentSchema = AutoRotateSchema;

  private _speedX: number = 1;
  private _speedY: number = 1;
  private _speedZ: number = 1;

  public onAdd(parent: XrFrame.Element, data: IAutoRotateData): void {
    this._processData(data);
  }

  public onUpdate(data: IAutoRotateData, preData: IAutoRotateData): void {
    this._processData(data);
  }

  public onTick(delta: number, data: IAutoRotateData) {
    const trs = this.el.getComponent(xrFrameSystem.Transform);
    if (!trs) {
      return;
    }

    trs.rotation.x += this._speedX * 0.1;
    trs.rotation.y += this._speedY * 0.1;
    trs.rotation.z += this._speedZ * 0.1;
  }

  public onRemove(parent: XrFrame.Element, data: IAutoRotateData): void {

  }

  private _processData(data: IAutoRotateData) {
    this._speedX = data.speed?.[0] !== undefined ? data.speed[0] : 1;
    this._speedY = data.speed?.[1] !== undefined ? data.speed[1] : 1;
    this._speedZ = data.speed?.[2] !== undefined ? data.speed[2] : 1;
  }
});
