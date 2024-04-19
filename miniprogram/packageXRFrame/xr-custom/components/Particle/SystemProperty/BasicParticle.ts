
import { PointShapeEmitter, SphereShapeEmitter, BoxShapeEmitter } from '../Shape/emitter'
import { FactorGradient, BasicGradientMethod, ColorGradient } from '../Util/Gradient'
import { IParticleData, ParticleSchema } from './ParticleInterface'

const xrFrameSystem = wx.getXrFrameSystem();

// 注册粒子系统的effect
xrFrameSystem.registerEffect('custom-particle-effect', scene => scene.createEffect({
    name: "custom-particle-effect",
    properties: [{
        "key": 'u_baseColorFactor',
        "type": 3,
        "default": [1, 1, 1, 1]
    }],
    images: [{
        key: 'u_baseColorMap',
        default: 'white',
        macro: 'WX_USE_BASECOLORMAP'
    }, {
        key: 'u_rampColorMap',
        default: 'white',
        macro: 'WX_USE_RAMPCOLORMAP'
    }],
    defaultRenderQueue: 3000,
    passes: [{
        "renderStates": {
            cullOn: false,
            blendOn: true,
            depthWrite: false
        },
        lightMode: "ForwardBase",
        useMaterialRenderStates: true,
        shaders: [0, 1]
    }],
    shaders: [`#version 100
    precision mediump float;
    uniform highp mat4 u_view;
    uniform highp mat4 u_projection;
    uniform highp mat4 u_world;
    
    attribute vec3 a_position;
    attribute highp vec2 a_texCoord;
    attribute vec3 a_offset;
    attribute vec4 a_color;
    attribute float a_angle;
    
    #ifdef WX_BILLBOARDMODE_STRETCHED
        attribute vec3 a_direction;
        attribute float a_lengthScale;
    #endif
    
    #ifdef WX_USE_RAMPCOLORMAP
        attribute vec4 a_rampPos;
    #endif
    
    #ifdef WX_SPRITESHEET
        attribute vec4 a_cellPosition;
    #endif
    
    varying highp vec2 v_Uv;
    varying highp vec4 v_Color;
    
    #ifdef WX_USE_RAMPCOLORMAP
        varying highp vec4 v_rampData;
    #endif
    
    uniform mat4 u_viewInverse;
    
    #ifdef WX_BILLBOARDMODE_Y
    vec3 rotate(vec3 yaxis,vec3 rotatedOffset) {
        vec3 xaxis=normalize(cross(vec3(0.,1.0,0.),yaxis));
        vec3 zaxis=normalize(cross(yaxis,xaxis));
        vec3 row0=vec3(xaxis.x,xaxis.y,xaxis.z);
        vec3 row1=vec3(yaxis.x,yaxis.y,yaxis.z);
        vec3 row2=vec3(zaxis.x,zaxis.y,zaxis.z);
        mat3 rotMatrix= mat3(row0,row1,row2);
        vec3 alignedOffset=rotMatrix*rotatedOffset;
        return alignedOffset;
    }
    #endif
    
    #ifdef WX_BILLBOARDMODE_STRETCHED
    vec3 rotateAlign(vec3 toCamera, vec3 rotatedOffset) {
        vec3 normalizedToCamera = normalize(toCamera);
        vec3 normalizedCrossVec = normalize(cross(normalize(a_direction), normalizedToCamera));
        vec3 normalizedCrossResult = normalize(cross(normalizedToCamera, normalizedCrossVec)) * a_lengthScale;
        vec3 row0 = normalizedCrossVec;
        vec3 row1 = normalizedCrossResult;
        vec3 row2 = normalizedToCamera;
        mat3 rotMatrix = mat3(row0, row1, row2);
        vec3 alignedOffset = rotMatrix * rotatedOffset;
        return alignedOffset; 
    }
    #endif
    
    vec3 extractScale(mat4 matrix){
        vec3 scale;
        scale.x = length(vec4(matrix[0][0],matrix[0][1],matrix[0][2],matrix[0][3]));
        scale.y = length(vec4(matrix[1][0],matrix[1][1],matrix[1][2],matrix[1][3]));
        scale.z = length(vec4(matrix[2][0],matrix[2][1],matrix[2][2],matrix[2][3]));
        return scale;
    }
    
    void main()
    {
    #ifdef WX_SPRITESHEET
        vec2 uvOffset = vec2(a_texCoord.x * a_cellPosition.z ,a_texCoord.y * a_cellPosition.w);
        v_Uv = vec2(a_cellPosition.x, a_cellPosition.y) + uvOffset;
    #else
        v_Uv = a_texCoord;
    #endif 
        vec4 localPosition = vec4(a_position, 1.0);
    
        vec4 cameraPosition;
        vec3 rotatedOffset;
        vec3 viewPos;
        v_Color = a_color;
    
    #ifdef WX_BILLBOARDMODE_Y
        rotatedOffset.x = a_offset.x * cos(a_angle) - a_offset.y * sin(a_angle);
        rotatedOffset.z = a_offset.x * sin(a_angle) + a_offset.y * cos(a_angle);
        rotatedOffset.y = 0.0;
        vec3 yaxis = a_position - vec3(u_viewInverse[3][0], u_viewInverse[3][1], u_viewInverse[3][2]);
        yaxis.y = 0.0;
        vec3 alignedOffset = rotate(yaxis, rotatedOffset);
        cameraPosition = u_view * u_world * vec4(localPosition.xyz + alignedOffset.xyz, 1.0);
        viewPos = cameraPosition.xyz;
    #elif defined(WX_BILLBOARDMODE_STRETCHED)
        rotatedOffset.x = a_offset.x * cos(a_angle) - a_offset.y * sin(a_angle);
        rotatedOffset.y = a_offset.x * sin(a_angle) + a_offset.y * cos(a_angle);
        rotatedOffset.z = 0.0;
        vec3 toCamera = a_position - vec3(u_viewInverse[3][0], u_viewInverse[3][1], u_viewInverse[3][2]);
        vec3 alignedOffset = rotateAlign(toCamera, rotatedOffset);
        cameraPosition = u_view * u_world * vec4(localPosition.xyz + alignedOffset.xyz, 1.0);
        viewPos = cameraPosition.xyz;
    #elif defined(WX_BILLBOARD)
        vec3 scale = extractScale(u_world);
        rotatedOffset.x = (a_offset.x * cos(a_angle) - a_offset.y * sin(a_angle)) * scale.x;
        rotatedOffset.y = (a_offset.x * sin(a_angle) + a_offset.y * cos(a_angle)) * scale.y;
        rotatedOffset.z = 0.0;
        cameraPosition = u_view * u_world * localPosition + vec4(rotatedOffset, 1.0);
        viewPos = cameraPosition.xyz;
    #elif defined(WX_RENDERMESH)
        rotatedOffset.x = a_offset.x * cos(a_angle) - a_offset.z * sin(a_angle);
        rotatedOffset.z = a_offset.x * sin(a_angle) + a_offset.z * cos(a_angle);
        rotatedOffset.y = a_offset.y;
        cameraPosition = u_view * u_world * vec4(localPosition.xyz + rotatedOffset.xyz, 1.0);
        viewPos = cameraPosition.xyz;
    #else
        rotatedOffset.x = a_offset.x * cos(a_angle) - a_offset.y * sin(a_angle);
        rotatedOffset.y = a_offset.x * sin(a_angle) + a_offset.y * cos(a_angle);
        rotatedOffset.z = 0.0;
        cameraPosition = u_view * u_world * vec4(localPosition.xyz + rotatedOffset.xyz, 1.0);
        viewPos = cameraPosition.xyz;
    #endif
    
    #ifdef WX_USE_RAMPCOLORMAP
        v_rampData = a_rampPos;
    #endif
        gl_Position = u_projection * vec4(viewPos, 1.0);
    }`,
        `#version 100
    precision mediump float;
    precision highp int;
    varying highp vec2 v_Uv;
    varying highp vec4 v_Color;
    #ifdef WX_USE_RAMPCOLORMAP
        varying highp vec4 v_rampData;
        uniform sampler2D u_rampColorMap;
    #endif
    
    uniform highp vec4 u_baseColorFactor;
    
    #ifdef WX_USE_BASECOLORMAP
        uniform sampler2D u_baseColorMap;
    #endif
    
    void main()
    {
        vec4 baseColor;
        #ifdef WX_USE_BASECOLORMAP
        vec4 textureColor = texture2D(u_baseColorMap, v_Uv) * u_baseColorFactor;
        baseColor = textureColor * v_Color;
        #else
        baseColor = v_Color;
        #endif
    
        #ifdef WX_USE_RAMPCOLORMAP
        float alpha=baseColor.a;
        float remappedIndex=clamp((alpha-v_rampData.x)/v_rampData.y,0.0,1.0);
        vec4 rampColor = texture2D(u_rampColorMap,vec2(1.0-remappedIndex,0.));
        baseColor.rgb *= rampColor.rgb;
        baseColor.a=clamp((alpha*rampColor.a-v_rampData.z)/v_rampData.w,0.0,1.0);
        #endif
    
        #ifdef WX_PP_ACTIVE
            // removeGammaCorrection
            gl_FragData[0] = vec4(pow(baseColor.rgb, vec3(2.2)), baseColor.a);
        #else
            gl_FragData[0] = baseColor;
        #endif
    
        gl_FragData[0] = baseColor;
    }  
        `],
}));

