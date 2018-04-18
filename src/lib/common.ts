export interface IMessage<T> {
  readonly uuid?: string;
  // tslint:disable-next-line:no-reserved-keywords
  readonly type: T;
  readonly args: {}[];
}

export interface IMessageEvent<T> extends MessageEvent {
  readonly data: IMessage<T>;
}

export type IMessageCallback<T> = (message: IMessage<T>) => void;
