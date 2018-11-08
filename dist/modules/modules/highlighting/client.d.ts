import { Client } from '../../lib/client';
import { IHighlightOptions } from './interface';
import { RangeData } from '../utilities/rangeData';
export declare class Highlighting extends Client {
    typeName: string;
    constructor(targetWindow: Window);
    createHighlight(rangeData: RangeData, options?: IHighlightOptions): Promise<void>;
}
