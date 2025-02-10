import { SuperComponent } from './superComponent';
export declare const toComponent: (options: Record<string, any>) => Record<string, any>;
export declare const wxComponent: () => (constructor: new () => SuperComponent) => void;
