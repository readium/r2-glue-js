import { generateEventTargetSelector, isEventTarget } from './util';
export var EVENT_PROPERTIES = [
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
export var UI_EVENT_PROPERTIES = ['view', 'detail'];
export function marshalEvent(event, enumeratedProperties) {
    if (enumeratedProperties === void 0) { enumeratedProperties = []; }
    var propertiesToEnumerate = EVENT_PROPERTIES.concat(enumeratedProperties);
    if (event instanceof UIEvent) {
        propertiesToEnumerate = UI_EVENT_PROPERTIES.slice();
    }
    var eventObject = {};
    propertiesToEnumerate.forEach(function (key) {
        eventObject[key] = event[key];
    });
    return marshalObject(eventObject);
}
export function marshalObject(obj) {
    return JSON.parse(JSON.stringify(obj, function (key, value) {
        if (isEventTarget(value)) {
            return generateEventTargetSelector(value);
        }
        return value;
    }));
}
//# sourceMappingURL=marshaling.js.map