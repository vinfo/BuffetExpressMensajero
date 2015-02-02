app.initialize();
var id, target, option;
if (window.jQuery) {  
   $(function(){
    // Tamaño container
    $(".container").css({"min-height":$(document).height()});   
    if( navigator.geolocation ){
        var optn = {
            enableHighAccuracy: true,
            timeout: Infinity,
            maximumAge: 0   
        };        
      navigator.geolocation.getCurrentPosition(
              function(position) {
                lat1= position.coords.latitude;
                lng1= position.coords.longitude;     
                localStorage.setItem("position",JSON.stringify({lat:lat1,lng:lng1}));                
              },
              function(error) {
                  alert("Ubicación no disponible");
              },
              {optn}
      );
     id = navigator.geolocation.watchPosition(success, error, optn);
    }

    $(window).load(function(){
        $(".menupie ul li").css({"height":$("li.carrito a img").height()});
        $(".pedidotar").css({"bottom":$("li.carrito a img").height()});
        $(".contpag").css({"bottom":$("li.carrito a img").height()});
        $(".latermenu").css({"margin-top":$(".menusup").height()});
        $(".botones").css({"bottom":$("li.carrito a img").height()+"px"});        
    });
    //fin tamaño container      
    
    //Mostrar menu lateral  
    $(".verlatermenu").click(function(event){
        event.preventDefault();
        var img= $(".menusup button.ico-menu span").css('background-image').split("flecha_atras");        
        if(img[1] && img[1].length>0){
            $(".menusup button.ico-menu span").css("background","url(images/linmenu.png)");
            //window.history.back();
            var url= window.location.href.split('#/');
            var data= url[1].split("/");

            var redir="internal.html#/slider";            
            if(data[1]=="ins")redir= "internal.html#/menu";
            if(data[1]=="edit")redir= "internal.html#/compras";
            if(url[1]=="pago#top")redir= "internal.html#/compras"; 
            window.location = redir;
        }else{
            var position = $(".latermenu").position();
            if(position.left==0){
                $(".latermenu").animate({"left":-412},200);
            }else{
                $(".latermenu").animate({"left":0},400);           
            }
            $(".container").animate({
             scrollTop:0
         },"slow");             
        }
    });
    $(".td a").click(function(){
        $(".latermenu").animate({"left":-412},200);
    });    
    $(".menupie").hover(function(){
        $(".latermenu").animate({"left":-412},200);
    });

    //Activar menus  
    $(".menupie li a").click(function(){
        $("li").removeClass("active");
        $(this).parent().addClass("active");
    });
})
} else {
    alert("Internet es requerido!");
}      
/* Funciones */    
function hiddeMenu(){
    $(".latermenu").animate({"left":-412},200);
}
function show(div){
    $(".panels").hide();
    $("."+div).fadeIn();    
    new Maplace().ResizeMap();
    getSummary();
}
function getSummary(){
    if(localStorage.getItem("routes")!=null){
        var Routes= JSON.parse(localStorage.getItem("routes"));
        if(Routes.routes[0].legs.length>1){
            var time=0;
            var kms=0;
           for (var i = 0; i < Routes.routes[0].legs.length; i++) {
                time+= parseInt(Routes.routes[0].legs[i].duration.value);
                kms+= parseInt(Routes.routes[0].legs[i].distance.value);
           }
           var add=0;
           if(localStorage.min_adicionales){
            var mins= JSON.parse(localStorage.min_adicionales);
            if(parseInt(mins[0].valor_tipo)>0)add= parseInt(mins[0].valor_tipo)*60;        
           }
           time= Math.round((time+add)/60);
           kms= Math.round(kms/1000);
        }
        $(".adp-summary").html("Distancia aprox. "+kms+" kms, Tiempo aprox. "+time+" min.");         
    }else{
        $(".adp-summary").html("");   
    }
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