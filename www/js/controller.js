// JavaScript Document
angular.module('starter.controllers', [])

.controller('MainCtrl', function($scope, $ionicSideMenuDelegate) {
  $scope.attendees = [
    { firstname: 'Nicolas', lastname: 'Cage' },
    { firstname: 'Jean-Claude', lastname: 'Van Damme' },
    { firstname: 'Keanu', lastname: 'Reeves' },
    { firstname: 'Steven', lastname: 'Seagal' }
  ];
  
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
})

.controller('menuCtrl', function($scope, $ionicSideMenuDelegate,$state,CalcService,$window) {
	token = localStorage.getItem("token");
	
	$scope.logout = function() {
		localStorage.setItem("userid",-1);
		localStorage.setItem("logoutyn",1);
		localStorage.setItem("slocid",-1);
		localStorage.setItem("orgid",-1);
		localStorage.setItem("thermame",-1); 
		localStorage.setItem("thermid",-1);
		localStorage.setItem("token",-1);
		CalcService.disconnect();
		$state.go('signin');
		setTimeout(function () {
			window.location.reload(1);
		},10); 
  	};
})

.controller('SignInCtrl', function($scope,$state,$http,$ionicPopup,$rootScope) {
	var userid = localStorage.getItem("userid");
	var username = localStorage.getItem("localusername");
	
	var logoutyn = localStorage.getItem("logoutyn");
	console.log(username);
	console.log(logoutyn);
	if((username != null) && (username != -1) && (logoutyn != 1)){
		var password = localStorage.getItem("localpassword");
		var data_parameters = "username="+username+ "&password="+password;
		$http.post("http://"+globalip+"/userauth",data_parameters, {
			headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
		})
		.success(function(response) {
			if(response[0].status == "Y"){
				localStorage.setItem("therm_online",response[0].online);
				$state.go('eventmenu.checkin');
			}
		});
	}
	else{
		if((localStorage.getItem("localusername") != null) && (localStorage.getItem("localpassword") != null)){
			var uname = localStorage.getItem("localusername");
			var upassword = localStorage.getItem("localpassword");
			$scope.user = {
				username: uname,
				password : upassword,
				remember : true
			}
		}
		else{
			$scope.user = {
				username: '',
				password : '',
				remember : false
			};
		}
		$scope.signIn = function(user) {
			var username = user.username;
			var password = user.password;
			var check = user.remember;
			
			if(typeof username === "undefined" || typeof password === "undefined" || username == "" || password == ""){
				$ionicPopup.show({
				  template: '',
				  title: 'Please fill all fields',
				  scope: $scope,
				  buttons: [
					{ 
					  text: 'Ok',
					  type: 'button-assertive'
					},
				  ]
				})
			}
			else{
				var data_parameters = "username="+username+ "&password="+password;
				$http.post("http://"+globalip+"/userauth",data_parameters, {
					headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
				})
				.success(function(response) {
					if(response[0].status == "Y"){
						/*if(check){
							localStorage.setItem("localpassword",password);
						}*/
						localStorage.setItem("localpassword",password);
						localStorage.setItem("localusername",username);
						localStorage.setItem("userid", response[0].user_id);
						localStorage.setItem("slocid",response[0].sloc_id);
						localStorage.setItem("orgid", response[0].org_id);
						localStorage.setItem("thermame",response[0].thermostat_name);
						localStorage.setItem("thermid",response[0].therm_id);
						localStorage.setItem("token",response[0].token);
						localStorage.setItem("therm_online",response[0].online);
						$rootScope.$broadcast('eventThermname',{thermname:response[0].thermostat_name,thermid:response[0].therm_id});
						
						$state.go('eventmenu.checkin');
					}
					else{
						$ionicPopup.show({
						  template: '',
						  title: 'Username or password is wrong',
						  scope: $scope,
						  buttons: [
							{
							  text: 'Ok',
							  type: 'button-assertive'
							},
						  ]
						})
					}
				});
			}
		};
	}
})

.controller('forgotCtrl', function($scope,$state,$http,$ionicPopup){
	$scope.user = {email: ''};
	$scope.forget = function(user) {
		var email = user.email;
		var flag = "A";
		
		if(email != ""){
			var data_parameters = "slocid="+0+ "&orgid="+0+ "&id="+0+ "&emailid="+email+ "&flag="+flag;
			$http.post("http://"+globalip+"/email_exists",data_parameters, {
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
			})
			.success(function(response){
				if(response[0].status == "N"){
					$ionicPopup.show({
					  template: '',
					  title: 'Email address not registered.',
					  scope: $scope,
					  buttons: [
						{
						  text: 'Ok',
						  type: 'button-assertive'
						},
					  ]
					})
				}else{
					sendmail(email);
				}
			});
		}
		else{
			$ionicPopup.show({
			  template: '',
			  title: 'Please enter email address.',
			  scope: $scope,
			  buttons: [
				{
				  text: 'Ok',
				  type: 'button-assertive'
				},
			  ]
			})
		}
	}
	
	function sendmail(email){
		var data_parameters = "emailid="+email;
		$http.post("http://"+globalip+"/forgot_password",data_parameters, {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		})
		.success(function(response){
			$scope.user = {email: ''};
			$ionicPopup.show({
			  template: '',
			  title: 'An email has been sent to the email address.',
			  scope: $scope,
			  buttons: [
				{
				  text: 'Ok',
				  type: 'button-assertive',
				  onTap:function(e){
            			$state.go('signin');
       				}
				},
			  ]
			})
			
		});
	}
})

.controller('signupCtrl', function($scope,$state,$http,$ionicPopup) {
	
	if((localStorage.getItem("rusername") != null)){
		$scope.user = {
			username: localStorage.getItem("rusername")
		}
	}
	else{
		$scope.user = {
			thermostatname : '',
			thermostatid : '',
			locationname : '',
			username : '',
			email : '',
			password : '',
			cpassword : '',
			companyname : '',
			phone : ''
		};
	}
		
	
	// first validation
	$scope.firstvalidation = function(user) {
		if(user.thermostatid != "" && user.thermostatname != "" && user.locationname != ""){
			var data_parameters = "thermostatid="+user.thermostatid;
			$http.post("http://"+globalip+"/valid_thermostat",data_parameters, {
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
			})
			.success(function(response){
				if(response[0].status != "N")$state.go('signup2');
				else{
					$ionicPopup.show({
						  template: '',
						  title: 'Thermostat ID not valid',
						  scope: $scope,
						  buttons: [
							{ 
							  text: 'Ok',
							  type: 'button-assertive'
							},
						  ]
					})
				}
			});
		}
		else{
			$ionicPopup.show({
				  template: '',
				  title: 'Please fill all fields',
				  scope: $scope,
				  buttons: [
					{ 
					  text: 'Ok',
					  type: 'button-assertive'
					},
				  ]
			})
		}
	};
	
	//second validation
	$scope.secondvalidation = function(user) {
		if(user.username != "" && user.email != "" && user.password != "" && user.cpassword != ""){
			localStorage.setItem("rusername", user.username);
			
			flag = "A";
			var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z\-])+\.)+([a-zA-Z]{2,4})+$/;
			
			var data_parameters = "slocid="+0+ "&orgid="+0+ "&id="+0+ "&username="+user.username+ "&flag="+flag;
			$http.post("http://"+globalip+"/user_exists",data_parameters, {
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
			})
			.success(function(response){
				if(response[0].status == "Y"){
					$ionicPopup.show({
						  template: '',
						  title: 'Username already exists',
						  scope: $scope,
						  buttons: [
							{ 
							  text: 'Ok',
							  type: 'button-assertive'
							},
						  ]
					})
				}
				else{
					if(!filter.test(user.email))
					{
						$ionicPopup.show({
								  template: '',
								  title: 'Please enter valid email',
								  scope: $scope,
								  buttons: [
									{ 
									  text: 'Ok',
									  type: 'button-assertive'
									},
								  ]
							})
					}
					else{
						if(user.password != user.cpassword){
							$ionicPopup.show({
								  template: '',
								  title: "Confirm password didn't match with old password",
								  scope: $scope,
								  buttons: [
									{ 
									  text: 'Ok',
									  type: 'button-assertive'
									},
								  ]
							})
						}
						else $state.go('signup3');	
					}
				}
			});
		}
		else{
			$ionicPopup.show({
				  template: '',
				  title: 'Please fill all fields',
				  scope: $scope,
				  buttons: [
					{ 
					  text: 'Ok',
					  type: 'button-assertive'
					},
				  ]
			})
		}
	};
	
	//third validation
	$scope.thirdvalidation = function(user) {
		if(user.companyname != "" && user.phone != ""){
			var data_parameters = "username="+user.username+ "&password="+user.password+ "&emailid="+user.email+ "&thermostatid="+user.thermostatid+ "&locationname="+user.locationname+ "&companyname="+user.companyname+ "&phoneno="+user.phone+ "&thermostatname="+user.thermostatname;
			$http.post("http://"+globalip+"/signup",data_parameters, {
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
			})
			.success(function(response){
				if(response[0].status == "Y")$state.go('signin');
			});
		}
		else{
			$ionicPopup.show({
				  template: '',
				  title: 'Please fill all fields',
				  scope: $scope,
				  buttons: [
					{ 
					  text: 'Ok',
					  type: 'button-assertive'
					},
				  ]
			})
		}
	};
})

