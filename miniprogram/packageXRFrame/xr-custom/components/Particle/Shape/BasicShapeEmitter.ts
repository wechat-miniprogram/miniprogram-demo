import XrFrame from 'XrFrame';
const xrFrameSystem = wx.getXrFrameSystem();

// 控制发射器形态的基础类
export abstract class BasicShapeEmitter {
    /**
     * keep normalized length
     */
    direction?: XrFrame.Vector3;
    /**
     * keep normalized length
     */
    direction2?: XrFrame.Vector3;
    // 继承实现后，获取粒子初始的发射方向
    abstract startDirection(worldMatrix: XrFrame.Matrix4, direction: XrFrame.Vector3, ...args: any[]): void;
    // 继承实现后，获取粒子初始的发射位置
    abstract startPosition(worldMatrix: XrFrame.Matrix4, position: XrFrame.Vector3, ...args: any[]): void;
    // 继承后，用于自行定制粒子轨迹的变化规律
    processInstance?(instance: ParticleInstance, deltaTime: number): void;
    // 设置该形态发射器的各项属性
    setProperty(properties) {
        properties?.forEach(([key, v]) => {
            switch (typeof (this[key])) {
                case "number":
                    this[key] = parseFloat(v);
                    break;
                //一般为vector3
                case "object":
                    var stringArray = v.split(' ')
                    this[key] = xrFrameSystem.Vector3.createFromNumber(parseFloat(stringArray[0]), parseFloat(stringArray[1]), parseFloat(stringArray[2]))
                    break;
            }
        })
    }
}