/**
 * BillBoard渲染模式。
 */
export const enum BillBoardMode {
    BILLBOARDMODE_DEFAULT = 0,
    BILLBOARDMODE_Y = 1,
    BILLBOARDMODE_STRETCHED = 2
}

export default class BasicParticle extends xrFrameSystem.Component<IParticleData> {
    public readonly schema: xrFrameSystem.IComponentSchema = ParticleSchema;

    protected _data: IParticleData;
    // 当前粒子系统所在场景
    protected particleScene: xrFrameSystem.Scene;
    // 当前粒子系统的元素
    protected particleEl: xrFrameSystem.Element;
    // 现有粒子对象池
    protected _instances: ParticleInstance[] = new Array<ParticleInstance>();
    // 粒子对象池
    protected _stockInstances: ParticleInstance[] = new Array<ParticleInstance>();

    // 粒子总容量
    protected _capacity: number = 1;
    // 粒子延时启动的时间
    protected _delay: number = 0;
    // 粒子生命周期的更新速率
    protected _updateSpeed: number = 0.01;
    // 粒子系统的生命周期
    protected _stopDuration: number = 0;
    // 粒子发射速率
    protected _emitRate: number = 10;
    // 重力大小
    protected _gravity: number = 0;
    protected _preWarmCycles: number = 0;
    protected _preWarmStepOffset: number = 5;
    protected _particleEmitterType: string;
    protected _particleEmitter: BasicShapeEmitter = null;
    protected _particleEmitterProperties;

    protected particleStride: number;
    protected particleVertexSize: number;
    protected byteStride: number;
    protected ParticleAttributes;

    protected _burstCount: number = 0;
    protected _burstTime: number = 0;
    // -1 = Infinity
    protected _burstCycle: number = -1;
    // -1 = invalid
    protected _burstInterval: number = 1;

