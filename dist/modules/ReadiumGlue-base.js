var ReadiumGlue = (function (exports) {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var PROTOCOL_NAME = 'r2-glue-js';
    var PROTOCOL_VERSION = '1.0.0';
    var MessageType;
    (function (MessageType) {
        MessageType["Invoke"] = "invoke";
        MessageType["Return"] = "return";
        MessageType["Callback"] = "callback";
    })(MessageType || (MessageType = {}));
    var messageCount = 0;
    var Message = /** @class */ (function () {
        function Message(namespace, type, key, value, correlationId) {
            this.namespace = namespace;
            this.type = type;
            this.key = key;
            this.value = value;
            this.correlationId = correlationId || "" + messageCount; // uuid();
            messageCount += 1;
            this.protocol = PROTOCOL_NAME;
            this.version = PROTOCOL_VERSION;
        }
        Message.validate = function (message) {
            return !!message.protocol && message.protocol === PROTOCOL_NAME;
        };
        return Message;
    }());

    var Receiver = /** @class */ (function () {
        function Receiver(namespace) {
            var _this = this;
            this.destroy = this.destroy.bind(this);
            this.handler = function (event) {
                var request = event.data;
                if (!Message.validate(request) || request.namespace !== namespace) {
                    return;
                }
                _this.processMessage(request, function (type, name, parameters) {
                    if (!event.source) {
                        return;
                    }
                    var sourceWindow = event.source;
                    sourceWindow.postMessage(new Message(namespace, type, name, parameters, request.correlationId), event.origin);
                });
            };
            window.addEventListener('message', this.handler);
        }
        Receiver.prototype.destroy = function () {
            window.removeEventListener('message', this.handler);
        };
        return Receiver;
    }());

    var Dispatcher = /** @class */ (function (_super) {
        __extends(Dispatcher, _super);
        function Dispatcher(namespace, handlerType) {
            var _this = _super.call(this, namespace) || this;
            _this._handler = new handlerType();
            return _this;
        }
        Dispatcher.prototype.processMessage = function (message, sendMessage) {
            this._handleRequest(message, sendMessage);
        };
        Dispatcher.prototype._handleRequest = function (message, sendResponse) {
            this._handler.declarations[message.key]
                .apply(this._handler, [
                function () {
                    var callbackArgs = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        callbackArgs[_i] = arguments[_i];
                    }
                    sendResponse(MessageType.Callback, message.key, callbackArgs);
                }
            ].concat(message.value))
                .then(function (returnValue) { return sendResponse(MessageType.Return, message.key, returnValue); });
        };
        return Dispatcher;
    }(Receiver));

    var MessageHandler = /** @class */ (function () {
        function MessageHandler() {
        }
        return MessageHandler;
    }());

    exports.Dispatcher = Dispatcher;
    exports.MessageHandler = MessageHandler;

    return exports;

}({}));
//# sourceMappingURL=ReadiumGlue-base.js.map
