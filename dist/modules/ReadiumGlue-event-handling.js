this.ReadiumGlue = this.ReadiumGlue || {};
this.ReadiumGlue.EventHandlingReceiver = (function (exports,receiver_ts) {
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

    var EventHandlingMessage;
    (function (EventHandlingMessage) {
        EventHandlingMessage["AddEventListener"] = "ADD_EVENT_LISTENER";
        EventHandlingMessage["Event"] = "EVENT";
    })(EventHandlingMessage || (EventHandlingMessage = {}));

    var EventHandlingReceiver = /** @class */ (function (_super) {
        __extends(EventHandlingReceiver, _super);
        function EventHandlingReceiver() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        EventHandlingReceiver.prototype.handleMessage = function (message, callback) {
            if (message.type === EventHandlingMessage.AddEventListener) {
                var _a = message.args, target = _a[0], eventType = _a[1], _b = _a[2], options = _b === void 0 ? {} : _b;
                this.onEventListener(String(target), String(eventType), options, callback);
            }
        };
        EventHandlingReceiver.prototype.onEventListener = function (target, eventType, options, callback) {
            var eventTargets;
            if (target === '@window') {
                eventTargets = [window];
            }
            else if (target === '@document') {
                eventTargets = [document];
            }
            else {
                eventTargets = document.querySelectorAll(target);
            }
            if (eventTargets && eventTargets.length) {
                Array.prototype.forEach.call(eventTargets, function (resolvedTarget) {
                    resolvedTarget.addEventListener(eventType, function (event) {
                        if (options.preventDefault) {
                            event.preventDefault();
                        }
                        if (options.stopPropagation) {
                            event.stopPropagation();
                        }
                        if (options.stopImmediatePropagation) {
                            event.stopImmediatePropagation();
                        }
                        callback({
                            type: EventHandlingMessage.Event,
                            args: [event],
                        });
                    });
                });
            }
        };
        return EventHandlingReceiver;
    }(receiver_ts.Receiver));

    exports.EventHandlingReceiver = EventHandlingReceiver;

    return exports;

}({},ReadiumGlue));
//# sourceMappingURL=ReadiumGlue-event-handling.js.map
