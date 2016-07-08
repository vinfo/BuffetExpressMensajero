/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 var networkStat;
 var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("offline", checkConnection, false);        
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        //alert("Iniciando app..");
        //app.receivedEvent('deviceready');
        screen.lockOrientation('portrait-primary');
        //navigator.splashscreen.show();
        checkConnection();
        getDeviceProperty();
        navigator.splashscreen.hide();


        var callbackFn = function(location) {
            console.log('[js] BackgroundGeolocation callback:  ' + location.latitude + ',' + location.longitude);
     
            // Do your HTTP request here to POST location to your server. 
            // jQuery.post(url, JSON.stringify(location)); 
            backgroundGeolocation.finish();
        };
     
        var failureFn = function(error) {
            console.log('BackgroundGeolocation error');
        };    
        backgroundGeolocation.configure(callbackFn, failureFn, {
            desiredAccuracy: 10,
            stationaryRadius: 20,
            distanceFilter: 30,
            debug: true, // <-- enable this hear sounds for background-geolocation life-cycle. 
            stopOnTerminate: false, // <-- enable this to clear background location settings when the app terminates 
        });
        backgroundGeolocation.start();

    }
};

function checkConnection() {
    var state=true;
    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection'; 
    
    var page=getNameURLWeb();
    if(states[networkState]=='No network connection'){
        //navigator.notification.beep(1);        
        if(page!="offline.html"){
            alert('Internet es requerido!');        
            window.location.href = 'offline.html';
        }
        //throw new Error('No Internet Connection.');  
        state=false;                            
    }else{
        if(page=="offline.html")window.location.href = 'index.html';
    }
    return state;
}

function getDeviceProperty()
{
     var deviceOS  = device.platform  ;  //fetch the device operating system
     var deviceOSVersion = device.version ;  //fetch the device OS version
     localStorage.setItem("OS",deviceOS); 
         /* alert("Device OS: " + deviceOS); 
          alert("Device OS Version: " + deviceOSVersion);
          */
 }
 function getNameURLWeb(){
   var sPath = window.location.pathname;
   var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
   return sPage;
}