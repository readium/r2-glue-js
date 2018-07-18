export type MessageCallback = (...params: any[]) => void;
export type MessageResponders = {
  [key: string]: (callback: MessageCallback, ...params: any[]) => Promise<any>;
};
export abstract class MessageHandler {
  public abstract declarations: MessageResponders;
}
