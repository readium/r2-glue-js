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

    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var Sender = /** @class */ (function () {
        function Sender(targetWindow) {
            this.targetWindow = targetWindow;
        }
        Sender.prototype.sendMessage = function (message) {
            this.targetWindow.postMessage(message, this.targetWindow.location.origin);
        };
        return Sender;
    }());

    var EventHandlingMessage;
    (function (EventHandlingMessage) {
        EventHandlingMessage["AddEventListener"] = "ADD_EVENT_LISTENER";
        EventHandlingMessage["Event"] = "EVENT";
    })(EventHandlingMessage || (EventHandlingMessage = {}));

    var EventHandlingSender = /** @class */ (function (_super) {
        __extends(EventHandlingSender, _super);
        function EventHandlingSender() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        EventHandlingSender.prototype.addEventListener = function (target, eventType, options) {
            if (options === void 0) { options = {}; }
            this.sendMessage({
                type: EventHandlingMessage.AddEventListener,
                args: [target, eventType, options],
            });
        };
        return EventHandlingSender;
    }(Sender));

    exports.EventHandlingSender = EventHandlingSender;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ReadiumGlue-senders.js.map
