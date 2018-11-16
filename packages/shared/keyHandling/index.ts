import { Executor } from '@teadium/glue-rpc';
import { KeyHandler } from './handler';

export default new Executor('key-handling', KeyHandler);
