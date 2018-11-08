export interface RangeData {
    startOffset: number;
    startContainer: any[];
    endOffset: number;
    endContainer: any[];
}
export declare function createRangeData(range: Range): RangeData;
export declare function createRangeFromSelection(selection: Selection): Range;
export declare function createRangeFromRangeData(rangeData: RangeData): Range;
