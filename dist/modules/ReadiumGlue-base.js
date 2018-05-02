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

    // tslint:disable
    /**
     * Returns a random v4 UUID
     * See {@link https://gist.github.com/jed/982883}.
     * @param [a] This is to not be used.
     * @returns {string}
     */
    function uuid(a) {
        if (a === void 0) { a = undefined; }
        return a
            ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
            : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuid);
    }
    // tslint:enable

    var PROTOCOL_NAME = 'r2-glue-js';
    var PROTOCOL_VERSION = '1.0.0';
    var Message = /** @class */ (function () {
        function Message(namespace, type, parameters, correlationId) {
            this.namespace = namespace;
            this.type = type;
            this.parameters = parameters;
            this.correlationId = correlationId || uuid();
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
            window.addEventListener('message', function (event) {
                var request = event.data;
                if (!Message.validate(request) || request.namespace !== namespace) {
                    return;
                }
                _this.processMessage(request, function (type, parameters) {
                    if (!event.source) {
                        return;
                    }
                    event.source.postMessage(new Message(namespace, type, parameters, request.correlationId), event.origin);
                });
            }, false);
        }
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
            this._handler[message.type].apply(this, [
                function () {
                    var responseParams = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        responseParams[_i] = arguments[_i];
                    }
                    sendMessage(message.type + "$response", responseParams);
                }
            ].concat(message.parameters));
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
