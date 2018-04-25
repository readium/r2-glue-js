// Ensure that the statements here are exporting only the *named* receiver class for each module
//
// Example:
// export { FooBarHandling } from '../modules/foo-bar/handler';

import { Dispatcher } from './lib/dispatcher';
import { EventHandler } from './modules/event-handling/handler';

(() => new Dispatcher('event-handling', EventHandler))();
