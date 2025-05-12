export default class Bus {
    constructor() {
        this.listeners = new Map();
        this.emitted = new Set();
    }
    on(evtName, listener) {
        if (this.emitted.has(evtName)) {
            listener();
            return;
        }
        const target = this.listeners.get(evtName) || [];
        target.push(listener);
        this.listeners.set(evtName, target);
    }
    emit(evtName) {
        const listeners = this.listeners.get(evtName);
        if (listeners) {
            listeners.forEach((func) => func());
        }
        this.emitted.add(evtName);
    }
}
