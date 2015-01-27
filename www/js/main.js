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
		.when('/ruta', {
			templateUrl : 'templates/ruta.html',
			controller 	: 'rutaController'
		})	
		.when('/mi_cuenta', {
			templateUrl : 'templates/mi_cuenta.html',
			controller 	: 'mi_cuentaController'
		})
		.when('/notificar', {
			templateUrl : 'templates/notificaciones.html',
			controller 	: 'notificacionesController'
		})	
		.when('/detalle', {
			templateUrl : 'templates/detalles.html',
			controller 	: 'detallesController'
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
		var data= ajaxrest.getOrders();
		var route=[];
		var orders="";
		var clas="";
		if(data.length>0){			
			for(var j=0;j<data.length;j++){
				route.push(data[j].coordinates);
			}
			localStorage.setItem("coordinates",JSON.stringify(route));
			calcRoute(0);
			var routes= JSON.parse(localStorage.routes);
			for (var i = 0; i < routes.legs.length; i++) {
				orders+='<div id="1" class="tr orden"><div class="td"><label>1</label></div><div class="td"><label>safsafsaf</label><span>Tetsasfdsaf</span></div><div class="td"><img src="images/enruta_ok.png" alt="Entregado" title="Entregado" /></div></div><div id="detail_1" class="vrdirc"><div><b>Oficina </b><span>104</span><b>Cerca a </b><span>xxxxxxxxxxxxx</span><b>Valor </b><span>$13.000</span></br><b>Min. Estimados </b><span>15</span><img src="images/cronometro.png" width="14" alt="Tiempo en ruta" title="Tiempo en ruta" /> <span>15</span></div><ul> <li>item 1</li> <li>item 2</li> <li>item 3</li> <li>item 4</li> <li>item 5</li>  </ul> <div class="btns"><input name="rechazado" type="button" value="Rechazado" class="rechazado" /><input name="notificar" type="button" value="Notificar" class="notificar" /><input name="entregado" type="button" value="Entregado" class="entregado" /></div></div>';				
			}
		}else{
			orders+='<div class="norecords">No existen ordenes asignadas para entregar!</div>';
		}
		$("#contenedor").html(orders);								
	});	

	angularRoutingApp.controller('notificacionesController', function($scope) {
		$scope.message = 'Esta es la página de "Login"';
	});
	
	angularRoutingApp.controller('detallesController', function($scope) {
      var summaryPanel = document.getElementById('directions_panel');     
      var ordenes='';
      var total='';
      var time=0;
      var kms=0;
	  var route= JSON.parse(localStorage.routes);
if(localStorage.routes){
      for (var i = 0; i < route.legs.length; i++) {
        var routeSegment = i+1;
        var lat= route.legs[i].start_location.k;
        var lng= route.legs[i].start_location.D;
        ordenes += '<b>Paso #' + routeSegment + ' (Aprox. '+ route.legs[i].distance.text + ', '+ route.legs[i].duration.text +'): </b><br>';
        ordenes += 'Desde: ('+ lat+ ','+ lng +') '+route.legs[i].start_address + '<br>';
        ordenes += 'Hasta: '+ route.legs[i].end_address + '<br>';

		ordenes += '<ul>';
		var steps = route.legs[i].steps;
		for (j=0;j<steps.length;j++) {            
            ordenes += "<li>"+steps[j].instructions;
            var dist_dur = "";
            if (steps[j].distance && steps[j].distance.text) dist_dur += "&nbsp;"+steps[j].distance.text;
            if (steps[j].duration && steps[j].duration.text) dist_dur += "&nbsp;"+steps[j].duration.text;
            if (dist_dur != "") {
              ordenes += "("+dist_dur+")<br /></li>";
            } else {
              ordenes+= "</li>";
            }
          }
		ordenes += '</ul><hr>';

        kms+=route.legs[i].distance.value;
        time+=route.legs[i].duration.value;
      }
      var mins= JSON.parse(ajaxrest.getValueTipo(93));
      var min= parseInt(mins[0].valor_tipo)*60;      
      if(kms>0)kms= Math.round((kms/1000) * 100) / 100;
      if(time>0)time= Math.round(((time+min)/60) * 100) / 100;
      total = '<div class="totales"><b>Total ruta: ' + kms + ' kms, Tiempo aprox.: '+ time +' min</b></div>';
      summaryPanel.innerHTML = total +''+ ordenes;
  }else{
  	summaryPanel.innerHTML = '';
  }
	});	

	angularRoutingApp.controller('mi_cuentaController', function($scope) {
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


	angularRoutingApp.controller("rutaController", ["$scope", function ($scope) {
		$("li").removeClass("active");
		$(".menupie ul li:nth-child(2)").addClass("active");
		
		var alto= parseInt($(".container").height()) - parseInt($(".menupie a img").height()*2);
		
		$(".gmap").css("height",alto+"px");
		$(".pedidotar").css("bottom",$(".menupie a img").height()+"px");

		

		$scope.minutes="N/A";
		if(localStorage.position){
			var position= JSON.parse(localStorage.position);
			$scope.Area = { Name: "Mi ubicación", Latitude: position.lat, Longitude: position.lng };
		}
				
		if(localStorage.dimension>400){
			$("#areaMap").css("height","1100px");
		}else{
			$("#areaMap").css("height","600px");
		}
	}]);

	/* Directivas */
	/*angularRoutingApp.directive('areaBasedGoogleMap', function () {
		return {
			restrict: "A",
			template: "<div id='areaMap'></div>",
			scope: {           
				area: "=",
				zoom: "="
			},
			controller: function ($scope) {
				var mapOptions;
				var map;           
				var marker;
				var zone= JSON.parse(localStorage.zona);
				var position= JSON.parse(localStorage.position);				
				var MyPosition = new google.maps.LatLng(position.lat, position.lng);										

				var initialize = function () {
					directionsDisplay = new google.maps.DirectionsRenderer({
						suppressMarkers : false
					});
					var lat= 6.230539;
					if(position.lat)lat= position.lat;
					var lng= -75.570672;
					if(position.lng)lng= position.lng;

					mapOptions = {
						zoom: 6,
						panControl: false,
						center: new google.maps.LatLng(lat,lng),
						mapTypeId: google.maps.MapTypeId.ROADMAP
					};
					map = new google.maps.Map(document.getElementById('areaMap'), mapOptions);
					calcRoute(1);
					var homeControlDiv = document.createElement('div');
					var homeControl = new HomeControl(homeControlDiv, map);			

					homeControlDiv.index = 9999;
					map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);
					directionsDisplay.setMap(map);
				};

				var createMarker = function (area) {
					var position = new google.maps.LatLng(area.Latitude, area.Longitude);
					map.setCenter(position);
					marker = new google.maps.Marker({
						map: map,
						position: position,
						title: area.Name,
						icon: 'images/puntero_dom.png'
					});               
				};

				var createKML = function (src) {
					var kmlLayer = new google.maps.KmlLayer(src, {
						suppressInfoWindows: true,
						preserveViewport: false,
						map: map
					});             
				};

				var HomeControl = function (controlDiv, map) {
					controlDiv.style.padding = '5px';

					var controlUI = document.createElement('div');
					controlUI.style.backgroundColor = 'white';
					controlUI.style.borderStyle = 'solid';
					controlUI.style.borderWidth = '2px';
					controlUI.style.cursor = 'pointer';
					controlUI.style.textAlign = 'center';
					controlUI.title = 'Click para ir a Mí Ubicación';
					controlDiv.appendChild(controlUI);

					var controlText = document.createElement('div');
					controlText.style.fontFamily = 'Arial,sans-serif';
					controlText.style.fontSize = '12px';
					controlText.style.paddingLeft = '4px';
					controlText.style.paddingRight = '4px';
					controlText.innerHTML = '<b>Mí Ubicación</b>';
					controlUI.appendChild(controlText);

					google.maps.event.addDomListener(controlUI, 'click', function() {
						map.setCenter(MyPosition)
					});
				}; 				           

				$scope.$watch("area", function (area) {
					if (area != undefined) {
						createMarker(area);
						createKML(localStorage.getItem("domain")+'resources/kmls/zona_total.kml');
						createKML(localStorage.getItem("domain")+'resources/kmls/'+localData['code']+'.kml');
					}
				});
				initialize();
			},
		};
	});*/