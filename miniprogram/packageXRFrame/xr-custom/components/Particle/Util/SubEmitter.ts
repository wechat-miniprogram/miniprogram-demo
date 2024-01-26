import CustomParticle from "../index";


/**
 * 粒子子发射器的依附状态。
 */
export const enum SubEmitterState {
    /**
     * 依附于粒子整个生命周期
     */
    ATTACH = 0,
    /**
    * 在粒子生命周期末出现
    */
    END = 1
}

// 子发射器类
export default class SubEmitter {

    public particleSystem: CustomParticle;
    public state: SubEmitterState;

    constructor(particleSystem) {
        this.particleSystem = particleSystem;
        this.state = SubEmitterState.END;
    }

    /**
     * 通过克隆，获取指定的粒子子发射器实例
     * @return {SubEmitter} 克隆后的子发射器实例
     */
    public clone() {
        var cloneParticleSystem = this.particleSystem.clone();
        cloneParticleSystem.initParticle(cloneParticleSystem.data);
        var cloneSubEmitter = new SubEmitter(cloneParticleSystem);
        cloneSubEmitter.state = this.state;
        return cloneSubEmitter;
    }
}