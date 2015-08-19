// JavaScript Document
//var globalip = "192.168.1.3:1837";
var globalip = "50.116.21.72:1837";
var token = "";
angular.module('ionicApp', ['ionic','ngCordova','starter.controllers'])
.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
   .state('signin', {
      url: "/sign-in",
      templateUrl: "sign-in.html",
      controller: 'SignInCtrl'
    })
    .state('forgotpassword', {
		  url: "/forgot-password",
		  templateUrl: "forgot-password.html",
		  controller: 'forgotCtrl'
    })
	.state('signup', {
		  url: "/signup",
		  templateUrl: "signup.html",
		  controller: 'signupCtrl'
    })
	.state('signup2', {
		  url: "/signup2",
		  templateUrl: "signup2.html",
		  controller: 'signupCtrl'
    })
	.state('signup3', {
		  url: "/signup3",
		  templateUrl: "signup3.html",
		  controller: 'signupCtrl'
    })
    .state('eventmenu', {
      url: "/event",
      abstract: true,
      templateUrl: "templates/event-menu.html",
	  controller: 'menuCtrl'
    })
    .state('eventmenu.home', {
      url: "/home",
      views: {
        'menuContent' :{
          templateUrl: "templates/home.html"
        }
      }
    })
    .state('eventmenu.checkin', {
      url: "/check-in",
      views: {
        'menuContent' :{
          templateUrl: "templates/check-in.html",
          controller: "CheckinCtrl"
        }
      }
    })
	.state('eventmenu.thermostat', {
		url: "/thermostat",
		views: {
			'menuContent' :{
			  templateUrl: "templates/thermostat.html",
			  controller: "Locationlist"
		}
		}
    })
	.state('eventmenu.thermostatlist', {
		url: "/thermostatlist/:locid",
		views: {
			'menuContent' :{
			  templateUrl: "templates/thermostatlist.html",
			  controller: "Thermostatlist"
		}
		}
    })
	.state('eventmenu.schedulelist', {
      url: "/schedulelist/:id",
      views: {
        'menuContent' :{
          templateUrl: "templates/schedulelist.html",
		  controller: "ScheduleCtrl"
        }
      }
    })
	 .state('eventmenu.messages', {
      url: "/messages",
      views: {
        'menuContent' :{
          templateUrl: "templates/messages.html",
        }
      }
    })
	 .state('eventmenu.compose', {
      url: "/compose",
      views: {
        'menuContent' :{
          templateUrl: "templates/compose.html",
		  controller: "compose"
        }
      }
    })
	 .state('eventmenu.receive', {
      url: "/receive",
      views: {
        'menuContent' :{
          templateUrl: "templates/receive.html",
		  controller: "receiveCtrl"
        }
      }
    })
	 .state('eventmenu.sent', {
      url: "/sent",
      views: {
        'menuContent' :{
          templateUrl: "templates/sent.html",
		  controller: "sentCtrl"
        }
      }
    })
	.state('eventmenu.amenities', {
      url: "/amenities",
      views: {
        'menuContent' :{
          templateUrl: "templates/amenities.html",
		  controller: "amenitiesCtrl"
		}
      }
    })
	.state('eventmenu.monitoring', {
      url: "/monitoring",
      views: {
        'menuContent' :{
          templateUrl: "templates/monitoring.html",
		  controller: "monitoringCtrl"
		}
      }
    })
	.state('eventmenu.sensorconfig', {
      url: "/sensorconfig",
      views: {
        'menuContent' :{
          templateUrl: "templates/sensorconfig.html",
		  controller: "sensorconfigCtrl"
		}
      }
    })
	.state('eventmenu.changepassword', {
      url: "/changepassword",
      views: {
        'menuContent' :{
          templateUrl: "templates/changepassword.html",
		  controller: "setting"
		}
      }
    })
    .state('eventmenu.attendees', {
      url: "/attendees",
      views: {
        'menuContent' :{
          templateUrl: "templates/attendees.html",
          controller: "MyCtrl1"
        }
      }
    })
	.state('eventmenu.detail', {
    url: "/detail/:sensor_id?sensor_type?sensor_name?schedule_name?sensor_type_id?sensor_status",
    views: {
      'menuContent': {
        controller:'DetailCtrl',
        templateUrl: "templates/detail.html"
      }
    }
  })
  .state('eventmenu.setting', {
      url: "/setting",
      views: {
        'menuContent' :{
          templateUrl: "templates/setting.html",
		  controller: "setting"
        }
      }
    })
  $urlRouterProvider.otherwise("/sign-in");
})

