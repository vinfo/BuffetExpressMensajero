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
		var LocsD = [],route=[],orders="",clas="",cont=0;

		var coordinates= localData['coordinates'].split(',');
		LocsD.push({
			lat: coordinates[0], 
			lon: coordinates[1],
			title: 'Punto Inicial',
			html: '<h3>Cocina Laureles</h3>',
			icon: 'images/puntero_cocina.png',
			visible: true
		});
		var data= ajaxrest.getOrders();

		if(data.length>0){			
			for(var j=0;j<data.length;j++){
				cont+=1;
				var coord= data[j].coordinates.split(',');
				var ord=data[j].id_r;
				var dir="";
				if(data[j].address!=null && data[j].address!="")dir+=data[j].address+'. ';
				if(data[j].type!=null && data[j].type!="")dir+=data[j].type+'. ';
				if(data[j].num!=null && data[j].num!="")dir+=data[j].num+'. ';								
				if(data[j].reference!=null && data[j].reference!="")dir+=data[j].reference+'. ';
				LocsD.push({
					lat: coord[0],
					lon: coord[1],
					title: 'Orden #'+cont,
					html: '<h3>Orden # %index - ID# '+ord+' </h3>'+data[j].name+' '+data[j].lastname+'<br/>'+dir,
					stopover: true,
					visible: true,
					icon: 'images/rastreo_'+cont+'.png'
				});	
			}
		}else{
			orders+='<div class="norecords">No existen ordenes asignadas para entregar!</div>';
			localStorage.removeItem("routes");
		}	
		LocsD.push({
			lat: coordinates[0], 
			lon: coordinates[1],
			title: 'Punto Final'
		});

		new Maplace({
			locations: LocsD,
			map_div: '#gmap-route',
			generate_controls: true,
			show_markers: false,
			type: 'directions',
			draggable: false,
			directions_panel: '#route',
			afterRoute: function(dist_time) {
				/*$('#kms').text((dist_time[0]/1000));*/
				$('#min').text(Math.round((dist_time[1]/60)));
			}
		}).Load();
					
		


		$("#contenedor").html(orders);								
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