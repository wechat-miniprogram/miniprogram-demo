import { SuperComponent } from '../common/src/index';
export default class CountDown extends SuperComponent {
    externalClasses: string[];
    properties: import("./type").TdCountDownProps;
    observers: {
        time(): void;
    };
    data: {
        prefix: string;
        classPrefix: string;
        timeDataUnit: {
            DD: string;
            HH: string;
            mm: string;
            ss: string;
            SSS: string;
        };
        timeData: import("./utils").TimeData;
        formattedTime: string;
    };
    timeoutId: null | number;
    lifetimes: {
        detached(): void;
    };
    methods: {
        start(): void;
        pause(): void;
        reset(): void;
        getTime(): number;
        updateTime(remain: number): void;
        doCount(): void;
    };
}
