(function() {
	angular
		.module("studentsPaging")
		.controller('gradeProfileController', gradeProfileController);

	function gradeProfileController(userService, loggedGrade, $location) {
		var model = this;
		model.logout = logout;
		model.updateGradeProfile = updateGradeProfile;
		// To add students to model.gradeProfile.students fetched from studentsDB filtered by grade id

		function init() {
			console.log('in grade controller');
			model.loggedGrade = loggedGrade;
			model.gradeProfile = loggedGrade;
		}
		init();

		function updateGradeProfile(updatedGradeProfile){
			userService
				.updateProfile(updatedGradeProfile)
				.then(function(result){
					console.log('Profile Updated');
					$location.url('/profile');
				});
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