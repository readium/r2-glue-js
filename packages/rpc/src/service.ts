export type GlueCallback = (...params: any[]) => void;

export type CallHandler = (callback: GlueCallback, ...params: any[]) => Promise<any>;

export type CallHandlerList = { [name: string] : CallHandler };

export interface CallSource {
  bind(name: string, handler: CallHandler): void;
  bind(handlers: CallHandlerList): void;
  unbind(name: string, handler: CallHandler): void;
}

export interface GlueServiceConstructor {
  new (source: CallSource): GlueService;
}

export abstract class GlueService {
  constructor(source: CallSource) {}
}
