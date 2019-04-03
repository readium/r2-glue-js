window.r2glue = window.r2glue || {};

document.addEventListener("DOMContentLoaded", function(event) {
  var frame = document.getElementById("page"),
      testPicker = document.getElementById("testPicker");

  // RPC services
  var clickRPCCaller = new ReadiumGlue.EventHandling(frame.contentWindow);
  window.r2glue.clickRPCCaller = clickRPCCaller;
  var keyRPCCaller = new ReadiumGlue.KeyHandling(frame.contentWindow);
  window.r2glue.keyRPCCaller = keyRPCCaller;

  // Shared scrolling functions
  var scrollLeft = function() {
    var gap = parseInt(window.getComputedStyle(frame.contentWindow.document.documentElement).getPropertyValue("column-gap"));
    frame.contentWindow.scrollTo(frame.contentWindow.scrollX - frame.contentWindow.innerWidth - gap, 0);
  };

  var scrollRight = function() {
    var gap = parseInt(window.getComputedStyle(frame.contentWindow.document.documentElement).getPropertyValue("column-gap"));
    frame.contentWindow.scrollTo(frame.contentWindow.scrollX + frame.contentWindow.innerWidth + gap, 0);
  };

  // Key event handler
  var keydownHandlerFn = function(e) {
    if (e.key == "ArrowRight") {
      scrollRight();
    } else if (e.key == "ArrowLeft") {
      scrollLeft();
    }
  };
  document.body.addEventListener('keydown', keydownHandlerFn);

  // Click event handler
  document.body.addEventListener('click', function(e) {
    e.preventDefault();
    if (e.clientX > (window.innerWidth / 2)) {
      scrollRight();
    } else {
      scrollLeft();
    }
  });

  // Updating iFrame
  var updateSrc = function(url) {
    var prefix = "src/";
    frame.src = prefix + url;
    frame.onload = function() {
      var script = frame.contentDocument.createElement("script");
      script.setAttribute("src", "/dist/glue-embed.js");
      frame.contentDocument.head.appendChild(script);
      script = frame.contentDocument.createElement("script");
      script.setAttribute("src", "/dist/glue-caller.js");
      frame.contentDocument.head.appendChild(script);

      // Bind listeners
      script.onload = function() {
        clickRPCCaller.addEventListener('click', function(e) {
          var frameWidth = frame.offsetWidth;
          if (e.clientX > (frameWidth / 2)) {
            scrollRight();
          } else {
            scrollLeft();
          }
        }, {
          preventDefault: true,
          target: 'body',
          properties: ['clientX']
        });
        keyRPCCaller.addKeyEventListener('keydown', keydownHandlerFn);
      }
    }
  }

  if (testPicker) {
    testPicker.addEventListener("change", function(e) {
      var newValue = this.value;
      updateSrc(newValue);
    }, false);
    updateSrc(testPicker.selectedOptions[0].value);
  }
})