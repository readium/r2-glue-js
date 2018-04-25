import { Dispatcher } from '../../lib/dispatcher';
import { EventHandler } from './handler';

(() => new Dispatcher('event-handling', EventHandler))();