    protected _burstCountTime: number = 0;
    protected _burstCountCycle: number = 0;
    protected _burstCountInterval: number = 0;

    protected _minLifeTime: number = 1;
    protected _maxLifeTime: number = 1;
    protected _minScaleX: number = 1;
    protected _maxScaleX: number = 1;
    protected _minScaleY: number = 1;
    protected _maxScaleY: number = 1;
    protected _minSize: number = 0.3;
    protected _maxSize: number = 0.3;
    protected _minSpeed: number = 1;
    protected _maxSpeed: number = 1;
    protected _particleLengthScale: number = 1;
    // the left edge of color at the begin of particle's life cycle
    protected _startColor: number[] = [1, 1, 1, 1];
    // the right edge of color at the begin of particle's life cycle
    protected _startColor2: number[] = null;
    // the color at the end of particle's life cycle
    protected _endColor: number[] = null;
    protected _sizeGradients;
    protected _alphaGradients;
    protected _colorRemapGradients;
    protected _speedScaleGradients;
    protected _limitSpeedGradients;
    protected _speedDampenFactor: number;
    protected _dragGradients;

    protected _useSpriteSheet: boolean = false;
    protected _startSpriteCellIndex: number = 0;
    protected _endSpriteCellIndex: number = 0;
    protected _useRandomSpriteCellIndex: boolean = false;
    protected _useSpriteCellLoop: boolean = true;
    protected _spriteChangeSpeed: number = 1;
    protected _spriteFrameInfo: xrFrameSystem.Vector4[];
    protected _spriteNameToCellIndex: Map<string, number>;

    protected _textureData: xrFrameSystem.Texture = null;
    protected _atlasObj: xrFrameSystem.Atlas = null;
    protected _atlasTexture: xrFrameSystem.Texture;

    protected _mesh: xrFrameSystem.MeshRendererComponent;
    protected _sourceMaterial: xrFrameSystem.Material;
    protected _material: xrFrameSystem.Material;
    protected _trs: xrFrameSystem.Transform;

    protected _renderMesh: Geometry = null;
    protected _vertexCount: number;
    protected _vertexData: Float32Array;
    protected _indexData: UInt32Array;
    protected _eachIndexSize: number;
    protected _indexSize: number = 0;
    protected _vertexSize: number = 0;

    // 默认，粒子使用billboard， 始终面向相机
    protected _useBillboard: boolean = true;
    protected _useRenderMesh: boolean = false;
    protected _billboardMode: number = BillBoardMode.BILLBOARDMODE_DEFAULT;
    protected _useRampGradients: boolean = false;
    protected _rampGradients;
    protected _rampGradientsTexture: xrFrameSystem.Texture;
    protected _colorGradients;
    protected _vertexLayoutDirty: boolean = false;

    protected _startAngle: number = 0;
    protected _startAngle2: number = 0;
    protected _minAngularSpeed: number = 0;
    protected _maxAngularSpeed: number = 0;

    protected _subEmitters: any[] = null;

    protected _emitterPosition: xrFrameSystem.Vector3 = xrFrameSystem.Vector3.createFromNumber(0, 0, 0);

    get material() {
        return this._material;
    }

    get useBillboard() {
        return this._useBillboard;
    }

    set useBillboard(value) {
        if (this.useBillboard != value) {
            this._useBillboard = value;
            this._vertexLayoutDirty = true;
        }
    }

    get useRampGradients() {
        return this._useRampGradients;
    }

    set useRampGradients(value) {
        if (this._useRampGradients != value) {
            this._useRampGradients = value;
            this._vertexLayoutDirty = true;
        }
    }

    get billboardMode() {
        return this._billboardMode;
    }

    set billboardMode(value) {
        if (this._billboardMode != value) {
            this._billboardMode = value;
            this._vertexLayoutDirty = true;
        }
    }

    get useSpriteSheet() {
        return this._useSpriteSheet;
    }

    set useSpriteSheet(value) {
        if (this._useSpriteSheet != value) {
            this._useSpriteSheet = value;
            this._vertexLayoutDirty = true;
        }
    }

    get useRandomSpriteCellIndex() {
        return this._useRandomSpriteCellIndex;
    }

    get useSpriteCellLoop() {
        return this._useSpriteCellLoop;
    }

    get spriteChangeSpeed() {
        return this._spriteChangeSpeed;
    }

    get emitterPosition() {
        return this._emitterPosition;
    }

    set emitterPosition(value) {
        this._emitterPosition = value;
    }

