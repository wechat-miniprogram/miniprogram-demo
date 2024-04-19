import XrFrame from 'XrFrame';
import BasicParticle from './SystemProperty/BasicParticle'
import SubEmitter, { SubEmitterState } from './Util/SubEmitter'
import ParticleInstance from './SystemProperty/ParticleInstance'
import { BasicGradientMethod } from './Util/Gradient'

const xrFrameSystem = wx.getXrFrameSystem();

const tempVec1 = xrFrameSystem.Vector3.createFromNumber(0, 0, 0);
const tempVec2 = xrFrameSystem.Vector3.createFromNumber(0, 0, 0);

function randomBetween(v1, v2, randomSeed = Math.random()) {
    if (v1 === v2) {
        return v1;
    } else {
        return randomSeed * Math.abs(v1 - v2) + Math.min(v1, v2);
    }
};

// 继承了控制粒子系统渲染的基础类，这里将实现粒子运作的逻辑
export default class CustomParticle extends BasicParticle {
    public readonly priority: number = 300;
    public subEmitters = null;

    private _start: boolean = false;
    private _stop: boolean = false;
    private _alive: boolean = false;
    private _actualFrame: number = 0;
    private _excessInstance: number = 0;
    private _emitterWorldMatrix: XrFrame.Matrix4;
    private _emitterInverseWorldMatrix: XrFrame.Matrix4;

    private _tempEndColor: XrFrame.Vector4 = xrFrameSystem.Vector4.createFromNumber(0, 0, 0, 0);
    private _tempDiffColor: XrFrame.Vector4 = xrFrameSystem.Vector4.createFromNumber(0, 0, 0, 0);
    private _tempAccColorStep: XrFrame.Vector4 = xrFrameSystem.Vector4.createFromNumber(0, 0, 0, 0);
    private _activeSubEmitterSystem;

    private _rootEmitterSystem;

    get material() {
        return this._material;
    }

    set material(value: Material) {
        if (!this._mesh) {
            return;
        }
    }

    get id() {
        return this._mesh.id;
    }

    get data() {
        return this._data;
    }

    get particleEmitter() {
        return this._particleEmitter;
    }

    set data(value: IParticleData) {
        this._data = value;
    }

    /**
     * 粒子系统开始播放。
     * 
     * @param delay 设定粒子延时几秒后再播放。
     */
    public start(delay) {
        if (delay) {
            setTimeout(() => {
                this.start(0);
            }, delay);
            return;
        }

        this._start = true;
        this._stop = false;

        if (this._preWarmCycles) {
            for (var index = 0; index < this._preWarmCycles; index++) {
                this._updateRenderData(0, true);
            }
        }
    }

    /**
     * 停止粒子系统与其子发射器的播放。
     */
    public stop() {
        if (this._stop) {
            return;
        }
        this._stop = true;
        this.stopSubEmitters();
    }

    /**
     * 当粒子系统添加到场景中时会执行的函数
     */
    public onAdd(parent: Element, data: IParticleData) {
        if (this._mesh) {
            return;
        }
        // 将元素和粒子所在场景给予对应成员变量
        this.particleEl = this.el;
        this.particleScene = this.el.scene;
        this._data = data;
        this.initParticle(this._data);
        // 检查是否存在子发射器
        this._prepareSubEmitterArray();
        // 粒子系统开始运行，delay控制几秒后执行
        this.start(this._delay);
    }

    /**
     * 初始化粒子系统的状态。
     */
    public initParticle(data: IParticleData) {
        this._systemId = CustomParticle.count++;
        this._parseProperties(data);
        this._parseAttribute();
        this._createVertexBuffers();
        this._createIndexBuffer();
        this._registerGeometry();
        this._createMesh();
        this._chooseEmitterProcess();
        this._setMeshData(this._material, data.uniforms, data.states);

    }