.controller('compose', function($scope,$http,$ionicPopup,$ionicModal,$ionicPlatform,$cordovaLocalNotification) {
	
	$scope.notify = function(){
		$cordovaLocalNotification.add({
				title: "Notifciation",
				message : "Hello Root testing"
		});
	};
	
	$scope.locationload = function(){
		var slocid = localStorage.getItem("slocid");
		var orgid = localStorage.getItem("orgid");
		var userid = localStorage.getItem("userid");
		var flag = "V";
		$scope.user = {msgvalue: ""};
		$scope.countries = [];
		var data_parameters = "slocid="+slocid+ "&orgid="+orgid+ "&flag="+flag+ "&userid="+userid+"&token="+token;
		$http.post("http://"+globalip+"/user_map_therm",data_parameters, {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		})
		.success(function(response){
			for (var i=0; i< response.length; i++) {
					  $scope.countries.push({id : response[i].therm_id,text: response[i].thermostat_name, checked: false, icon: null});
			}
		});
	};
	
	$scope.locationload();
	
	$scope.countries_text_single = 'Choose country';
	$scope.countries_text_multiple = 'Select Thermostat';
	$scope.val =  {single: null, multiple: null};
	
	$scope.sendmessage = function(user){
		var slocid = localStorage.getItem("slocid");
		var orgid = localStorage.getItem("orgid");
		var userid = localStorage.getItem("userid");
		var userarr = "";
		for(var i = 0; i < $scope.countries.length; i++){
			if ($scope.countries[i].checked) {
				userarr += $scope.countries[i].id+",";
			}
		}
		userarr = userarr.substr(0,userarr.length-1);

		if(userarr.length == 0){
			$ionicPopup.show({
			  template: '',
			  title: 'Please select thermostat',
			  scope: $scope,
			  buttons: [
				{ 
				  text: 'Ok',
				  type: 'button-assertive'
				},
			  ]
			})
		}
		else if(user.msgvalue == ""){
			$ionicPopup.show({
			  template: '',
			  title: 'Please fill message',
			  scope: $scope,
			  buttons: [
				{ 
				  text: 'Ok',
				  type: 'button-assertive'
				},
			  ]
			})
		}
		else{
			var data_parameters = "slocid="+slocid+ "&orgid="+orgid+ "&thermid="+userarr+ "&id="+userid+ "&message="+user.msgvalue+"&token="+token;
			$http.post("http://"+globalip+"/send_message_user",data_parameters, {
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
			})
			.success(function(response){
				for(var i = 0; i < $scope.countries.length; i++){
					if ($scope.countries[i].checked) {
						$scope.countries[i].checked = false;
					}
				}
				
				$scope.user = {msgvalue: ""};
				$ionicPopup.show({
					template: '',
					title: 'Message sent',
					scope: $scope,
					buttons: [
						{ 
						  text: 'Ok',
						  type: 'button-assertive'
						},
					]
				})
			});
		}
	};
})

.controller('receiveCtrl', function($scope,$http,$ionicModal, $ionicScrollDelegate,$ionicPopup) {
	var pagenum = 0;
	var status = "Y";
	var globalpagecount = 0;
	$scope.loadMore1 = function() {
		var a = [];
		
		var slocid = localStorage.getItem("slocid");
		var orgid = localStorage.getItem("orgid");
		var userid = localStorage.getItem("userid");
		var thermid = localStorage.getItem("thermid");
		var searchtext = "NA";
		
		var pagecount = 5;
		if(pagenum <= globalpagecount ){
			pagenum += 1;
			var thermid = "3";
			var data_parameters = "slocid="+slocid+ "&orgid="+orgid+ "&userid="+userid+ "&pagenum="+pagenum+ "&pagecount="+pagecount+ "&searchtext="+searchtext+ "&thermid="+thermid+"&token="+token;
			$http.post("http://"+globalip+"/get_inbox",data_parameters, {
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
			})
			.success(function(response){
				if(response[0].status != "N"){
					globalpagecount = response[0].cnt;
					$scope.response = response;
					for (var i=0; i< $scope.response.length; i++) {
						 $scope.items.push({msg:response[i].msg_remarks,sentby:response[i].sent_by,sentdate:response[i].create_dt});
					}
				}
			});
	}
	$scope.$broadcast('scroll.infiniteScrollComplete');
	
	};
	
	$scope.items = [];
	$scope.items1 = [];
	
	$scope.showinboxmsg = function(msg,sentby,sentdate){
		$ionicPopup.show({
			template: '<b>'+"Message : "+'</b>'+msg+'<br>'+'<b>'+"Sent By : "+'</b>'+sentby+'<br>'+'<b>'+"Sent On : "+'</b>'+sentdate,
			title: '<b style="text-align:center">Message Details</b>',
			scope: $scope,
			buttons: [
			{ 
			  text: 'Ok',
			  type: 'button-calm'
			},
			]
		})
	};
	
	$scope.scrollBottom = function() {
   	 	$ionicScrollDelegate.scrollBottom(true);
  	};
	$scope.scrollTop = function(){
		$ionicScrollDelegate.scrollTop(true);
	};
})

.controller('sentCtrl', function($scope,$http,$ionicModal,$ionicScrollDelegate,$ionicPopup) {
	var pagenum = 0;
	var status = "Y";
	var globalpagecount = 0;
	$scope.loadMore = function() {
		var a = []
		
		var slocid = localStorage.getItem("slocid");
		var orgid = localStorage.getItem("orgid");
		var userid = localStorage.getItem("userid");
		var thermid = localStorage.getItem("thermid");
		var searchtext = "NA";
		
		var pagecount = 5;
		if(pagenum <= globalpagecount ){
			pagenum += 1;
			var data_parameters = "slocid="+slocid+ "&orgid="+orgid+ "&userid="+userid+ "&pagenum="+pagenum+ "&pagecount="+pagecount+ "&searchtext="+searchtext+"&token="+token;
			$http.post("http://"+globalip+"/get_sent",data_parameters, {
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
			})
			.success(function(response){
				if(response[0].status != "N"){
					globalpagecount = response[0].cnt;
					$scope.response = response;
					for (var i=0; i< $scope.response.length; i++) {
						var thermliststr = "";
						for(var j = 0; j < $scope.response[i].thermostats.length; j++){
							thermliststr +=  $scope.response[i].thermostats[j].thermostat_name+",";
						}
						thermliststr = thermliststr.substr(0,(thermliststr.length-1))
						$scope.items.push({msg:response[i].msg_remarks,sentdate:response[i].create_dt,list:thermliststr});
					}
			
				}
				
			});
	}
	
	$scope.$broadcast('scroll.infiniteScrollComplete');
	};
	
	$scope.showsentmsg = function(msg,sentdate,list){
		$ionicPopup.show({
			template: '<b>'+"Message : "+'</b>'+msg+'<br>'+'<b>'+"Sent On : "+'</b>'+sentdate+'<br>'+'<b>'+"Thermostat List : "+'</b>'+list,
			title: '<b style="text-align:center">Message Delivery Status</b>',
			scope: $scope,
			buttons: [
			{ 
			  text: 'Ok',
			  type: 'button-calm'
			},
			]
		})
	};
	
	$scope.scrollTop = function(){
		$ionicScrollDelegate.scrollTop(true);
	};
	$scope.items = [];
  
	$scope.scrollBottom = function() {
   	 	$ionicScrollDelegate.scrollBottom(true);
  	};
})


