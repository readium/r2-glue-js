import { uuid } from '../src/util';

test('uuid generation', () => {
  expect(uuid()).not.toEqual(uuid());
});
