(function() {
	angular
		.module("studentsPaging")
		.controller('updateUserProfile', updateUserProfile);

	function updateUserProfile(userService, loggedUser, $location) {
		var model = this;

		function init() {
			loggedUser.DOB = new Date(loggedUser.DOB);
			model.parentProfile = loggedUser;
			model.loggedUser = loggedUser;
		}
		init();

		model.logout = logout;
		model.removeRegisteredCourse = removeRegisteredCourse;
		model.updateProfile = updateProfile;
		// model.DOB = new Date(loggedUser.DOB);

		function updateProfile(updatedUserProfile){
			userService
				.updateProfile(updatedUserProfile)
				.then(function(result){
					console.log('Profile Updated');
				});
				$location.url('/profile');
		}

		function ValidateSize(file) {
	        		var FileSize = file.files[0].size / 1024 / 1024; // in MB
	        		if (FileSize > 2) {
	            		alert('File size exceeds 2 MB');
	        		} else {
	        			alert(file.files[0].size);
	        		}
    			}




		function logout(){
			userService
				.logout()
				.then(function(){
					$location.url('/');
				});
		}



		function removeRegisteredCourse(gradeId){
			// var _userId = $routeParams.userId;
			userService
				.removeRegisteredCourse(loggedUser._id, gradeId)
				.then(function(response){
					$location.url('/profile');
				});
		}

	}
})();