import { Executor } from '@readium/glue-rpc';
import { EventHandler } from './handler';

export default new Executor('event-handling', EventHandler);
