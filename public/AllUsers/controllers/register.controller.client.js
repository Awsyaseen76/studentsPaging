(function() {
	angular
		.module("studentsPaging")
		.controller('registerController', registerController);

	function registerController(userService, $location, $rootScope) {
		var model = this;

		function init() {
			userService
					.checkUserLogin()
					.then(function(user){
						if(user){
							model.loggedUser = user;
						}
					});
		}
		init();
		model.register = register;
		model.logout = logout;

		function logout(){
			userService
				.logout()
				.then(function(){
					$location.url('/');
				});
		}



		function register(user, password2) {
			if (!user) {
				model.error = 'Please fill all the requested fields';
				return;
			}
			if (user.password === password2) {
				model.error = null;
				return userService
					.findUserByEmail(user.email)
					.then(function(result){
						if(result === 'email already exist'){
							model.error = 'email already exist';
							return;
						}else{
							return userService
								.createUser(user)
								.then(function(result){
									var matchedUser = result;
									var userId = matchedUser._id;
									$rootScope.loggedUser = matchedUser;
									if(matchedUser.userType === 'parent'){
										$location.url('/parentProfile');
										return;
									}else if(matchedUser.userType === 'schoolAdmin'){
										$location.url('/schoolProfile');
										return;
									}else if(matchedUser.userType === 'gradeAdmin'){
										$location.url('/gradeProfile');
										return;
									}else if(matchedUser.userType === 'admin'){
										$location.url('/adminPage');
										return;
									}
									return;
								});
						}
					});


			} else {
				model.error = 'Please double check that the two passwords are matched';
			}
		}
	}
})();