import { SuperComponent, RelationsOptions } from '../common/src/index';
import { TdTabsProps } from './type';
export interface TabsProps extends TdTabsProps {
}
export default class Tabs extends SuperComponent {
    options: {
        pureDataPattern: RegExp;
    };
    behaviors: string[];
    externalClasses: string[];
    relations: RelationsOptions;
    properties: TdTabsProps;
    controlledProps: {
        key: string;
        event: string;
    }[];
    observers: {
        value(name: any): void;
    };
    data: {
        prefix: string;
        classPrefix: string;
        tabs: any[];
        currentLabels: any[];
        currentIndex: number;
        trackStyle: string;
        offset: number;
        scrollLeft: number;
        tabID: string;
        placement: string;
    };
    lifetimes: {
        created(): void;
        attached(): void;
    };
    initChildId(): void;
    methods: {
        onScroll(e: any): void;
        updateTabs(cb: any): void;
        setCurrentIndexByName(name: any): void;
        setCurrentIndex(index: number): void;
        getCurrentName(): any;
        calcScrollOffset(containerWidth: number, targetLeft: number, targetWidth: number, offset: number): number;
        getTabHeight(): Promise<any>;
        getTrackSize(): Promise<number>;
        setTrack(): Promise<void>;
        onTabTap(event: any): void;
        onTouchStart(event: any): void;
        onTouchMove(event: any): void;
        onTouchEnd(): void;
        onTouchScroll(event: WechatMiniprogram.CustomEvent): void;
        changeIndex(index: any): void;
        getAvailableTabIndex(deltaX: number): any;
    };
}
