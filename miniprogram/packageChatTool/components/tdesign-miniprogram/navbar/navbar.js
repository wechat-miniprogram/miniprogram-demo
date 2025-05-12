var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { SuperComponent, wxComponent } from '../common/src/index';
import { getRect, systemInfo } from '../common/utils';
import config from '../common/config';
import props from './props';
const { prefix } = config;
const name = `${prefix}-navbar`;
let Navbar = class Navbar extends SuperComponent {
    constructor() {
        super(...arguments);
        this.externalClasses = [
            `${prefix}-class`,
            `${prefix}-class-placeholder`,
            `${prefix}-class-content`,
            `${prefix}-class-title`,
            `${prefix}-class-left`,
            `${prefix}-class-center`,
            `${prefix}-class-left-icon`,
            `${prefix}-class-home-icon`,
            `${prefix}-class-capsule`,
            `${prefix}-class-nav-btn`,
        ];
        this.timer = null;
        this.options = {
            multipleSlots: true,
        };
        this.properties = props;
        this.observers = {
            visible(visible) {
                const { animation } = this.properties;
                const visibleClass = `${name}${visible ? '--visible' : '--hide'}`;
                this.setData({
                    visibleClass: `${visibleClass}${animation ? '-animation' : ''}`,
                });
                if (this.timer) {
                    clearTimeout(this.timer);
                }
                if (animation) {
                    this.timer = setTimeout(() => {
                        this.setData({
                            visibleClass,
                        });
                    }, 300);
                }
            },
            'title,titleMaxLength'() {
                const { title } = this.properties;
                const titleMaxLength = this.properties.titleMaxLength || Number.MAX_SAFE_INTEGER;
                let temp = title.slice(0, titleMaxLength);
                if (titleMaxLength < title.length)
                    temp += '...';
                this.setData({
                    showTitle: temp,
                });
            },
        };
        this.data = {
            prefix,
            classPrefix: name,
            boxStyle: '',
            showTitle: '',
            hideLeft: false,
            hideCenter: false,
            _menuRect: null,
            _leftRect: null,
            _boxStyle: {},
        };
        this.methods = {
            initStyle() {
                this.getMenuRect();
                const { _menuRect, _leftRect } = this.data;
                if (!_menuRect || !_leftRect || !systemInfo)
                    return;
                const _boxStyle = {
                    '--td-navbar-padding-top': `${systemInfo.statusBarHeight}px`,
                    '--td-navbar-right': `${systemInfo.windowWidth - _menuRect.left}px`,
                    '--td-navbar-left-max-width': `${_menuRect.left}px`,
                    '--td-navbar-capsule-height': `${_menuRect.height}px`,
                    '--td-navbar-capsule-width': `${_menuRect.width}px`,
                    '--td-navbar-height': `${(_menuRect.top - systemInfo.statusBarHeight) * 2 + _menuRect.height}px`,
                };
                this.calcCenterStyle(_leftRect, _menuRect, _boxStyle);
            },
            calcCenterStyle(leftRect, menuRect, defaultStyle) {
                const maxSpacing = Math.max(leftRect.right, systemInfo.windowWidth - menuRect.left);
                const _boxStyle = Object.assign(Object.assign({}, defaultStyle), { '--td-navbar-center-left': `${maxSpacing}px`, '--td-navbar-center-width': `${Math.max(menuRect.left - maxSpacing, 0)}px` });
                const boxStyle = Object.entries(_boxStyle)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join('; ');
                this.setData({
                    boxStyle,
                    _boxStyle,
                });
            },
            getLeftRect() {
                getRect(this, `.${name}__left`).then((res) => {
                    if (res.right > this.data._leftRect.right) {
                        this.calcCenterStyle(res, this.data._menuRect, this.data._boxStyle);
                    }
                });
            },
            getMenuRect() {
                if (wx.getMenuButtonBoundingClientRect) {
                    const rect = wx.getMenuButtonBoundingClientRect();
                    this.setData({
                        _menuRect: rect,
                        _leftRect: {
                            right: systemInfo.windowWidth - rect.left,
                        },
                    });
                }
            },
            onMenuButtonBoundingClientRectWeightChange() {
                if (wx.onMenuButtonBoundingClientRectWeightChange) {
                    wx.onMenuButtonBoundingClientRectWeightChange((res) => this.queryElements(res));
                }
            },
            offMenuButtonBoundingClientRectWeightChange() {
                if (wx.offMenuButtonBoundingClientRectWeightChange) {
                    wx.offMenuButtonBoundingClientRectWeightChange((res) => this.queryElements(res));
                }
            },
            queryElements(capsuleRect) {
                Promise.all([
                    getRect(this, `.${this.data.classPrefix}__left`),
                    getRect(this, `.${this.data.classPrefix}__center`),
                ]).then(([leftRect, centerRect]) => {
                    if (Math.round(leftRect.right) > capsuleRect.left) {
                        this.setData({
                            hideLeft: true,
                            hideCenter: true,
                        });
                    }
                    else if (Math.round(centerRect.right) > capsuleRect.left) {
                        this.setData({
                            hideLeft: false,
                            hideCenter: true,
                        });
                    }
                    else {
                        this.setData({
                            hideLeft: false,
                            hideCenter: false,
                        });
                    }
                });
            },
            goBack() {
                const { delta } = this.data;
                const that = this;
                this.triggerEvent('go-back');
                if (delta > 0) {
                    wx.navigateBack({
                        delta,
                        fail(e) {
                            that.triggerEvent('fail', e);
                        },
                        complete(e) {
                            that.triggerEvent('complete', e);
                        },
                        success(e) {
                            that.triggerEvent('success', e);
                        },
                    });
                }
            },
        };
    }
    attached() {
        this.initStyle();
        this.getLeftRect();
        this.onMenuButtonBoundingClientRectWeightChange();
    }
    detached() {
        this.offMenuButtonBoundingClientRectWeightChange();
    }
};
Navbar = __decorate([
    wxComponent()
], Navbar);
export default Navbar;
