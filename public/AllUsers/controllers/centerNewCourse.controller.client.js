(function(){
	angular
		.module("studentsPaging")
		.controller('schoolNewGradeController', schoolNewGradeController);

		function schoolNewGradeController($location, gradeService, schoolService, loggedSchool, userService){
			var model = this;
			function init(){
				model.newGradeMain = true;
				model.loggedSchool = loggedSchool;
				model.practiceDailyDetails = {};
				gradeService
					.getMapBoxKey()
					.then(function(mapBoxKey){
						model.mapBoxKey = mapBoxKey.data;

						// MapBox Maps
					    // Get the access token from the server
					    mapboxgl.accessToken = model.mapBoxKey;
						
						$('#mapModal').on('shown.bs.modal', function() {
							// Initilise the map 
							var map = new mapboxgl.Map({
								container: 'mapForLocation',
								// style: 'mapbox://styles/mapbox/streets-v10',
								style: 'mapbox://styles/mapbox/satellite-streets-v9',
								school: [35.87741988743201, 32.003009804995955],
								// school: [model.position.currentposition.lng, model.position.currentposition.lat],
								zoom: 12
							});

							// Show map controller
							map.addControl(new mapboxgl.NavigationControl());

							// Get the location from the map
							map.on('click', function(e) {
							    // var latitude = e.lngLat.lat;
							    // var longitude = e.lngLat.lng;
							    model.mapLocation.latitude = e.lngLat.lat;
								model.mapLocation.longitude = e.lngLat.lng;
							    document.getElementById('mapLat').innerHTML = model.mapLocation.latitude;
							    document.getElementById('mapLng').innerHTML = model.mapLocation.longitude;
							});

						});	
						
						
 						

					});
				schoolService
					.getAllSchools()
					.then(function(schools){
						model.schools = schools.data;
					});
			}
			init();
			var _schoolId = loggedSchool._id;
			
			model.createCourse = createCourse;
			model.logout = logout;
			model.createCourseDetails = createCourseDetails;
			model.getCurrentLocation = getCurrentLocation;
			model.getLocationFromMap = getLocationFromMap;
			model.mapLocation = {longitude: 0, latitude: 0};
			model.addAssignment = addAssignment;


			function getCurrentLocation() {
			    if (navigator.geolocation) {
			        navigator.geolocation.getCurrentPosition(showPosition);
			    } else { 
			        console.log("Geolocation is not supported by this browser.");
			    }
			}

			function showPosition(position){
				model.mapLocation.latitude = position.coords.latitude; 
				model.mapLocation.longitude = position.coords.longitude;
				document.getElementById('mapLongitude').value = model.mapLocation.longitude;
				document.getElementById('mapLatitude').value = model.mapLocation.latitude;

			}

			function getLocationFromMap(){
				document.getElementById('mapLongitude').value = model.mapLocation.longitude;
				document.getElementById('mapLatitude').value = model.mapLocation.latitude;
			}

			function createCourseDetails(newGrade, daysOfWeek, mapLocation){
				// create dates based on start-end dates and the days of the weeks
				var start = new Date(newGrade.startingDate);
				var end = new Date(newGrade.expiryDate);
				var days = [];
				var gradeDays = [];
				for(var i in daysOfWeek){
					if(daysOfWeek[i] === true){	
						switch (i) {
						    case "Sun":
						        days.push(0);
						        break;
							case "Mon":
						        days.push(1);
						        break;
							case "Tue":
						        days.push(2);
						        break;
							case "Wed":
						        days.push(3);
						        break;
							case "Thu":
						        days.push(4);
						        break;
					        case "Fri":
					     	    days.push(5);
					     	    break;
							case "Sat":
						        days.push(6);
						        break;
						}
					}
				}
				newGrade.daysPerWeek = days;
				
				for (start; end>start; start.setDate(start.getDate()+1)){
					inner:
					for(var j in days){
						if(start.getDay() === days[j]){
							gradeDays.push(start.toDateString());
							break inner;
						}
					}
				}
				newGrade.gradeDays = gradeDays;
				newGrade.coordinates = [mapLocation.longitude, mapLocation.latitude];
				model.newGrade = newGrade;
				console.log(newGrade);
				model.newGradeMain = false;
				model.newGradeProgramDetails = true;
			}


			function addAssignment(day, resource, pages){
				if(model.practiceDailyDetails[day]){
					for(var i in model.practiceDailyDetails[day].assignments){
						if(model.practiceDailyDetails[day].assignments[i].book === resource.title){
							model.practiceDailyDetails[day].assignments[i].pages.push(pages);
							return;
						}
					}
						model.practiceDailyDetails[day].assignments.push({book: resource.title, pages: [pages]});
				}else{
					model.practiceDailyDetails[day] = {};
					model.practiceDailyDetails[day].assignments = [];
					model.practiceDailyDetails[day].assignments.push({book: resource.title, pages: [pages]});
				}
				console.log(model.practiceDailyDetails);
			}

			
			function createCourse(newGrade){
				newGrade.schoolId = _schoolId;
				newGrade.practiceDailyDetails = model.practiceDailyDetails;
				console.log(newGrade);
				// gradeService
				// 	.addNewCourse(newGrade)
				// 	.then(function(addedCourse){
				// 		$location.url('/schoolProfile/gradesList');
				// 	});
			}

			function logout(){
				userService
					.logout()
					.then(function(){
						$location.url('/');
					});
			}
			
			

		}
})();