.controller('sensorconfigCtrl', function($scope,$http,$ionicModal,$rootScope,$ionicPopup,$ionicLoading) {
	$ionicLoading.show({template: '<ion-spinner icon="crescent"></ion-spinner>'});
	var sensortype_id = "";
	
  	var slocid = localStorage.getItem("slocid");
	var orgid = localStorage.getItem("orgid");
	var thermid = localStorage.getItem("thermid");
	$scope.themostatname = localStorage.getItem("thermame"); 
	
  	var data_parameters = "slocid="+slocid+ "&orgid="+orgid+ "&thermid="+thermid+"&sensorid="+0+"&token="+token;
	$http.post("http://"+globalip+"/get_sensor",data_parameters, {
		headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
	})
	.success(function(response) {
		if(response[0].status != "N")$scope.response = response;
		else $scope.response = "City";
		$ionicLoading.hide();
	});
	
	$ionicModal.fromTemplateUrl('templates/modal.html', {
  		scope: $scope
  	}).then(function(modal) {
    	$scope.modal = modal;
	});
  	
	//for get room
	var data_parameters = "slocid="+slocid+ "&orgid="+orgid;
	$http.post("http://"+globalip+"/get_room",data_parameters, {
		headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
	})
	.success(function(response) {
		if(response[0].status != "N")$scope.response_room = response;
		else $scope.response_room = "City";
	});
	
	//for get schedule
	var data_parameters = "slocid="+slocid+ "&orgid="+orgid;
	$http.post("http://"+globalip+"/get_schedule",data_parameters, {
		headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
	})
	.success(function(response) {
		if(response[0].status != "N")$scope.response_schedule = response;
		else $scope.response_schedule = "City";
	});
	
	//for get logic board
	var data_parameters = "slocid="+slocid+ "&orgid="+orgid;
	$http.post("http://"+globalip+"/get_logic",data_parameters, {
		headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
	})
	.success(function(response) {
		if(response[0].status != "N")$scope.response_logicboard = response;
		else $scope.response_logicboard = "City";
	});
	
	$scope.editsensor = function(sid,type,devicename,roomid,scheduleid,activeyn,mintemp,maxtemp,sensor_type_id,logicid){
		console.log(logicid);
		sensortype_id = sensor_type_id;
		var activeynt;
		if(activeyn == "Y")activeynt = true;
		else activeynt = false;
		$scope.user = {
			deviceid: sid,
			type: type,
			device: devicename,
			s_room: roomid,
			s_schedule: scheduleid,
			s_logicid: logicid,
			activeyn: activeynt,
			r_id:roomid,
			s_id:scheduleid,
			l_id:logicid,
			mint:mintemp,
			maxt:maxtemp,
			s_type_id:sensor_type_id
		};
		$scope.modal.show();
	}
	
	$scope.updatesensor = function(user){
		var slocid = localStorage.getItem("slocid");
		var orgid = localStorage.getItem("orgid");
		var thermid = localStorage.getItem("thermid");
		var userid = localStorage.getItem("userid");
		
		var flag = 0;
		if(sensortype_id != "2" || sensortype_id != "4"){
			if(user.device == ""){
				$ionicPopup.show({
				  template: '',
				  title: 'Please fill all the fields.',
				  scope: $scope,
				  buttons: [
					{ 
					  text: 'Ok',
					  type: 'button-assertive'
					},
				  ]
				})
				flag = 1;
			}
		}
		
		if(sensortype_id == "4"){
			if(user.maxt == "" || user.mint == "" || user.mint == null || user.maxt == null){
				$ionicPopup.show({
				  template: '',
				  title: 'Please fill all the fields.',
				  scope: $scope,
				  buttons: [
					{ 
					  text: 'Ok',
					  type: 'button-assertive'
					},
				  ]
				})
				flag = 1;
			}
			if(user.mint > user.maxt){
				$ionicPopup.show({
				  template: '',
				  title: 'Low temperature should be less than High temperature.',
				  scope: $scope,
				  buttons: [
					{ 
					  text: 'Ok',
					  type: 'button-assertive'
					},
				  ]
				})
				flag = 1;
			}
		}
		
		if(flag == 0){
			if(user.activeyn)activeynt = "Y";
			else activeynt = "N";
			
			var maxtemp = 0;
			var mintemp = 0;
			var schedule_id = 0;
			var logic_id = 0;
			
			if(sensortype_id == "4"){
				maxtemp = user.maxt;
				mintemp = user.mint;
				schedule_id = user.s_id;
			}
			if(sensortype_id == "2"){
				logic_id = user.l_id;
				if(logic_id == null)logic_id = 0;
			}
			
			var data_parameters = "slocid="+slocid+ "&orgid="+orgid+ "&thermid="+thermid+ "&sensorid="+user.deviceid+ "&sensorname="+user.device+ "&scheduleid="+schedule_id+ "&maxtemp="+maxtemp+ "&mintemp="+mintemp+ "&id="+userid+ "&sensoractiveyn="+activeynt+ "&roomid="+user.r_id+ "&logicid="+logic_id;
			//alert(data_parameters);
			$http.post("http://"+globalip+"/edit_sensor",data_parameters, {
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
			})
			.success(function(response) {
				var data_parameters = "slocid="+slocid+ "&orgid="+orgid+ "&thermid="+thermid+"&sensorid="+0+"&token="+token;
				$http.post("http://"+globalip+"/get_sensor",data_parameters, {
					headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				})
				.success(function(response) {
					$scope.modal.hide();
					if(response[0].status != "N"){
						$scope.response = response;
						$ionicPopup.show({
						  template: '',
						  title: 'Sensor updated successfully',
						  scope: $scope,
						  buttons: [
							{ 
							  text: 'Ok',
							  type: 'button-assertive'
							},
						  ]
						})
					}
					else $scope.response = "City";
				});
			});
		}
	}
	
	$scope.refreshsensorconfiglist = function() {
    	var slocid = localStorage.getItem("slocid");
		var orgid = localStorage.getItem("orgid");
		var thermid = localStorage.getItem("thermid");
		$scope.themostatname = localStorage.getItem("thermame"); 
		
		var data_parameters = "slocid="+slocid+ "&orgid="+orgid+ "&thermid="+thermid+"&sensorid="+0+"&token="+token;
		$http.post("http://"+globalip+"/get_sensor",data_parameters, {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		})
		.success(function(response) {
			if(response[0].status != "N")$scope.response = response;
			else $scope.response = "City";
			$scope.$broadcast('scroll.refreshComplete');
		});
	};
	
	$rootScope.$on('eventThermname', function (event, args) {
		if(args.thermname != "not"){
			localStorage.setItem("thermame",args.thermname);
			localStorage.setItem("thermid",args.thermid); 
		}
		
		var slocid = localStorage.getItem("slocid");
		var orgid = localStorage.getItem("orgid");
		var thermid = localStorage.getItem("thermid");
		
		var data_parameters = "slocid="+slocid+ "&orgid="+orgid+ "&thermid="+thermid+"&sensorid="+0+"&token="+token;
		$http.post("http://"+globalip+"/get_sensor",data_parameters, {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		})
		.success(function(response) {
			if(response[0].status != "N")$scope.response = response;
			else $scope.response = "City";
		});
	});
})


