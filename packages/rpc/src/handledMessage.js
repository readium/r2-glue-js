import { uuid } from './util';
var PROTOCOL_NAME = 'r2-glue-js';
var PROTOCOL_VERSION = '1.0.0';
var HandledMessage = /** @class */ (function () {
    function HandledMessage(namespace, type, key, value, correlationId) {
        this.namespace = namespace;
        this.type = type;
        this.key = key;
        this.value = value;
        this.correlationId = correlationId || uuid();
        this.protocol = PROTOCOL_NAME;
        this.version = PROTOCOL_VERSION;
    }
    HandledMessage.validate = function (message) {
        return !!message.protocol && message.protocol === PROTOCOL_NAME;
    };
    return HandledMessage;
}());
export { HandledMessage };
//# sourceMappingURL=handledMessage.js.map