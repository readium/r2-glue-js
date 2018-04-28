import { Dispatcher } from '../../lib';
import { EventHandler } from './handler';

export default new Dispatcher('event-handling', EventHandler);
