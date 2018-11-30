export enum MessageType {
  Request = 'request',
  Respond = 'respond',
  Callback = 'callback',
}

export interface Message {
  readonly protocol?: string;

  readonly correlationId?: string;

  readonly namespace?: string;
  readonly type?: MessageType;

  readonly key: string;
  readonly value: any;
}
