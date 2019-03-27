import { uuid } from './util';

export enum MessageType {
  Request = 'request',
  Respond = 'respond',
  Callback = 'callback',
}

type NewMessage = Partial<Message> & {
  type: MessageType;
  namespace: string,
  name: string;
  payload: any;
};

export class Message {
  public readonly protocol: string;

  public readonly correlationId: string;
  public readonly type: MessageType;

  public readonly namespace: string;
  public readonly name: string;
  public readonly payload: any;

  constructor(newMessage: NewMessage) {
    this.type = newMessage.type;

    this.namespace = newMessage.namespace;
    this.name = newMessage.name;
    this.payload = newMessage.payload;

    this.correlationId = newMessage.correlationId || uuid();
  }
}
