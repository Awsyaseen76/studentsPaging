(function() {
	angular
		.module("studentsPaging")
		.controller('adminController', adminController);

	// function adminController(userService, gradeService, schoolService, loggedAdmin, $location) {
	function adminController(userService, loggedAdmin, schoolService, $location) {

		var model = this;

		function init() {
			model.loggedAdmin = loggedAdmin;
			// model.adminPage = loggedAdmin;
			model.allUsers = null;
			model.parents = null;
			model.grades = null;
			model.schools = null;
			// getAllSchools();
		}
		init();

		model.logout = logout;
		model.getAllUsers = getAllUsers;
		// model.getallGrades = getallGrades;
		// model.updateGradeByAdmin = updateGradeByAdmin;
		// model.getAllFeedbacks = getAllFeedbacks;
		// model.updateFeedbackByAdmin = updateFeedbackByAdmin;
		// model.getAllSchools = getAllSchools;


		// function getAllSchools(){
		// 	schoolService
		// 		.getAllSchools()
		// 		.then(function(result){
		// 			model.schools = result.data;
		// 		});
		// }

		// function updateFeedbackByAdmin(feedback){
		// 	userService
		// 		.updateFeedbackByAdmin(feedback)
		// 		.then(getAllFeedbacks);
		// }

		// function getAllFeedbacks(){
		// 	userService
		// 		.getAllFeedbacks()
		// 		.then(function(feedbacks){
		// 			model.feedbacks = feedbacks.data;
		// 		});
		// }

		function getAllUsers(){
			// model.grades = null;
			return userService
				.getAllUsers()
				.then(function (users){
					if(users){
						model.allUsers = users.data;
					}
				});
		}

		// function getallGrades(){
		// 	model.parents = null;
		// 	gradeService
		// 			.getallGrades()
		// 			.then(function(grades){
		// 				if(grades){
		// 					model.grades = grades;	
		// 				}
		// 			});
		// }

		// function updateGradeByAdmin(grade){
		// 	gradeService
		// 			.updateGradeByAdmin(grade)
		// 			.then(getallGrades);
		// }



		function logout(){
			userService
				.logout()
				.then(function(){
					$location.url('/');
				});
		}

	}
})();