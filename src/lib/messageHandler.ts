// tslint:disable-next-line:no-any
export type IMessageResponse = (messageType: string, ...params: any[]) => void;

export abstract class MessageHandler {
  [key: string]: (
    callback: IMessageResponse,
    // tslint:disable-next-line:no-any
    ...params: any[],
  ) => void;
}
