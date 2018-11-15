import { uuid } from './util';
import { Message, MessageType } from './message';

const PROTOCOL_NAME = 'r2-glue-js';
const PROTOCOL_VERSION = '1.0.0';

export class HandledMessage implements Message {
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

    this.correlationId = correlationId || uuid();

    this.protocol = PROTOCOL_NAME;
    this.version = PROTOCOL_VERSION;
  }

  public static validate(message: Message): boolean {
    return !!message.protocol && message.protocol === PROTOCOL_NAME;
  }
}