    /**
     * 设置粒子的顶点属性数据
     */
    protected _parseAttribute() {
        this.ParticleAttributes = [];
        this.ParticleAttributes.push(
            {
                name: "a_position",
                format: xrFrameSystem.EVertexFormat.FLOAT3,
                offset: 0,
                usage: xrFrameSystem.EVertexLayoutUsage.POSITION
            },
            {
                name: "a_texCoord",
                format: xrFrameSystem.EVertexFormat.FLOAT2,
                offset: 12,
                usage: xrFrameSystem.EVertexLayoutUsage.UV0
            },
            {
                name: "a_offset",
                format: xrFrameSystem.EVertexFormat.FLOAT3,
                offset: 20,
                // 自定义用途此处可指定为xrFrameSystem.EVertexLayoutUsage.CUSTOM
                usage: xrFrameSystem.EVertexLayoutUsage.CUSTOM
            },
            {
                name: "a_color",
                format: xrFrameSystem.EVertexFormat.FLOAT4,
                offset: 32,
                usage: xrFrameSystem.EVertexLayoutUsage.COLOR
            },
            {
                name: "a_angle",
                format: xrFrameSystem.EVertexFormat.FLOAT,
                offset: 48,
                usage: xrFrameSystem.EVertexLayoutUsage.CUSTOM
            }
        );

        var count = 52;

        // 根据是否使用billboard，动态增添属性
        if (this._useBillboard && this._billboardMode == BillBoardMode.BILLBOARDMODE_STRETCHED) {
            this.ParticleAttributes.push({
                name: "a_direction",
                format: xrFrameSystem.EVertexFormat.FLOAT3,
                offset: count,
                usage: xrFrameSystem.EVertexLayoutUsage.CUSTOM
            })
            count += 3 * 4;
            this.ParticleAttributes.push({
                name: "a_lengthScale",
                format: xrFrameSystem.EVertexFormat.FLOAT,
                offset: count,
                usage: xrFrameSystem.EVertexLayoutUsage.CUSTOM
            })
            count += 4;
        }

        if (this._useRampGradients) {
            this.ParticleAttributes.push({
                name: "a_rampPos",
                format: xrFrameSystem.EVertexFormat.FLOAT4,
                offset: count,
                usage: xrFrameSystem.EVertexLayoutUsage.CUSTOM
            })
            count += 4 * 4;
        }

        if (this.useSpriteSheet) {
            this.ParticleAttributes.push({
                name: "a_cellPosition",
                format: xrFrameSystem.EVertexFormat.FLOAT4,
                offset: count,
                usage: xrFrameSystem.EVertexLayoutUsage.CUSTOM
            })
            count += 4 * 4;
        }

        // 每一个粒子的顶点属性偏移量
        this.particleStride = count;
        // 每一个属性大小背后的字节偏移量
        this.byteStride = 4;
        // 每一个粒子使用的顶点元素偏移量
        this.particleVertexSize = this.particleStride / this.byteStride;
    }

    /**
     * 设置粒子系统的内置粒子effect。
     */
    protected createMaterial() {
        let newMaterial = null;
        newMaterial = new xrFrameSystem.Material(this.particleScene);
        // 此处初始化指定的custom-particle-effect，因为前面有注册过对应名字的effect
        newMaterial.initByEffect(this.particleScene.assets.getAsset("effect", 'custom-particle-effect'));
        return newMaterial;
    }

    // 注册 Geometry 信息
    public _registerGeometry() {
        // 构建顶点属性布局
        const vl = this.particleScene.createVertexLayout({
            attributes: this.ParticleAttributes,
            stride: this.particleStride
        });
        const vb = new Float32Array(this._vertexData);
        const ib = new Uint16Array(this._indexData);

        this._geometry = this.particleScene.createGeometry(vl, vb, ib);
        // 指定为子网格0号
        this._geometry.addSubMesh(ib.length, 0, 0);
    }

    /**
    * 创建一个点发射器。
    * @param {Vector3} direction1 粒子运动方向左区间
    * @param {Vector3} direction2 粒子运动方向右区间
    * @return {PointShapeEmitter} 点发射器 
    */
    public createPointEmitter(direction1: Vector3, direction2: Vector3) {
        var particleEmitter = new PointShapeEmitter();
        particleEmitter.direction = direction1;
        particleEmitter.direction2 = direction2;
        this._particleEmitter = particleEmitter;
        this._particleEmitterType = "PointShape";
        return particleEmitter;
    };

    /**
     * 创建一个箱形发射器。
     * @param {Vector3} direction1 粒子运动方向左区间
     * @param {Vector3} direction2 粒子运动方向右区间
     * @param {Vector3} minEmitBox 粒子生成位置最小允许坐标
     * @param {Vector3} maxEmitBox 粒子生成位置最大允许坐标
     * @return {BoxShapeEmitter} 箱形发射器 
     */
    public createBoxEmitter(direction1: Vector3, direction2: Vector3, minEmitBox: Vector3, maxEmitBox: Vector3) {
        var particleEmitter = new BoxShapeEmitter();
        particleEmitter.direction = direction1;
        particleEmitter.direction2 = direction2;
        particleEmitter.minEmitBox = minEmitBox;
        particleEmitter.maxEmitBox = maxEmitBox;
        this._particleEmitter = particleEmitter;
        this._particleEmitterType = "BoxShape";
        return particleEmitter;
    };

    /**
   * 创建一个球形发射器。
   * @param {number} radius 球形半径
   * @param {number} radiusRange 球形区域内的覆盖范围[0-1]
   * @param {number} arc 粒子在球形内生成的角度区间[0-360]
   * @param {number} randomizeDirection 粒子运动方向偏离程度[0-1]
   * @return {SphereShapeEmitter} 球形发射器 
   */
    public createSphereEmitter(radius: number, radiusRange: number, arc: number, randomizeDirection: number) {
        var particleEmitter = new SphereShapeEmitter();
        particleEmitter.radius = radius;
        particleEmitter.radiusRange = radiusRange;
        particleEmitter.arc = arc;
        particleEmitter.randomizeDirection = randomizeDirection;
        this._particleEmitter = particleEmitter;
        this._particleEmitterType = "SphereShape";
        return particleEmitter;
    };