.directive('fancySelect', 
    [
        '$ionicModal',
        function($ionicModal) {
            return {
                /* Only use as <fancy-select> tag */
                restrict : 'E',

                /* Our template */
                templateUrl: 'fancy-select.html',

                /* Attributes to set */
                scope: {
                    'items'        : '=', /* Items list is mandatory */
                    'text'         : '=', /* Displayed text is mandatory */
                    'value'        : '=', /* Selected value binding is mandatory */
                    'callback'     : '&'
                },

                link: function (scope, element, attrs) {

                    /* Default values */
                    scope.multiSelect   = attrs.multiSelect === 'true' ? true : false;
                    scope.allowEmpty    = attrs.allowEmpty === 'false' ? false : true;

                    /* Header used in ion-header-bar */
                    scope.headerText    = attrs.headerText || '';

                    /* Text displayed on label */
                    // scope.text          = attrs.text || '';
                    scope.defaultText   = scope.text || '';

                    /* Notes in the right side of the label */
                    scope.noteText      = attrs.noteText || '';
                    scope.noteImg       = attrs.noteImg || '';
                    scope.noteImgClass  = attrs.noteImgClass || '';
                    
                    /* Optionnal callback function */
                    // scope.callback = attrs.callback || null;

                    /* Instanciate ionic modal view and set params */

                    /* Some additionnal notes here : 
                     * 
                     * In previous version of the directive,
                     * we were using attrs.parentSelector
                     * to open the modal box within a selector. 
                     * 
                     * This is handy in particular when opening
                     * the "fancy select" from the right pane of
                     * a side view. 
                     * 
                     * But the problem is that I had to edit ionic.bundle.js
                     * and the modal component each time ionic team
                     * make an update of the FW.
                     * 
                     * Also, seems that animations do not work 
                     * anymore.
                     * 
                     */
                    $ionicModal.fromTemplateUrl(
                        'fancy-select-items.html',
                          {'scope': scope}
                    ).then(function(modal) {
                        scope.modal = modal;
                    });

                    /* Validate selection from header bar */
                    scope.validate = function (event) {
                        // Construct selected values and selected text
                        if (scope.multiSelect == true) {

                            // Clear values
                            scope.value = '';
                            scope.text = '';

                            // Loop on items
                            jQuery.each(scope.items, function (index, item) {
                                if (item.checked) {
                                    scope.value = scope.value + item.id+';';
                                    scope.text = scope.text + item.text+', ';
                                }
                            });

                            // Remove trailing comma
                            scope.value = scope.value.substr(0,scope.value.length - 1);
                            scope.text = scope.text.substr(0,scope.text.length - 2);
                        }

                        // Select first value if not nullable
                        if (typeof scope.value == 'undefined' || scope.value == '' || scope.value == null ) {
                            if (scope.allowEmpty == false) {
                                scope.value = scope.items[0].id;
                                scope.text = scope.items[0].text;

                                // Check for multi select
                                scope.items[0].checked = true;
                            } else {
                                scope.text = scope.defaultText;
                            }
                        }

                        // Hide modal
                        scope.hideItems();
                        
                        // Execute callback function
                        if (typeof scope.callback == 'function') {
                            scope.callback (scope.value);
                        }
                    }

                    /* Show list */
                    scope.showItems = function (event) {
                        event.preventDefault();
                        scope.modal.show();
                    }

                    /* Hide list */
                    scope.hideItems = function () {
                        scope.modal.hide();
                    }

                    /* Destroy modal */
                    scope.$on('$destroy', function() {
                      scope.modal.remove();
                    });

                    /* Validate single with data */
                    scope.validateSingle = function (item) {

                        // Set selected text
                        scope.text = item.text;

                        // Set selected value
                        scope.value = item.id;

                        // Hide items
                        scope.hideItems();
                        
                        // Execute callback function
                        if (typeof scope.callback == 'function') {
                            scope.callback (scope.value);
                        }
                    }
                }
            };
        }
    ]
)

.service('CalcService', function($rootScope,$ionicPopup,$cordovaLocalNotification){
	var socket = null;
	
	this.connect = function() { 
		var slocid = localStorage.getItem("slocid");
		var orgid = localStorage.getItem("orgid");
		var userid = localStorage.getItem("userid");
		var thermid = localStorage.getItem("thermid");
		var token = localStorage.getItem("token");
		var msg = '{"socketname" : "add_con_website","thermostatid" : "268249152-f8c4d6d753ff0fcc","thermid" : "'+thermid+'","slocid" : "'+slocid+'" , "orgid" : "'+orgid+'","userid" :"'+userid+'","token":"'+token+'"}';
		if (socket !== null)return;

		socket = new WebSocket('ws://50.116.21.72:1837');

	    socket.onopen = function() {
	        console.log('open');
			send(msg);
	    };

		socket.onmessage = function(e) {
			var x = JSON.parse(e.data);
			if(x[0].socketname == "new_message"){
				$cordovaLocalNotification.add({
						title: "Notifciation",
						message : "Message received"
				});
			}
			if(x[0].socketname == "hvac_updates"){
				var thermid = localStorage.getItem("thermid");
				var thermname = localStorage.getItem("thermame");
				$rootScope.$broadcast('eventThermname',{thermname:thermname,thermid:thermid});
			}
			
			if(x[0].socketname == "watcher"){
				var thermid = localStorage.getItem("thermid");
				if(x[0].thermid == thermid){
					if(x[0].thermostatonoff == "N"){
						$("#hvac_desktop").css({"pointer-events":"none","opacity":"0.4"});
						$("#rootcontrol_desktop").css({"pointer-events":"none","opacity":"0.4"});
						
						$rootScope.$broadcast('eventWatcher');
						
						$ionicPopup.show({
							template: '',
							title: 'No thermostat in selected location',
							buttons: [
							{ 
							  text: 'Ok',
							  type: 'button-assertive'
							},
							]
						})
					}
					if(x[0].thermostatonoff == "Y"){
						$("#hvac_desktop").css({"pointer-events":"auto","opacity":"1"});
						$("#rootcontrol_desktop").css({"pointer-events":"auto","opacity":"1"});
					}
				}
			}
	
		};

	    socket.onclose = function(e) {
	    	// e.reason ==> total.js client.close('reason message');
			$('button[name="open"]').attr('disabled', false);
	    };
 	}
	
	function send(msg) { 
		if(socket !== null && msg.length > 0)socket.send(msg);
	}
	
	this.disconnect = function(msg) { 
		if (socket === null)
			return;
		$('button[name="close"],button[name="send"],button[name="rename"]').attr('disabled', true);
		$('button[name="open"]').attr('disabled', false);
		socket.close();
		socket = null;
	}
})