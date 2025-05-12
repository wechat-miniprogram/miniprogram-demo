var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { SuperComponent, wxComponent } from '../common/src/index';
import config from '../common/config';
import props from './props';
import { getRect, throttle, systemInfo } from '../common/utils';
import pageScrollMixin from '../mixins/page-scroll';
const { prefix } = config;
const name = `${prefix}-indexes`;
let Indexes = class Indexes extends SuperComponent {
    constructor() {
        super(...arguments);
        this.externalClasses = [`${prefix}-class`, `${prefix}-class-sidebar`, `${prefix}-class-sidebar-item`];
        this.properties = props;
        this.data = {
            prefix,
            classPrefix: name,
            _height: 0,
            _indexList: [],
            scrollTop: 0,
            activeAnchor: null,
            showTips: false,
        };
        this.relations = {
            '../indexes-anchor/indexes-anchor': {
                type: 'child',
            },
        };
        this.behaviors = [pageScrollMixin()];
        this.timer = null;
        this.groupTop = [];
        this.sidebar = null;
        this.currentTouchAnchor = null;
        this.observers = {
            indexList(v) {
                this.setIndexList(v);
                this.setHeight(this.data._height);
            },
            height(v) {
                this.setHeight(v);
            },
        };
        this.lifetimes = {
            ready() {
                this.timer = null;
                this.groupTop = [];
                this.sidebar = null;
                if (this.data._height === 0) {
                    this.setHeight();
                }
                if (this.data.indexList === null) {
                    this.setIndexList();
                }
            },
        };
        this.methods = {
            setHeight(height) {
                if (!height) {
                    const { windowHeight } = systemInfo;
                    height = windowHeight;
                }
                this.setData({
                    _height: height,
                }, () => {
                    this.getAllRect();
                });
            },
            setIndexList(list) {
                if (!list) {
                    const start = 'A'.charCodeAt(0);
                    const alphabet = [];
                    for (let i = start, end = start + 26; i < end; i += 1) {
                        alphabet.push(String.fromCharCode(i));
                    }
                    this.setData({ _indexList: alphabet });
                }
                else {
                    this.setData({ _indexList: list });
                }
            },
            getAllRect() {
                this.getAnchorsRect().then(() => {
                    this.groupTop.forEach((item, index) => {
                        const next = this.groupTop[index + 1];
                        item.totalHeight = ((next === null || next === void 0 ? void 0 : next.top) || Infinity) - item.top;
                    });
                    this.setAnchorOnScroll(0);
                });
                this.getSidebarRect();
            },
            getAnchorsRect() {
                return Promise.all(this.$children.map((child) => getRect(child, `.${name}-anchor`).then((rect) => {
                    this.groupTop.push({
                        height: rect.height,
                        top: rect.top,
                        anchor: child.data.index,
                    });
                })));
            },
            getSidebarRect() {
                getRect(this, `#id-${name}__bar`).then((rect) => {
                    const { top, height } = rect;
                    const { length } = this.data._indexList;
                    this.sidebar = {
                        top,
                        height,
                        itemHeight: (height - (length - 1) * 2) / length,
                    };
                });
            },
            toggleTips(flag) {
                if (!flag) {
                    clearInterval(this.timer);
                    this.timer = setTimeout(() => {
                        this.setData({
                            showTips: false,
                        });
                    }, 300);
                }
                else {
                    this.setData({
                        showTips: true,
                    });
                }
            },
            setAnchorByIndex(index) {
                const { _indexList, stickyOffset } = this.data;
                const activeAnchor = _indexList[index];
                if (this.data.activeAnchor !== null && this.data.activeAnchor === activeAnchor)
                    return;
                const target = this.groupTop.find((item) => item.anchor === activeAnchor);
                if (target) {
                    this.currentTouchAnchor = activeAnchor;
                    const scrollTop = target.top - stickyOffset;
                    wx.pageScrollTo({
                        scrollTop,
                        duration: 0,
                    });
                    this.toggleTips(true);
                    this.triggerEvent('select', { index: activeAnchor });
                    this.setData({ activeAnchor });
                }
            },
            onClick(e) {
                const { index } = e.currentTarget.dataset;
                this.setAnchorByIndex(index);
            },
            onTouchMove(e) {
                this.onAnchorTouch(e);
            },
            onTouchCancel() {
                this.toggleTips(false);
            },
            onTouchEnd(e) {
                this.toggleTips(false);
                this.onAnchorTouch(e);
            },
            onAnchorTouch: throttle(function (e) {
                const getAnchorIndex = (clientY) => {
                    const offsetY = clientY - this.sidebar.top;
                    if (offsetY <= 0) {
                        return 0;
                    }
                    if (offsetY > this.sidebar.height) {
                        return this.data._indexList.length - 1;
                    }
                    return Math.floor(offsetY / this.sidebar.itemHeight);
                };
                const index = getAnchorIndex(e.changedTouches[0].clientY);
                this.setAnchorByIndex(index);
            }, 1000 / 30),
            setAnchorOnScroll(scrollTop) {
                if (!this.groupTop) {
                    return;
                }
                const { sticky, stickyOffset, activeAnchor } = this.data;
                scrollTop += stickyOffset;
                const curIndex = this.groupTop.findIndex((group) => scrollTop >= group.top - group.height && scrollTop <= group.top + group.totalHeight - group.height);
                if (curIndex === -1)
                    return;
                const curGroup = this.groupTop[curIndex];
                if (this.currentTouchAnchor !== null) {
                    this.triggerEvent('change', { index: curGroup.anchor });
                    this.currentTouchAnchor = null;
                }
                else if (activeAnchor !== curGroup.anchor) {
                    this.triggerEvent('change', { index: curGroup.anchor });
                    this.setData({ activeAnchor: curGroup.anchor });
                }
                if (sticky) {
                    const offset = curGroup.top - scrollTop;
                    const betwixt = offset < curGroup.height && offset > 0 && scrollTop > stickyOffset;
                    this.$children.forEach((child, index) => {
                        if (index === curIndex) {
                            const sticky = scrollTop > stickyOffset;
                            const anchorStyle = `transform: translate3d(0, ${betwixt ? offset : 0}px, 0); top: ${stickyOffset}px`;
                            if (anchorStyle !== child.data.anchorStyle || sticky !== child.data.sticky) {
                                child.setData({
                                    sticky,
                                    active: true,
                                    style: `height: ${curGroup.height}px`,
                                    anchorStyle,
                                });
                            }
                        }
                        else if (index + 1 === curIndex) {
                            const anchorStyle = `transform: translate3d(0, ${betwixt ? offset - curGroup.height : 0}px, 0); top: ${stickyOffset}px`;
                            if (anchorStyle !== child.data.anchorStyle) {
                                child.setData({
                                    sticky: true,
                                    active: true,
                                    style: `height: ${curGroup.height}px`,
                                    anchorStyle,
                                });
                            }
                        }
                        else {
                            child.setData({ active: false, sticky: false, anchorStyle: '' });
                        }
                    });
                }
            },
            onScroll({ scrollTop }) {
                this.setAnchorOnScroll(scrollTop);
            },
        };
    }
};
Indexes = __decorate([
    wxComponent()
], Indexes);
export default Indexes;
