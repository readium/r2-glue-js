import { GlueHost } from '../src/host';
import { GlueService, CallSource, GlueCallback } from '../src/service';
import { MessageType, Message } from '../src/message';
import { SendMessageFunction } from '../src/controller';

window.addEventListener = jest.fn();

class TestService extends GlueService {
  constructor(source: CallSource) {
    super(source);
    // TODO: Use a mock here as the handler
    source.bind('SEND_ECHO', this._handleEcho);
  }

  private async _handleEcho(cb: GlueCallback, str: string): Promise<string> {
    // TODO: Mock this
    return str;
  }
}

const messageRequest = new Message({
  type: MessageType.Request,
  namespace: 'echo',
  name: 'SEND_ECHO',
  payload: ['sendchuckberry'],
});

const messageResponse = new Message({
  type: MessageType.Respond,
  namespace: 'echo',
  name: 'SEND_ECHO',
  payload: 'sendchuckberry',
});

class TestHost extends GlueHost {
  public processMessage(message: Message, sendMessage: SendMessageFunction): void {
    // TODO: Mock this
    super.processMessage(message, sendMessage);
  }
}

const testDispatcher = new TestHost('echo', TestService);

test.skip('init with executor', () => {
  // TODO: Implement tests
  // TODO: Test processing requests, skipping responses
});

test.skip('binds a function', () => {
  // TODO
});

test.skip('binds to multiple functions', () => {
  // TODO
});
