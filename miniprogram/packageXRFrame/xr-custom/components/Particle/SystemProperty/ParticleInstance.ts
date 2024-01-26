
import { FactorGradient, ColorGradient } from '../Util/Gradient'
import CustomParticle from '../index'

const xrFrameSystem = wx.getXrFrameSystem();

// 粒子实例，代表每一个粒子的具体属性
export default class ParticleInstance {
    public static count: number = 0;
    public id: number;
    public position: xrFrameSystem.Vector3;
    public direction: xrFrameSystem.Vector3;
    public speed: number;
    public color: xrFrameSystem.Vector4;
    public colorStep: xrFrameSystem.Vector4;
    public rampPos: xrFrameSystem.Vector4;
    // 粒子生命周期
    public lifeTime: number;
    public age: number;
    public drag: number;

    public size: number;
    public startSize: number;
    public sizeGradientFactor: number;

    public scale: xrFrameSystem.Vector2;
    public angle: number;
    public angularSpeed: number;
    public particleSystem: CustomParticle;

    public currentSize: number;
    public currentSize2: number;
    public currentSizeGradient: FactorGradient;

    public currentColor: xrFrameSystem.Vector4;
    public currentColor2: xrFrameSystem.Vector4;
    public currentColorGradient: ColorGradient;

    public currentAlpha: number;
    public currentAlpha2: number;
    public currentAlphaGradient: FactorGradient;

    public currentSpeedScale: number;
    public currentSpeedScale2: number;
    public currentSpeedScaleGradient: FactorGradient;

    public currentLimitSpeed: number;
    public currentLimitSpeed2: number;
    public currentLimitSpeedGradient: FactorGradient;

    public currentDrag: number;
    public currentDrag2: number;
    public currentDragGradient: FactorGradient;

    public subEmitterMuster;
    public startSpriteCellIndex: number;
    public endSpriteCellIndex: number;
    public cellIndex: number = 0;
    public randomCellOffset;

    constructor(particle: CustomParticle) {
        this.particleSystem = particle;
        this.position = xrFrameSystem.Vector3.createFromNumber(0, 0, 0);
        this.direction = xrFrameSystem.Vector3.createFromNumber(0, 0, 0);
        this.speed = 0;

        this.color = xrFrameSystem.Vector4.createFromNumber(0, 0, 0, 0);
        this.colorStep = xrFrameSystem.Vector4.createFromNumber(0, 0, 0, 0);
        this.rampPos = xrFrameSystem.Vector4.createFromNumber(0, 0, 0, 1);
        this.currentSize = 0;
        this.currentSize2 = 0;
        this.currentColor = xrFrameSystem.Vector4.createFromNumber(0, 0, 0, 0);
        this.currentColor2 = xrFrameSystem.Vector4.createFromNumber(0, 0, 0, 1);
        this.currentAlpha = 0;
        this.currentAlpha2 = 0;

        this.startSpriteCellIndex = 0;
        this.endSpriteCellIndex = 0;

        this.lifeTime = 1.0;
        this.age = 0;
        this.drag = 0;
        this.size = 1;
        this.startSize = 1;
        this.sizeGradientFactor = 1;
        this.scale = xrFrameSystem.Vector2.createFromNumber(0, 0);
        this.angle = 0;
        this.angularSpeed = 0;
        this.id = ParticleInstance.count++;
    }

    /**
    * 重置粒子实例的状态。
    */
    public reset() {
        this.age = 0;
        this.id = ParticleInstance.count++;

        this.randomCellOffset = undefined;
        this.cellIndex = this.startSpriteCellIndex;
    }

    /**
     * 将当前粒子实例的状态拷贝到目标实例。
     * @param {ParticleInstance} other 目标粒子实例
     */
    public copyTo(other: ParticleInstance) {
        other.position.set(this.position);
        other.direction.set(this.direction);
        other.color.set(this.color);
        other.colorStep.set(this.colorStep);
        other.rampPos.set(this.rampPos);

        other.speed = this.speed;
        other.lifeTime = this.lifeTime;
        other.size = this.size;
        other.scale.set(this.scale);
        other.angle = this.angle;
        other.angularSpeed = this.angularSpeed;
        other.particleSystem = this.particleSystem;
        other.id = this.id;
        other.age = this.age;
        other.subEmitterMuster = this.subEmitterMuster;

        // 判断是否使用了颜色渐变
        if (this.currentColorGradient) {
            other.currentColorGradient = this.currentColorGradient;
            other.currentColor = this.currentColor.clone();
            other.currentColor2 = this.currentColor2.clone();
        }

        // 判断是否使用了大小渐变
        if (this.currentSizeGradient) {
            other.currentSizeGradient = this.currentSizeGradient;
            other.currentSize = this.currentSize;
            other.currentSize2 = this.currentSize2;
        }

        // 判断是否使用了透明度渐变
        if (this.currentAlphaGradient) {
            other.currentAlphaGradient = this.currentAlphaGradient;
            other.currentAlpha = this.currentAlpha;
            other.currentAlpha2 = this.currentAlpha2;
        }

        // 判断是否使用了速度渐变
        if (this.currentSpeedScaleGradient) {
            other.currentSpeedScaleGradient = this.currentSpeedScaleGradient;
            other.currentSpeedScale = this.currentSpeedScale;
            other.currentSpeedScale2 = this.currentSpeedScale2;
        }

        // 判断是否使用了限速渐变
        if (this.currentLimitSpeedGradient) {
            other.currentLimitSpeedGradient = this.currentLimitSpeedGradient;
            other.currentLimitSpeed = this.currentLimitSpeed;
            other.currentLimitSpeed2 = this.currentLimitSpeed2;
        }

        // 判断是否使用了阻力渐变
        if (this.currentDragGradient) {
            other.currentDragGradient = this.currentDragGradient;
            other.currentDrag = this.currentDrag;
            other.currentDrag2 = this.currentDrag2;
        }

        // 判断是否使用了动画图集
        if (this.particleSystem.useSpriteCellLoop) {
            other.randomCellOffset = this.randomCellOffset;
            other.startSpriteCellIndex = this.startSpriteCellIndex;
            other.endSpriteCellIndex = this.endSpriteCellIndex;
        }
    }

    /**
     * 更新从动画图集采样的帧序号
     */
    public updateCellIndex() {
        var offset = this.age;
        // 设置图集变化的速度
        var changeSpeed = this.particleSystem.spriteChangeSpeed;
        if (this.particleSystem.useRandomSpriteCellIndex) {
            if (this.randomCellOffset == undefined) {
                //随机给图集中的一帧作为初始帧
                this.randomCellOffset = Math.random() * this.lifeTime;
            }
            if (changeSpeed == 0) {
                // 如果播放速度为0，则不会播放到下一动画帧
                changeSpeed = 1;
                offset = this.randomCellOffset;
            } else {
                offset += this.randomCellOffset;
            }
        }
        var ratio;
        var loopDist = this.endSpriteCellIndex - this.startSpriteCellIndex;
        if (this.particleSystem.useSpriteCellLoop) {
            // 粒子将循环播放动画图集
            ratio = this.clamp((offset * changeSpeed) % this.lifeTime / this.lifeTime);
        } else {
            ratio = this.clamp(offset * changeSpeed / this.lifeTime);
        }

        //round
        this.cellIndex = (this.startSpriteCellIndex + ratio * loopDist) | 0;
    }

    /**
     * 限制num的值在left与right的区间内
     */
    public clamp(num, left = 0, right = 1) {
        if (num < left)
            return left;
        if (num > right)
            return right;
        return num;
    }
};