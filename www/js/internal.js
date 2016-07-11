app.initialize();
var id, target, option;
if (window.jQuery) {  
 $(function(){
    //Establecer tracking
    window.navigator.geolocation.getCurrentPosition(function(location) {
        console.log('Location from Phonegap');
    });
    var bgGeo = window.backgroundGeoLocation;
    var yourAjaxCallback = function(response) {
        console.log("Finish");
        bgGeo.finish();
    };    
    var callbackFn = function(location) {
        console.log('[js] BackgroundGeoLocation callback:  ' + location.latitude + ',' + location.longitude);
        yourAjaxCallback.call(this);
    };
    var failureFn = function(error) {
        console.log('BackgroundGeoLocation error');
    }
    bgGeo.configure(callbackFn, failureFn, {
        url: 'http://buffetexpress.co/REST/resources/printer/composer.json', // <-- Android ONLY:  your server url to send locations to
        params: {
            auth_token: 'user_secret_auth_token',    //  <-- Android ONLY:  HTTP POST params sent to your server when persisting locations.
            foo: 'bar'                              //  <-- Android ONLY:  HTTP POST params sent to your server when persisting locations.
        },
        headers: {                                   // <-- Android ONLY:  Optional HTTP headers sent to your configured #url when persisting locations
            "X-Foo": "BAR"
        },
        desiredAccuracy: 10,
        stationaryRadius: 20,
        distanceFilter: 30,
        notificationTitle: 'Background tracking', // <-- android only, customize the title of the notification
        notificationText: 'ENABLED', // <-- android only, customize the text of the notification
        activityType: 'AutomotiveNavigation',
        debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
        stopOnTerminate: false // <-- enable this to clear background location settings when the app terminates
    });
    bgGeo.start();
    // bgGeo.stop();
    
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
}