    /**
  * 获取一个粒子子发射器。
  */
    public createSubEmitter(data: IParticleData) {
        var particleSystem = new CustomParticle();
        var tempData: IParticleData = {};
        particleSystem.data = tempData;
        particleSystem.particleEl = this.particleEl || this.el;
        particleSystem.particleScene = this.particleScene || this.el.scene;

        for (var key in data) {
            particleSystem.data[key] = data[key];
        }

        //此时还未解析后加入的properties数据, 当此subEmitter被clone后成员数据更新生效
        var subEmitter = new SubEmitter(particleSystem)
        return subEmitter;
    }

    /**
   * 获取一个拷贝的粒子系统。
   */
    public clone() {
        var cloneParticleSystem = new CustomParticle();
        var tempData: IParticleData = {};
        for (var key in this._data) {
            tempData[key] = this._data[key]
        }
        cloneParticleSystem.data = tempData;
        cloneParticleSystem.particleEl = this.particleScene.createElement(xrFrameSystem.XRNode, {
            position: "0 0 0"
        });
        this.particleEl.addChild(cloneParticleSystem.particleEl);
        cloneParticleSystem.particleScene = this.particleScene;
        return cloneParticleSystem;
    }


    /**
     * 重置粒子系统的状态。
     */
    public resetParticle() {
        this._stockInstances.length = 0;
        this._instances.length = 0;
        // canvas must be redrawed to make right phenomenon
        this._updateRenderData(0);
        this._setMeshData(this._material)
    };

    /**
     * 检测子发射器的类型
     */
    protected _prepareSubEmitterArray() {
        this._subEmitters = [];
        if (this.subEmitters) {
            this.subEmitters.forEach((subEmitter) => {
                if (subEmitter instanceof CustomParticle) {
                    this._subEmitters.push([new SubEmitter(subEmitter)]);
                } else if (subEmitter instanceof SubEmitter) {
                    this._subEmitters.push([subEmitter]);
                } else if (subEmitter instanceof Array) {
                    this._subEmitters.push(subEmitter);
                }
            })
        }
        if (this._subEmitters && this._subEmitters.length != 0) {
            this._activeSubEmitterSystem = new Array();
        }
    }

    /**
     * 停止所有粒子子系统的发射状态。
     */
    protected stopSubEmitters() {
        if (!this._activeSubEmitterSystem) {
            return;
        }

        this._activeSubEmitterSystem.forEach((subEmitterSystem) => {
            subEmitterSystem.stop();
        })

        this._activeSubEmitterSystem = new Array();
    }

    /**
     * 粒子子发射系统从依附的粒子系统中剥离。
     */
    protected removeFromRoot() {
        if (!this._rootEmitterSystem) {
            return;
        }
        var index = this._rootEmitterSystem._activeSubEmitterSystem.indexOf(this);
        if (index !== -1) {
            this._rootEmitterSystem._activeSubEmitterSystem.splice(index, 1);
        }
        this._rootEmitterSystem = null;
    }

    /**
     * 每一帧粒子系统更新的逻辑
     */
    public onTick(deltaTime: number, data: IParticleData): void {
        this._updateSpeed = deltaTime / 1000;

        //layout发生变化时，会重置粒子系统
        if (this._vertexLayoutDirty) {
            this.onUpdate(data, null);
        } else {
            this._updateRenderData(deltaTime);
            this._setMeshData(this._material, data.uniforms);
        }

        this._material?._checkTextures(deltaTime);
    }

    public onUpdate(data: IParticleData, preData: IParticleData) {
        if (!this._mesh) {
            return;
        }

        let startState = this._start;
        this._start = false;

        // 如果顶点布局发生变化，则需要重置粒子系统
        if (this._vertexLayoutDirty) {
            this.resetParticle();
            this._parseAttribute();
            this._createVertexBuffers();
            this._setMeshData(this._material, data.uniforms);
            this._vertexLayoutDirty = false;
        } else {
            //wxml属性更新
            this.resetParticle();
            this.initParticle(data);
        }

        this._start = startState;
    }

