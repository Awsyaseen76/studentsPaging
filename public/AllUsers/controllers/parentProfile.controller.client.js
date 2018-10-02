(function() {
	angular
		.module("studentsPaging")
		.controller('parentProfileController', parentProfileController);

	function parentProfileController(userService, loggedUser, $location, $sce, $route) {
		var model = this;

		function init() {
			model.parentProfile = loggedUser;
			model.loggedUser = loggedUser;
			// model.upcommingProgram = [];
			// model.userFeedbacks = [];
			// model.registeredGradesList = model.parentProfile.registeredGradesList;
			// get the upcomming daily program item
			// for(var i in model.parentProfile.registeredGradesList){
			// 	inner: 
			// 	for(var e in model.parentProfile.registeredGradesList[i].practiceDailyDetails){
			// 		if(new Date(e) >= new Date()){
			// 			model.upcommingProgram.push({grade: model.parentProfile.registeredGradesList[i].name, 
			// 										 date: new Date(e),
			// 										 programDetails: model.parentProfile.registeredGradesList[i].practiceDailyDetails[e]});
			// 			break inner;
			// 		}
			// 	}
			// }
			// for(var j in model.parentProfile.userCourseParameters){
			// 	for(var f in model.parentProfile.userCourseParameters[j].feedbacks){
			// 		model.userFeedbacks.push(model.parentProfile.userCourseParameters[j].feedbacks[f]);
			// 	}
			// }
		}
		init();


		model.logout = logout;
		// model.removeRegisteredCourse = removeRegisteredCourse;
		// model.totalPayments = totalPayments;
		// model.attendedDays = attendedDays;
		// model.trustedUrl = trustedUrl;
		// model.submitFeedback = submitFeedback;

		// function submitFeedback(gradeId, gradeName,feedbackText){
		// 	var feedbackObject = {userId: model.loggedUser._id, gradeId: gradeId, gradeName: gradeName, feedbackText: feedbackText};
		// 	userService
		// 		.submitFeedback(feedbackObject)
		// 		.then(function(result){
		// 			console.log(result.data);
		// 			$route.reload();
		// 		}, function(error){
		// 			console.log(error);
		// 		});
		// }


		// function trustedUrl(videoLink){
		// 	var youtubeUrl = "https://www.youtube.com/embed/";
		// 	var urlParts = videoLink.split("/");
		// 	youtubeUrl += urlParts[urlParts.length-1];
		// 	return $sce.trustAsResourceUrl(youtubeUrl);
		// }

		// function attendedDays(gradeId){
		// 	var attended = 0;
		// 	var missed = 0;
		// 	for(var i in loggedUser.attendedGrades){
		// 		if(gradeId === loggedUser.attendedGrades[i].gradeId && loggedUser.attendedGrades[i].attended===true){
		// 			attended+=1;
		// 		} else if(gradeId === loggedUser.attendedGrades[i].gradeId && loggedUser.attendedGrades[i].attended===false){
		// 			missed+=1;
		// 		}
		// 	}
		// 	return {attended: attended, missed: missed};
		// }
	


		// function totalPayments(gradeId, gradePrice){
		// 	var totals = 0;
		// 	var balance = 0;
		// 	for(var i in loggedUser.payments){
		// 		if(gradeId === loggedUser.payments[i].gradeId){
		// 			totals+= JSON.parse(loggedUser.payments[i].paymentAmount)
		// 		}
		// 	}
		// 	balance = totals - gradePrice
		// 	return {totals: totals, balance: balance};
		// }

		// function ValidateSize(file) {
	 //        		var FileSize = file.files[0].size / 1024 / 1024; // in MB
	 //        		if (FileSize > 2) {
	 //            		alert('File size exceeds 2 MB');
	 //           // $(file).val(''); //for clearing with Jquery
	 //        		} else {
	 //        			alert(file.files[0].size);
	 //        		}
  //   			}




		function logout(){
			userService
				.logout()
				.then(function(){
					$location.url('/');
				});
		}



		// function removeRegisteredCourse(gradeId){
		// 	// var _userId = $routeParams.userId;
		// 	userService
		// 		.removeRegisteredCourse(loggedUser._id, gradeId)
		// 		.then(function(response){
		// 			$location.url('/profile');
		// 		});
		// }

	}
})();