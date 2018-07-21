import { IMessage, Message, MessageType } from '../message';

import { Receiver, sendMessage } from '../receiver';
import Mock = jest.Mock;

window.addEventListener = jest.fn();

class ReceiverTest extends Receiver {
  public constructor(namespace: string) {
    super(namespace);
  }

  public processMessage(message: IMessage, sendMessage: sendMessage): void {}
}

const testMessage = new Message('namespace', MessageType.Call, 'test', [0, 1, 2, 3]);
const testReceiver = new ReceiverTest(testMessage.namespace);

test('adds message event listener', () => {
  expect(window.addEventListener).toHaveBeenCalledWith('message', expect.any(Function));
});

describe('processing and responding to messages', () => {
  const testListener: EventListener = (window.addEventListener as Mock).mock.calls[0][1];

  test('should process message', () => {
    testReceiver.processMessage = jest.fn();
    testListener({ data: testMessage } as MessageEvent);
    expect(testReceiver.processMessage).toHaveBeenCalledWith(testMessage, expect.any(Function));
  });

  test('should not process an invalid message', () => {
    testReceiver.processMessage = jest.fn();
    testListener({ data: { fruit: 'banana' } } as MessageEvent);
    expect(testReceiver.processMessage).not.toBeCalled();
  });

  test('should post message back to source', () => {
    testReceiver.processMessage = jest.fn();
    const postMessageCall = jest.fn();

    testListener({
      source: {
        postMessage: postMessageCall,
      } as any,
      data: testMessage,
      origin: 'example.com',
    } as MessageEvent);

    const sendMessageCallback: sendMessage = (testReceiver.processMessage as Mock).mock.calls[0][1];
    const expectedPostedMessage: IMessage = {
      type: MessageType.Reply,
      name: 'retest',
      parameters: ['a', 'b', 'c'],
      correlationId: testMessage.correlationId,
    };

    sendMessageCallback(
      expectedPostedMessage.type,
      expectedPostedMessage.name,
      expectedPostedMessage.parameters,
    );

    expect(postMessageCall).toBeCalledWith(expect.any(Message), 'example.com');

    const actualPostedMessage: IMessage = postMessageCall.mock.calls[0][0];
    expect(actualPostedMessage).toMatchObject(expectedPostedMessage);
  });
});