    protected _parseProperties(data: IParticleData) {

        var useNoise: boolean = false;
        var useAtlasFrame: boolean = false;
        var atlasFrameArray: string[];

        for (var k in data) {
            var v = data[k]
            switch (k) {
                case 'capacity':
                    this._capacity = v;
                    break;
                case 'renderMode':
                    switch (v) {
                        case 'off':
                            this.useBillboard = false;
                            break;
                        case 'default':
                            this.useBillboard = true;
                            this.billboardMode = BillBoardMode.BILLBOARDMODE_DEFAULT;
                            break;
                        case 'y':
                            this.useBillboard = true;
                            this.billboardMode = BillBoardMode.BILLBOARDMODE_Y;
                            break;
                        case 'stretched':
                            this.useBillboard = true;
                            this.billboardMode = BillBoardMode.BILLBOARDMODE_STRETCHED;
                            break;
                        case 'mesh':
                            this.useBillboard = false;
                            this._useRenderMesh = true;
                            break;
                        default:
                            break;
                    }
                    break;
                case 'mesh':
                    if (v == undefined)
                        break;
                    this._renderMesh = v;
                    break;
                case 'renderModel':
                    if (v == undefined)
                        break;
                    this.processRenderModel(v);
                    break;
                case 'delay':
                    this._delay = v;
                    break;
                case 'burstCount':
                    this._burstCount = v;
                    break;
                case 'burstTime':
                    this._burstTime = v;
                    break;
                case 'burstCycle':
                    this._burstCycle = v;
                    break;
                case 'burstInterval':
                    this._burstInterval = v;
                    break;
                case 'stopDuration':
                    this._stopDuration = v;
                    break;
                case 'updateSpeed':
                    this._updateSpeed = v;
                    break;
                case 'emitRate':
                    this._emitRate = v;
                    break;
                case 'gravity':
                    this._gravity = v;
                    break;
                case 'prewarmCycles':
                    this._preWarmCycles = v;
                    break;
                case 'particleLengthScale':
                    this._particleLengthScale = v;
                    break;
                case "speedDampen":
                    this._speedDampenFactor = v;
                    break;
                case "texture":
                    if (v == undefined)
                        break;
                    if (typeof v == 'string') {
                        this._textureData = this.particleScene.assets.getAsset<Texture>('texture', v);
                    } else {
                        this._textureData = v;
                    }
                    break;
                case "useNoise":
                    if (v == undefined)
                        break;
                    useNoise = v;
                    break;
                case 'atlas':
                    if (v == undefined)
                        break;
                    this._useSpriteSheet = true;
                    this._startSpriteCellIndex = 0;
                    var count = 0;
                    this._spriteFrameInfo = new Array();
                    this._spriteNameToCellIndex = new Map();
                    var value: Atlas = v;
                    this._atlasObj = value;
                    this._atlasTexture = value.texture;
                    for (var k in value.frames) {
                        this._spriteNameToCellIndex.set(k, count);
                        this._spriteFrameInfo.push(value.getUVST(k));
                        count++;
                    }
                    this._endSpriteCellIndex = count;
                    break;
                case 'atlasFrames':
                    useAtlasFrame = true;
                    atlasFrameArray = v;
                    break;
                case "atlasLoop":
                    this._useSpriteCellLoop = v;
                    break;
                case "atlasSpeed":
                    this._spriteChangeSpeed = v;
                    break;
                case 'atlasRandom':
                    this._useRandomSpriteCellIndex = v;
                    break;
                case "angle":
                    this._startAngle = this._startAngle2 = v[0];
                    if (v[1])
                        this._startAngle2 = v[1];
                    break;
                case 'lifeTime':
                    this._minLifeTime = this._maxLifeTime = v[0];
                    if (v[1])
                        this._maxLifeTime = v[1];
                    break;
                case 'scaleX':
                    this._minScaleX = this._maxScaleX = v[0];
                    if (v[1])
                        this._maxScaleX = v[1];
                    break;
                case 'scaleY':
                    this._minScaleY = this._maxScaleY = v[0];
                    if (v[1])
                        this._maxScaleY = v[1];
                    break;
                case 'size':
                    this._minSize = this._maxSize = v[0];
                    if (v[1])
                        this._maxSize = v[1];
                    break;
                case 'speed':
                    this._minSpeed = this._maxSpeed = v[0];
                    if (v[1])
                        this._maxSpeed = v[1];
                    break;
                case 'angularSpeed':
                    this._minAngularSpeed = this._maxAngularSpeed = v[0];
                    if (v[1])
                        this._maxAngularSpeed = v[1];
                    break;
                case 'emitterType':
                    this._particleEmitterType = v;
                    break;
                case 'emitterProps':
                    this._particleEmitterProperties = v;
                    break;
                case 'emitterPosition':
                    this._emitterPosition.x = v[0];
                    this._emitterPosition.y = v[1];
                    this._emitterPosition.z = v[2];
                    break;
                case 'startColor':
                    for (var i = 0; i < 4; i++) {
                        this._startColor[i] = v[i];
                    }
                    break;
                case 'sizeChange':
                    v.forEach(([key, value]) => {
                        this.addSizeGradient(parseFloat(key), parseFloat(value));
                    })
                    break;
                case 'speedChange':
                    v.forEach(([key, value]) => {
                        this.addSpeedScaleGradient(parseFloat(key), parseFloat(value));
                    })
                    break;
                case 'colorChange':
                    v.forEach(([key, value]) => {
                        var valueArray = value.split(' ')
                        this.addColorGradient(parseFloat(key), xrFrameSystem.Vector4.createFromNumber(
                            parseFloat(valueArray[0]), parseFloat(valueArray[1]),
                            parseFloat(valueArray[2]), parseFloat(valueArray[3])));
                    })
                    break;
                case 'startColor2':
                    this._startColor2 = this._startColor2 || [0, 0, 0, 0];
                    for (var i = 0; i < 4; i++) {
                        this._startColor2[i] = v[i];
                    }
                    break;
                case 'endColor':
                    this._endColor = this._endColor || [0, 0, 0, 0];
                    for (var i = 0; i < 4; i++) {
                        this._endColor[i] = v[i];
                    }
                    break;
            }
        }

        if (useAtlasFrame) {
            if (!this._atlasObj) {
                console.log("未取得图集信息");
            } else {
                var count = 0;
                this._startSpriteCellIndex = 0;
                this._spriteFrameInfo = new Array();
                this._spriteNameToCellIndex = new Map();
                for (var name in this._atlasObj.frames) {
                    atlasFrameArray.forEach((v, k) => {
                        if (name == v) {
                            this._spriteNameToCellIndex.set(name, count);
                            this._spriteFrameInfo.push(this._atlasObj.getUVST(name));
                            count++;
                        }
                    })
                }
                this._endSpriteCellIndex = count;
            }
        }
    }

