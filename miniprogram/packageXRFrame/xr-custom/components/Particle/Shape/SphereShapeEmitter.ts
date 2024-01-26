import { BasicShapeEmitter } from './BasicShapeEmitter'

const xrFrameSystem = wx.getXrFrameSystem();

function randomBetween(v1, v2, randomSeed = Math.random()) {
    if (v1 === v2) {
        return v1;
    } else {
        return randomSeed * Math.abs(v1 - v2) + Math.min(v1, v2);
    }
};

// 控制粒子以球型区域向外发射
export default class SphereShapeEmitter extends BasicShapeEmitter {
    /**
    * 球形半径
    */
    public radius: number;
    /**
     * 球形区域覆盖范围[0-1]
     */
    public radiusRange: number;
    /**
     * 粒子在球形内生成的角度区间[0-360]
     */
    public arc: number;
    /**
     * 粒子运动方向偏离程度[0-1]
     */
    public randomizeDirection: number;

    constructor() {
        super();
        this.radius = 3;
        this.radiusRange = 0;
        this.arc = 360;
        this.randomizeDirection = 0;
    }

    public startDirection(worldMatrix: xrFrameSystem.Matrix4, direction: xrFrameSystem.Vector3, position: xrFrameSystem.Vector3) {
        var centerVec = xrFrameSystem.Vector3.createFromNumber(worldMatrix.getValue(3, 0), worldMatrix.getValue(3, 1), worldMatrix.getValue(3, 2));
        var tempDirection = position.sub(centerVec).normalize();
        var randX = randomBetween(0, this.randomizeDirection);
        var randY = randomBetween(0, this.randomizeDirection);
        var randZ = randomBetween(0, this.randomizeDirection);
        var temp = xrFrameSystem.Vector3.createFromNumber(randX, randY, randZ);
        direction.set(tempDirection.add(temp).normalize().transformDirection(worldMatrix));
    }


    public startPosition(worldMatrix: xrFrameSystem.Matrix4, position: xrFrameSystem.Vector3) {
        var randRadius = this.radius - randomBetween(0, this.radius * this.radiusRange);
        var cosV = randomBetween(0, 1);
        var phi = randomBetween(0, this.arc / 360 * 2 * Math.PI);
        var theta = Math.acos(2 * cosV - 1);
        var randX = randRadius * Math.cos(phi) * Math.sin(theta);
        var randY = randRadius * Math.cos(theta);
        var randZ = randRadius * Math.sin(phi) * Math.sin(theta);
        var temp = xrFrameSystem.Vector3.createFromNumber(randX, randY, randZ);
        position.set(temp.applyMatrix4(worldMatrix));
    }
}
