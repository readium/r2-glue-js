var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { MessageType } from './message';
import { Controller } from './controller';
var Executor = /** @class */ (function (_super) {
    __extends(Executor, _super);
    function Executor(namespace, messageHandlingType) {
        var _this = _super.call(this, namespace) || this;
        _this._messageHandlingInstance = new messageHandlingType();
        return _this;
    }
    Executor.prototype.processMessage = function (message, sendMessage) {
        this._messageHandlingInstance.handlers[message.key]
            .apply(this._messageHandlingInstance, [
            function () {
                var callbackData = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    callbackData[_i] = arguments[_i];
                }
                sendMessage(MessageType.Callback, message.key, callbackData);
            }
        ].concat(message.value))
            .then(function (responseValue) {
            sendMessage(MessageType.Respond, message.key, responseValue);
        });
    };
    return Executor;
}(Controller));
export { Executor };
//# sourceMappingURL=executor.js.map