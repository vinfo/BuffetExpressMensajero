app.initialize();
var id, target, option;
if (window.jQuery) {  
 $(function(){
    //Establecer tracking
    setInterval(function(){
        getPosition();      
        try {
          var pos1= JSON.parse(localStorage.position);
          var pos2= JSON.parse(localStorage.position2);
          var p1= pos1["lat"].toString().substring(0,9);
          var p2= pos2["lat"].toString().substring(0,9);
          if(p1 !== p2){
            ajaxrest.setTracking(); 
            if(localStorage.position2)localStorage.setItem("position",localStorage.position2);
            new Maplace().CenterMap();
            getRoutes();                    
          }       
        }
        catch(err) {
          console.log("Tracking result: "+err.message);
        }
       ajaxrest.setTracking();
      }, 15000);
    
    // Tamaño container  
    $(".container").css({"min-height":$(document).height()});

   $(window).load(function(){
    $(".menupie ul li").css({"height":$("li.carrito a img").height()});
    $(".pedidotar").css({"bottom":$("li.carrito a img").height()});
    $(".contpag").css({"bottom":$("li.carrito a img").height()});
    $(".latermenu").css({"margin-top":$(".menusup").height()});
    $(".botones").css({"bottom":$("li.carrito a img").height()+"px"});        
  });
    //fin tamaño container
  })
} else {
  alert("Internet es requerido!");
}      
/* Funciones */    
function hiddeMenu(){
  $(".latermenu").animate({"left":-412},200);
}
function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
};
target = {
  latitude : 0,
  longitude: 0,
} 
function success(pos) {
  var crd = pos.coords;
  if (target.latitude === crd.latitude && target.longitude === crd.longitude) {
   new Maplace().ResizeMap();
   getSummary();
   navigator.geolocation.clearWatch(id);
 }
};