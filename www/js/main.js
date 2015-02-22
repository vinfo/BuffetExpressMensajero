	// Creación del módulo
	var angularRoutingApp = angular.module('angularRoutingApp', ["ngRoute","ngSanitize"]);
	var localData = JSON.parse(localStorage.getItem('cuenta'));
	var base_url="http://buffetexpress.co/REST/";	

	// Configuración de las rutas
	angularRoutingApp.config(function($routeProvider) {
		$routeProvider
		.when('/', {
			templateUrl : 'templates/ordenes.html',
			controller 	: 'ordenesController'
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
		}										
	});		

	angularRoutingApp.controller('ordenesController', function($scope,$location){		
		$(".links").attr("href","");
		getOrdens();
		setInterval(function(){
			getOrdens();
		}, 30000);
		setInterval(function(){
			getPosition();
			if(localStorage.position!=localStorage.position2){
				ajaxrest.setTracking();
				localStorage.setItem("position",localStorage.position2);
			}
		}, 60000);
		$(".pedidotar").css({"bottom":$(".menupie").height()+"px"});										
	});	

	angularRoutingApp.controller('mi_cuentaController', function($scope) {
		$(".links").attr("href","internal.html");
		$scope.changeRoute = function(url, forceReload) {
			$scope = $scope || angular.element(document).scope();
			if(forceReload || $scope.$$phase) {
				window.location = url;
			} else {
				$location.path(url);
				$scope.$apply();
			}
		};
		
		if(localData!=null && localData!=""){		
			var data= ajaxrest.getUser("email="+localData['email']+"&token="+localStorage.token);	
			var dat = angular.fromJson(data);
			$scope.email = localData['email'];
			$scope.name = dat[0].name;
			$scope.lastname = dat[0].lastname;
			$scope.cellPhone = dat[0].cellPhone;
		}else{
			$scope.changeRoute('login.html#/login');
		}	
	});