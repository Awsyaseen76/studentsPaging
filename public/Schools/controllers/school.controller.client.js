(function() {
	angular
		.module("studentsPaging")
		.controller('schoolController', schoolController);

	function schoolController(userService, schoolService, loggedSchool, $location) {
		var model = this;

		function init() {
			model.schools = null;
			model.schoolProfile = loggedSchool;
			// getAllSchools();
		}
		init();

		// model.getAllSchools = getAllSchools;
		// model.findSchoolByName = findSchoolByName;
		model.logout = logout;

		// Change to getAllGrades
		// function getAllSchools(){
		// 	schoolService
		// 		.getAllSchools()
		// 		.then(function(result){
		// 			model.schools = result.data;
		// 		});
		// }


		// Change to findGradeByName
		// function findSchoolByName(schoolName){
		// 	schoolService
		// 		.findSchoolByName(schoolName)
		// 		.then(function(result){
		// 			return result.data;
		// 		});
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