.controller('MyCtrl1', function($scope,$http,$ionicModal,$rootScope,$ionicLoading) {
	
	$ionicLoading.show({template: '<ion-spinner icon="crescent"></ion-spinner>'});
	
	var thermonoff = localStorage.getItem("therm_online");
	if(thermonoff == "N"){
		console.log("thermostat off");
		$("#hvac_desktop").css({"pointer-events":"none","opacity":"0.4"});
		$("#rootcontrol_desktop").css({"pointer-events":"none","opacity":"0.4"});
	}
  	var slocid = localStorage.getItem("slocid");
	var orgid = localStorage.getItem("orgid");
	var thermid = localStorage.getItem("thermid");
	$scope.themostatname = localStorage.getItem("thermame"); 
	
	var data_parameters = "slocid="+slocid+ "&orgid="+orgid+ "&thermid="+thermid+"&token="+token;
	$http.post("http://"+globalip+"/get_root_control",data_parameters, {
		headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
	})
	.success(function(response) {
		if(response[0].status != "N")$scope.response = response;
		else $scope.response = "City";
		$ionicLoading.hide();
	});
  	/*
	* if given group is the selected group, deselect it
	* else, select the given group
	*/
	$scope.doRefresh = function() {
    	console.log('Refreshing!');
		var slocid = localStorage.getItem("slocid");
		var orgid = localStorage.getItem("orgid");
		var thermid = localStorage.getItem("thermid");
		var data_parameters = "slocid="+slocid+ "&orgid="+orgid+ "&thermid="+thermid+"&token="+token;
		$http.post("http://"+globalip+"/get_root_control",data_parameters, {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		})
		.success(function(response) {
			if(response[0].status != "N")$scope.response = response;
			else $scope.response = "City";
			$scope.$broadcast('scroll.refreshComplete');
		});
		
	};
	
	$scope.toggleGroup = function(group) {
		if ($scope.isGroupShown(group)) {
		  $scope.shownGroup = null;
		} else {
		  $scope.shownGroup = group;
		}
	};
	
	$scope.isGroupShown = function(group) {
		return $scope.shownGroup === group;
	};
	
	$rootScope.$on('eventThermname', function (event, args) {
		if(args.thermname != "not"){
			localStorage.setItem("thermame",args.thermname);
			localStorage.setItem("thermid",args.thermid); 
		}
		$("#rootcontrol_desktop").css({"pointer-events":"auto","opacity":"1"});
		var slocid = localStorage.getItem("slocid");
		var orgid = localStorage.getItem("orgid");
		var thermid = localStorage.getItem("thermid");
		$scope.themostatname = localStorage.getItem("thermame");
		
		var data_parameters = "slocid="+slocid+ "&orgid="+orgid+ "&thermid="+thermid+"&token="+token;
		$http.post("http://"+globalip+"/get_root_control",data_parameters, {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		})
		.success(function(response) {
			if(response[0].status != "N")$scope.response = response;
			else $scope.response = "City";
		});
	});
})


.controller('amenitiesCtrl', function($scope,$stateParams,$ionicPopover,$http,$sce,$rootScope,$ionicLoading) {
	$ionicLoading.show({template: '<ion-spinner icon="crescent"></ion-spinner>'});
	$scope.trustSrc = function(src) {
		return $sce.trustAsResourceUrl(src);
	}
	var slocid = localStorage.getItem("slocid");
	var orgid = localStorage.getItem("orgid");
	var thermid = localStorage.getItem("thermid");
	var data_parameters = "slocid="+slocid+ "&orgid="+orgid+ "&thermid="+thermid+"&token="+token;
	$http.post("http://"+globalip+"/get_amenities",data_parameters, {
		headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
	})
	.success(function(response) {
		if(response[0].status != "N"){
			$scope.movie = {src:response[0].amt_url,title:response[0].amt_name};
			$scope.response = response;
		}
		else $scope.response = "no";
		$ionicLoading.hide();
	});
	
	$scope.changeamenities = function(url){
		var ref = window.open(url,'_blank','location=no'); 
		ref.show();
		return false;
	}
	
	$scope.demo = 'ios';
	
	$rootScope.$on('eventThermname', function (event, args) {
		if(args.thermname != "not"){
			localStorage.setItem("thermame",args.thermname);
			localStorage.setItem("thermid",args.thermid);
		}
		var slocid = localStorage.getItem("slocid");
		var orgid = localStorage.getItem("orgid");
		var thermid = localStorage.getItem("thermid");
		var data_parameters = "slocid="+slocid+ "&orgid="+orgid+ "&thermid="+thermid+"&token="+token;
		$http.post("http://"+globalip+"/get_amenities",data_parameters, {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		})
		.success(function(response) {
			if(response[0].status != "N"){
				$scope.movie = {src:response[0].amt_url,title:response[0].amt_name};
				$scope.response = response;
			}
			else $scope.response = "no";
		});
	});
})

.controller('monitoringCtrl', function($scope, $stateParams) {
	$scope.showmonitoring = function(url){
		var ref = window.open(url,'_blank','location=no'); 
		return false;
	}
})

.controller('DetailCtrl', function($scope, $stateParams) {
	console.log($stateParams.sensor_type);
  	$scope.response = $stateParams.sensor_id;
	$scope.response1 = $stateParams.sensor_type;
	$scope.response2 = $stateParams.sensor_name;
	$scope.response3 = $stateParams.schedule_name; 
	$scope.response4 = $stateParams.sensor_type_id;
	$scope.response5 = $stateParams.sensor_status;
})

.controller('Locationlist', function($scope,$http,$rootScope,$ionicPopup,$state,$stateParams) {
	var slocid = localStorage.getItem("slocid");
	var orgid = localStorage.getItem("orgid");
	var userid = localStorage.getItem("userid");
	var flag = "V";
	var data_parameters = "slocid="+slocid+ "&orgid="+orgid+ "&userid="+userid+ "&flag="+flag+"&token="+token;
	$http.post("http://"+globalip+"/user_map_loc",data_parameters, {
		headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
	})
	.success(function(response) {
		$scope.response = response;
	});
	
	$scope.thermostatlist = function(locid) {
		var slocid = localStorage.getItem("slocid");
		var orgid = localStorage.getItem("orgid");
		var	locid = locid;
		
		var data_parameters = "slocid="+slocid+ "&orgid="+orgid+ "&locid="+locid+"&token="+token;
		$http.post("http://"+globalip+"/loc_map_thermostat",data_parameters, {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		})
		.success(function(response) {
			if(response[0].status != "N"){
				$state.go('eventmenu.thermostatlist',{"locid":locid});
			}
			else{
				$ionicPopup.show({
					template: '',
					title: 'Thermostat is offline now.',
					scope: $scope,
					buttons: [
					{ 
					  text: 'Ok',
					  type: 'button-assertive'
					},
					]
				})
			}
		});
	};
})

.controller('Thermostatlist', function($scope,$http,$stateParams,$rootScope) {
	var slocid = localStorage.getItem("slocid");
	var orgid = localStorage.getItem("orgid");
	
	var	locid = $stateParams.locid;
	var data_parameters = "slocid="+slocid+ "&orgid="+orgid+ "&locid="+locid+"&token="+token;
	$http.post("http://"+globalip+"/loc_map_thermostat",data_parameters, {
		headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
	})
	.success(function(response) {
		$scope.response = response;
	});
	
	$scope.thermstat = function(thermid,thermname){
		$("#hvac_desktop").css({"pointer-events":"auto","opacity":"1"});
		$rootScope.$broadcast('eventThermname',{thermname:thermname,thermid:thermid});
	};
})

