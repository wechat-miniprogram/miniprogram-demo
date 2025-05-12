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
import props from './props';
import config from '../common/config';
import touch from '../mixins/touch';
import { getRect, uniqueFactory } from '../common/utils';
import { getObserver } from '../common/wechat';
const { prefix } = config;
const name = `${prefix}-tabs`;
const getUniqueID = uniqueFactory('tabs');
let Tabs = class Tabs extends SuperComponent {
    constructor() {
        super(...arguments);
        this.options = {
            pureDataPattern: /^currentLabels$/,
        };
        this.behaviors = [touch];
        this.externalClasses = [
            `${prefix}-class`,
            `${prefix}-class-item`,
            `${prefix}-class-active`,
            `${prefix}-class-track`,
            `${prefix}-class-content`,
        ];
        this.relations = {
            '../tab-panel/tab-panel': {
                type: 'descendant',
                linked(target) {
                    this.children.push(target);
                    this.initChildId();
                    target.index = this.children.length - 1;
                    this.updateTabs();
                },
                unlinked(target) {
                    this.children = this.children.filter((item) => item.index !== target.index);
                    this.updateTabs(() => this.setTrack());
                    this.initChildId();
                },
            },
        };
        this.properties = props;
        this.controlledProps = [
            {
                key: 'value',
                event: 'change',
            },
        ];
        this.observers = {
            value(name) {
                if (name !== this.getCurrentName()) {
                    this.setCurrentIndexByName(name);
                }
            },
        };
        this.data = {
            prefix,
            classPrefix: name,
            tabs: [],
            currentLabels: [],
            currentIndex: -1,
            trackStyle: '',
            offset: 0,
            scrollLeft: 0,
            tabID: '',
            placement: 'top',
        };
        this.lifetimes = {
            created() {
                this.children = this.children || [];
            },
            attached() {
                wx.nextTick(() => {
                    this.setTrack();
                });
                getRect(this, `.${name}`).then((rect) => {
                    this.containerWidth = rect.width;
                });
                this.setData({
                    tabID: getUniqueID(),
                });
            },
        };
        this.methods = {
            onScroll(e) {
                const { scrollLeft } = e.detail;
                this.setData({
                    scrollLeft,
                });
            },
            updateTabs(cb) {
                const { children } = this;
                const tabs = children.map((child) => child.data);
                tabs.forEach((item) => {
                    if (typeof item.icon === 'string') {
                        item.icon = { name: item.icon };
                    }
                });
                this.setData({ tabs }, cb);
                this.setCurrentIndexByName(this.properties.value);
            },
            setCurrentIndexByName(name) {
                const { children } = this;
                const index = children.findIndex((child) => child.getComputedName() === `${name}`);
                if (index > -1) {
                    this.setCurrentIndex(index);
                }
            },
            setCurrentIndex(index) {
                if (index <= -1 || index >= this.children.length)
                    return;
                const Labels = [];
                this.children.forEach((child, idx) => {
                    const isActive = index === idx;
                    if (isActive !== child.data.active || !child.initialized) {
                        child.render(isActive, this);
                    }
                    Labels.push(child.data.label);
                });
                const { currentIndex, currentLabels } = this.data;
                if (currentIndex === index && currentLabels.join('') === Labels.join(''))
                    return;
                this.setData({
                    currentIndex: index,
                    currentLabels: Labels,
                }, () => {
                    this.setTrack();
                });
            },
            getCurrentName() {
                if (this.children) {
                    const activeTab = this.children[this.data.currentIndex];
                    if (activeTab) {
                        return activeTab.getComputedName();
                    }
                }
            },
            calcScrollOffset(containerWidth, targetLeft, targetWidth, offset) {
                return offset + targetLeft - (1 / 2) * containerWidth + targetWidth / 2;
            },
            getTabHeight() {
                return getRect(this, `.${name}`);
            },
            getTrackSize() {
                return new Promise((resolve, reject) => {
                    if (this.trackWidth) {
                        resolve(this.trackWidth);
                        return;
                    }
                    getRect(this, `.${prefix}-tabs__track`)
                        .then((res) => {
                        if (res) {
                            this.trackWidth = res.width;
                            resolve(this.trackWidth);
                        }
                    })
                        .catch(reject);
                });
            },
            setTrack() {
                return __awaiter(this, void 0, void 0, function* () {
                    const { children } = this;
                    if (!children)
                        return;
                    const { currentIndex } = this.data;
                    if (currentIndex <= -1)
                        return;
                    try {
                        const res = yield getRect(this, `.${prefix}-tabs__item`, true);
                        const rect = res[currentIndex];
                        if (!rect)
                            return;
                        let count = 0;
                        let distance = 0;
                        let totalSize = 0;
                        res.forEach((item) => {
                            if (count < currentIndex) {
                                distance += item.width;
                                count += 1;
                            }
                            totalSize += item.width;
                        });
                        if (this.containerWidth) {
                            const offset = this.calcScrollOffset(this.containerWidth, rect.left, rect.width, this.data.scrollLeft);
                            const maxOffset = totalSize - this.containerWidth;
                            this.setData({
                                offset: Math.min(Math.max(offset, 0), maxOffset),
                            });
                        }
                        else if (!this._hasObserved) {
                            this._hasObserved = true;
                            getObserver(this, `.${name}`).then(() => this.setTrack());
                        }
                        if (this.data.theme === 'line') {
                            const trackLineWidth = yield this.getTrackSize();
                            distance += (rect.width - trackLineWidth) / 2;
                        }
                        this.setData({
                            trackStyle: `-webkit-transform: translateX(${distance}px);
            transform: translateX(${distance}px);
          `,
                        });
                    }
                    catch (err) {
                        this.triggerEvent('error', err);
                    }
                });
            },
            onTabTap(event) {
                const { index } = event.currentTarget.dataset;
                this.changeIndex(index);
            },
            onTouchStart(event) {
                if (!this.properties.swipeable)
                    return;
                this.touchStart(event);
            },
            onTouchMove(event) {
                if (!this.properties.swipeable)
                    return;
                this.touchMove(event);
            },
            onTouchEnd() {
                if (!this.properties.swipeable)
                    return;
                const { direction, deltaX, offsetX } = this;
                const minSwipeDistance = 50;
                if (direction === 'horizontal' && offsetX >= minSwipeDistance) {
                    const index = this.getAvailableTabIndex(deltaX);
                    if (index !== -1) {
                        this.changeIndex(index);
                    }
                }
            },
            onTouchScroll(event) {
                this._trigger('scroll', event.detail);
            },
            changeIndex(index) {
                const currentTab = this.data.tabs[index];
                const { value, label } = currentTab;
                if (!(currentTab === null || currentTab === void 0 ? void 0 : currentTab.disabled) && index !== this.data.currentIndex) {
                    this._trigger('change', { value, label });
                }
                this._trigger('click', { value, label });
            },
            getAvailableTabIndex(deltaX) {
                const step = deltaX > 0 ? -1 : 1;
                const { currentIndex, tabs } = this.data;
                const len = tabs.length;
                for (let i = step; currentIndex + step >= 0 && currentIndex + step < len; i += step) {
                    const newIndex = currentIndex + i;
                    if (newIndex >= 0 && newIndex < len && tabs[newIndex]) {
                        if (!tabs[newIndex].disabled) {
                            return newIndex;
                        }
                    }
                    else {
                        return currentIndex;
                    }
                }
                return -1;
            },
        };
    }
    initChildId() {
        this.children.forEach((item, index) => {
            item.setId(`${this.data.tabID}_panel_${index}`);
        });
    }
};
Tabs = __decorate([
    wxComponent()
], Tabs);
export default Tabs;
