import { Executor } from '../../../packages/rpc';
import { EventHandler } from './handler';

export default new Executor('event-handling', EventHandler);
