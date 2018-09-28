import { Message, MessageType } from '../message';

export const testMessage = new Message('namespace', MessageType.Call, 'test', [0, 1, 2, 3]);

test('message has unique correlation identifier', () => {
  const duplicatedMessage = new Message(
    testMessage.namespace,
    testMessage.type,
    testMessage.key,
    testMessage.value,
  );

  expect(testMessage.correlationId).not.toBe(duplicatedMessage.correlationId);
});

test('message uses provided correlation identifier', () => {
  const messageWithCorrelationId = new Message(
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
  expect(Message.validate(invalidMessage)).toBe(false);
  expect(Message.validate(testMessage)).toBe(true);
});
