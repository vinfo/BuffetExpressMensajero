app.initialize();
startApp();

function startApp() {  
  //alert("startApp");
  localStorage.removeItem("position");
  localStorage.removeItem("position2");
  localStorage.removeItem("final_orders");
  localStorage.removeItem("ordenes");
  localStorage.removeItem("num_ordenes");
  localStorage.removeItem("routes");
  localStorage.removeItem("ruta");
  localStorage.removeItem("coordinates");
  localStorage.setItem("domain","http://buffetexpress.com.co/REST/");  
  localStorage.setItem("dimension",$(window).width());
  
  var lat1="";
  var lng1="";  
  localStorage.setItem("zona",JSON.stringify({id:2,code:'cam002',show:0}));
  if (navigator.geolocation) {
    //alert("geolocation");
      navigator.geolocation.getCurrentPosition(
              function(position) {
                lat1= position.coords.latitude;
                lng1= position.coords.longitude; 
                localStorage.setItem("position",JSON.stringify({lat:lat1,lng:lng1}));
				        localStorage.setItem("coordinates",lat1+","+lng1);
                console.log("Registro de posición exitosa: "+lat1+" - "+lng1);                
                redirect();
              },
              function(error) {
                  alert("Problemas ubicando posición GPS.\nDebe encender su GPS para ubicar su posición.");
                  lat1= 6.252592;
                  lng1= -75.563851;
                  localStorage.setItem("position",JSON.stringify({lat:lat1,lng:lng1}));
                  localStorage.setItem("coordinates",lat1+","+lng1);
                  redirect();
              },
              {timeout:10000, enableHighAccuracy: true, maximumAge:0}
      );
  }else{
    alert("Geolocalización no soportada en dispositivo!\nPor favor encender el GPS de su dispositivo.");
    redirect();
  }  
}

function redirect(){
    var cuenta= localStorage.cuenta;   
    window.setTimeout(function() {
           if(cuenta){
              window.location = "internal.html";
           }else{
              window.location.href = 'login.html';
          } 
    }, 1000);   
}