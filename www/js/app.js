angular.module('app', ['onsen', 'ngCordova'])

.controller("Page1Ctrl", function($scope){
	console.log("Page1Ctrl");

	ons.ready(function() {
		console.log("Onsen is ready");

		//can just use menu
		$scope.menu.on('preopen', function() {
		    console.log("Menu page is going to open");
		  });
	});

})

.controller("CalendarCtrl", function($scope, $cordovaCalendar){
	console.log("CalendarCtrl");

	$scope.isCalendar=false;

	if (window.cordova) {
		$scope.isCalendar = true;
	}

	//GET current time in UTC format
	var now = new Date(); 
	var yyyy = now.getFullYear();
	var mm = now.getMonth();//mm=0 is January
	var dd = now.getDate();
	//GET today at midnight, in UTC format
	var today = new Date(Date.UTC(yyyy,mm,dd));
	var timeZoneOffset = today.getTimezoneOffset(); //in minutes

	//offset timezone, convert UTC time to local time
	var startDate = new Date(today.getTime() + timeZoneOffset * 60 * 1000);
	//one day = 86400 sec, so add 86399*1000 ms
	var endDate = new Date(today.getTime() + timeZoneOffset * 60 * 1000 + 86399*1000);

	$scope.now = now;
	$scope.today = today;
	$scope.todayLong = today.getTime(); //or Date.parse(), convert to long: milliseconds since midnight January 1, 1970
	$scope.timeZoneOffset = timeZoneOffset;
	$scope.startDate = startDate;
	$scope.endDate = endDate;
	$scope.eventList = [];

	$scope.findCalendar = function(){
			//for ios only
		  $cordovaCalendar.findAllEventsInNamedCalendar('1').then(function (result) {
		    // success
		    alert(JSON.stringify(result));
		  }, function (err) {
		    // error
		    alert("error");
		    alert(err);
		  });
	}

	$scope.findEvents = function(){

/*		  $cordovaCalendar.findEvent({
		  	title: 'Test',
		  	location: "45 High St",
		    startDate: startDate,
		    endDate: endDate
		  }).then(function (result) {
		    // success
		    alert(JSON.stringify(result));
		  }, function (err) {
		    // error
		    alert("error");
		    alert(err);
		  });*/

		window.plugins.calendar.findEvent(null,null,null,startDate,endDate,
		function(result){
			// success
			alert(JSON.stringify(result));
		},function(err){
			alert("error");
		    alert(err);
		});
	}

	$scope.listInstancesInRange = function(){
		//this function is added by me
		window.plugins.calendar.listInstancesInRange(startDate,endDate,
		function(results){
			// success
			//alert(JSON.stringify(results));

		    //parse results
		    for(var i=0; i<results.length; i++){
		    	results[i].begin = new Date(results[i].begin);
		    	results[i].end = new Date(results[i].end);
		    }

			$scope.eventList = results;
			$scope.$digest();

		},function(err){
			alert("error");
		    alert(err);
		});


	}

	$scope.listAllEvents = function(){
		//retrieve Calendar event
		//for android only

		window.plugins.calendar.listEventsInRange(startDate,endDate,
		function(result){
			// success
			alert(JSON.stringify(result));
		},function(err){
			alert("error");
		    alert(err);
		});


/*		  $cordovaCalendar.listEventsInRange(startDate, endDate
		  ).then(function (result) {
		    // success
		    //alert("success");
		    alert(JSON.stringify(result));
		    var intTotal=result.length;
		    var temp="";
		    for(var i=0; i<intTotal;i++){
		    	temp += "Event # " + (i+1) + "\n";;
				temp += "Calendar ID = " + result[i].calendar_id + "\n";
				temp += "Title = " + result[i].title + "\n";
				temp += "eventLocation = " + result[i].eventLocation + "\n";
				temp += "dtstart = " + result[i].dtstart + "\n";
				temp += new Date(result[i].dtstart) + "\n";
				temp += "dtend = " + result[i].dtend + "\n";
				temp += new Date(result[i].dtend) + "\n";
				temp += "allDay = " + result[i].allDay + "\n\n\n";
		    }
		    if(temp=="") temp="No Event Found!";
		    alert(temp);
		  }, function (err) {
		    // error
		    alert("error");
		    alert(err);
		  });	*/	
	}

	$scope.Open = function(){
		//window.plugins.calendar.openCalendar();
		try{
			window.plugins.calendar.openCalendar(startDate, function(){
				//success
				alert("success");
			}, function(err){
				//error
				alert("error");
			    alert(err);
			}); 			
		}catch(err){
			alert("error");
			alert(JSON.stringify(err));
		}

	}

	$scope.listCalendar = function(){
		$cordovaCalendar.listCalendars()
		  .then(function (result) {
		    // success
		    //alert("success");
		    alert(JSON.stringify(result));
		  }, function (err) {
		    // error
		    alert("error");
		    alert(err);
		  });
	}


});