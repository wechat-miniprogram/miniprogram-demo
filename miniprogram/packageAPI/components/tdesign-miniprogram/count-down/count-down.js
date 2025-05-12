var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { SuperComponent, wxComponent } from '../common/src/index';
import config from '../common/config';
import props from './props';
import { isSameSecond, parseFormat, parseTimeData, TimeDataUnit } from './utils';
const { prefix } = config;
const name = `${prefix}-count-down`;
let CountDown = class CountDown extends SuperComponent {
    constructor() {
        super(...arguments);
        this.externalClasses = [`${prefix}-class`, `${prefix}-class-count`, `${prefix}-class-split`];
        this.properties = props;
        this.observers = {
            time() {
                this.reset();
            },
        };
        this.data = {
            prefix,
            classPrefix: name,
            timeDataUnit: TimeDataUnit,
            timeData: parseTimeData(0),
            formattedTime: '0',
        };
        this.timeoutId = null;
        this.lifetimes = {
            detached() {
                if (this.timeoutId) {
                    clearTimeout(this.timeoutId);
                    this.timeoutId = null;
                }
            },
        };
        this.methods = {
            start() {
                if (this.counting) {
                    return;
                }
                this.counting = true;
                this.endTime = Date.now() + this.remain;
                this.doCount();
            },
            pause() {
                this.counting = false;
                this.timeoutId && clearTimeout(this.timeoutId);
            },
            reset() {
                this.pause();
                this.remain = this.properties.time;
                this.updateTime(this.remain);
                if (this.properties.autoStart) {
                    this.start();
                }
            },
            getTime() {
                return Math.max(this.endTime - Date.now(), 0);
            },
            updateTime(remain) {
                const { format } = this.properties;
                this.remain = remain;
                const timeData = parseTimeData(remain);
                this.triggerEvent('change', timeData);
                const { timeText } = parseFormat(remain, format);
                const timeRange = format.split(':');
                this.setData({
                    timeRange,
                    timeData,
                    formattedTime: timeText.replace(/:/g, ' : '),
                });
                if (remain === 0) {
                    this.pause();
                    this.triggerEvent('finish');
                }
            },
            doCount() {
                this.timeoutId = setTimeout(() => {
                    const time = this.getTime();
                    if (this.properties.millisecond) {
                        this.updateTime(time);
                    }
                    else if (!isSameSecond(time, this.remain) || time === 0) {
                        this.updateTime(time);
                    }
                    if (time !== 0) {
                        this.doCount();
                    }
                }, 33);
            },
        };
    }
};
CountDown = __decorate([
    wxComponent()
], CountDown);
export default CountDown;
