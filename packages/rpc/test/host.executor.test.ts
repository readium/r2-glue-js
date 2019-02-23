import { GlueHost } from '../src/host';
import { GlueService, CallSource, CallbackFunction } from '../src/service';
import { MessageType, Message } from '../src/message';
import { MessageInstance } from '../src/messageInstance';
import { SendMessageFunction } from '../src/controller';

window.addEventListener = jest.fn();

class TestService extends GlueService {
  constructor(source: CallSource) {
    super(source);
    // TODO: Use a mock here as the handler
    source.bind('SEND_ECHO', this._handleEcho);
  }

  private async _handleEcho(cb: CallbackFunction, str: string): Promise<string> {
    // TODO: Mock this
    return str;
  }
}

const messageRequest = new MessageInstance('echo', MessageType.Request, 'SEND_ECHO', [
  'sendchuckberry',
]);

const messageResponse = new MessageInstance(
  'echo',
  MessageType.Respond,
  'SEND_ECHO',
  'sendchuckberry',
);

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
