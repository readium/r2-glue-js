import { Callback } from '../../shared/src';

import { Caller } from '../src/caller';
import { Message, MessageType } from '../src/message';

type PartialMessage = Partial<Message> & {
  type: MessageType;
  name: string;
  payload: any;
};

const mockWindow = {
  postMessage: jest.fn(),
  location: { origin: 'example.com' },
};

const testNamespace = 'test-client';
const testMessage: PartialMessage = {
  type: MessageType.Request,
  name: 'ping',
  payload: 'hello',
};

const expectedResponse: PartialMessage = {
  ...testMessage,
  type: MessageType.Respond,
  payload: 'pong',
};

const expectedCallbackResponse: PartialMessage = {
  ...testMessage,
  type: MessageType.Callback,
  payload: 'world',
};

class TestCaller extends Caller {
  constructor(targetWindow: any) {
    super(testNamespace, targetWindow);
  }

  public callSync(name: string, params: any): void {
    super.call(name, params);
  }

  public async callAsync(name: string, params: any, callback: Callback): Promise<string> {
    return super.call(name, params, callback);
  }

  public processMessage(message: Message): void {
    super.processMessage(message);
  }
}

const testCaller = new TestCaller(mockWindow);

test('posts messages to target window', () => {
  testCaller.callSync(testMessage.name, testMessage.payload);
  const expectedPostedMessage = new Message({
    ...testMessage,
    namespace: testNamespace,
  });
  expect(mockWindow.postMessage).toHaveBeenCalledWith(
    expect.objectContaining({ ...expectedPostedMessage, correlationId: expect.anything() }),
    mockWindow.location.origin,
  );
});

test('handles messages from target window', async () => {
  const callback = jest.fn();
  const sendPromise = testCaller.callAsync(testMessage.name, testMessage.payload, callback);

  // simulate the target responding
  const postMessageMock = mockWindow.postMessage.mock;
  const postedMessage = postMessageMock.calls[postMessageMock.calls.length - 1][0];
  const response = { ...postedMessage, ...expectedResponse };
  testCaller.processMessage(response);
  const callbackResponse = { ...postedMessage, ...expectedCallbackResponse };
  testCaller.processMessage(callbackResponse);

  expect(await sendPromise).toBe(expectedResponse.payload);
  expect(callback).toHaveBeenCalledWith(expectedCallbackResponse.payload);
});
