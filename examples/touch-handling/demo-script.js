document.addEventListener("DOMContentLoaded", function(event) {
  var frame = document.getElementById("page"),
      testPicker = document.getElementById("testPicker");

  var updateSrc = function(url) {
    var prefix = "src/";
    frame.src = prefix + url;
  }

  var scrollLeft = function() {
    var gap = parseInt(window.getComputedStyle(frame.contentWindow.document.documentElement).getPropertyValue("column-gap"));
    frame.contentWindow.scrollTo(frame.contentWindow.scrollX - frame.contentWindow.innerWidth - gap, 0);
  };

  var scrollRight = function() {
    var gap = parseInt(window.getComputedStyle(frame.contentWindow.document.documentElement).getPropertyValue("column-gap"));
    frame.contentWindow.scrollTo(frame.contentWindow.scrollX + frame.contentWindow.innerWidth + gap, 0);
  };

  document.body.addEventListener('click', function(e) {
    e.preventDefault();
    if (e.clientX > (window.innerWidth / 2)) {
      scrollRight();
    } else {
      scrollLeft();
    }
  });
  document.body.addEventListener('keydown', function(e) {
    if (e.keyCode == "39") {
      scrollRight();
    } else if (e.keyCode == "37") {
      scrollLeft();
    }
  });

  if (testPicker) {
    testPicker.addEventListener("change", function(e) {
      var newValue = this.value;
      updateSrc(newValue);
    }, false);
  }
})