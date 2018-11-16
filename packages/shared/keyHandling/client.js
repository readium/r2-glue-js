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
import { Caller } from '@teadium/glue-rpc/lib/caller';
import { KeyHandlingMessage } from './interface';
var KeyHandling = /** @class */ (function (_super) {
    __extends(KeyHandling, _super);
    function KeyHandling(targetWindow) {
        return _super.call(this, 'key-handling', targetWindow) || this;
    }
    KeyHandling.prototype.addKeyEventListener = function (target, eventType, keyCode, listener, options) {
        if (options === void 0) { options = {}; }
        this.sendMessage(KeyHandlingMessage.AddKeyEventListener, [target, eventType, keyCode, options], function (event) {
            listener(event);
        });
    };
    return KeyHandling;
}(Caller));
export { KeyHandling };
//# sourceMappingURL=client.js.map