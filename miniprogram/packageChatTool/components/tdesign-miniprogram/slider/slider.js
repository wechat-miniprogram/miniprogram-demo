var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SuperComponent, wxComponent } from '../common/src/index';
import config from '../common/config';
import { trimSingleValue, trimValue } from './tool';
import props from './props';
import { getRect } from '../common/utils';
import Bus from '../common/bus';
const { prefix } = config;
const name = `${prefix}-slider`;
let Slider = class Slider extends SuperComponent {
    constructor() {
        super(...arguments);
        this.externalClasses = [
            `${prefix}-class`,
            `${prefix}-class-bar`,
            `${prefix}-class-bar-active`,
            `${prefix}-class-bar-disabled`,
            `${prefix}-class-cursor`,
        ];
        this.options = {
            pureDataPattern: /^__/,
        };
        this.properties = props;
        this.controlledProps = [
            {
                key: 'value',
                event: 'change',
            },
        ];
        this.data = {
            sliderStyles: '',
            classPrefix: name,
            initialLeft: null,
            initialRight: null,
            activeLeft: 0,
            activeRight: 0,
            maxRange: 0,
            lineLeft: 0,
            lineRight: 0,
            dotTopValue: [0, 0],
            _value: 0,
            blockSize: 20,
            isScale: false,
            scaleArray: [],
            scaleTextArray: [],
            prefix,
            isVisibleToScreenReader: false,
            identifier: [-1, -1],
            __inited: false,
        };
        this.observers = {
            value(newValue) {
                this.handlePropsChange(newValue);
            },
            _value(newValue) {
                this.bus.on('initial', () => this.renderLine(newValue));
                this.toggleA11yTips();
            },
            marks(val) {
                this.bus.on('initial', () => this.handleMark(val));
            },
        };
        this.lifetimes = {
            created() {
                this.bus = new Bus();
            },
            attached() {
                const { value } = this.properties;
                if (!value)
                    this.handlePropsChange(0);
                this.init();
                this.injectPageScroll();
            },
        };
    }
    injectPageScroll() {
        const { range, vertical } = this.properties;
        if (!range || !vertical)
            return;
        const pages = getCurrentPages() || [];
        let curPage = null;
        if (pages && pages.length - 1 >= 0) {
            curPage = pages[pages.length - 1];
        }
        if (!curPage)
            return;
        const originPageScroll = curPage === null || curPage === void 0 ? void 0 : curPage.onPageScroll;
        curPage.onPageScroll = (rest) => {
            originPageScroll === null || originPageScroll === void 0 ? void 0 : originPageScroll.call(this, rest);
            this.observerScrollTop(rest);
        };
    }
    observerScrollTop(rest) {
        const { scrollTop } = rest || {};
        this.pageScrollTop = scrollTop;
    }
    toggleA11yTips() {
        this.setData({
            isVisibleToScreenReader: true,
        });
        setTimeout(() => {
            this.setData({
                isVisibleToScreenReader: false,
            });
        }, 2000);
    }
    renderLine(val) {
        const { min, max, range } = this.properties;
        const { maxRange } = this.data;
        if (range) {
            const left = (maxRange * (val[0] - Number(min))) / (Number(max) - Number(min));
            const right = (maxRange * (Number(max) - val[1])) / (Number(max) - Number(min));
            this.setLineStyle(left, right);
        }
        else {
            this.setSingleBarWidth(val);
        }
    }
    triggerValue(value) {
        if (this.preval === value)
            return;
        this.preval = value;
        this._trigger('change', {
            value: trimValue(value, this.properties),
        });
    }
    handlePropsChange(newValue) {
        const value = trimValue(newValue, this.properties);
        const setValueAndTrigger = () => {
            this.setData({
                _value: value,
            });
        };
        if (this.data.maxRange === 0) {
            this.init().then(setValueAndTrigger);
            return;
        }
        setValueAndTrigger();
    }
    handleMark(marks) {
        const calcPos = (arr) => {
            const { max, theme } = this.properties;
            const { blockSize, maxRange } = this.data;
            const margin = theme === 'capsule' ? blockSize / 2 : 0;
            return arr.map((item) => ({
                val: item,
                left: Math.round((item / Number(max)) * maxRange) + margin,
            }));
        };
        if ((marks === null || marks === void 0 ? void 0 : marks.length) && Array.isArray(marks)) {
            this.setData({
                isScale: true,
                scaleArray: calcPos(marks),
                scaleTextArray: [],
            });
        }
        if (Object.prototype.toString.call(marks) === '[object Object]') {
            const scaleArray = Object.keys(marks).map((item) => Number(item));
            const scaleTextArray = scaleArray.map((item) => marks[item]);
            this.setData({
                isScale: scaleArray.length > 0,
                scaleArray: calcPos(scaleArray),
                scaleTextArray,
            });
        }
    }
    setSingleBarWidth(value) {
        const { max, min, theme } = this.properties;
        const { maxRange, blockSize } = this.data;
        const halfBlock = theme === 'capsule' ? Number(blockSize) / 2 : 0;
        const percentage = (Number(value) - Number(min)) / (Number(max) - Number(min));
        const width = percentage * maxRange + halfBlock;
        this.setData({
            lineBarWidth: `${width}px`,
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.data.__inited)
                return;
            const line = yield getRect(this, '#sliderLine');
            const { blockSize } = this.data;
            const { theme, vertical } = this.properties;
            const halfBlock = Number(blockSize) / 2;
            const { top, bottom, right, left } = line;
            let maxRange = vertical ? bottom - top : right - left;
            let initialLeft = vertical ? top : left;
            let initialRight = vertical ? bottom : right;
            if (initialLeft === 0 && initialRight === 0)
                return;
            if (theme === 'capsule') {
                maxRange = maxRange - Number(blockSize) - 6;
                initialLeft -= halfBlock;
                initialRight -= halfBlock;
            }
            this.setData({
                maxRange,
                initialLeft,
                initialRight,
                __inited: true,
            });
            this.bus.emit('initial');
        });
    }
    stepValue(value) {
        const { step, min, max } = this.properties;
        const decimal = String(step).indexOf('.') > -1 ? String(step).length - String(step).indexOf('.') - 1 : 0;
        const closestStep = trimSingleValue(Number((Math.round(value / Number(step)) * Number(step)).toFixed(decimal)), Number(min), Number(max));
        return closestStep;
    }
    onSingleLineTap(e) {
        const { disabled } = this.properties;
        if (disabled)
            return;
        const isSingleLineTap = this.data.identifier[0] === -1;
        if (isSingleLineTap) {
            const [touch] = e.changedTouches;
            this.data.identifier[0] = touch.identifier;
        }
        const value = this.getSingleChangeValue(e);
        if (isSingleLineTap) {
            this.data.identifier[0] = -1;
        }
        this.triggerValue(value);
    }
    getSingleChangeValue(e) {
        const { min, max, theme, vertical } = this.properties;
        const { initialLeft, maxRange, blockSize } = this.data;
        const touch = e.changedTouches.find((item) => item.identifier === this.data.identifier[0]);
        const pagePosition = this.getPagePosition(touch);
        let offset = 0;
        if (theme === 'capsule') {
            offset = Number(blockSize);
            if (vertical) {
                offset *= 2;
            }
            offset += 6;
        }
        else if (vertical) {
            offset = Number(blockSize);
        }
        const currentLeft = pagePosition - initialLeft - offset;
        let value = 0;
        if (currentLeft <= 0) {
            value = Number(min);
        }
        else if (currentLeft >= maxRange) {
            value = Number(max);
        }
        else {
            value = (currentLeft / maxRange) * (Number(max) - Number(min)) + Number(min);
        }
        return this.stepValue(value);
    }
    convertPosToValue(posValue, dir) {
        const { maxRange } = this.data;
        const { max, min } = this.properties;
        return dir === 0
            ? (posValue / maxRange) * (Number(max) - Number(min)) + Number(min)
            : Number(max) - (posValue / maxRange) * (Number(max) - Number(min));
    }
    onLineTap(e) {
        const { disabled, theme, vertical } = this.properties;
        const { initialLeft, initialRight, maxRange, blockSize } = this.data;
        if (disabled)
            return;
        const [touch] = e.changedTouches;
        const pagePosition = this.getPagePosition(touch);
        const halfBlock = theme === 'capsule' ? Number(blockSize) / 2 : 0;
        const currentLeft = pagePosition - initialLeft;
        const currentRight = -(pagePosition - initialRight);
        if (currentLeft < 0 || currentRight > maxRange + Number(blockSize))
            return;
        Promise.all([getRect(this, '#leftDot'), getRect(this, '#rightDot')]).then(([leftDot, rightDot]) => {
            const pageScrollTop = this.pageScrollTop || 0;
            const leftDotPosition = vertical ? leftDot.top + pageScrollTop : leftDot.left;
            const distanceLeft = Math.abs(pagePosition - leftDotPosition - halfBlock);
            const rightDotPosition = vertical ? rightDot.top + pageScrollTop : rightDot.left;
            const distanceRight = Math.abs(rightDotPosition - pagePosition + halfBlock);
            const isMoveLeft = distanceLeft < distanceRight;
            let offset = 0;
            if (theme === 'capsule') {
                offset = Number(blockSize);
                if (vertical) {
                    offset *= 2;
                }
                offset += 6;
            }
            else if (vertical) {
                offset = Number(blockSize);
            }
            if (isMoveLeft) {
                const left = pagePosition - initialLeft - offset;
                const leftValue = this.convertPosToValue(left, 0);
                this.triggerValue([this.stepValue(leftValue), this.data._value[1]]);
            }
            else {
                let right = -(pagePosition - initialRight);
                if (vertical) {
                    right += offset / 2;
                }
                const rightValue = this.convertPosToValue(right, 1);
                this.triggerValue([this.data._value[0], this.stepValue(rightValue)]);
            }
        });
    }
    onTouchStart(e) {
        this.triggerEvent('dragstart', { e });
        const [touch] = e.changedTouches;
        if (e.currentTarget.id === 'rightDot') {
            this.data.identifier[1] = touch.identifier;
        }
        else {
            this.data.identifier[0] = touch.identifier;
        }
    }
    onTouchMoveLeft(e) {
        const { disabled, theme, vertical } = this.properties;
        const { initialLeft, _value, blockSize } = this.data;
        if (disabled)
            return;
        const touch = e.changedTouches.find((item) => item.identifier === this.data.identifier[0]);
        const pagePosition = this.getPagePosition(touch);
        let offset = 0;
        if (theme === 'capsule') {
            offset += Number(blockSize);
        }
        if (vertical) {
            offset += Number(blockSize) + 6;
        }
        const currentLeft = pagePosition - initialLeft - offset;
        const newData = [..._value];
        const leftValue = this.convertPosToValue(currentLeft, 0);
        newData[0] = this.stepValue(leftValue);
        this.triggerValue(newData);
    }
    onTouchMoveRight(e) {
        const { disabled, vertical } = this.properties;
        const { initialRight, _value, blockSize } = this.data;
        if (disabled)
            return;
        const touch = e.changedTouches.find((item) => item.identifier === this.data.identifier[1]);
        const pagePosition = this.getPagePosition(touch);
        let offset = 0;
        if (vertical) {
            offset += Number(blockSize) / 2 + 6;
        }
        const currentRight = -(pagePosition - initialRight - offset);
        const newData = [..._value];
        const rightValue = this.convertPosToValue(currentRight, 1);
        newData[1] = this.stepValue(rightValue);
        this.triggerValue(newData);
    }
    setLineStyle(left, right) {
        const { theme } = this.properties;
        const { blockSize, maxRange } = this.data;
        const halfBlock = theme === 'capsule' ? Number(blockSize) / 2 : 0;
        const [a, b] = this.data._value;
        const cut = (v) => parseInt(v, 10);
        this.setData({
            dotTopValue: [a, b],
        });
        if (left + right <= maxRange) {
            this.setData({
                lineLeft: cut(left + halfBlock),
                lineRight: cut(right + halfBlock),
            });
        }
        else {
            this.setData({
                lineLeft: cut(maxRange + halfBlock - right),
                lineRight: cut(maxRange - left + halfBlock * 1.5),
            });
        }
    }
    onTouchEnd(e) {
        this.triggerEvent('dragend', { e, value: this.data._value });
        if (e.currentTarget.id === 'rightDot') {
            this.data.identifier[1] = -1;
        }
        else {
            this.data.identifier[0] = -1;
        }
    }
    getPagePosition(touch) {
        const { pageX, pageY } = touch;
        const { vertical } = this.properties;
        return vertical ? pageY : pageX;
    }
};
Slider = __decorate([
    wxComponent()
], Slider);
export default Slider;
