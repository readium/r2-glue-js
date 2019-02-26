import { uuid } from './util';

export enum MessageType {
  Request = 'request',
  Respond = 'respond',
  Callback = 'callback',
}

const PROTOCOL_NAME = 'readium-glue';

export class Message {
  public readonly protocol: string;

  public readonly correlationId: string;

  public readonly namespace: string;
  public readonly type: MessageType;

  public readonly key: string;
  public readonly value: any;

  constructor(
    namespace: string,
    type: MessageType,
    key: string,
    value: any,
    correlationId?: string,
  ) {
    this.namespace = namespace;
    this.type = type;

    this.key = key;
    this.value = value;

    this.correlationId = correlationId || uuid();

    this.protocol = PROTOCOL_NAME;
  }

  public static validate(message: Message): boolean {
    return !!message.protocol && message.protocol === PROTOCOL_NAME;
  }
}
