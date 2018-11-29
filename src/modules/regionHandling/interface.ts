import { IAddEventListenerOptions } from '../eventHandling/interface';

export enum RegionScope {
  Viewport = 'viewport',
  Document = 'document',
}

export type Region = {
  left: number,
  top: number,
  width: number,
  height: number,
  scope?: RegionScope,
};

export interface IAddRegionListenerOptions extends IAddEventListenerOptions {
  region?: Region;
  eventType?: string;
  wasWithinRegion?: boolean;
  withinRegion?: boolean;
}
