import { BasicShapeEmitter } from './BasicShapeEmitter'

const xrFrameSystem = wx.getXrFrameSystem();

function randomBetween(v1, v2, randomSeed = Math.random()) {
    if (v1 === v2) {
        return v1;
    } else {
        return randomSeed * Math.abs(v1 - v2) + Math.min(v1, v2);
    }
};

// 控制粒子以原点为中心向外发射
export default class PointShapeEmitter extends BasicShapeEmitter {

    /**
     * 粒子运动方向左区间。
     */
    public direction: xrFrameSystem.Vector3;

    /**
   * 粒子运动方向右区间。
   */
    public direction2: xrFrameSystem.Vector3;

    constructor() {
        super();
        this.direction = xrFrameSystem.Vector3.createFromNumber(0, 1.0, 0);
        this.direction2 = xrFrameSystem.Vector3.createFromNumber(0, 1.0, 0);
    }

    // 粒子起始发射方向
    public startDirection(worldMatrix: xrFrameSystem.Matrix4, direction: xrFrameSystem.Vector3) {
        var randX = randomBetween(this.direction.x, this.direction2.x);
        var randY = randomBetween(this.direction.y, this.direction2.y);
        var randZ = randomBetween(this.direction.z, this.direction2.z);
        var temp = xrFrameSystem.Vector3.createFromNumber(randX, randY, randZ);
        direction.set(temp.normalize().transformDirection(worldMatrix));
    }

    // 粒子起始发射位置
    public startPosition(worldMatrix: xrFrameSystem.Matrix4, position: xrFrameSystem.Vector3) {
        position.set(xrFrameSystem.Vector3.createFromNumber(0, 0, 0).applyMatrix4(worldMatrix));
    }
}