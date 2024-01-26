const xrFrameSystem = wx.getXrFrameSystem();

// 控制粒子颜色渐变
export class ColorGradient {
    public gradient: number;
    public color: xrFrameSystem.Vector4;
    public color2: xrFrameSystem.Vector4;

    constructor(gradient, color, color2) {
        this.gradient = gradient;
        this.color = color;
        this.color2 = color2;
    }

    /**
    * 获取具体颜色属性值
    * @param {Vector4} 用于存储结果的临时变量
    */
    public getColor(colorTemp: xrFrameSystem.Vector4) {
        if (!this.color2) {
            colorTemp.x = this.color.x;
            colorTemp.y = this.color.y;
            colorTemp.z = this.color.z;
            colorTemp.w = this.color.w;
            return;
        }

        var lerp = Math.random();
        colorTemp.x = this.color.x + (this.color2.x - this.color.x) * lerp;
        colorTemp.y = this.color.y + (this.color2.y - this.color.y) * lerp;
        colorTemp.z = this.color.z + (this.color2.z - this.color.z) * lerp;
        colorTemp.w = this.color.w + (this.color2.w - this.color.w) * lerp;
    }
}

export class Color3Gradient {
    public gradient: number;
    public color: xrFrameSystem.Vector3;

    constructor(gradient, color) {
        this.gradient = gradient;
        this.color = color;
    }
}

// 控制粒子变化的属性
export class FactorGradient {

    public gradient: number;
    public factor: number;
    public factor2: number;

    constructor(gradient, factor, factor2) {
        this.gradient = gradient;
        this.factor = factor;
        this.factor2 = factor2;
    }

    /**
     * 获取具体属性值
     * @return {number} 插值后的属性大小
     */
    public getFactor() {
        if (!this.factor2 || this.factor2 == this.factor) {
            return this.factor;
        }

        return this.factor + (this.factor2 - this.factor) * Math.random();
    }
}


export class BasicGradientMethod {
    /**
     * 从获取具体时刻的属性大小
     * @param {number} ratio 粒子所处生命周期的阶段
     * @param {Array} gradients 存储不同时刻指定属性变化的数组
     * @param {Callback} updateFunc 回调函数
     */
    public static GetCurrentGradient(ratio, gradients, updateFunc) {
        if (gradients[0].graident > ratio) {
            updateFunc(gradients[0], gradients[0], 1.0)
            return;
        }

        var lastIndex = gradients.length - 1;

        for (var index = 0; index < lastIndex; index++) {
            var currentGradient = gradients[index];
            var nextGradient = gradients[index + 1];
            if (ratio >= currentGradient.gradient && ratio <= nextGradient.gradient) {
                var lerp = (ratio - currentGradient.gradient) / (nextGradient.gradient - currentGradient.gradient);
                updateFunc(currentGradient, nextGradient, lerp);
                return;
            }
        }
        updateFunc(gradients[lastIndex], gradients[lastIndex], 1.0);
    }
}