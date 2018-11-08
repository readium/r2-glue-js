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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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

var Client = /** @class */ (function (_super) {
    __extends(Client, _super);
    function Client(namespace, targetWindow) {
        var _this = _super.call(this, namespace) || this;
        _this.typeName = 'Client';
        _this._namespace = namespace;
        _this._targetWindow = targetWindow;
        _this._messageCorrelations = {};
        return _this;
    }
    Client.prototype.sendMessage = function (key, parameters, callback) {
        var message = new Message(this._namespace, MessageType.Invoke, key, parameters);
        var correlations = this._getCorrelations(message.correlationId);
        if (callback) {
            correlations.invokeCallback = callback;
        }
        this._targetWindow.postMessage(message, this._targetWindow.location.origin);
        return new Promise(function (resolve) {
            correlations.invokeReturn = resolve;
        });
    };
    Client.prototype.processMessage = function (message) {
        if (!message.correlationId) {
            return;
        }
        var correlations = this._getCorrelations(message.correlationId);
        if (message.type === MessageType.Return && correlations.invokeReturn) {
            correlations.invokeReturn(message.value);
        }
        if (message.type === MessageType.Callback && correlations.invokeCallback) {
            correlations.invokeCallback(message.value);
        }
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
        var _this = _super.call(this, 'event-handling', targetWindow) || this;
        _this.typeName = 'EventHandling';
        return _this;
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
    KeyHandlingMessage["RemoveKeyEventListener"] = "REMOVE_KEY_EVENT_LISTENER";
})(KeyHandlingMessage || (KeyHandlingMessage = {}));

var KeyHandling = /** @class */ (function (_super) {
    __extends(KeyHandling, _super);
    function KeyHandling(targetWindow) {
        var _this = _super.call(this, 'key-handling', targetWindow) || this;
        _this.typeName = 'KeyHandling';
        return _this;
    }
    KeyHandling.prototype.addKeyEventListener = function (target, eventType, keyCode, listener, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.sendMessage(KeyHandlingMessage.AddKeyEventListener, [target, eventType, keyCode, options], function (event) {
                        listener(event);
                    })];
            });
        });
    };
    KeyHandling.prototype.removeKeyEventListener = function (listenerID) {
        this.sendMessage(KeyHandlingMessage.RemoveKeyEventListener, [listenerID]);
    };
    return KeyHandling;
}(Client));

var LinkHandling = /** @class */ (function (_super) {
    __extends(LinkHandling, _super);
    function LinkHandling(targetWindow) {
        var _this = _super.call(this, 'link-handling', targetWindow) || this;
        _this.typeName = 'LinkHandling';
        return _this;
    }
    LinkHandling.prototype.addEventListener = function (target, eventType, properties, listener, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.sendMessage(EventHandlingMessage.AddEventListener, [target, eventType, properties, options], function (event) {
                        listener(event);
                    })];
            });
        });
    };
    LinkHandling.prototype.removeEventListener = function (listenerID) {
        this.sendMessage(EventHandlingMessage.RemoveEventListener, [listenerID]);
    };
    return LinkHandling;
}(Client));

var SelectionHandling = /** @class */ (function (_super) {
    __extends(SelectionHandling, _super);
    function SelectionHandling(targetWindow) {
        var _this = _super.call(this, 'selection-handling', targetWindow) || this;
        _this.typeName = 'SelectionHandling';
        return _this;
    }
    SelectionHandling.prototype.addEventListener = function (target, listener, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var eventType, properties;
            var _this = this;
            return __generator(this, function (_a) {
                eventType = 'mouseup';
                properties = [];
                return [2 /*return*/, this.sendMessage(EventHandlingMessage.AddEventListener, [target, eventType, properties, options], function (event) {
                        event[1] = _this;
                        listener(event);
                    })];
            });
        });
    };
    SelectionHandling.prototype.removeEventListener = function (listenerID) {
        this.sendMessage(EventHandlingMessage.RemoveEventListener, [listenerID]);
    };
    return SelectionHandling;
}(Client));

var EventHandlingMessage$1;
(function (EventHandlingMessage) {
    EventHandlingMessage["CreateHighlight"] = "CREATE_HIGHLIGHT";
})(EventHandlingMessage$1 || (EventHandlingMessage$1 = {}));

var Highlighting = /** @class */ (function (_super) {
    __extends(Highlighting, _super);
    function Highlighting(targetWindow) {
        var _this = _super.call(this, 'highlighting', targetWindow) || this;
        _this.typeName = 'Highlighting';
        return _this;
    }
    Highlighting.prototype.createHighlight = function (rangeData, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.sendMessage(EventHandlingMessage$1.CreateHighlight, [rangeData, options])];
            });
        });
    };
    return Highlighting;
}(Client));

export { EventHandling, KeyHandling, LinkHandling, SelectionHandling, Highlighting };
//# sourceMappingURL=ReadiumGlue.esm.js.map
