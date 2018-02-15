/* Handle basic navigation using taps */

(function() {

  var page = 0;
  
  window.addEventListener("click", (function(e) {        
    var clickX = e.pageX;
    console.log("Click detected at: "+clickX);
    console.log("Current page: "+page);
    if (clickX > (window.innerWidth*page)+((window.innerWidth/3)*2)) {
      page = page+1;
    } else if (clickX < (window.innerWidth*page)+(window.innerWidth/3)) {
      if (page>0) page = page-1;
    }
    else {
      
    }
    console.log("Page is now: "+page);
    console.log("New position: "+page*(window.innerWidth));
    document.documentElement.scrollLeft = page*(window.innerWidth);
    document.body.scrollLeft = page*(window.innerWidth);
  }));
  
  document.body.addEventListener('keydown', function(e) {
    e.preventDefault();
    console.log("Current page: "+page);
    if (e.keyCode == "39") {
      page = page+1;
    } else if (e.keyCode == "37") {
      if (page>0) page = page-1;
    }
    console.log("Page is now: "+page);
    console.log("New position: "+page*(window.innerWidth));
    document.documentElement.scrollLeft = page*(window.innerWidth);
    document.body.scrollLeft = page*(window.innerWidth);
  });

}());