    // 每一帧进行粒子生成和粒子位置与轨迹运算的核心逻辑
    protected _updateRenderData(deltaTime: number, isPreWarm: boolean = false) {
        if (!this._start) {
            return;
        }

        var newInstanceSum;

        var rate = this._emitRate;
        var _scaledUpdateSpeed = this._updateSpeed * (isPreWarm ? this._preWarmStepOffset : 1);
        newInstanceSum = (rate * _scaledUpdateSpeed) >> 0;
        this._excessInstance += rate * _scaledUpdateSpeed - newInstanceSum;

        if (this._excessInstance > 1.0) {
            newInstanceSum += this._excessInstance >> 0;
            this._excessInstance -= this._excessInstance >> 0;
        }

        //burst mode
        //控制粒子喷射效果的逻辑
        if (this._burstCount > 0) {
            var cycle: boolean = false;
            var begin: boolean = false;

            //达到喷射时间时，开始第一次喷射
            if (this._burstCountTime < this._burstTime) {
                this._burstCountTime += this._updateSpeed;
            } else {
                begin = true;
            }

            if (begin) {
                // 判断喷射间隙, 如果喷射间隙过短则视为仅喷射一次
                if (this._burstInterval < 0.01) {
                    if (this._burstInterval >= 0) {
                        newInstanceSum += this._burstCount;
                        this._burstInterval = -1;
                    }
                } else {
                    this._burstCountInterval += this._updateSpeed;
                    if (this._burstCountInterval > this._burstInterval) {
                        cycle = true;
                        this._burstCountInterval = 0
                    }
                }
            }

            // 判断喷射循环的次数
            if (cycle) {
                if (this._burstCycle != -1) {
                    if (this._burstCountCycle >= this._burstCycle >> 0) {
                        cycle = false;
                    } else {
                        this._burstCountCycle++;
                    }
                }
            }

            if (cycle) {
                newInstanceSum += this._burstCount >> 0;
            }
        }

        this._alive = false;

        if (!this._stop) {
            this._actualFrame += _scaledUpdateSpeed;
            if (this._stopDuration && this._actualFrame >= this._stopDuration) {
                this.stop();
            }
        }
        else {
            newInstanceSum = 0;
        }
        this.update(newInstanceSum);

        if (this._stop) {
            if (!this._alive) {
                this._start = false;
                this.resetParticle();
                this.removeFromRoot();
            }
        }

        if (!isPreWarm) {
            var offset = 0;
            // 每帧此处需要清空_vertexData
            this._vertexData.fill(0);
            for (var index = 0; index < this._instances.length; index++) {
                var particle = this._instances[index];
                this._appendParticleVertices(offset, particle);
                if (this._useRenderMesh) {
                    offset += this._vertexCount;
                } else {
                    offset += 4;
                }
                if (particle.subEmitterMuster && particle.subEmitterMuster.length > 0) {
                    particle.subEmitterMuster.forEach((subEmitter: SubEmitter) => {
                        subEmitter.particleSystem.onTick(deltaTime, subEmitter.particleSystem.data);
                    })
                }
            }

            if (this._activeSubEmitterSystem && this._activeSubEmitterSystem.length > 0) {
                this._activeSubEmitterSystem.forEach((particleSystem) => {
                    particleSystem.onTick(deltaTime, particleSystem.data);
                })
            }
        }
    }

    /**
     * 创建一个粒子实例。
     */
    protected createParticle() {
        var instance: ParticleInstance;
        if (this._stockInstances.length !== 0) {
            instance = this._stockInstances.pop();
            instance.reset();
        }
        else {
            instance = new ParticleInstance(this);
        }

        if (this._subEmitters && this._subEmitters.length > 0) {
            var subEmitters = this._subEmitters[Math.floor(Math.random() * this._subEmitters.length)];
            instance.subEmitterMuster = [];
            subEmitters.forEach((subEmitter) => {
                if (subEmitter.state == SubEmitterState.ATTACH) {
                    var tempEmitter = subEmitter.clone();
                    instance.subEmitterMuster.push(tempEmitter);
                    tempEmitter.particleSystem.start();
                }
            })
        }
        return instance;
    };

