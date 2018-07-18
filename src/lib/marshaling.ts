import finder from '@medv/finder';

export const EVENT_PROPERTIES = [
  'type',
  'target',
  'currentTarget',
  'eventPhase',
  'bubbles',
  'cancelable',
  'defaultPrevented',
  'composed',
  'timeStamp',
  'srcElement',
  'returnValue',
  'cancelBubble',
  'path',
  'composedPath',
];

export const UI_EVENT_PROPERTIES = ['view', 'detail'];

export function marshalEvent(event: Event, enumeratedProperties: string[] = []): any {
  let propertiesToEnumerate = [...EVENT_PROPERTIES, ...enumeratedProperties];
  if (event instanceof UIEvent) {
    propertiesToEnumerate = [...UI_EVENT_PROPERTIES];
  }
  const eventObject: any = {};
  propertiesToEnumerate.forEach((key) => {
    eventObject[key] = (<any>event)[key];
  });
  return marshalObject(eventObject);
}

export function marshalObject(obj: any): any {
  return JSON.parse(
    JSON.stringify(obj, (key, value) => {
      if (value instanceof Window) {
        return '@window';
      }
      if (value instanceof Document) {
        return '@document';
      }
      if (value instanceof Element) {
        // Generate a CSS selector for the Element
        return finder(value);
      }
      return value;
    }),
  );
}
