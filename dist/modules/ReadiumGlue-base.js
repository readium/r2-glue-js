var ReadiumGlue = (function (exports) {
  'use strict';

  var Receiver = /** @class */ (function () {
      function Receiver() {
          var _this = this;
          window.addEventListener('message', function (event) {
              var message = event.data;
              if (!message.type || !message.args) {
                  return;
              }
              _this.handleMessage(message, function (callbackMessage) {
                  if (!event.source) {
                      return;
                  }
                  event.source.postMessage(callbackMessage, event.origin);
              });
          });
      }
      return Receiver;
  }());

  exports.Receiver = Receiver;

  return exports;

}({}));
//# sourceMappingURL=ReadiumGlue-base.js.map
