import { Message, MessageType } from '../src/message';

export const testMessage = new Message({
  type: MessageType.Request,
  namespace: 'namespace',
  name: 'test',
  payload: [0, 1, 2, 3],
});

test('message has unique correlation identifier', () => {
  const duplicatedMessage = new Message({ ...testMessage, correlationId: undefined });

  expect(testMessage.correlationId).not.toBe(duplicatedMessage.correlationId);
});

test('message uses provided correlation identifier', () => {
  const messageWithCorrelationId = new Message({ ...testMessage, correlationId: 'foobar' });

  expect(messageWithCorrelationId.correlationId).toBe('foobar');
});

test('validates message', () => {
  const invalidMessage = { fruit: 'banana' };
  // @ts-ignore
  expect(Message.validate(invalidMessage)).toBe(false);
  expect(Message.validate(testMessage)).toBe(true);
});
