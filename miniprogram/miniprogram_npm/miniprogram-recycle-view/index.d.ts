declare namespace recycleContext {
    interface itemSize {
        width: number;
        height: number;
    }
    
    type Component = any;
    type Page = any;
    
    type itemSizeFunc<T> = (item: T, index: number) => itemSize
    
    interface options<T> {
        id: string;
        dataKey: string;
        page: Component | Page;
        itemSize: itemSizeFunc<T> | itemSize;
        useInPage?: boolean;
        root?: Page;
    }
    
    interface position {
        left: number;
        top: number;
        width: number;
        height: number;
    }
    
    interface RecycleContext<T> {
        append(list: T[], callback?: () => void): RecycleContext<T>
        appendList(list: T[], callback?: () => void): RecycleContext<T>
        splice(begin: number, deleteCount: number, appendList: T[], callback?: () => void): RecycleContext<T>;
        updateList(beginIndex: number, list: T[], callback?: () => void): RecycleContext<T>
        update(beginIndex: number, list: T[], callback?: () => void): RecycleContext<T>
        destroy(): RecycleContext<T>
        forceUpdate(callback: () => void, reinitSlot: boolean): RecycleContext<T>
        getBoundingClientRect(index: number | undefined): position | position[]
        getScrollTop(): number;
        transformRpx(rpx: number, addPxSuffix?: string): number;
        getViewportItems(inViewportPx: number): T[]
        getList(): T[]
    }
}
declare function createRecycleContext<T>(op: recycleContext.options<T>): recycleContext.RecycleContext<T>

export = createRecycleContext;