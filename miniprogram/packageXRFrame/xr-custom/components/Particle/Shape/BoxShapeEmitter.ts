
import { BasicShapeEmitter } from './BasicShapeEmitter'

const xrFrameSystem = wx.getXrFrameSystem();

// 返回v1到v2间的随机值
function randomBetween(v1, v2, randomSeed = Math.random()) {
    if (v1 === v2) {
        return v1;
    } else {
        return randomSeed * Math.abs(v1 - v2) + Math.min(v1, v2);
    }
};

// 控制粒子在箱型区域内进行发射
export default class BoxShapeEmitter extends BasicShapeEmitter {
    public direction: xrFrameSystem.Vector3;
    public direction2: xrFrameSystem.Vector3;
    // 箱型区域的坐标起始点
    public minEmitBox: xrFrameSystem.Vector3;
    // 箱型区域的坐标终点
    public maxEmitBox: xrFrameSystem.Vector3;

    constructor() {
        super();
        this.direction = xrFrameSystem.Vector3.createFromNumber(0, 1.0, 0);
        this.direction2 = xrFrameSystem.Vector3.createFromNumber(0, 1.0, 0);
        this.minEmitBox = xrFrameSystem.Vector3.createFromNumber(-0.5, -0.5, -0.5);
        this.maxEmitBox = xrFrameSystem.Vector3.createFromNumber(0.5, 0.5, 0.5);
    }

    // 决定粒子起始的运动方向
    public startDirection(worldMatrix, direction) {
        var randX = randomBetween(this.direction.x, this.direction2.x);
        var randY = randomBetween(this.direction.y, this.direction2.y);
        var randZ = randomBetween(this.direction.z, this.direction2.z);
        var temp = xrFrameSystem.Vector3.createFromNumber(randX, randY, randZ);
        direction.set(temp.normalize().transformDirection(worldMatrix));
    }

    // 决定粒子起始的运动位置
    public startPosition(worldMatrix, position: xrFrameSystem.Vector3) {
        var randX = randomBetween(this.minEmitBox.x, this.maxEmitBox.x);
        var randY = randomBetween(this.minEmitBox.y, this.maxEmitBox.y);
        var randZ = randomBetween(this.minEmitBox.z, this.maxEmitBox.z);
        var temp = xrFrameSystem.Vector3.createFromNumber(randX, randY, randZ);
        position.set(temp.applyMatrix4(worldMatrix));
    }
}
