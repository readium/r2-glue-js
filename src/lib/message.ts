import { uuid } from './util';

const PROTOCOL_NAME = 'r2-glue-js';
const PROTOCOL_VERSION = '1.0.0';

export interface IMessage {
  readonly protocol?: string;
  readonly version?: string;

  readonly correlationId?: string;

  readonly namespace?: string;
  readonly type: string;
  readonly parameters: any[];
}

export class Message implements IMessage {
  public readonly namespace: string;
  public readonly type: string;
  public readonly parameters: any[];

  public readonly correlationId: string;

  public readonly protocol: string;
  public readonly version: string;

  constructor(namespace: string, type: string, parameters: any[], correlationId?: string) {
    this.namespace = namespace;
    this.type = type;
    this.parameters = parameters;

    this.correlationId = correlationId || uuid();

    this.protocol = PROTOCOL_NAME;
    this.version = PROTOCOL_VERSION;
  }

  public static validate(message: IMessage): boolean {
    return !!message.protocol && message.protocol === PROTOCOL_NAME;
  }
}

export interface IMessageEvent extends MessageEvent {
  readonly data: IMessage;
}
