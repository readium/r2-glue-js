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
import { Controller } from './controller';
import { HandledMessage } from './handledMessage';
import { MessageType } from './message';
var Caller = /** @class */ (function (_super) {
    __extends(Caller, _super);
    function Caller(namespace, targetWindow) {
        var _this = _super.call(this, namespace) || this;
        _this._namespace = namespace;
        _this._targetWindow = targetWindow;
        _this._messageCorrelations = {};
        return _this;
    }
    Caller.prototype.sendMessage = function (key, parameters, callback) {
        var message = new HandledMessage(this._namespace, MessageType.Request, key, parameters);
        var correlations = this._getCorrelations(message.correlationId);
        if (callback) {
            correlations.callback = callback;
        }
        this._targetWindow.postMessage(message, this._targetWindow.location.origin);
        return new Promise(function (resolve) {
            correlations.response = resolve;
        });
    };
    Caller.prototype.processMessage = function (message) {
        if (!message.correlationId) {
            return;
        }
        var correlations = this._getCorrelations(message.correlationId);
        if (message.type === MessageType.Respond && correlations.response) {
            correlations.response(message.value);
        }
        if (message.type === MessageType.Callback && correlations.callback) {
            correlations.callback(message.value);
        }
    };
    Caller.prototype._getCorrelations = function (id) {
        if (!this._messageCorrelations[id]) {
            this._messageCorrelations[id] = {};
        }
        return this._messageCorrelations[id];
    };
    return Caller;
}(Controller));
export { Caller };
//# sourceMappingURL=caller.js.map