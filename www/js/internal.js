app.initialize();
var id, target, option;
if (window.jQuery) {  
 $(function(){
    //Establecer tracking
    setInterval(function(){
        getPosition();//Valida posición desde phone   
        try {
          var pos1= JSON.parse(localStorage.position);
          var pos2= JSON.parse(localStorage.position2);
          var p1= pos1["lat"].toString().substring(0,9);
          var p2= pos2["lat"].toString().substring(0,9);
          if(p1 !== p2){
            console.log("IR a Tracking coordenadas diferentes: "+p1+" - "+p2);
            ajaxrest.setTracking();
            if(localStorage.position2)localStorage.setItem("position",localStorage.position2);
            new Maplace().CenterMap();
            getRoutes();                    
          }       
        }
        catch(err) {
          console.log("Tracking result: "+err.message);
        }
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
function getPosition(){  
  if (navigator.geolocation){
    console.log("Registrar posición dispositivo");   
     navigator.geolocation.getCurrentPosition(
              function(position) {
                lat1= position.coords.latitude;
                lng1= position.coords.longitude;           
                localStorage.setItem("position2",JSON.stringify({lat:lat1,lng:lng1}));
        console.log("OK Posición2: "+lat1+" "+lng1);
              },
              function(error) {
                  console.log("Ubicación no disponible.");
                  setTimeout(getPosition(),5000);
              },
              {timeout: 10000, enableHighAccuracy: true, maximumAge:0}
      );
  }

    var bgGeo = navigator.plugins.backgroundGeoLocation; 
    var callbackFn = function(location){
        alert(JSON.stringify(location));
        runtap.util.gps.onBackgroundSuccess(location);
    };
     
    var failureFn = function(error){
        alert('Geolocation Error PLUGIN');
    };
     
    bgGeo.configure(callbackFn, failureFn, {
        desiredAccuracy: 10,
        stationaryRadius: 10,
        distanceFilter: 30,
        debug: true
    });
}