    protected processRenderModel(value){
        for(const mesh of value.model.meshes) {
            this._renderMesh = mesh.subMeshes[0].geometry
        }
        this.useBillboard = false;
        this._useRenderMesh = true;
    }

    protected _chooseEmitterProcess() {
        if (this._particleEmitter != null) {
            return;
        }
        //Add cache to optimize on onUpdate cycle
        else {
            switch (this._particleEmitterType) {
                case "SphereShape":
                    this._particleEmitter = new SphereShapeEmitter();
                    break;
                case "BoxShape":
                    this._particleEmitter = new BoxShapeEmitter();
                    break;
                default:
                    this._particleEmitter = new PointShapeEmitter();
                    break;
            }
        }
        this._particleEmitter.setProperty(this._particleEmitterProperties);
    }

    protected _createVertexBuffers() {
        if (this._useRenderMesh) {
            const layout = this._renderMesh.getVertexLayout();
            const stride = layout.stride;
            const vertexBuffer = this._renderMesh._getRawVertexBuffer();
            this._vertexCount = vertexBuffer .byteLength / stride;
            this._vertexSize = this._capacity * this._vertexCount;
            this._vertexData = new Float32Array(this.particleVertexSize * this._vertexSize);
        } else {
            //*4 是因为每一个粒子面片由上下左右四个点构成 
            this._vertexSize = this._capacity * 4;
            // 这里构建顶点数据数组的长度，为顶点属性的元素数乘以顶点总数
            this._vertexData = new Float32Array(this.particleVertexSize * this._vertexSize);
        }
    }

    protected _createIndexBuffer() {
        if (this._useRenderMesh) {
            const indexBuffer = this._renderMesh._getRawIndiceBuffer();
            this._eachIndexSize = indexBuffer.byteLength / 2;
            this._indexSize = this._capacity * this._eachIndexSize;
            this._indexData = new Uint16Array(this._indexSize);
            for (let i = 0; i < this._capacity; i++) {
              var firstIndex = i * this._eachIndexSize;
              for (let j = 0; j < this._eachIndexSize; j++) {
                this._indexData[firstIndex + j] = indexBuffer[j] + i * this._vertexCount;
              }
            }
        }else{
        // 粒子索引数量
        this._indexSize = this._capacity * 6;
        this._indexData = new Uint16Array(this._indexSize);
        for (let i = 0; i < this._capacity; i++) {
            this._indexData[i * 6] = i * 4;
            this._indexData[i * 6 + 1] = i * 4 + 1;
            this._indexData[i * 6 + 2] = i * 4 + 2;
            this._indexData[i * 6 + 3] = i * 4;
            this._indexData[i * 6 + 4] = i * 4 + 2;
            this._indexData[i * 6 + 5] = i * 4 + 3;
        }
    }
    }

    // 创建材质与mesh网络
    protected _createMesh() {
        this._material = this.createMaterial()
        
        this._mesh = this.particleEl.getComponent(xrFrameSystem.Mesh);
        if (this._mesh == undefined) {
            this._mesh = this.particleEl.addComponent(xrFrameSystem.Mesh, {
                geometry: this._geometry,
                material: this._material,
                meshCount: this._renderMesh ? this._renderMesh.getSubMeshCount() : 1,
            });
        }

        // 基础库内存在_geometry的bug, 此处先加这么一句
        this._mesh._geometry = this._geometry

        // 更改geometry
        this._mesh.setData({
            geometry: this._geometry,
            material: this._material,
            meshCount: this._renderMesh ? this._renderMesh.getSubMeshCount() : 1,
        });
    }

    //往顶点数据数组里设置值，分别为四个点设置偏移与uv值
    protected _appendParticleVertices(offset, instance: ParticleInstance = null) {
        if (this._useRenderMesh) {
            const vertexBufferView = this._renderMesh._getRawVertexBuffer();
            const layout = this._renderMesh.vertexLayout;
            const stride = layout.stride;
            for (var i = 0; i < this._vertexCount; i++) {
              const aUV = layout.getConfigByName("a_texCoord");
              const aPosition = layout.getConfigByName("a_position");
              const realStride = stride / 4;
              const posBase = i * realStride + aPosition.offset / 4;
              const uvBase = i * realStride + aUV.offset / 4;
              this._appendParticleVertex(offset++, instance, vertexBufferView[posBase + 0], vertexBufferView[posBase + 1], vertexBufferView[posBase + 2],
                vertexBufferView[uvBase + 0], vertexBufferView[uvBase + 1]);
            }
        }else{
            this._appendParticleVertex(offset++, instance, -1, -1, 0, 0, 1);
            this._appendParticleVertex(offset++, instance, 1, -1, 0, 1, 1);
            this._appendParticleVertex(offset++, instance, 1, 1, 0, 1, 0);
            this._appendParticleVertex(offset++, instance, -1, 1, 0, 0, 0);
        }
    };

