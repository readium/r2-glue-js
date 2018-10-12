import { uuid } from './util';

const PROTOCOL_NAME = 'r2-glue-js';
const PROTOCOL_VERSION = '1.0.0';

export enum MessageType {
  Call = 'call',
  Reply = 'reply',
  Yield = 'yield',
}

export interface IMessage {
  readonly protocol?: string;
  readonly version?: string;

  readonly correlationId?: string;

  readonly namespace?: string;
  readonly type?: MessageType;

  readonly key: string;
  readonly value: any;
}

let messageCount = 0;

export class Message implements IMessage {
  public readonly protocol: string;
  public readonly version: string;

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

    this.correlationId = correlationId || `${messageCount}`; // uuid();
    messageCount += 1;

    this.protocol = PROTOCOL_NAME;
    this.version = PROTOCOL_VERSION;
  }

  public static validate(message: IMessage): boolean {
    return !!message.protocol && message.protocol === PROTOCOL_NAME;
  }
}
