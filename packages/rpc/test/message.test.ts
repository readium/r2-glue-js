import { MessageType } from '../message';
import { HandledMessage } from '../handledMessage';

export const testMessage = new HandledMessage('namespace', MessageType.Request, 'test', [
  0,
  1,
  2,
  3,
]);

test('message has unique correlation identifier', () => {
  const duplicatedMessage = new HandledMessage(
    testMessage.namespace,
    testMessage.type,
    testMessage.key,
    testMessage.value,
  );

  expect(testMessage.correlationId).not.toBe(duplicatedMessage.correlationId);
});

test('message uses provided correlation identifier', () => {
  const messageWithCorrelationId = new HandledMessage(
    testMessage.namespace,
    testMessage.type,
    testMessage.key,
    testMessage.value,
    'foobar',
  );

  expect(messageWithCorrelationId.correlationId).toBe('foobar');
});

test('validates message', () => {
  const invalidMessage = { fruit: 'banana' };
  // @ts-ignore
  expect(HandledMessage.validate(invalidMessage)).toBe(false);
  expect(HandledMessage.validate(testMessage)).toBe(true);
});
