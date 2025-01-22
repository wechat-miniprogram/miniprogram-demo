export default class Bus {
    listeners: Map<string, any>;
    emitted: Set<string>;
    constructor();
    on(evtName: string, listener: any): void;
    emit(evtName: string): void;
}
