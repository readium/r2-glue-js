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

const expectedReplyResponse: IMessage = {
  ...testMessage,
  type: MessageType.Reply,
  value: 'pong',
};
const expectedYieldResponse: IMessage = {
  ...testMessage,
  type: MessageType.Yield,
  value: 'world',
};

class TestClient extends Client {
  constructor(targetWindow: any) {
    super(testNamespace, targetWindow);
  }

  public sendSync(message: IMessage): void {
    super.sendMessage(message.key, testMessage.value);
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
    MessageType.Call,
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
  const replyResponse = { ...postedMessage, ...expectedReplyResponse };
  testClient.processMessage(replyResponse);
  const yieldResponse = { ...postedMessage, ...expectedYieldResponse };
  testClient.processMessage(yieldResponse);

  expect(await sendPromise).toBe(expectedReplyResponse.value);
  expect(callback).toHaveBeenCalledWith(expectedYieldResponse.value);
});