    /**
     * 启动处于END状态的粒子子发射器。
     * @param {ParticleInstance} instance 粒子实例
     */
    protected particleSubEmitter(instance: ParticleInstance) {
        if (!this._subEmitters || this._subEmitters.length == 0) {
            return;
        }
        var tempIndex = Math.floor(Math.random() * this._subEmitters.length);
        this._subEmitters[tempIndex].forEach((subEmitter) => {
            if (subEmitter.state == SubEmitterState.END) {
                var tempEmitter = subEmitter.clone();
                tempEmitter.particleSystem._rootEmitterSystem = this;
                // the position of sub emitter from one particle 
                tempEmitter.particleSystem.emitterPosition = instance.position.clone();
                this._activeSubEmitterSystem.push(tempEmitter.particleSystem);
                tempEmitter.particleSystem.start();
            }
        })
    }

    /**
     * 回收当前粒子实例，并放入储备粒子队列。
     * @param {ParticleInstance} particle 粒子实例
     */
    protected recycleParticle(particle: ParticleInstance) {
        var lastParticle = this._instances.pop();
        if (lastParticle !== particle) {
            lastParticle.copyTo(particle);
        }
        this._stockInstances.push(lastParticle);
    }

    /**
     * 更新每一个粒子的状态。
     * @param {number} instancesSum 新生成的粒子数
     */
    protected update(instancesSum: number) {
        // Update current
        this._alive = this._instances.length > 0;

        if (!this._alive && this._stop) {
            return;
        }


        var emitterPosition = this._emitterPosition;
        this._emitterWorldMatrix = xrFrameSystem.Matrix4.IDENTITY.translate(emitterPosition.x, emitterPosition.y, emitterPosition.z);
        this._emitterWorldMatrix.inverse(this._emitterInverseWorldMatrix);

        var instance: ParticleInstance;
        var loop = (index) => {
            if (this._instances.length === this._capacity) {
                return "break";
            }
            instance = this.createParticle();
            this._instances.push(instance);
            this.initInstanceProperty(instance);
        };
        for (var index = 0; index < instancesSum; index++) {
            var state = loop(index);
            if (state === "break")
                break;
        }

        this.updateInstanceProperty(this._instances);

    };