    protected _appendParticleVertex(index, instance: ParticleInstance, offsetX, offsetY, offsetZ, u, v) {
        var offset = index * this.particleVertexSize;
        this._vertexData[offset++] = instance.position.x;
        this._vertexData[offset++] = instance.position.y;
        this._vertexData[offset++] = instance.position.z;
        this._vertexData[offset++] = u;
        this._vertexData[offset++] = v;
        //Offset
        this._vertexData[offset++] = offsetX * instance.size * instance.scale.x;
        this._vertexData[offset++] = offsetY * instance.size * instance.scale.y;
        this._vertexData[offset++] = offsetZ * instance.size;
        //Color
        this._vertexData[offset++] = instance.color.x;
        this._vertexData[offset++] = instance.color.y;
        this._vertexData[offset++] = instance.color.z;
        this._vertexData[offset++] = instance.color.w;
        //Rotation
        this._vertexData[offset++] = instance.angle * Math.PI / 180;

        if (this._useBillboard && this._billboardMode == BillBoardMode.BILLBOARDMODE_STRETCHED) {
            this._vertexData[offset++] = instance.direction.x;
            this._vertexData[offset++] = instance.direction.y;
            this._vertexData[offset++] = instance.direction.z;
            this._vertexData[offset++] = this._particleLengthScale;
        }

        //RampColor
        if (this._useRampGradients) {
            this._vertexData[offset++] = instance.rampPos.x;
            this._vertexData[offset++] = instance.rampPos.y;
            this._vertexData[offset++] = 0;
            this._vertexData[offset++] = 1;
        }

        //SpriteSheet
        if (this.useSpriteSheet) {
            var cellIndex = ~~instance.cellIndex;
            this._vertexData[offset++] = this._spriteFrameInfo[cellIndex].z;
            this._vertexData[offset++] = this._spriteFrameInfo[cellIndex].w;
            this._vertexData[offset++] = this._spriteFrameInfo[cellIndex].x;
            this._vertexData[offset++] = this._spriteFrameInfo[cellIndex].y;
        }
    };

    // 更新材质上挂载的effect的属性信息
    protected _setMeshData(material: Material,
        uniforms?: [string, string][], states?: [string, string][]
    ) {
        if (!uniforms && !states) {
            this._material = material;
        } else if (this._sourceMaterial !== material || this._sourceMaterial === this._material) {
            this._material = material.clone();
        }

        if (this._textureData) {
            this._material.setTexture('u_baseColorMap', this._textureData);
        }

        if (this._atlasTexture) {
            this._material.setTexture('u_baseColorMap', this._atlasTexture);
        }

        if (this._useRampGradients) {
            if (this._rampGradientsTexture)
                this._material.setTexture('u_rampColorMap', this._rampGradientsTexture);
        }

        if (this.useSpriteSheet) {
            this._material.setMacro("WX_SPRITESHEET", true);
        } else {
            this._material.setMacro("WX_SPRITESHEET", false);
        }

        if (this._useRenderMesh) {
            this._material.setMacro("WX_RENDERMESH", true);
        } else {
            this._material.setMacro("WX_RENDERMESH", false);
        }

        if (this._useBillboard) {
            this._material.setMacros({ "WX_BILLBOARD": true });
            switch (this._billboardMode) {
                case BillBoardMode.BILLBOARDMODE_Y:
                    this._material.setMacros({ "WX_BILLBOARDMODE_Y": true });
                    break;
                case BillBoardMode.BILLBOARDMODE_STRETCHED:
                    this._material.setMacros({ "WX_BILLBOARDMODE_STRETCHED": true });
                    break;
                case BillBoardMode.BILLBOARDMODE_DEFAULT:
                    this._material.setMacros({ "WX_BILLBOARDMODE_DEFAULT": true });
                    break;
                default:
                    break;
            }
        } else {
            this._material.setMacro("WX_BILLBOARD", false);
            this._material.setMacro("WX_BILLBOARDMODE_Y", false);
            this._material.setMacro("WX_BILLBOARDMODE_STRETCHED", false);
            this._material.setMacro("WX_BILLBOARDMODE_DEFAULT", false);
        }

        if (uniforms) {
            this._material._parseUniforms(uniforms);
        }

        if (states) {
            this._material._parseRenderStates(states);
        }

        this._sourceMaterial = material;

        const vb = new Float32Array(this._vertexData);
        const ib = new Uint16Array(this._indexData);

        // 更新顶点与索引信息
        this._mesh.geometry.uploadVertexBuffer(0, vb);
        this._mesh.geometry.uploadIndexBuffer(0, ib);
    }

    /**
     * 添加粒子运动过程中的颜色变化规则。
     * @param {number} gradient 指定所处粒子生命周期的阶段
     * @param {Vector4} color1 指定粒子颜色的左区间
     * @param {Vector4} color2 指定粒子颜色的右区间
     */
    public addColorGradient(gradient: number, color1: Vector4, color2?: Vector4) {
        if (!this._colorGradients) {
            this._colorGradients = [];
        }
        var colorGradient = new ColorGradient(gradient, color1, color2);
        this._colorGradients.push(colorGradient);
        this._colorGradients.sort(function (a, b) {
            if (a.gradient < b.gradient) {
                return -1;
            }
            else if (a.gradient > b.gradient) {
                return 1;
            }
            return 0;
        });
    };

    /**
    * 添加粒子运动过程中的速度变化规则。
    * @param {number} gradient 指定所处粒子生命周期的阶段
    * @param {Vector4} speed 指定粒子速度的左区间
    * @param {Vector4} speed2 指定粒子速度的右区间
    */
    public addSpeedScaleGradient(gradient: number, speed: number, speed2?: number) {
        if (!this._speedScaleGradients) {
            this._speedScaleGradients = [];
        }
        this.addFactorGradient(this._speedScaleGradients, gradient, speed, speed2);
    }

