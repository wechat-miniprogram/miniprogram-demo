var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { SuperComponent, wxComponent } from '../common/src/index';
import config from '../common/config';
import props from './props';
import { getRect } from '../common/utils';
const { prefix } = config;
const name = `${prefix}-collapse-panel`;
let CollapsePanel = class CollapsePanel extends SuperComponent {
    constructor() {
        super(...arguments);
        this.externalClasses = [`${prefix}-class`, `${prefix}-class-content`, `${prefix}-class-header`];
        this.options = {
            multipleSlots: true,
        };
        this.relations = {
            '../collapse/collapse': {
                type: 'ancestor',
                linked(target) {
                    const { value, expandIcon, disabled } = target.properties;
                    this.setData({
                        ultimateExpandIcon: this.properties.expandIcon == null ? expandIcon : this.properties.expandIcon,
                        ultimateDisabled: this.properties.disabled == null ? disabled : this.properties.disabled,
                    });
                    this.updateExpanded(value);
                },
            },
        };
        this.properties = props;
        this.data = {
            prefix,
            expanded: false,
            classPrefix: name,
            classBasePrefix: prefix,
            ultimateExpandIcon: false,
            ultimateDisabled: false,
        };
        this.observers = {
            disabled(v) {
                this.setData({ ultimateDisabled: !!v });
            },
        };
        this.methods = {
            updateExpanded(activeValues = []) {
                if (!this.$parent) {
                    return;
                }
                const { value } = this.properties;
                const { defaultExpandAll } = this.$parent.data;
                const expanded = defaultExpandAll ? !this.data.expanded : activeValues.includes(value);
                if (expanded === this.properties.expanded)
                    return;
                this.setData({ expanded });
                this.updateStyle(expanded);
            },
            updateStyle(expanded) {
                return getRect(this, `.${name}__content`)
                    .then((rect) => rect.height)
                    .then((height) => {
                    const animation = wx.createAnimation({
                        duration: 0,
                        timingFunction: 'ease-in-out',
                    });
                    if (expanded) {
                        animation.height(height).top(0).step({ duration: 300 }).height('auto').step();
                    }
                    else {
                        animation.height(height).top(1).step({ duration: 1 }).height(0).step({ duration: 300 });
                    }
                    this.setData({ animation: animation.export() });
                });
            },
            onClick() {
                const { ultimateDisabled } = this.data;
                const { value } = this.properties;
                if (ultimateDisabled)
                    return;
                if (this.$parent.data.defaultExpandAll) {
                    this.updateExpanded();
                }
                else {
                    this.$parent.switch(value);
                }
            },
        };
    }
};
CollapsePanel = __decorate([
    wxComponent()
], CollapsePanel);
export default CollapsePanel;
