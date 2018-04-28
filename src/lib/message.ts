import { uuid } from './util';

const PROTOCOL_NAME = 'r2-glue-js';
const PROTOCOL_VERSION = '1.0.0';

export interface IMessage {
  readonly protocol?: string;
  readonly version?: string;
  readonly namespace?: string;

  readonly type: string;
  readonly parameters: any[];
  readonly correlationId?: string;
}

export class Message implements IMessage {
  public readonly type: string;
  public readonly parameters: any[];
  public readonly protocol: string;
  public readonly version: string;
  public readonly correlationId: string;

  constructor(type: string, parameters: any[]) {
    this.type = type;
    this.parameters = parameters;
    this.protocol = PROTOCOL_NAME;
    this.version = PROTOCOL_VERSION;
    this.correlationId = uuid();
  }

  public static validate(message: IMessage): boolean {
    return !!message.protocol && message.protocol === name;
  }
}

export interface IMessageEvent extends MessageEvent {
  readonly data: IMessage;
}
