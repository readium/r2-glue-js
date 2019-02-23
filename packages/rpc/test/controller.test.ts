import { Message, MessageType } from '../src/message';
import { MessageInstance } from '../src/messageInstance';
import { Controller, SendMessageFunction } from '../src/controller';
import { testMessage } from './message.test';
import Mock = jest.Mock;

window.addEventListener = jest.fn();

class TestController extends Controller {
  constructor(namespace: string) {
    super(namespace);
  }

  public processMessage(message: Message, sendMessage: SendMessageFunction): void {}
}

const testController = new TestController(testMessage.namespace);

test('adds message event listener', () => {
  expect(window.addEventListener).toHaveBeenCalledWith('message', expect.any(Function));
});

describe('processing and responding to messages', () => {
  const testListener: EventListener = (window.addEventListener as Mock).mock.calls[0][1];

  test('should process message', () => {
    testController.processMessage = jest.fn();
    testListener({ data: testMessage } as MessageEvent);
    expect(testController.processMessage).toHaveBeenCalledWith(testMessage, expect.any(Function));
  });

  test('should not process an invalid message', () => {
    testController.processMessage = jest.fn();
    testListener({ data: { fruit: 'banana' } } as MessageEvent);
    expect(testController.processMessage).not.toBeCalled();
  });

  test('should post message back to source', () => {
    testController.processMessage = jest.fn();
    const postMessageCall = jest.fn();

    testListener({
      source: {
        postMessage: postMessageCall,
      } as any,
      data: testMessage,
      origin: 'example.com',
    } as MessageEvent);

    const sendMessageCallback: SendMessageFunction = (testController.processMessage as Mock).mock
      .calls[0][1];
    const postedMessage = {
      type: MessageType.Respond,
      key: 'retest',
      value: ['a', 'b', 'c'],
      correlationId: testMessage.correlationId,
    };

    sendMessageCallback(postedMessage.type, postedMessage.key, postedMessage.value);

    expect(postMessageCall).toBeCalledWith(expect.any(MessageInstance), 'example.com');

    const actualPostedMessage: Message = postMessageCall.mock.calls[0][0];
    expect(actualPostedMessage).toMatchObject(postedMessage);
  });
});
