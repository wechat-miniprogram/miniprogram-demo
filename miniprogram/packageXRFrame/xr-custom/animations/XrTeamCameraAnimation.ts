import XrFrame from 'XrFrame';
const xrFrameSystem = wx.getXrFrameSystem();

interface IXrTeamCameraAnimtionData {
  targets: {
    hikari: XrFrame.Vector3;
    roam: XrFrame.Vector3;
    xinyi: XrFrame.Vector3;
    final: XrFrame.Vector3;
    [key: string]: XrFrame.Vector3;
  },
  startY: number;
  finalY: number;
}

interface IXrTeamCameraAnimationOptions {

}

export default class XrTeamCameraAnimation extends xrFrameSystem.Animation<
  IXrTeamCameraAnimtionData,
  IXrTeamCameraAnimationOptions
> {
  private _camera: XrFrame.Transform | undefined;
  private _target: XrFrame.Transform | undefined;
  private _targets: IXrTeamCameraAnimtionData['targets'] | undefined;
  private _startY: number | undefined;
  private _finalY: number | undefined;
  private _startC: XrFrame.Vector3 = new xrFrameSystem.Vector3();
  private _endC: XrFrame.Vector3 = new xrFrameSystem.Vector3();
  private _startT: XrFrame.Vector3 = new xrFrameSystem.Vector3();
  private _endT: XrFrame.Vector3 = new xrFrameSystem.Vector3();

  public onInit(data: IXrTeamCameraAnimtionData) {
    console.log('anim data', data);
    this._targets = data.targets;
    this._startY = data.startY;
    this._finalY = data.finalY;

    this.clipNames = [
      'hikari',
      'roam',
      'xinyi',
      'final'
    ];
  }

  public onPlay(el: XrFrame.Element, clipName: string, options: IXrTeamCameraAnimationOptions): {
    duration: number,
    loop?: number,
    delay?: number,
    direction?: XrFrame.TDirection
  } {
    const isFinal = clipName === 'final';
    this._camera = this._camera || el.getComponent(xrFrameSystem.Transform);
    this._target = el.getComponent(xrFrameSystem.Camera).target;
    this._startT.set(this._target.position);
    this._endT.setValue(this._targets![clipName].x, isFinal ? this._finalY! : this._startY!, this._targets![clipName].z);
    this._startC.set(this._camera.position);
    this._endC.set(this._endT);
    this._endC.z += isFinal ? 3 : 1;

    return {duration: isFinal ? 4 : 2};
  }

  /**
   * @param progress 0~1
   */
  public onUpdate(el: XrFrame.Element, progress: number, reverse: boolean) {
    progress = xrFrameSystem.noneParamsEaseFuncs['ease-in-out'](progress);
    this._startT?.lerp(this._endT, progress, this._target?.position);
    this._startC?.lerp(this._endC, progress, this._camera?.position);
  }

  public onPause(el: XrFrame.Element) {

  }

  public onResume(el: XrFrame.Element) {

  }

  public onStop(el: XrFrame.Element) {

  }
}
