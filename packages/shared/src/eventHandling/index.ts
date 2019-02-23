import { GlueHost } from '@readium/glue-rpc';
import { EventHandler } from './handler';

export default new GlueHost('event-handling', EventHandler);
