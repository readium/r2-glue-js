/* Handle basic navigation using taps and arrow keys */

(function() {

  var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  var isIDevice = navigator.platform.substr(0,2) === 'iP';
  var isAndroid = /(android)/i.test(navigator.userAgent);
  var isWebview = /(wv)/i.test(navigator.userAgent);
  var root = undefined;
  var page = 0;

  if (isSafari || isAndroid && isWebview) {
    var root = document.body;
  } else {
    var root = document.documentElement;
  };

  var debounce = function(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  var updateHeight = debounce(function() {
    document.documentElement.style.maxHeight = document.documentElement.clientHeight+"px";
  }, 250);

  if (!isAndroid || !isIDevice) {
    document.documentElement.style.maxHeight = document.documentElement.clientHeight+"px";
    document.documentElement.style.overflowY = "hidden";
    window.addEventListener("resize", updateHeight, false);
  };

  var clickHandler = function(e) {
    var clickX = e.pageX;
    e.preventDefault();
    console.log("Click detected at: "+clickX);
    console.log("Current page: "+page);
    if (clickX > (window.innerWidth*page)+((window.innerWidth/3)*2)) {
      page = page+1;
    } else if (clickX < (window.innerWidth*page)+(window.innerWidth/3)) {
      if (page>0) page = page-1;
    }
    console.log("Page is now: "+page);
    console.log("New position: "+page*(window.innerWidth));
    root.scrollLeft = page*(window.innerWidth);
  };
  
  if (isSafari && isIDevice) {
    document.addEventListener("touchend", clickHandler, false);
  } else {
    window.addEventListener("click", clickHandler, false);
  };

  window.addEventListener('keydown', function(e) {
    e.preventDefault();
    console.log("Current page: "+page);
    if (e.keyCode == "39") {
      page = page+1;
    } else if (e.keyCode == "37") {
      if (page>0) page = page-1;
    }
    console.log("Page is now: "+page);
    console.log("New position: "+page*(window.innerWidth));
    //document.body.style.transform = "translateX(-"+page*(window.innerWidth)+"px)"
    root.scrollLeft = page*(window.innerWidth);
  });

}());