.controller('sensormappingCtrl', function($scope,$http,$rootScope,$stateParams,$ionicPopup) {
	$scope.rokerList = [{ text: "On", value: "1" },{ text: "Off", value: "0" }];
	$scope.windowList = [{ text: "Open", value: "1" },{ text: "Close", value: "0" }];
	$scope.occupancyList = [{ text: "Occupy", value: "1" },{ text: "Unoccupy", value: "0" }];
	
	$scope.data = {
		sensor_light_id:$stateParams.sensor_id,
		sensor_type_id:$stateParams.sensor_type_id,
		rockerlist:"0",
		occupancylist:"0",
		windowlist:"0"
	};
	
	var slocid = localStorage.getItem("slocid");
	var orgid = localStorage.getItem("orgid");
	var thermid = localStorage.getItem("thermid");
	var userid = localStorage.getItem("userid");
	
	$scope.getunmappedsensor = function(){
		var data_parameters = "slocid="+slocid+ "&orgid="+orgid+ "&thermid="+thermid+ "&sensorid="+$stateParams.sensor_id;
		$http.post("http://"+globalip+"/get_sensor_unmapped",data_parameters, {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		})
		.success(function(response) {
			if(response[0].status != "N"){
				$scope.response_unmapped = response;
			}
			else $scope.response_unmapped = "City";
			$scope.sensor_id = 0; // sensor type id
		})
	}
	
	$scope.getid = function(id){
		var tempid = id.split(",");
		console.log(id);
		if(id == ""){
			mappedsensorid = 0;
		}
		else{
			$scope.sensor_id = tempid[0]; // sensor type id
			mappedsensorid = tempid[1];
			mapped_sensor_type_id = tempid[0];
		}
	}
	
	$scope.getmapped = function(sensor_type_id){
		var logic_status = $("#lightvalue").prop("checked");
		if(logic_status)logic_status = 1;
		else logic_status = 0;
		
		if(mapped_sensor_type_id == "4"){
			mappedsensorstat = $("#setpointrange").val();
			mappedsensorthreshold = $("#setpointvalue").val();
		}
		//console.log(val1+" "+sensorid);
		if(mappedsensorid != 0){
			var data_parameters = "slocid="+slocid+ "&orgid="+orgid+ "&thermid="+thermid+ "&id="+userid+ "&sensorid="+$stateParams.sensor_id+ "&sensortypeid="+$stateParams.sensor_type_id+ "&mappedsensorid="+mappedsensorid+ "&mappedsensortypeid="+mapped_sensor_type_id+ "&mappedsensorstat="+mappedsensorstat+ "&mappedsensorthreshold="+mappedsensorthreshold+ "&sensorstatus="+logic_status;
			console.log(data_parameters);
			$http.post("http://"+globalip+"/sensor_mapping",data_parameters, {
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
			})
			.success(function(response) {
				$scope.getunmappedsensor();
				$ionicPopup.show({
					template: '',
					title: 'Sensor mapped successfully.',
					scope: $scope,
					buttons: [
						{ 
						  text: 'Ok',
						  type: 'button-assertive'
						},
					]
				})
			})
		}
		else{
			$ionicPopup.show({
			  template: '',
			  title: 'Please select sensor',
			  scope: $scope,
			  buttons: [
				{ 
				  text: 'Ok',
				  type: 'button-assertive'
				},
			  ]
			})
		}
	}
	
	var mappedsensorthreshold = 0;
	var mappedsensorstat = 0;
	var mappedsensorid = 0;
	var mapped_sensor_type_id = 0;
	
	$scope.getselectboxval = function(sensorid,val){
		if(sensorid == "1"){
			mappedsensorstat = val;
		}
		if(sensorid == "3"){
			mappedsensorstat = val;
		}
		if(sensorid == "4"){
			mappedsensorstat = $("#setpointrange").val();
			mappedsensorthreshold = $("#setpointvalue").val();
		}
		if(sensorid == "5"){
			mappedsensorstat = val;
		}
	}
	$scope.getunmappedsensor();
})

.controller('sensormappinglistCtrl', function($scope,$http,$rootScope,$stateParams,$ionicModal,$ionicPopup) {
	$scope.editrokerList = [{ text: "On", value: "1"},{ text: "Off", value: "0"}];
	$scope.windowList = [{ text: "Open", value: "1" },{ text: "Close", value: "0" }];
	$scope.occupancyList = [{ text: "Occupy", value: "1" },{ text: "Unoccupy", value: "0" }];
	$scope.threshholdList = [{ text: "Light Status", checked: false }];
	
	var slocid = localStorage.getItem("slocid");
	var orgid = localStorage.getItem("orgid");
	var thermid = localStorage.getItem("thermid");
	var userid = localStorage.getItem("userid");
	
	$scope.getupdatesensor = function(){
		var data_parameters = "slocid="+slocid+ "&orgid="+orgid+ "&thermid="+thermid+ "&sensorid="+$stateParams.sensor_id;
		$http.post("http://"+globalip+"/get_sensor_mapping",data_parameters, {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		})
		.success(function(response) {
			if(response[0].status != "N"){
				var sensor_mapping_data = [];
				for(var i = 0;i <  response.length;i++){
					var status = 0;
					var lightstatus = 0;
					var threshold = 0;
					
					if(response[i].mapped_sensor_type_id == "1"){
						if(response[i].mapped_sensor_stat == "1")status = "On";
						else status = "Off";
					}
					if(response[i].mapped_sensor_type_id == "3"){
						if(response[i].mapped_sensor_stat == "1")status = "Open";
						else status = "Close";
					}
					if(response[i].mapped_sensor_type_id == "5"){
						if(response[i].mapped_sensor_stat == "1")status = "Occupy";
						else status = "Unoccupy";
					}
					if(response[i].mapped_sensor_type_id == "4"){
						if(response[i].mapped_sensor_stat == "H")status = "High";
						else status = "Low";
					}
					
					if(response[i].sensor_status == "1")lightstatus = "On";
					else lightstatus = "Off"
					
					sensor_mapping_data.push({mapped_sensor_id:response[i].mapped_sensor_id,mapped_sensor_name:response[i].mapped_sensor_name,mapped_sensor_stat:response[i].mapped_sensor_stat,mapped_sensor_threshold:response[i].mapped_sensor_threshold,mapped_sensor_type:response[i].mapped_sensor_type,mapped_sensor_type_id:response[i].mapped_sensor_type_id,org_id:response[i].org_id,sensor_id:response[i].sensor_id,sensor_status:response[i].sensor_status,sloc_id:response[i].sloc_id,therm_id:response[i].therm_id,a_mapped_sensor_stat:status,a_sensor_status:lightstatus});
				}
				$scope.response = sensor_mapping_data;
			}
			else $scope.response = "City";
		});
	}
	
	$ionicModal.fromTemplateUrl('templates/editsensormapping.html', {
  		scope: $scope
  	}).then(function(modal) {
    	$scope.modal = modal;
	});
  	
	$scope.show = function(mappedsensorid,mapedsensortype,mappedsensorname,mappedid,lightstatus,mapped_sensor_stat,threshold){
		$scope.edit_mappedsensorid = mappedsensorid+","+mapedsensortype+","+mappedsensorname;
		$scope.sensor_id = mappedid;
		if(lightstatus == "1"){
			$scope.threshholdList = [{ text: "Light Status", checked: true }];
		}else{
			$scope.threshholdList = [{ text: "Light Status", checked: false }];
		}
		
		if(mappedid == "1"){
			if(mapped_sensor_stat == "1")$scope.data = {editrockerlist : "1"};
			else $scope.data = {editrockerlist : "0"};
		}
		if(mappedid == "3"){
			if(mapped_sensor_stat == "1")$scope.data = {editwindowlist : "1"};
			else $scope.data = {editwindowlist : "0"};
		}
		if(mappedid == "5"){
			if(mapped_sensor_stat == "1")$scope.data = {editoccupancylist : "1"};
			else $scope.data = {editoccupancylist : "0"};
		}
		if(mappedid == "4"){
			console.log(mapped_sensor_stat);
			$scope.editsetpointrangeval = mapped_sensor_stat;
			$scope.editthreshold = threshold;
		}
		$scope.modal.show();
	}
	
	// gloabl light status
	var global_logic_status;
	$scope.itemtheresholdChange = function(val){
		if(val)global_logic_status = 1;
		else global_logic_status = 0;
	}
	
	// global mappedsensorstat value
	var global_mappedsensorstat;
	$scope.editmappedsensorstat = function(val){
		global_mappedsensorstat = val;
	}
	
	$scope.editgetmapped = function(typeid){
		var mapped_values = $scope.edit_mappedsensorid.split(",");
		
		var sensortype_id = "2";
		var mappedsensorid = mapped_values[0];
		var mapped_sensor_type_id = typeid;
		var editmappedsensorstat = 0;
		var editmappedsensorthreshold = 0;
		
		if(mapped_sensor_type_id == "4"){
			global_mappedsensorstat = $("#editsetpointrange").val();
			editmappedsensorthreshold = $("#editsetpointvalue").val();
		}
		
		var data_parameters = "slocid="+slocid+ "&orgid="+orgid+ "&thermid="+thermid+ "&id="+userid+ "&sensorid="+$stateParams.sensor_id+ "&sensortypeid="+sensortype_id+ "&mappedsensorid="+mappedsensorid+ "&mappedsensortypeid="+mapped_sensor_type_id+ "&mappedsensorstat="+global_mappedsensorstat+ "&mappedsensorthreshold="+editmappedsensorthreshold+ "&sensorstatus="+global_logic_status;
		
		$http.post("http://"+globalip+"/sensor_mapping",data_parameters, {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		})
		.success(function(response) {
			$ionicPopup.show({
				template: '',
				title: 'Sensor updated successfully.',
				scope: $scope,
				buttons: [
					{ 
					  text: 'Ok',
					  type: 'button-assertive',
					  onTap:function(e){
            			$scope.modal.hide();
       				  }
					},
				]
			})
			$scope.getupdatesensor();
		})
	}
	
	$scope.deletemap = function(mappedlightid,sensorid){
		$ionicPopup.show({
			template: '',
			title: 'Are you sure',
			scope: $scope,
			buttons: [
			 	{ text: 'Cancel', onTap: function(e) { return true; } },
				{ 
				  text: 'Ok',
				  type: 'button-assertive',
				  onTap:function(e){
					$scope.deleteconfirm(mappedlightid,sensorid);
				  }
				},
			]
		})
	}
	
	$scope.deleteconfirm = function(mappedlightid,sensorid){
		console.log(mappedlightid,sensorid);
		var data_parameters = "slocid="+slocid+ "&orgid="+orgid+ "&thermid="+thermid+ "&sensorid="+mappedlightid+ "&mappedsensorid="+sensorid;
		$http.post("http://"+globalip+"/del_sensor_mapping",data_parameters, {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		})
		.success(function(response) {
			$ionicPopup.show({
				template: '',
				title: 'Sensor deleted successfully',
				scope: $scope,
				buttons: [
					{ 
					  text: 'Ok',
					  type: 'button-assertive',
					  onTap:function(e){
						$scope.getupdatesensor();
					  }
					},
				]
			})
		})
	}
	
	$scope.getupdatesensor();
})


