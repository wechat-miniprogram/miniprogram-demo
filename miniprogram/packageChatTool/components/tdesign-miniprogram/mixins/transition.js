import config from '../common/config';
const { prefix } = config;
export default function transition() {
    return Behavior({
        properties: {
            visible: {
                type: Boolean,
                value: null,
                observer: 'watchVisible',
            },
            appear: Boolean,
            name: {
                type: String,
                value: 'fade',
            },
            durations: {
                type: Number,
                optionalTypes: [Array],
            },
        },
        data: {
            transitionClass: '',
            transitionDurations: 300,
            className: '',
            realVisible: false,
        },
        created() {
            this.status = '';
            this.transitionT = 0;
        },
        attached() {
            this.durations = this.getDurations();
            if (this.data.visible) {
                this.enter();
            }
            this.inited = true;
        },
        detached() {
            clearTimeout(this.transitionT);
        },
        methods: {
            watchVisible(curr, prev) {
                if (this.inited && curr !== prev) {
                    curr ? this.enter() : this.leave();
                }
            },
            getDurations() {
                const { durations } = this.data;
                if (Array.isArray(durations)) {
                    return durations.map((item) => Number(item));
                }
                return [Number(durations), Number(durations)];
            },
            enter() {
                const { name } = this.data;
                const [duration] = this.durations;
                this.status = 'entering';
                this.setData({
                    realVisible: true,
                    transitionClass: `${prefix}-${name}-enter ${prefix}-${name}-enter-active`,
                });
                setTimeout(() => {
                    this.setData({
                        transitionClass: `${prefix}-${name}-enter-active ${prefix}-${name}-enter-to`,
                    });
                }, 30);
                if (typeof duration === 'number' && duration > 0) {
                    this.transitionT = setTimeout(this.entered.bind(this), duration + 30);
                }
            },
            entered() {
                this.customDuration = false;
                clearTimeout(this.transitionT);
                this.status = 'entered';
                this.setData({
                    transitionClass: '',
                });
            },
            leave() {
                const { name } = this.data;
                const [, duration] = this.durations;
                this.status = 'leaving';
                this.setData({
                    transitionClass: `${prefix}-${name}-leave  ${prefix}-${name}-leave-active`,
                });
                clearTimeout(this.transitionT);
                setTimeout(() => {
                    this.setData({
                        transitionClass: `${prefix}-${name}-leave-active ${prefix}-${name}-leave-to`,
                    });
                }, 30);
                if (typeof duration === 'number' && duration > 0) {
                    this.customDuration = true;
                    this.transitionT = setTimeout(this.leaved.bind(this), duration + 30);
                }
            },
            leaved() {
                this.customDuration = false;
                this.triggerEvent('leaved');
                clearTimeout(this.transitionT);
                this.status = 'leaved';
                this.setData({
                    transitionClass: '',
                });
            },
            onTransitionEnd() {
                if (this.customDuration) {
                    return;
                }
                clearTimeout(this.transitionT);
                if (this.status === 'entering' && this.data.visible) {
                    this.entered();
                }
                else if (this.status === 'leaving' && !this.data.visible) {
                    this.leaved();
                    this.setData({
                        realVisible: false,
                    });
                }
            },
        },
    });
}
