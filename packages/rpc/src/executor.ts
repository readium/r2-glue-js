export type CallbackFunction = (...params: any[]) => void;

export type MessageHandlingDeclarations = {
  [key: string]: (callback: CallbackFunction, ...params: any[]) => Promise<any>;
};

export abstract class Executor {
  public abstract handlers: MessageHandlingDeclarations;
}
