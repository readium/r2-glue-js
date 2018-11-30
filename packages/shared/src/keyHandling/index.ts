import { Dispatcher } from '@readium/glue-rpc';
import { KeyHandler } from './handler';

export default new Dispatcher('key-handling', KeyHandler);
