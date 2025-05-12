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
        };
        this.methods = {
            queryElements(capsuleRect) {
                Promise.all([
                    getRect(this, `.${this.data.classPrefix}__left`),
                    getRect(this, `.${this.data.classPrefix}__center`),
                ]).then(([leftRect, centerRect]) => {
                    if (leftRect.right > capsuleRect.left) {
                        this.setData({
                            hideLeft: true,
                            hideCenter: true,
                        });
                    }
                    else if (centerRect.right > capsuleRect.left) {
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
        return __awaiter(this, void 0, void 0, function* () {
            let rect = null;
            if (wx.getMenuButtonBoundingClientRect) {
                rect = wx.getMenuButtonBoundingClientRect();
            }
            if (!rect || !systemInfo)
                return;
            const { right } = yield getRect(this, `.${name}__left`);
            const boxStyleList = [];
            boxStyleList.push(`--td-navbar-padding-top: ${systemInfo.statusBarHeight}px`);
            if (rect && (systemInfo === null || systemInfo === void 0 ? void 0 : systemInfo.windowWidth)) {
                const maxSpacing = Math.max(right, systemInfo.windowWidth - rect.left);
                boxStyleList.push(`--td-navbar-center-left: ${maxSpacing}px`);
                boxStyleList.push(`--td-navbar-center-width: ${rect.left - maxSpacing}px`);
                boxStyleList.push(`--td-navbar-right: ${systemInfo.windowWidth - rect.left}px`);
            }
            boxStyleList.push(`--td-navbar-capsule-height: ${rect.height}px`);
            boxStyleList.push(`--td-navbar-capsule-width: ${rect.width}px`);
            boxStyleList.push(`--td-navbar-height: ${(rect.top - systemInfo.statusBarHeight) * 2 + rect.height}px`);
            this.setData({
                boxStyle: `${boxStyleList.join('; ')}`,
            });
            if (wx.onMenuButtonBoundingClientRectWeightChange) {
                wx.onMenuButtonBoundingClientRectWeightChange((res) => this.queryElements(res));
            }
        });
    }
    detached() {
        if (wx.offMenuButtonBoundingClientRectWeightChange) {
            wx.offMenuButtonBoundingClientRectWeightChange((res) => this.queryElements(res));
        }
    }
};
Navbar = __decorate([
    wxComponent()
], Navbar);
export default Navbar;