    /**
     * 初始化粒子实例。
     * @param {ParticleInstance} instance 需要初始化的粒子实例
     */
    protected initInstanceProperty(instance: ParticleInstance) {
        instance.lifeTime = randomBetween(this._minLifeTime, this._maxLifeTime);

        //Ramp
        if (this._useRampGradients) {
            instance.rampPos = xrFrameSystem.Vector4.createFromNumber(0, 1, 0, 1);
        }

        //Position
        this._particleEmitter.startPosition(this._emitterWorldMatrix, instance.position);

        //Rotation
        instance.angularSpeed = randomBetween(this._minAngularSpeed, this._maxAngularSpeed);
        instance.angle = randomBetween(this._startAngle, this._startAngle2);

        //Direction
        instance.speed = randomBetween(this._minSpeed, this._maxSpeed);
        this._particleEmitter.startDirection(this._emitterWorldMatrix, instance.direction, instance.position);

        //Color
        if (this._colorGradients && this._colorGradients.length > 0) {
            instance.currentColorGradient = this._colorGradients[0];
            instance.currentColorGradient.getColor(instance.currentColor);
            instance.color = instance.currentColor.clone();
            if (this._colorGradients.length > 1) {
                this._colorGradients[1].getColor(instance.currentColor2);
            } else {
                instance.currentColor2 = instance.currentColor.clone();
            }
        } else {
            var lerpStep = Math.random();
            var startColor2, endColor;

            startColor2 = this._startColor2 ?? this._startColor;
            endColor = this._endColor ?? this._startColor;

            this.lerpNumberArrayToVector(instance.color, this._startColor, startColor2, lerpStep);
            this.lerpNumberArrayToVector(this._tempEndColor, endColor, endColor, lerpStep);
            this._tempEndColor.sub(instance.color, this._tempDiffColor);
            this._tempDiffColor.scale(1 / instance.lifeTime, instance.colorStep);
        }

        //Color-alpha
        if (this._alphaGradients && this._alphaGradients.length > 0) {
            instance.currentAlphaGradient = this._alphaGradients[0];
            instance.currentAlpha = instance.currentAlphaGradient.getFactor();
            instance.color.w = instance.currentAlpha;
            if (this._alphaGradients.length > 1) {
                instance.currentAlpha2 = this._alphaGradients[1].getFactor();
            } else {
                instance.currentAlpha2 = instance.currentAlpha;
            }
        }

        //Speed
        if (this._speedScaleGradients && this._speedScaleGradients.length > 0) {
            instance.currentSpeedScaleGradient = this._speedScaleGradients[0];
            instance.currentSpeedScale = instance.currentSpeedScaleGradient.getFactor();
            if (this._speedScaleGradients.length > 1) {
                instance.currentSpeedScale2 = this._speedScaleGradients[1].getFactor();
            } else {
                instance.currentSpeedScale2 = instance.currentSpeedScale;
            }
        }

        //Limit-speed
        if (this._limitSpeedGradients && this._limitSpeedGradients.length > 0) {
            instance.currentLimitSpeedGradient = this._limitSpeedGradients[0];
            instance.currentLimitSpeed = instance.currentLimitSpeedGradient.getFactor();
            if (this._limitSpeedGradients.length > 1) {
                instance.currentLimitSpeed2 = this._limitSpeedGradients[1].getFactor();
            } else {
                instance.currentLimitSpeed2 = instance.currentLimitSpeed;
            }
        }

        //Drag
        if (this._dragGradients && this._dragGradients.length > 0) {
            instance.currentDragGradient = this._dragGradients[0];
            instance.currentDrag = instance.currentDragGradient.getFactor();
            if (this._dragGradients.length > 1) {
                instance.currentDrag2 = this._dragGradients[1].getFactor();
            } else {
                instance.currentDrag2 = instance.currentDrag;
            }
        }

        //Scale
        instance.scale.setValue(randomBetween(this._minScaleX, this._maxScaleX), randomBetween(this._minScaleY, this._maxScaleY));

        if (this._sizeGradients && this._sizeGradients.length > 0) {
            instance.currentSizeGradient = this._sizeGradients[0];
            instance.currentSize = instance.currentSizeGradient.getFactor();
            instance.sizeGradientFactor = instance.currentSize;
            instance.startSize = randomBetween(this._minSize, this._maxSize);
            instance.size = instance.startSize * instance.sizeGradientFactor;
            if (this._sizeGradients.length > 1) {
                instance.currentSize2 = this._sizeGradients[1].getFactor();
            } else {
                instance.currentSize2 = instance.currentSize;
            }
        } else {
            instance.size = randomBetween(this._minSize, this._maxSize);
        }

        //SpriteSheet
        if (this.useSpriteSheet) {
            instance.startSpriteCellIndex = this._startSpriteCellIndex;
            instance.endSpriteCellIndex = this._endSpriteCellIndex;
        }
    }

    protected fetch(u, v, width, height, content) {
        u = u * 0.5 + 0.5;
        v = v * 0.5 + 0.5;
        const wrappedU = (u * width) % width | 0;
        const wrappedV = (v * height) % height | 0;
        const position = (wrappedU + wrappedV * width) * 4;
        return content[position] / 255;
    }

