(function() {
	angular
		.module("studentsPaging")
		.controller('schoolGradesListController', schoolGradesListController);

	function schoolGradesListController(gradeService, $location, loggedSchool, userService) {
		var model = this;

		function init() {
			model.loggedSchool = loggedSchool;
			// var schoolName = loggedSchool.name;
			// var loggedSchoolId = loggedSchool._id;
			// model.schoolName = schoolName;
			// model.schoolId = loggedSchoolId;
			gradeService
				.findGradesByCenterId(loggedSchool._id)
				.then(function(grades){
					model.gradesList = grades;
				});

			
			// userService
			// 		.checkUserLogin()
			// 		.then(function(result){
			// 			if(result){
			// 				model.loggedUser = result;
			// 			}
			// 		});

		}
		init();

		model.removeCourse = removeCourse;
		model.logout = logout;
		model.reCreateCourse = reCreateCourse;
		// model.findUserByCourseId = findUserByCourseId

		// function findUserByCourseId(gradeId){
		// 	console.log(gradeId);
		// }

		function logout(){
			userService
				.logout()
				.then(function(){
					$location.url('/');
				});
		}


		function removeCourse(schoolId, gradeId){
			//var schoolId = $rootScope.loggedSchool._id;
			gradeService.removeCourse(schoolId, gradeId)
				.then(function(deleted){
					var url = "/schoolProfile";
					$location.url(url);
				});
		}

		function reCreateCourse(grade){
			
			var unnecessaryProperties = ['created', 'gradeDays', 'registeredMembers', 'discountedMembers', 'expenses', '_id', 'startingDate', 'expiryDate', 'schoolId', 'special', '__v', 'approved', '$$hashKey'];
			for(var i in unnecessaryProperties){
				delete(grade[unnecessaryProperties[i]]);
			}
			console.log(grade);
		}


	}
})();