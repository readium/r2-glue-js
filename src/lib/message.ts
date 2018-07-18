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
  readonly type: MessageType;

  readonly name: string;
  readonly parameters: any[];
}

export class Message implements IMessage {
  public readonly protocol: string;
  public readonly version: string;

  public readonly correlationId: string;

  public readonly namespace: string;
  public readonly type: MessageType;

  public readonly name: string;
  public readonly parameters: any[];

  constructor(
    namespace: string,
    type: MessageType,
    name: string,
    parameters: any[],
    correlationId?: string,
  ) {
    this.namespace = namespace;
    this.type = type;

    this.name = name;
    this.parameters = parameters;

    this.correlationId = correlationId || uuid();

    this.protocol = PROTOCOL_NAME;
    this.version = PROTOCOL_VERSION;
  }

  public static validate(message: IMessage): boolean {
    return !!message.protocol && message.protocol === PROTOCOL_NAME;
  }
}
