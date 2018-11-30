import { Caller } from '../src/caller';
import { Message, MessageType } from '../src/message';
import { CallbackFunction } from '../src/executor';
import { HandledMessage } from '../src/handledMessage';

const mockWindow = {
  postMessage: jest.fn(),
  location: { origin: 'example.com' },
};

const testNamespace = 'test-client';
const testMessage: Message = {
  key: 'ping',
  value: 'hello',
};

const expectedResponse: Message = {
  ...testMessage,
  type: MessageType.Respond,
  value: 'pong',
};
const expectedCallbackResponse: Message = {
  ...testMessage,
  type: MessageType.Callback,
  value: 'world',
};

class TestCaller extends Caller {
  constructor(targetWindow: any) {
    super(testNamespace, targetWindow);
  }

  public sendSync(message: Message): void {
    super.sendMessage(message.key, testMessage.value);
  }

  public async sendAsync(message: Message, callback: CallbackFunction): Promise<string> {
    return super.sendMessage(message.key, message.value, callback);
  }

  public processMessage(message: Message): void {
    super.processMessage(message);
  }
}

const testCaller = new TestCaller(mockWindow);

test('posts messages to target window', () => {
  testCaller.sendSync(testMessage);
  const expectedPostedMessage = new HandledMessage(
    testNamespace,
    MessageType.Request,
    testMessage.key,
    testMessage.value,
  );
  expect(mockWindow.postMessage).toHaveBeenCalledWith(
    expect.objectContaining({ ...expectedPostedMessage, correlationId: expect.anything() }),
    mockWindow.location.origin,
  );
});

test('handles messages from target window', async () => {
  const callback = jest.fn();
  const sendPromise = testCaller.sendAsync(testMessage, callback);

  // simulate the target responding
  const postMessageMock = mockWindow.postMessage.mock;
  const postedMessage = postMessageMock.calls[postMessageMock.calls.length - 1][0];
  const response = { ...postedMessage, ...expectedResponse };
  testCaller.processMessage(response);
  const callbackResponse = { ...postedMessage, ...expectedCallbackResponse };
  testCaller.processMessage(callbackResponse);

  expect(await sendPromise).toBe(expectedResponse.value);
  expect(callback).toHaveBeenCalledWith(expectedCallbackResponse.value);
});