.controller('ScheduleCtrl', function($scope,$http,$rootScope,$stateParams,$ionicSideMenuDelegate) {
	$scope.clientSideList = [
		{ text: "Work Week", value: "1" },
		{ text: "Vacation", value: "2" },
		{ text: "Custom", value: "3" },
	 ];
	
	$scope.data = {
		clientSide: $stateParams.id
	};
	
	$rootScope.$on('eventSchedule_list', function (event, args) {
		$scope.data = {
			clientSide: args.scheduleid
		};
	});
	
	
	$scope.refreshschedule = function(val){
		$rootScope.$broadcast('eventSchedule', { scheduleid: val});
		var slocid = localStorage.getItem("slocid");
		var orgid = localStorage.getItem("orgid");
		var userid = localStorage.getItem("userid");
		var thermid = localStorage.getItem("thermid");
		var scheduleid = val;
		var fan_mode = "X";
		var heat_mode = "X";
		var hvac_temprature = "X";
		var security_mode = "X";
		var set_point_temprature = "X";
		
		var data_parameters = "slocid="+slocid+ "&orgid="+orgid+ "&thermid="+thermid+ "&scheduleid="+scheduleid+ "&fan_mode="+fan_mode+ "&heat_mode="+heat_mode+ "&hvac_temprature="+hvac_temprature+ "&security_mode="+security_mode+ "&set_point_temprature="+set_point_temprature+ "&id="+userid+"&token="+token;
		$http.post("http://"+globalip+"/edit_hvac",data_parameters, {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		})
		.success(function(response) {
		});
		
	};
})

