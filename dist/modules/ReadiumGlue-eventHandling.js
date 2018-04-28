this.ReadiumGlue = this.ReadiumGlue || {};
this.ReadiumGlue.eventHandling = (function (dispatcher_ts,messageHandler_ts) {
  'use strict';

  // tslint:disable
  // tslint:enable

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
  })(EventHandlingMessage || (EventHandlingMessage = {}));

  var EventHandler = /** @class */ (function (_super) {
      __extends(EventHandler, _super);
      function EventHandler() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      EventHandler.prototype[EventHandlingMessage.AddEventListener] = function (callback, target, eventType, options) {
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
                      callback(event);
                  });
              });
          }
      };
      return EventHandler;
  }(dispatcher_ts.MessageHandler));

  var index = new dispatcher_ts.Dispatcher('event-handling', EventHandler);

  return index;

}(ReadiumGlue,ReadiumGlue));
//# sourceMappingURL=ReadiumGlue-eventHandling.js.map
