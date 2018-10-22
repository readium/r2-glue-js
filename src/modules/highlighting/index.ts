import { Dispatcher } from '../../lib';
import { Highlighter } from './handler';

export default new Dispatcher('highlighting', Highlighter);
