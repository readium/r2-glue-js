import { Dispatcher } from '../src/dispatcher';
import { Executor, MessageSource, CallbackFunction } from '../src/executor';
import { MessageType, Message } from '../src/message';
import { HandledMessage } from '../src/handledMessage';
import { SendMessageFunction } from '../src/controller';

window.addEventListener = jest.fn();

class TestHandler extends Executor {
  constructor(messageSource: MessageSource) {
    super(messageSource);
    // TODO: Use a mock here as the handler
    messageSource.addListener('SEND_ECHO', this._handleEcho);
  }

  private async _handleEcho(cb: CallbackFunction, str: string): Promise<string> {
    // TODO: Mock this
    return str;
  }
}

const messageRequest = new HandledMessage('echo', MessageType.Request, 'SEND_ECHO', [
  'sendchuckberry',
]);

const messageResponse = new HandledMessage(
  'echo',
  MessageType.Respond,
  'SEND_ECHO',
  'sendchuckberry',
);

class TestDispatcher extends Dispatcher {
  public processMessage(message: Message, sendMessage: SendMessageFunction): void {
    // TODO: Mock this
    super.processMessage(message, sendMessage);
  }
}

const testDispatcher = new TestDispatcher('echo', TestHandler);

test.skip('init with executor', () => {
  // TODO: Implement tests
  // TODO: Test processing requests, skipping responses
});