    /**
    * 添加粒子运动过程中的速度限制规则。
    * @param {number} gradient 指定所处粒子生命周期的阶段
    * @param {number} limitSpeed 指定粒子限制速度的左区间
    * @param {number} limitSpeed2 指定粒子限制速度的右区间
    */
    public addLimitSpeedGradient(gradient: number, limitSpeed: number, limitSpeed2?: number) {
        if (!this._limitSpeedGradients) {
            this._limitSpeedGradients = [];
        }
        this.addFactorGradient(this._limitSpeedGradients, gradient, limitSpeed, limitSpeed2);
    }

    /**
    * 添加粒子运动过程中的阻力规则。
    * @param {number} gradient 指定所处粒子生命周期的阶段
    * @param {number} speed 指定粒子受到的阻力大小的左区间[0-1]
    * @param {number} speed2 指定粒子受到的阻力大小的右区间[0-1]
    */
    public addDragGradient(gradient: number, drag: number, drag2?: number) {
        if (!this._dragGradients) {
            this._dragGradients = [];
        }
        this.addFactorGradient(this._dragGradients, gradient, drag, drag2);
    }

    /**
     * 添加粒子运动过程中的透明度变化规则。
     * @param {number} gradient 指定所处粒子生命周期的阶段
     * @param {number} alpha 指定粒子颜色透明度的左区间[0-1]
     * @param {number} alpha2 指定粒子颜色透明度的右区间[0-1]
     */
    public addAlphaGradient(gradient: number, alpha: number, alpha2?: number) {
        if (!this._alphaGradients) {
            this._alphaGradients = [];
        }
        this.addFactorGradient(this._alphaGradients, gradient, alpha, alpha2);
    }

    /**
     * 添加粒子运动过程中的尺寸变化规则。
     * @param {number} gradient 指定所处粒子生命周期的阶段
     * @param {number} size 指定粒子尺寸的左区间
     * @param {number} size2 指定粒子尺寸的右区间
     */
    public addSizeGradient(gradient: number, size: number, size2?: number) {
        if (!this._sizeGradients) {
            this._sizeGradients = [];
        }
        this.addFactorGradient(this._sizeGradients, gradient, size, size2);
    }

    /**
    * 添加粒子运动过程中的透明度变化范围。
    * @param {number} gradient 指定所处粒子生命周期的阶段
    * @param {number} min 指定粒子透明度值的左区间
    * @param {number} max 指定粒子透明度值的右区间
    */
    public addColorRemapGradient(gradient: number, min: number, max?: number) {
        if (!this._colorRemapGradients) {
            this._colorRemapGradients = [];
        }
        this.addFactorGradient(this._colorRemapGradients, gradient, min, max);
    }

    /**
     * 将存储不同时间段相关属性系数的数组按时间点从小到大进行排序。
     * @param {Array} factorGradients 存储不同时间段相关属性系数的数组
     * @param {number} gradient 一般代表粒子所处生命周期的阶段
     * @param {number} factor 左区间值
     * @param {number} factor2 右区间值
     */
    protected addFactorGradient(factorGradients, gradient, factor, factor2) {
        var newGradient = new FactorGradient(gradient, factor, factor2);
        factorGradients.push(newGradient);
        factorGradients.sort(function (a, b) {
            if (a.gradient < b.gradient) {
                return -1;
            }
            else if (a.gradient > b.gradient) {
                return 1;
            }
            return 0;
        });
    }

    /**
     * 添加粒子运动过程中的根据透明度影响的颜色变化规则，将通过颜色变化图纹理进行采样。
     * @param {number} gradient 指定粒子颜色变化图的具体位置，对应具体值应为(1-alpha)
     * @param {number} color 指定该位置的颜色
     */
    public addRampGradient(gradient, color) {
        if (!this._rampGradients) {
            this._rampGradients = [];
        }
        var rampGradient = new Color3Gradient(gradient, color);
        this._rampGradients.push(rampGradient);

        this._rampGradients.sort(function (a, b) {
            if (a.gradient < b.gradient) {
                return -1;
            }
            else if (a.gradient > b.gradient) {
                return 1;
            }
            return 0;
        });
        this.createRampGradientTexture();
    }

    /**
     * 根据颜色变化数组，生成对应的颜色变化纹理
     */
    protected createRampGradientTexture() {
        var data = new Uint8Array(256 * 4);
        var tmpColor: Vector3;
        var loop = (x: number) => {
            var ratio = x / 256;
            BasicGradientMethod.GetCurrentGradient(ratio, this._rampGradients, function (currentGradient, nextGradient, lerp) {
                tmpColor = currentGradient.color.lerp(nextGradient.color, lerp);
                data[x * 4] = tmpColor.x * 255;
                data[x * 4 + 1] = tmpColor.y * 255;
                data[x * 4 + 2] = tmpColor.z * 255;
                data[x * 4 + 3] = 255;
            });
        }

        for (var x = 0; x < 256; x++) {
            loop(x);
        }

        this._rampGradientsTexture = this.particleScene.createTexture({
            width: 256, height: 1,
            source: [data],
            pixelFormat: ETextureFormat.RGBA8
        })
    }

    /**
      * 根据数组进行插值
      */
    protected lerpNumberArrayToVector(vector, numberArray1, numberArray2, step, length = 4) {
        let result: number[] = new Array(length);
        for (var i = 0; i < length; i++)
            result[i] = numberArray1[i] + (numberArray2[i] - numberArray1[i]) * step;
        vector.setValue(...result);
    }
}
