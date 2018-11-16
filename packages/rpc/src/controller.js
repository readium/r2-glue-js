import { HandledMessage } from './handledMessage';
var Controller = /** @class */ (function () {
    function Controller(namespace) {
        var _this = this;
        window.addEventListener('message', function (event) {
            var request = event.data;
            if (!HandledMessage.validate(request) || request.namespace !== namespace) {
                return;
            }
            _this.processMessage(request, function (type, name, parameters) {
                if (!event.source) {
                    return;
                }
                var sourceWindow = event.source;
                sourceWindow.postMessage(new HandledMessage(namespace, type, name, parameters, request.correlationId), event.origin);
            });
        });
    }
    return Controller;
}());
export { Controller };
//# sourceMappingURL=controller.js.map