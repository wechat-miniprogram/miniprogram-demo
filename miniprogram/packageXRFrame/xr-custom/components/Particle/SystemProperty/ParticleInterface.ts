/**
 * 组件数据接口，记录粒子系统的成员属性和对应类型
 * 新增的属性字段需要在IParticleData和ParticleSchema中添加
 */
export interface IParticleData {
    neverCull?: boolean;
    /**
     * 渲染模式。
     */
    renderMode?: string;
    uniforms?: [string, string][];
    states?: [string, string][];

    renderModel?: xrFrameSystem.GLTFModel;
    /**
     * 纹理信息。
     */
    texture?: xrFrameSystem.Texture;
    /**
     * 是否使用噪声纹理。
     */
    useNoise?: boolean;
    /**
     * 使用自定义的噪声纹理。
     */
    noiseTexture?: xrFrameSystem.Texture;
    /**
     * 最大粒子数目。
     */
    capacity?: number;
    /**
     * 每秒粒子发射数。
     */
    emitRate?: number;
    /**
     * 初始角度。
     */
    angle?: number[];
    /**
     * 粒子系统启动延时秒数。
     */
    delay?: number;
    /**
     * y轴方向上的每秒位移。
     */
    gravity?: number;
    /**
     * 初始大小。
     */
    size?: number[];
    /**
     * 粒子在x轴方向上的大小尺度。
     */
    scaleX?: number[];
    /**
     * 粒子在y轴方向上的大小尺度。
     */
    scaleY?: number[];
    /**
     * 速度。
     */
    speed?: number[];
    /**
     * 生命周期时长。
     */
    lifeTime?: number[];
    /**
     * 粒子初始颜色左区间。
     */
    startColor?: number[];
    /**
     * 粒子初始颜色右区间。
     */
    startColor2?: number[];
    /**
     * 粒子结束时颜色。
     */
    endColor?: number[];
    /**
     * 角速度。
     */
    angularSpeed?: number[];
    /**
     * 发射器类型。
     */
    emitterType?: string;
    /**
     * 发射器属性配置。
     */
    emitterProps?: [string, string][];
    /**
     * 粒子系统生命周期时长。
     */
    stopDuration?: number;
    /**
     * 粒子预渲染周期数。
     */
    prewarmCycles?: number;
    /**
     * 速度阻尼系数。
     */
    speedDampen?: number;
    /**
     * 动画图集信息。
     */
    atlas?: xrFrameSystem.Atlas;
    /**
     * 图集切换速度。
     */
    atlasSpeed?: number;
    /**
     * 是否随机播放图集。
     */
    atlasRandom?: boolean;
    /**
     * 是否循环播放图集。
     */
    atlasLoop?: boolean;
    /**
     * 指定图集帧名。
     */
    atlasFrames?: string[];
    /**
     * 网格信息。
     */
    mesh?: xrFrameSystem.Geometry;
    sizeChange?: [string, string][];
    colorChange?: [string, string][];
    speedChange?: [string, string][];
    burstCount?: number;
    burstTime?: number;
    burstCycle?: number;
    burstInterval?: number;
}

/**
 * 此处声明属性在框架内运行时的真正类型
 */
export const ParticleSchema: xrFrameSystem.IComponentSchema = {
    renderModel: { type: 'gltf' },
    neverCull: { type: 'boolean', defaultValue: false },
    renderMode: { type: 'string', defaultValue: 'default' },
    uniforms: { type: 'map' },
    states: { type: 'map' },
    texture: { type: 'texture' },
    useNoise: { type: 'boolean' },
    noiseTexture: { type: 'texture' },
    capacity: { type: 'number' },
    emitRate: { type: 'number' },
    angle: { type: 'number-array' },
    delay: { type: 'number' },
    gravity: { type: 'number' },
    emitterPosition: { type: 'number-array' },
    size: { type: 'number-array' },
    scaleX: { type: 'number-array' },
    scaleY: { type: 'number-array' },
    speed: { type: 'number-array' },
    lifeTime: { type: 'number-array' },
    startColor: { type: 'number-array' },
    startColor2: { type: 'number-array' },
    endColor: { type: 'number-array' },
    angularSpeed: { type: 'number-array' },
    emitterType: { type: 'string' },
    emitterProps: { type: 'map' },
    stopDuration: { type: 'number' },
    prewarmCycles: { type: 'number' },
    speedDampen: { type: 'number', defaultValue: 0 },
    atlas: { type: 'atlas' },
    atlasSpeed: { type: 'number', defaultValue: 1 },
    atlasRandom: { type: 'boolean' },
    atlasLoop: { type: 'boolean', defaultValue: true },
    atlasFrames: { type: 'array' },
    mesh: { type: 'geometry' },
    sizeChange: { type: 'map' },
    colorChange: { type: 'map' },
    speedChange: { type: 'map' },
    burstCount: { type: 'number' },
    burstTime: { type: 'number' },
    burstCycle: { type: 'number' },
    burstInterval: { type: 'number' },
}