app.initialize();

if (window.jQuery) {  
   $(function(){
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

function addShop(action){
    var num=$(".numero").html();
    if(action=="mas"){
        num++;
    }
    if(action=="menos"){
       if(num>0)num--;
   } 
   localStorage.setItem("num",num);
   $(".numero").html(num);
   return false;
}
$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
}