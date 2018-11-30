import { Dispatcher } from '@readium/glue-rpc';
import { EventHandler } from './handler';

export default new Dispatcher('event-handling', EventHandler);
