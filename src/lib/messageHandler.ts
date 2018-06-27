export type messageResponseCallback = (...params: any[]) => void;

export abstract class MessageHandler {
  [key: string]: (callback: messageResponseCallback, ...params: any[]) => void;
}
