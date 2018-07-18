(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.ReadiumGlue = {})));
}(this, (function (exports) { 'use strict';

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

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
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

    var PROTOCOL_NAME = 'r2-glue-js';
    var PROTOCOL_VERSION = '1.0.0';
    var MessageType;
    (function (MessageType) {
        MessageType["Call"] = "call";
        MessageType["Reply"] = "reply";
        MessageType["Yield"] = "yield";
    })(MessageType || (MessageType = {}));
    var Message = /** @class */ (function () {
        function Message(namespace, type, name, parameters, correlationId) {
            this.namespace = namespace;
            this.type = type;
            this.name = name;
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
                _this.processMessage(request, function (type, name, parameters) {
                    if (!event.source) {
                        return;
                    }
                    event.source.postMessage(new Message(namespace, type, name, parameters, request.correlationId), event.origin);
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
            return __awaiter(this, void 0, void 0, function () {
                var handlerFunction, handlerReturnValue;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            handlerFunction = this._handler.declarations[message.name];
                            return [4 /*yield*/, handlerFunction.apply(this._handler, [
                                    function () {
                                        var responseParams = [];
                                        for (var _i = 0; _i < arguments.length; _i++) {
                                            responseParams[_i] = arguments[_i];
                                        }
                                        sendMessage(MessageType.Yield, message.name, responseParams);
                                    }
                                ].concat(message.parameters))];
                        case 1:
                            handlerReturnValue = _a.sent();
                            sendMessage(MessageType.Reply, message.name, handlerReturnValue);
                            return [2 /*return*/];
                    }
                });
            });
        };
        return Dispatcher;
    }(Receiver));

    var Client = /** @class */ (function (_super) {
        __extends(Client, _super);
        function Client(namespace, targetWindow) {
            var _this = _super.call(this, namespace) || this;
            _this._namespace = namespace;
            _this._targetWindow = targetWindow;
            _this._messageCorrelations = {};
            return _this;
        }
        Client.prototype.sendMessage = function (name, parameters, callback) {
            var message = new Message(this._namespace, MessageType.Call, name, parameters);
            var correlations = this._getCorrelations(message.correlationId);
            if (callback) {
                correlations.yieldCallback = callback;
            }
            this._targetWindow.postMessage(message, this._targetWindow.location.origin);
            return new Promise(function (resolve) {
                correlations.replyCallback = resolve;
            });
        };
        Client.prototype.processMessage = function (message, sendMessage) {
            return __awaiter(this, void 0, void 0, function () {
                var correlations;
                return __generator(this, function (_a) {
                    if (!message.correlationId) {
                        return [2 /*return*/];
                    }
                    correlations = this._getCorrelations(message.correlationId);
                    if (message.type === MessageType.Reply && correlations.replyCallback) {
                        correlations.replyCallback(message.parameters);
                    }
                    if (message.type === MessageType.Yield && correlations.yieldCallback) {
                        correlations.yieldCallback(message.parameters);
                    }
                    return [2 /*return*/];
                });
            });
        };
        Client.prototype._getCorrelations = function (id) {
            if (!this._messageCorrelations[id]) {
                this._messageCorrelations[id] = {};
            }
            return this._messageCorrelations[id];
        };
        return Client;
    }(Receiver));

    var EventHandlingMessage;
    (function (EventHandlingMessage) {
        EventHandlingMessage["AddEventListener"] = "ADD_EVENT_LISTENER";
        EventHandlingMessage["RemoveEventListener"] = "REMOVE_EVENT_LISTENER";
    })(EventHandlingMessage || (EventHandlingMessage = {}));

    var EventHandling = /** @class */ (function (_super) {
        __extends(EventHandling, _super);
        function EventHandling(targetWindow) {
            return _super.call(this, 'event-handling', targetWindow) || this;
        }
        EventHandling.prototype.addEventListener = function (target, eventType, properties, listener, options) {
            if (options === void 0) { options = {}; }
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.sendMessage(EventHandlingMessage.AddEventListener, [target, eventType, properties, options], function (event) {
                            listener(event);
                        })];
                });
            });
        };
        EventHandling.prototype.removeEventListener = function (listenerID) {
            this.sendMessage(EventHandlingMessage.RemoveEventListener, [listenerID]);
        };
        return EventHandling;
    }(Client));

    var KeyHandlingMessage;
    (function (KeyHandlingMessage) {
        KeyHandlingMessage["AddKeyEventListener"] = "ADD_KEY_EVENT_LISTENER";
    })(KeyHandlingMessage || (KeyHandlingMessage = {}));

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
    }(Client));

    exports.EventHandling = EventHandling;
    exports.KeyHandling = KeyHandling;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ReadiumGlue.js.map
