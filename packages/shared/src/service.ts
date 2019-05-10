export type Callback = (...params: any[]) => void;

export type CallHandler = (callback: Callback, ...params: any[]) => Promise<any>;

export type CallHandlerList = { [name: string]: CallHandler };

export interface CallSource {
  bind(name: string, handler: CallHandler): void;
  bind(handlers: CallHandlerList): void;
  unbind(name: string, handler: CallHandler): void;
}

export interface ServiceConstructor {
  new (source: CallSource): Service;
}

export abstract class Service {
  constructor(source: CallSource) {}
}