.controller('CheckinCtrl', function($scope,$http,$rootScope,CalcService,$ionicPopup,$ionicLoading) {
	CalcService.connect();
	$ionicLoading.show({template: '<ion-spinner icon="crescent"></ion-spinner>'});
	localStorage.setItem("logoutyn",0);
	var thermonoff = localStorage.getItem("therm_online");
	
	if(thermonoff == "N"){
		console.log("thermostat off");
		$("#hvac_desktop").css({"pointer-events":"none","opacity":"0.4"});
		$("#rootcontrol_desktop").css({"pointer-events":"none","opacity":"0.4"});
	}
	
	$scope.dashboardload = function(){
		var slocid = localStorage.getItem("slocid");
		var orgid = localStorage.getItem("orgid");
		var thermid = localStorage.getItem("thermid");
		var data_parameters = "slocid="+slocid+ "&orgid="+orgid+ "&thermid="+thermid+"&token="+token;
		$http.post("http://"+globalip+"/hvac_data",data_parameters, {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		})
		.success(function(response) {
			if(response[0].status != "N"){
				$scope.response = response;
				
				$scope.setpointtemp = response[0].set_point_temprature;
				$scope.themostatname = localStorage.getItem("thermame"); 
				//code for schedule
				if(response[0].schedule_id == "1"){$scope.schedulename = "Work Week";}
				if(response[0].schedule_id == "2"){$scope.schedulename = "Vacation";}
				if(response[0].schedule_id == "3"){$scope.schedulename = "Custom";}
				$scope.schedule_id = response[0].schedule_id;
				
				if(response[0].security_mode == "D"){
					$scope.securityclass = "button ion-ios-unlocked ion-chevron-down button-clear button-dark custom-icon";
					$scope.securitytext = "Disarm";
				}
				else{
					$scope.securityclass = "button ion-ios-locked ion-chevron-down button-clear button-calm custom-icon custom-security-icon4";
					$scope.securitytext = "Arm";
				}
				
				if(response[0].heat_mode == "H"){
					$scope.systemcontrolH = "custom-icon4";
					$scope.systemcontrolC = "";
					$scope.systemcontrolA = "";
					$scope.systemcontrolO = "";
				}
				if(response[0].heat_mode == "C"){
					$scope.systemcontrolH = "";
					$scope.systemcontrolC = "custom-icon4";
					$scope.systemcontrolA = "";
					$scope.systemcontrolO = "";
				}
				if(response[0].heat_mode == "A"){
					$scope.systemcontrolH = "";
					$scope.systemcontrolC = "";
					$scope.systemcontrolA = "custom-icon4";
					$scope.systemcontrolO = "";
				}
				if(response[0].heat_mode == "O"){
					$scope.systemcontrolH = "";
					$scope.systemcontrolC = "";
					$scope.systemcontrolA = "";
					$scope.systemcontrolO = "custom-icon4";
				}
				if(response[0].fan_mode == "H"){
					$scope.fancontrolHimg = "highimg_blue";
					$scope.fancontrolMimg = "medimg";
					$scope.fancontrolLimg = "lowimg";
					$scope.fancontrolOimg = "offimg";
					
					$scope.fancontrolHcolor = "highimg_c";
					$scope.fancontrolMcolor = "medimg_s";
					$scope.fancontrolLcolor = "lowimg_s";
					$scope.fancontrolOcolor = "offimg_s";
				}
				if(response[0].fan_mode == "M"){
					$scope.fancontrolHimg = "highimg";
					$scope.fancontrolMimg = "medimg_blue";
					$scope.fancontrolLimg = "lowimg";
					$scope.fancontrolOimg = "offimg";
					
					$scope.fancontrolHcolor = "highimg_s";
					$scope.fancontrolMcolor = "medimg_c";
					$scope.fancontrolLcolor = "lowimg_s";
					$scope.fancontrolOcolor = "offimg_s";
				}
				if(response[0].fan_mode == "L"){
					$scope.fancontrolHimg = "highimg";
					$scope.fancontrolMimg = "medimg";
					$scope.fancontrolLimg = "lowimg_blue";
					$scope.fancontrolOimg = "offimg";
					
					$scope.fancontrolHcolor = "highimg_s";
					$scope.fancontrolMcolor = "medimg_s";
					$scope.fancontrolLcolor = "lowimg_c";
					$scope.fancontrolOcolor = "offimg_s";
				}
				if(response[0].fan_mode == "O"){
					$scope.fancontrolHimg = "highimg";
					$scope.fancontrolMimg = "medimg";
					$scope.fancontrolLimg = "lowimg";
					$scope.fancontrolOimg = "offimg_blue";
					
					$scope.fancontrolHcolor = "highimg_s";
					$scope.fancontrolMcolor = "medimg_s";
					$scope.fancontrolLcolor = "lowimg_s";
					$scope.fancontrolOcolor = "offimg_c";
				}
			}
			else $scope.response = "City";
			$ionicLoading.hide();
		});
	};
	$scope.dashboardload();
	
	$scope.uptemp = function(){
		value = $scope.setpointtemp;
		if(value < 80){
			value++;
			$scope.setpointtemp = value;
			var slocid = localStorage.getItem("slocid");
			var orgid = localStorage.getItem("orgid");
			var userid = localStorage.getItem("userid");
			var thermid = localStorage.getItem("thermid");
			var scheduleid = 0;
			var fan_mode = "X";
			var heat_mode = "X";
			var hvac_temprature = "X";
			var security_mode = "X";
			var set_point_temprature = $scope.setpointtemp;
			
			var data_parameters = "slocid="+slocid+ "&orgid="+orgid+ "&thermid="+thermid+ "&scheduleid="+scheduleid+ "&fan_mode="+fan_mode+ "&heat_mode="+heat_mode+ "&hvac_temprature="+hvac_temprature+ "&security_mode="+security_mode+ "&set_point_temprature="+set_point_temprature+ "&id="+userid+"&token="+token;
			$http.post("http://"+globalip+"/edit_hvac",data_parameters, {
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
			})
			.success(function(response) {
			});
		}
	};
		
	$scope.downtemp = function(){
		value = $scope.setpointtemp;
		if(value > 65){
			value--;
			$scope.setpointtemp = value;
			var slocid = localStorage.getItem("slocid");
			var orgid = localStorage.getItem("orgid");
			var userid = localStorage.getItem("userid");
			var thermid = localStorage.getItem("thermid");
			var scheduleid = 0;
			var fan_mode = "X";
			var heat_mode = "X";
			var hvac_temprature = "X";
			var security_mode = "X";
			var set_point_temprature = $scope.setpointtemp;

			var data_parameters = "slocid="+slocid+ "&orgid="+orgid+ "&thermid="+thermid+ "&scheduleid="+scheduleid+ "&fan_mode="+fan_mode+ "&heat_mode="+heat_mode+ "&hvac_temprature="+hvac_temprature+ "&security_mode="+security_mode+ "&set_point_temprature="+set_point_temprature+ "&id="+userid+"&token="+token;
			$http.post("http://"+globalip+"/edit_hvac",data_parameters,{
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
			})
			.success(function(response) {
			});
		}
	};
	
	$scope.changesystemcontrol = function(response){
		if(response == "H"){
			$scope.systemcontrolH = "custom-icon4";
			$scope.systemcontrolC = "";
			$scope.systemcontrolA = "";
			$scope.systemcontrolO = "";
		}
		if(response == "C"){
			$scope.systemcontrolH = "";
			$scope.systemcontrolC = "custom-icon4";
			$scope.systemcontrolA = "";
			$scope.systemcontrolO = "";
		}
		if(response == "A"){
			$scope.systemcontrolH = "";
			$scope.systemcontrolC = "";
			$scope.systemcontrolA = "custom-icon4";
			$scope.systemcontrolO = "";
		}
		if(response == "O"){
			$scope.systemcontrolH = "";
			$scope.systemcontrolC = "";
			$scope.systemcontrolA = "";
			$scope.systemcontrolO = "custom-icon4";
		}
		var slocid = localStorage.getItem("slocid");
		var orgid = localStorage.getItem("orgid");
		var userid = localStorage.getItem("userid");
		var thermid =  localStorage.getItem("thermid");
		var scheduleid = 0;
		var fan_mode = "X";
		var heat_mode = response;
		var hvac_temprature = "X";
		var security_mode = "X";
		var set_point_temprature = "X";
		
		var data_parameters = "slocid="+slocid+ "&orgid="+orgid+ "&thermid="+thermid+ "&scheduleid="+scheduleid+ "&fan_mode="+fan_mode+ "&heat_mode="+heat_mode+ "&hvac_temprature="+hvac_temprature+ "&security_mode="+security_mode+ "&set_point_temprature="+set_point_temprature+ "&id="+userid+"&token="+token;
		$http.post("http://"+globalip+"/edit_hvac",data_parameters, {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		})
		.success(function(response) {
		});
	};
	
	$scope.changefancontrol = function(response){
		
			if(response == "H"){
				$scope.fancontrolHimg = "highimg_blue";
				$scope.fancontrolMimg = "medimg";
				$scope.fancontrolLimg = "lowimg";
				$scope.fancontrolOimg = "offimg";
				
				$scope.fancontrolHcolor = "highimg_c";
				$scope.fancontrolMcolor = "medimg_s";
				$scope.fancontrolLcolor = "lowimg_s";
				$scope.fancontrolOcolor = "offimg_s";
			}
			if(response == "M"){
				$scope.fancontrolHimg = "highimg";
				$scope.fancontrolMimg = "medimg_blue";
				$scope.fancontrolLimg = "lowimg";
				$scope.fancontrolOimg = "offimg";
				
				$scope.fancontrolHcolor = "highimg_s";
				$scope.fancontrolMcolor = "medimg_c";
				$scope.fancontrolLcolor = "lowimg_s";
				$scope.fancontrolOcolor = "offimg_s";
			}
			if(response == "L"){
				$scope.fancontrolHimg = "highimg";
				$scope.fancontrolMimg = "medimg";
				$scope.fancontrolLimg = "lowimg_blue";
				$scope.fancontrolOimg = "offimg";
				
				$scope.fancontrolHcolor = "highimg_s";
				$scope.fancontrolMcolor = "medimg_s";
				$scope.fancontrolLcolor = "lowimg_c";
				$scope.fancontrolOcolor = "offimg_s";
			}
			if(response == "O"){
				$scope.fancontrolHimg = "highimg";
				$scope.fancontrolMimg = "medimg";
				$scope.fancontrolLimg = "lowimg";
				$scope.fancontrolOimg = "offimg_blue";
				
				$scope.fancontrolHcolor = "highimg_s";
				$scope.fancontrolMcolor = "medimg_s";
				$scope.fancontrolLcolor = "lowimg_s";
				$scope.fancontrolOcolor = "offimg_c";
			}
		var slocid = localStorage.getItem("slocid");
		var orgid = localStorage.getItem("orgid");
		var userid = localStorage.getItem("userid");
		var thermid =  localStorage.getItem("thermid");
		var scheduleid = 0;
		var fan_mode = response;
		var heat_mode = "X";
		var hvac_temprature = "X";
		var security_mode = "X";
		var set_point_temprature = "X";
		
		var data_parameters = "slocid="+slocid+ "&orgid="+orgid+ "&thermid="+thermid+ "&scheduleid="+scheduleid+ "&fan_mode="+fan_mode+ "&heat_mode="+heat_mode+ "&hvac_temprature="+hvac_temprature+ "&security_mode="+security_mode+ "&set_point_temprature="+set_point_temprature+ "&id="+userid+"&token="+token;
		$http.post("http://"+globalip+"/edit_hvac",data_parameters, {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		})
		.success(function(response) {
		});
	};
	
	$scope.changesecurity = function(){
		var smode = "";
		if($scope.securitytext == "Arm"){
			$scope.securityclass = "button ion-ios-unlocked ion-chevron-down button-clear button-dark custom-icon";
			$scope.securitytext = "Disarm";
			smode = "D";
		}
		else{
			$scope.securityclass = "button ion-ios-locked ion-chevron-down button-clear button-calm custom-icon  custom-security-icon4";
			$scope.securitytext = "Arm";
			smode = "A";
		}
		
		var slocid = localStorage.getItem("slocid");
		var orgid = localStorage.getItem("orgid");
		var userid = localStorage.getItem("userid");
		var thermid = localStorage.getItem("thermid");
		var scheduleid = 0;
		var fan_mode = "X";
		var heat_mode = "X";
		var hvac_temprature = "X";
		var security_mode = smode;
		var set_point_temprature = "X";
		
		var data_parameters = "slocid="+slocid+ "&orgid="+orgid+ "&thermid="+thermid+ "&scheduleid="+scheduleid+ "&fan_mode="+fan_mode+ "&heat_mode="+heat_mode+ "&hvac_temprature="+hvac_temprature+ "&security_mode="+security_mode+ "&set_point_temprature="+set_point_temprature+ "&id="+userid+"&token="+token;
		$http.post("http://"+globalip+"/edit_hvac",data_parameters, {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		})
		.success(function(response) {
		});
	};
	
	$rootScope.$on('eventSchedule', function (event, args) {
		$scope.schedule_id = args.scheduleid;
		if(args.scheduleid == "1"){$scope.schedulename = "Work Week";}
		if(args.scheduleid == "2"){$scope.schedulename = "Vacation";}
		if(args.scheduleid	== "3"){$scope.schedulename = "Custom";}
		$rootScope.$broadcast('eventSchedule_list', { scheduleid: args.scheduleid});
		//console.log($scope.schedulename);
	});
	
	//event if thermostat is offline
	$rootScope.$on('eventWatcher', function (event) {
		console.log("2");
		$("#rootcontrol_desktop").css({"pointer-events":"none","opacity":"0.4"});
		$("#hvac_desktop").css({"pointer-events":"none","opacity":"0.4"});
		//console.log($scope.schedulename);
	});
	
	
	$rootScope.$on('eventThermname', function (event, args) {
		var thermid = localStorage.getItem("thermid");
		if(args.thermid != thermid){
			$scope.themostatname = args.thermname;
			localStorage.setItem("thermame",args.thermname);
			localStorage.setItem("thermid",args.thermid); 
			CalcService.disconnect();
			CalcService.connect();
		}
		var slocid = localStorage.getItem("slocid");
		var orgid = localStorage.getItem("orgid");
		var thermid = localStorage.getItem("thermid");
		var data_parameters = "slocid="+slocid+ "&orgid="+orgid+ "&thermid="+thermid+"&token="+token;
		$http.post("http://"+globalip+"/hvac_data",data_parameters, {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		})
		.success(function(response) {
			if(response[0].status != "N"){
				$scope.response = response;
				
				$scope.setpointtemp = response[0].set_point_temprature;
				$scope.themostatname = localStorage.getItem("thermame"); 
				//code for schedule
				if(response[0].schedule_id == "1"){$scope.schedulename = "Work Week";}
				if(response[0].schedule_id == "2"){$scope.schedulename = "Vacation";}
				if(response[0].schedule_id == "3"){$scope.schedulename = "Custom";}
				
				//$rootScope.$broadcast('eventSchedule_list', { scheduleid: response[0].schedule_id});
				$scope.schedule_id = response[0].schedule_id;
				
				if(response[0].security_mode == "D"){
					$scope.securityclass = "button ion-ios-unlocked ion-chevron-down button-clear button-dark custom-icon";
					$scope.securitytext = "Disarm";
				}
				else{
					$scope.securityclass = "button ion-ios-locked ion-chevron-down button-clear button-calm custom-icon  custom-security-icon4";
					$scope.securitytext = "Arm";
				}
				
				if(response[0].heat_mode == "H"){
					$scope.systemcontrolH = "custom-icon4";
					$scope.systemcontrolC = "";
					$scope.systemcontrolA = "";
					$scope.systemcontrolO = "";
				}
				if(response[0].heat_mode == "C"){
					$scope.systemcontrolH = "";
					$scope.systemcontrolC = "custom-icon4";
					$scope.systemcontrolA = "";
					$scope.systemcontrolO = "";
				}
				if(response[0].heat_mode == "A"){
					$scope.systemcontrolH = "";
					$scope.systemcontrolC = "";
					$scope.systemcontrolA = "custom-icon4";
					$scope.systemcontrolO = "";
				}
				if(response[0].heat_mode == "O"){
					$scope.systemcontrolH = "";
					$scope.systemcontrolC = "";
					$scope.systemcontrolA = "";
					$scope.systemcontrolO = "custom-icon4";
				}
				
				if(response[0].fan_mode == "H"){
					$scope.fancontrolHimg = "highimg_blue";
					$scope.fancontrolMimg = "medimg";
					$scope.fancontrolLimg = "lowimg";
					$scope.fancontrolOimg = "offimg";
					
					$scope.fancontrolHcolor = "highimg_c";
					$scope.fancontrolMcolor = "medimg_s";
					$scope.fancontrolLcolor = "lowimg_s";
					$scope.fancontrolOcolor = "offimg_s";
				}
				if(response[0].fan_mode == "M"){
					$scope.fancontrolHimg = "highimg";
					$scope.fancontrolMimg = "medimg_blue";
					$scope.fancontrolLimg = "lowimg";
					$scope.fancontrolOimg = "offimg";
					
					$scope.fancontrolHcolor = "highimg_s";
					$scope.fancontrolMcolor = "medimg_c";
					$scope.fancontrolLcolor = "lowimg_s";
					$scope.fancontrolOcolor = "offimg_s";
					
				}
				if(response[0].fan_mode == "L"){
					$scope.fancontrolHimg = "highimg";
					$scope.fancontrolMimg = "medimg";
					$scope.fancontrolLimg = "lowimg_blue";
					$scope.fancontrolOimg = "offimg";
					
					$scope.fancontrolHcolor = "highimg_s";
					$scope.fancontrolMcolor = "medimg_s";
					$scope.fancontrolLcolor = "lowimg_c";
					$scope.fancontrolOcolor = "offimg_s";
				}
				if(response[0].fan_mode == "O"){
					$scope.fancontrolHimg = "highimg";
					$scope.fancontrolMimg = "medimg";
					$scope.fancontrolLimg = "lowimg";
					$scope.fancontrolOimg = "offimg_blue";
					
					$scope.fancontrolHcolor = "highimg_s";
					$scope.fancontrolMcolor = "medimg_s";
					$scope.fancontrolLcolor = "lowimg_s";
					$scope.fancontrolOcolor = "offimg_c";
				}
			}
			else $scope.response = "City";
		});
	});
})

