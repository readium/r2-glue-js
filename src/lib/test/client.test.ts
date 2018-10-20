import { Client } from '../client';
import { IMessage, Message, MessageType } from '../message';
import { MessageCallback } from '../messageHandler';

const mockWindow = {
  postMessage: jest.fn(),
  location: { origin: 'example.com' },
};

const testNamespace = 'test-client';
const testMessage: IMessage = {
  key: 'ping',
  value: 'hello',
};

const expectedReturnResponse: IMessage = {
  ...testMessage,
  type: MessageType.Return,
  value: 'pong',
};
const expectedCallbackResponse: IMessage = {
  ...testMessage,
  type: MessageType.Callback,
  value: 'world',
};

class TestClient extends Client {
  constructor(targetWindow: any) {
    super(testNamespace, targetWindow);
  }

  public sendSync(message: IMessage): void {
    super.sendMessage(message.key, message.value);
  }
  public async sendAsync(message: IMessage, callback: MessageCallback): Promise<string> {
    return super.sendMessage(message.key, message.value, callback);
  }

  public processMessage(message: IMessage): void {
    super.processMessage(message);
  }
}

const testClient = new TestClient(mockWindow);

test('posts messages to target window', () => {
  testClient.sendSync(testMessage);
  const expectedPostedMessage = new Message(
    testNamespace,
    MessageType.Invoke,
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
  const sendPromise = testClient.sendAsync(testMessage, callback);

  // simulate the target responding
  const postMessageMock = mockWindow.postMessage.mock;
  const postedMessage = postMessageMock.calls[postMessageMock.calls.length - 1][0];
  const returnResponse = { ...postedMessage, ...expectedReturnResponse };
  testClient.processMessage(returnResponse);
  const callbackResponse = { ...postedMessage, ...expectedCallbackResponse };
  testClient.processMessage(callbackResponse);

  expect(await sendPromise).toBe(expectedReturnResponse.value);
  expect(callback).toHaveBeenCalledWith(expectedCallbackResponse.value);
});
