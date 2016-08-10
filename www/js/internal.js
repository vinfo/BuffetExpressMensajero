app.initialize();
if (window.jQuery) {  
 $(function(){
    var cont=1;
    setInterval(function(){ 
      getPosition();
      console.log("Registrar posición solo declaración 30 seg "+cont);
      cont++;
    }, 30000);

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
  if(localStorage.ordenes){
    if ("geolocation" in navigator) {
      console.log("Registrar posición real dispositivo via GPS - Position2");   
       navigator.geolocation.getCurrentPosition(
                function(position) {
                  lat1= position.coords.latitude;
                  lng1= position.coords.longitude;           
                  localStorage.setItem("position2",JSON.stringify({lat:lat1,lng:lng1}));
                  ajaxrest.setTracking();
                  console.log("OK Posición2: "+lat1+" "+lng1);                
                },
                function(error) {
                    console.log("Ubicación no disponible. Code:"+error.code+" Msg:"+error.message);
                },
                {timeout:30000, enableHighAccuracy:true, maximumAge:0}
        );
    }else{
      alert("Problemas detectando ubicación");
    }
  }
}