.controller('setting', function($scope,$stateParams,$http,$ionicPopup){
	$scope.user = {
			opassword : '',
			npassword : '',
			cpassword : ''
	};
	
	$scope.changepassword = function(user){
		var oldpass = user.opassword;
		var newpass = user.npassword;
		var confirmpass = user.cpassword;

		var slocid = localStorage.getItem("slocid");
		var orgid = localStorage.getItem("orgid");
		var userid = localStorage.getItem("userid");
		
		if(oldpass != "" && newpass != "" && confirmpass != ""){
			if(newpass != confirmpass){
				$ionicPopup.show({
					  template: '',
					  title: "New & Confirm password didn't match",
					  scope: $scope,
					  buttons: [
						{ 
						  text: 'Ok',
						  type: 'button-assertive'
						},
					  ]
				})
			}
			else{
				var data_parameters = "slocid="+slocid+ "&orgid="+orgid+ "&id="+userid+ "&userid="+userid+ "&oldpass="+oldpass+ "&newpass="+newpass;
				$http.post("http://"+globalip+"/change_password",data_parameters,{
					headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				})
				.success(function(response) {
					if(response[0].status != "N"){
						$ionicPopup.show({
							  template: '',
							  title: "Password changed successfully",
							  scope: $scope,
							  buttons: [
								{ 
								  text: 'Ok',
								  type: 'button-calm'
								},
							  ]
						})
						$scope.user = {
								opassword: '',
								npassword : '',
								cpassword : ''
						};
					}
					else{
						$ionicPopup.show({
							  template: '',
							  title: "Old password is wrong",
							  scope: $scope,
							  buttons: [
								{ 
								  text: 'Ok',
								  type: 'button-assertive'
								},
							  ]
						})
					}
				});
			}
		}
		else{
			$ionicPopup.show({
				  template: '',
				  title: 'Please fill all fields',
				  scope: $scope,
				  buttons: [
					{ 
					  text: 'Ok',
					  type: 'button-assertive'
					},
				  ]
			})
		}
	}
})
