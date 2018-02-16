/* Handle basic navigation using taps and arrow keys */

(function() {

  var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  var isIDevice = navigator.platform.substr(0,2) === 'iP';
  var root = undefined;
  var page = 0;

  if (isSafari) {
    var root = document.body;
  } else {
    var root = document.documentElement;
  };

  document.documentElement.style.maxHeight = document.documentElement.clientHeight+"px";
  window.addEventListener("resize", function() {
    document.documentElement.style.maxHeight = document.documentElement.clientHeight+"px";
  }, false);

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
  }
  
  if (isSafari && isIDevice) {
    document.documentElement.style.maxHeight = window.innerHeight+"px";
    document.addEventListener("touchend", clickHandler, false);
    window.addEventListener("resize", function() {
      document.documentElement.style.maxHeight = window.innerHeight+"px";
    }, false);
  } else {
    window.addEventListener("click", clickHandler, false);
  }

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