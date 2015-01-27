app.initialize();
startApp();

function startApp() {  
  //alert("startApp");
  localStorage.setItem("domain","http://buffetexpress.co/REST/");  
  localStorage.setItem("dimension",$(window).width());
  
  var lat1="";
  var lng1="";  
  localStorage.setItem("zona",JSON.stringify({id:1,code:'cam001',show:0}));
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
              function(position) {
                lat1= position.coords.latitude;
                lng1= position.coords.longitude;     
                localStorage.setItem("position",JSON.stringify({lat:lat1,lng:lng1}));
                redirect();
              },
              function(error) {
                  alert("Ubicación no disponible");
                  redirect();
              },
              {timeout: 30000, enableHighAccuracy: true, maximumAge: 75000}
      );
  }else{
    alert("Geolocalización no soportada en dispositivo!");
    redirect();
  }  
}

function redirect(){
    window.setTimeout(function() {
            window.location.href = 'login.html';  
         }, 1000);   
}