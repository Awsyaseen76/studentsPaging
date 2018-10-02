(function(){
	angular
		.module("studentsPaging")
		.controller('gradeDetailsController', gradeDetailsController);

		function gradeDetailsController($routeParams, gradeService, userService, $location){
			var model = this;

			function init(){
				model.error2 = null;
				var gradeId = $routeParams.gradeId;
				// var gradeDetails = gradeService.findCourseByCourseId(gradeId);
				gradeService.findCourseByCourseId(gradeId)
					.then(function(gradeDetails){
						model.gradeDetails = gradeDetails;
					});
				// check if there any user has already logged in to use it instead of the $rootScope
				userService
					.checkUserLogin()
					.then(function(result){
						if(result){
							model.loggedUser = result;
						}
					});

				
			}
			init();

			model.gradeRegistration = gradeRegistration;
			model.logout = logout;

			function logout(){
				userService
					.logout()
					.then(function(){
						$location.url('/');
					});
			}



			function gradeRegistration(grade){
				if (!model.loggedUser){
					model.error1 = 'Please login or register to register on this grade';
					$('html, body').animate({ scrollTop: 0 }, 'slow');
					return;
				} else {
					var userId = model.loggedUser._id;
					var gradesList = model.loggedUser.registeredGradesList;
					for(var e in gradesList){
						if(gradesList[e]._id === grade._id){
							model.error2 = 'You already registered for this grade';
							return;
						}
					}
					userService
						.addCourseToUserGradesList(grade)
						.then(function (response){
						$location.url('/parentProfile');
					});
				}
			}

		}

})();