    /**
    * 更新运动过程中粒子实例的各项属性以及子发射器状态。
    * @param {Array} instances 粒子实例数组
    */
    protected updateInstanceProperty(instances) {
        var loop = (index) => {
            var instance: ParticleInstance = instances[index];

            var scaledUpdateSpeed = this._updateSpeed;
            var previousAge = instance.age;
            instance.age += this._updateSpeed;

            if (instance.age > instance.lifeTime) {
                var diff = instance.age - previousAge;
                var oldDiff = instance.lifeTime - previousAge;
                scaledUpdateSpeed = (oldDiff * scaledUpdateSpeed) / diff;
                instance.age = instance.lifeTime;
            }

            this.processInstance(instance);
            if (this._particleEmitter.processInstance) {
                this._particleEmitter.processInstance(instance, this._updateSpeed);
            }

            // attached subemitter dynamic position 
            if (instance.subEmitterMuster) {
                instance.subEmitterMuster.forEach((subEmitter) => {
                    subEmitter.particleSystem.emitterPosition = instance.position.clone();
                })
            }

            if (this.useSpriteSheet) {
                instance.updateCellIndex();
            }

            if (instance.age >= instance.lifeTime) {
                this.particleSubEmitter(instance);
                if (instance.subEmitterMuster) {
                    instance.subEmitterMuster.forEach((subEmitter) => {
                        subEmitter.particleSystem.stop();
                    })
                    instance.subEmitterMuster = null;
                }
                this.recycleParticle(instance);
                index--;
            }
            popIndex = index;
        }

        var popIndex;
        for (var index = 0; index < instances.length; index++) {
            loop(index);
            index = popIndex;
        }
    }

