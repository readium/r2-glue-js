export type MessageResponseCallback = (...params: any[]) => void;
export type MessageResponders = {
  [key: string]: (callback: MessageResponseCallback, ...params: any[]) => void;
};
export abstract class MessageHandler {
  public abstract declarations: MessageResponders;
}
