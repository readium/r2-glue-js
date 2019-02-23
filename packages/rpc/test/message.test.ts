import { MessageType } from '../src/message';
import { MessageInstance } from '../src/messageInstance';

export const testMessage = new MessageInstance('namespace', MessageType.Request, 'test', [
  0,
  1,
  2,
  3,
]);

test('message has unique correlation identifier', () => {
  const duplicatedMessage = new MessageInstance(
    testMessage.namespace,
    testMessage.type,
    testMessage.key,
    testMessage.value,
  );

  expect(testMessage.correlationId).not.toBe(duplicatedMessage.correlationId);
});

test('message uses provided correlation identifier', () => {
  const messageWithCorrelationId = new MessageInstance(
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
  expect(MessageInstance.validate(invalidMessage)).toBe(false);
  expect(MessageInstance.validate(testMessage)).toBe(true);
});
