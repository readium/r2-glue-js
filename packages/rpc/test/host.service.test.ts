import { CallSource, Callback, CallHandler } from '@readium/glue-shared';

import { Host } from '../src/host';
import { MessageType, Message } from '../src/message';
import { SendMessageFunction } from '../src/controller';

window.addEventListener = jest.fn();

const echoHandlerMock = jest.fn(async (_cb: Callback, str: string) => {
  return str;
});

const fruitHandlerMock = jest.fn(async (cb: Callback, _str: string) => {
  cb('tomato');
  return 'banana';
});

let bindServiceHandlers: () => void;
let unbindServiceHandlers: () => void;
let testServiceSource: CallSource;

const testServiceMock = jest.fn().mockImplementation((source: CallSource) => {
  testServiceSource = source;

  bindServiceHandlers = () => {
    source.bind('SEND_ECHO', echoHandlerMock as CallHandler);
    source.bind({
      SEND_FRUIT: fruitHandlerMock,
    });
  };

  unbindServiceHandlers = () => {
    source.unbind('SEND_ECHO', echoHandlerMock as CallHandler);
    source.unbind('SEND_FRUIT', fruitHandlerMock as CallHandler);
  };

  bindServiceHandlers();
});

const echoMessageRequest = new Message({
  type: MessageType.Request,
  namespace: 'cosmos',
  name: 'SEND_ECHO',
  payload: ['sendmorechuckberry'],
});

const echoMessageResponse = new Message({
  type: MessageType.Respond,
  namespace: 'cosmos',
  name: 'SEND_ECHO',
  payload: 'sendmorechuckberry',
});

const fruitMessageRequest = new Message({
  type: MessageType.Request,
  namespace: 'cosmos',
  name: 'SEND_FRUIT',
  payload: [],
});

const fruitMessageResponse = new Message({
  type: MessageType.Respond,
  namespace: 'cosmos',
  name: 'SEND_FRUIT',
  payload: 'banana',
});

const fruitMessageCallback = new Message({
  type: MessageType.Respond,
  namespace: 'cosmos',
  name: 'SEND_FRUIT',
  payload: 'banana',
});

class TestHost extends Host {
  public processMessage(message: Message, sendMessage: SendMessageFunction): void {
    super.processMessage(message, sendMessage);
  }
}

const testHost = new TestHost('cosmos', testServiceMock);

test('host init with new service instance', () => {
  expect(testServiceMock).toBeCalled();
});

const echoHandlerTest = () => {
  const sendMessageMock = jest.fn();
  testHost.processMessage(echoMessageRequest, sendMessageMock);

  expect(echoHandlerMock).toBeCalled();
  echoHandlerMock.mockClear();

  setImmediate(() => {
    expect(sendMessageMock).toBeCalledWith(
      echoMessageResponse.type,
      echoMessageResponse.name,
      echoMessageResponse.payload,
    );
  });
};

test('binds a function to a response message', echoHandlerTest);

test('binds a function to a response and callback message', () => {
  const sendMessageMock = jest.fn();
  testHost.processMessage(
    fruitMessageRequest,
    (type: MessageType, name: string, parameters: any[]) => {
      debugger;
      sendMessageMock(type, name, parameters);
    },
  );

  expect(fruitHandlerMock).toBeCalled();
  fruitHandlerMock.mockClear();

  setImmediate(() => {
    expect(sendMessageMock).toBeCalledWith(
      fruitMessageCallback.type,
      fruitMessageCallback.name,
      fruitMessageCallback.payload,
    );
    expect(sendMessageMock).toBeCalledWith(
      fruitMessageResponse.type,
      fruitMessageResponse.name,
      fruitMessageResponse.payload,
    );
  });
});

const nullHandlerTest = () => {
  const sendMessageMock = jest.fn();
  testHost.processMessage(echoMessageRequest, sendMessageMock);
  expect(echoHandlerMock).not.toBeCalled();
  setImmediate(() => {
    expect(sendMessageMock).not.toBeCalled();
  });
};

test('unbinds a previously bound message handler', () => {
  unbindServiceHandlers();
  nullHandlerTest();
});

test('rebinds message handlers', () => {
  bindServiceHandlers();
  echoHandlerTest();
});

test('host skips non-request messages', () => {
  const sendMessageMock = jest.fn();
  testHost.processMessage(
    new Message({
      type: MessageType.Respond,
      namespace: '',
      name: '',
      payload: null,
    }),
    sendMessageMock,
  );
  testHost.processMessage(
    new Message({
      type: MessageType.Callback,
      namespace: '',
      name: '',
      payload: null,
    }),
    sendMessageMock,
  );

  expect(sendMessageMock).not.toBeCalled();
});

test('host stops all handling when destroyed', () => {
  testHost.destroy();
  nullHandlerTest();
});
