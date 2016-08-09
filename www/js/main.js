	// Creación del módulo
	var angularRoutingApp = angular.module('angularRoutingApp', ["ngRoute","ngSanitize"]);
	var localData = JSON.parse(localStorage.getItem('cuenta'));
	var base_url="http://buffetexpress.com.co/REST/";	

	// Configuración de las rutas
	angularRoutingApp.config(function($routeProvider) {
		$routeProvider
		.when('/', {
			templateUrl : 'templates/index.html',
			controller 	: 'mainController'
		})		
		.when('/ordenes', {
			templateUrl : 'templates/ordenes.html',
			controller 	: 'ordenesController'
		})
		.when('/programacion', {
			templateUrl : 'templates/programacion.html',
			controller 	: 'programacionController'
		})		
		.when('/mi_cuenta', {
			templateUrl : 'templates/mi_cuenta.html',
			controller 	: 'mi_cuentaController'
		})
		.otherwise({
			redirectTo: '/'
		});
	});

	angularRoutingApp.controller('mainController', function($scope,$location){
		localStorage.coordinates='';
		localStorage.removeItem("flagScreen");
		if(localStorage.cuenta){
			$scope.mi_cuenta="#mi_cuenta";
		}else{
			$scope.mi_cuenta="login.html";
			window.location = "login.html";	
		}		
		$scope.closeSession = function () {				
			localStorage.removeItem("cuenta");
			$scope.mi_cuenta="login.html";
			window.location = "login.html";	
		},
		$scope.cleanRoutes = function () {			
			var conf= confirm("Esta seguro que desea liberar la ruta?");
			if(conf){
				ajaxrest.cleanRoutes();
				localStorage.removeItem("ordenes");
				localStorage.removeItem("routes");
				$("#route").html('');
				alert("Domiciliario liberado de ruta");
				localStorage.setItem("num_ordenes",JSON.stringify({route:0,num:0}));				
				getRoutes();
			}
			localStorage.removeItem("flagScreen");
			$(".latermenu").animate({"left":-412},200);			
		},
		$scope.refreshOrders = function (){
			window.location = "internal.html#/ordenes";	
		}														
	});		

	angularRoutingApp.controller('ordenesController', function($scope,$location,$interval){
		$(".links").attr("href","");			
		getRoutes();
		ajaxrest.getOrders();			
		var timer= $interval(function(){
			if ( $("#lordenes").length > 0 ) {				
				if(localStorage.num_ordenes && !localStorage.flagScreen){
					var num_orders= JSON.parse(localStorage.num_ordenes);
					var getOrders = ajaxrest.getOrders();
					if(getOrders.length>0 && (getOrders.length != num_orders.num))getRoutes();	
				}else{
					localStorage.setItem("num_ordenes",JSON.stringify({route:0,num:0}));
				}
			}			
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
			ajaxrest.setTracking();			
		},15000);
		$(".pedidotar").css({"bottom":$(".menupie").height()+"px"});	
		localStorage.setItem("request","true");
		//setTimeout(function(){ getOrdens(); }, 5000);	
		getSummary();
	});
	
	angularRoutingApp.controller('programacionController', function($scope,$location,$interval){		
		$(".links").attr("href","internal.html");
		$(".latermenu").animate({"left":-412},200);
		var data= ajaxrest.getAgendaDomiciliario();	
		//var dat = angular.fromJson(data);
	});	

	angularRoutingApp.controller('mi_cuentaController', function($scope) {
		$(".links").attr("href","internal.html");
		$(".latermenu").animate({"left":-412},200);	
		if(localData!=null && localData!=""){		
			var data= ajaxrest.getUser("email="+localData['email']+"&token="+localStorage.token);	
			var dat = angular.fromJson(data);
			$scope.email = localData['email'];
			$scope.name = dat[0].name;
			$scope.lastname = dat[0].lastname;
			$scope.cellPhone = dat[0].cellPhone;
		}else{
			window.location = "login.html";	
		}	
	});