    /**
     * 更新粒子实例的各项属性。
     * @param {ParticleInstance} instance 待更新的粒子实例
     */
    protected processInstance(instance: ParticleInstance) {
        var ratio = instance.age / instance.lifeTime;
        var scaledUpdateSpeed = this._updateSpeed;
        //RampColor  
        if (this._useRampGradients) {
            if (this._colorRemapGradients && this._colorRemapGradients.length > 0) {
                BasicGradientMethod.GetCurrentGradient(ratio, this._colorRemapGradients, (currentGradient, nextGradient, lerp) => {
                    var min = currentGradient.factor + (nextGradient.factor - currentGradient.factor) * lerp;
                    var max = currentGradient.factor2 + (nextGradient.factor2 - currentGradient.factor2) * lerp;
                    instance.rampPos.x = min;
                    instance.rampPos.y = max - min;
                })
            }
        }


        //Color 
        if (this._colorGradients && this._colorGradients.length > 0) {
            BasicGradientMethod.GetCurrentGradient(ratio, this._colorGradients, (currentGradient, nextGradient, lerp) => {
                if (instance.currentColorGradient != currentGradient) {
                    instance.currentColor = instance.currentColor2.clone();
                    nextGradient.getColor(instance.currentColor2);
                    instance.currentColorGradient = currentGradient;
                }
                instance.color.x = instance.currentColor.x + (instance.currentColor2.x - instance.currentColor.x) * lerp;
                instance.color.y = instance.currentColor.y + (instance.currentColor2.y - instance.currentColor.y) * lerp;
                instance.color.z = instance.currentColor.z + (instance.currentColor2.z - instance.currentColor.z) * lerp;
                instance.color.w = instance.currentColor.w + (instance.currentColor2.w - instance.currentColor.w) * lerp;
            })

        } else {
            instance.colorStep.scale(scaledUpdateSpeed, this._tempAccColorStep);
            instance.color.add(this._tempAccColorStep, instance.color);
            if (instance.color.w < 0) {
                instance.color.w = 0;
            }

            if (instance.color.w > 1) {
                instance.color.w = 1;
            }
        }

        //Color Alpha
        if (this._alphaGradients && this._alphaGradients.length > 0) {
            BasicGradientMethod.GetCurrentGradient(ratio, this._alphaGradients, (currentGradient, nextGradient, lerp) => {
                if (instance.currentAlphaGradient != currentGradient) {
                    instance.currentAlpha = instance.currentAlpha2;
                    instance.currentAlpha2 = nextGradient.getFactor();
                    instance.currentAlphaGradient = currentGradient;
                }
                instance.color.w = instance.currentAlpha + (instance.currentAlpha2 - instance.currentAlpha) * lerp;
            })
        }

        //--- Velocity ---//

        var speed = instance.speed;

        //Speed
        if (this._speedScaleGradients && this._speedScaleGradients.length > 0) {
            BasicGradientMethod.GetCurrentGradient(ratio, this._speedScaleGradients, (currentGradient, nextGradient, lerp) => {
                if (instance.currentSpeedScaleGradient != currentGradient) {
                    instance.currentSpeedScale = instance.currentSpeedScale2;
                    instance.currentSpeedScale = nextGradient.getFactor();
                    instance.currentSpeedScaleGradient = currentGradient;
                }
                var currentSpeedScale = instance.currentSpeedScale + (instance.currentSpeedScale2 - instance.currentSpeedScale) * lerp;
                speed = speed * currentSpeedScale;
            })
        }

        //Limit-speed
        if (this._limitSpeedGradients && this._limitSpeedGradients.length > 0) {
            BasicGradientMethod.GetCurrentGradient(ratio, this._limitSpeedGradients, (currentGradient, nextGradient, lerp) => {
                if (instance.currentLimitSpeedGradient != currentGradient) {
                    instance.currentLimitSpeed = instance.currentSpeedScale2;
                    instance.currentLimitSpeed = nextGradient.getFactor();
                    instance.currentLimitSpeedGradient = currentGradient;
                }
                var limitSpeed = instance.currentLimitSpeed + (instance.currentLimitSpeed2 - instance.currentLimitSpeed) * lerp;
                if (Math.abs(instance.speed) > limitSpeed) {
                    speed = speed * (1 - this._speedDampenFactor);
                }
            })
        }

        //Drag
        if (this._dragGradients && this._dragGradients.length > 0) {
            BasicGradientMethod.GetCurrentGradient(ratio, this._dragGradients, (currentGradient, nextGradient, lerp) => {
                if (instance.currentDragGradient != currentGradient) {
                    instance.currentDrag = instance.currentSpeedScale2;
                    instance.currentDrag = nextGradient.getFactor();
                    instance.currentDragGradient = currentGradient;
                }
                instance.drag = instance.currentDrag + (instance.currentDrag2 - instance.currentDrag) * lerp;
            })
        }

        var velocity = instance.direction.scale(speed * (1 - instance.drag));

        //--- End Velocity ---//

        //Angle
        instance.angle += instance.angularSpeed * scaledUpdateSpeed;

        //Gravity
        var scaledGravityDirection = xrFrameSystem.Vector3.createFromNumber(0, -1 * this._gravity, 0);

        //Direction
        var scaledDirection = velocity.add(scaledGravityDirection).scale(scaledUpdateSpeed);

        //Position
        instance.position.add(scaledDirection, instance.position);

        //Size
        if (this._sizeGradients && this._sizeGradients.length > 0) {
            BasicGradientMethod.GetCurrentGradient(ratio, this._sizeGradients, (currentGradient, nextGradient, lerp) => {
                if (instance.currentSizeGradient != currentGradient) {
                    instance.currentSize = instance.currentSize2;
                    instance.currentSize2 = nextGradient.getFactor();
                    instance.currentSizeGradient = currentGradient;
                }
                instance.sizeGradientFactor = instance.currentSize + (instance.currentSize2 - instance.currentSize) * lerp;
                instance.size = instance.startSize * instance.sizeGradientFactor;
            })
        }
    }
}
xrFrameSystem.registerComponent('custom-particle', CustomParticle)

