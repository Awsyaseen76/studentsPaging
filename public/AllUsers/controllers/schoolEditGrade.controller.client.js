(function () {
	angular
		.module("studentsPaging")
		.controller('schoolEditGradeController', schoolEditGradeController);

	function schoolEditGradeController(gradeService, $location, loggedSchool, userService){
		var model = this;

		function init(){
			model.updateCourseMain = true;
			model.loggedSchool = loggedSchool;
			gradeService
				.findGradesByCenterId(loggedSchool._id)
				.then(function(grades){
					model.gradesList = grades;
				});
			model.selectedCourse = null;

			// userService
			// 		.checkUserLogin()
			// 		.then(function(result){
			// 			if(result){
			// 				model.loggedUser = result;
			// 			}
			// 		});
		}
		init();

		model.updateCourse = updateCourse;
		model.selectCourse = selectCourse;
		model.logout = logout;
		model.updateMainCourseDetails = updateMainCourseDetails;
		model.cancelUpdate = cancelUpdate;


		function updateMainCourseDetails(updatedCourse, daysOfWeek){

			// create dates based on start-end dates and the days of the weeks
			var start = new Date(updatedCourse.startingDate);
			var end = new Date(updatedCourse.expiryDate);
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
			
			// Store the selected days per week
			updatedCourse.daysPerWeek = days;

			// Create the grade days for the period of the grade.
			for (start; end >= start; start.setDate(start.getDate()+1)){
				inner:
				for(var j in days){
					if(start.getDay() === days[j]){
						gradeDays.push(start.toDateString());
						break inner;
					}	
				}
			}

			if(updatedCourse.gradeDays.length === 0){
				updatedCourse.gradeDays = gradeDays;
			}
			
			// When update: check if the days per week is changed
			for(var e in model.selectedCourse.gradeDays){
				if(model.selectedCourse.gradeDays[e] !== gradeDays[e]){
					// If the days chaned then store the new days per week
					updatedCourse.gradeDays = gradeDays;
					
					// temporary store the old details for each day in array
					var detailsArray = [];
					for(var n in updatedCourse.practiceDailyDetails){
						detailsArray.push(updatedCourse.practiceDailyDetails[n]);
					}

					// remove the old details for old days
					for(var h in updatedCourse.practiceDailyDetails){
						delete updatedCourse.practiceDailyDetails[h];
					}
					
					// store the daily details in the new dates
					for(var d in updatedCourse.gradeDays){
						updatedCourse.practiceDailyDetails[updatedCourse.gradeDays[d]] = detailsArray[d];
					}
					break;
				}
			}

			
			// switch to the next form 
			model.updateCourseMain = false;
			model.updateCourseProgramDetails = true;
		}


		function updateCourse(updatedCourse){
			var gradeId = model.selectedCourse._id;
			gradeService
				.updateCourse(updatedCourse, gradeId)
				.then(function(finalCourse){
					var url = "/schoolProfile";
					$location.url(url);
				});
		}

		function selectCourse(gradeId){
			gradeService
				.findCourseByCourseId(gradeId)
				.then(function(grade){
					grade.startingDate = new Date(grade.startingDate);
					grade.expiryDate = new Date(grade.expiryDate);
					
					model.selectedCourse = grade;

					// Reverse the selected days
					// 0: Sun   1: Mon   2: Tue   3: Wed    4: Thu  5: Fri  6: Sat 			
					var daysOfWeek = {Sun:false, Mon:false, Tue:false, Wed:false, Thu:false, Fri:false, Sat:false};
					for(var i in model.selectedCourse.daysPerWeek){
						switch (model.selectedCourse.daysPerWeek[i]) {
							case 0:
								daysOfWeek.Sun = true;
								break;
							case 1:
								daysOfWeek.Mon = true;
								break;
							case 2:
								daysOfWeek.Tue = true;
								break;
							case 3:
								daysOfWeek.Wed = true;
								break;
							case 4:
								daysOfWeek.Thu = true;
								break;
							case 5:
								daysOfWeek.Fri = true;
								break;
							case 6:
								daysOfWeek.Sat = true;
								break;
						}
					}
					model.daysOfWeek = daysOfWeek;
					console.log(model.selectedCourse.daysPerWeek)
				});
		}


		function cancelUpdate(){
			var url = "/schoolProfile";
			$location.url(url);
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