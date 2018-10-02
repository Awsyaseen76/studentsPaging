(function() {
	angular
		.module("studentsPaging")
		.config(configuration);

	function configuration($routeProvider) {
		$routeProvider
			//ok
			.when('/', {
				templateUrl: '../views/pages/home.html',
				controller: 'homePageController',
				controllerAs: 'model'
			})
			
			.when('/login', {
				templateUrl: 'AllUsers/templates/login.view.client.html',
				controller: 'loginController',
				controllerAs: 'model'
			})
			
			.when('/register', {
				templateUrl: 'AllUsers/templates/register.view.client.html',
				controller: 'registerController',
				controllerAs: 'model'
			})

			.when('/forgetPassword', {
				templateUrl: 'AllUsers/templates/forgetPassword.view.client.html',
				controller: 'forgetPasswordController',
				controllerAs: 'model'	
			})
			.when('/resetPassword/:token', {
				templateUrl: 'AllUsers/templates/resetPassword.view.client.html',
				controller: 'resetPasswordController',
				controllerAs: 'model'	
			})

			.when('/profile', {
				resolve: {
					loggedUser: checkUserType
				}
			})
			
			.when('/parentProfile', {
				templateUrl: 'AllUsers/templates/parentProfile.view.client.html',
				controller: 'parentProfileController',
				controllerAs: 'model',
				resolve: {
					loggedUser: isParent
				}
			})
			
			.when('/updateUserProfile', {
				templateUrl:'AllUsers/templates/editUserProfile.view.client.html',
				controller: 'updateUserProfile',
				controllerAs: 'model',
				resolve:{
					loggedUser: isParent
				}
			})

			.when('/schoolProfile', {
				templateUrl: 'Schools/templates/schoolProfile.view.client.html',
				controller: 'schoolController',
				controllerAs: 'model',
				resolve: {
					loggedSchool: isSchool
				}
			})

			.when('/updateSchoolProfile', {
				templateUrl:'AllUsers/templates/editSchoolProfile.view.client.html',
				controller: 'schoolProfileController',
				controllerAs: 'model',
				resolve:{
					loggedSchool: isSchool
				}
			})

			.when('/gradeProfile', {
				templateUrl: 'AllUsers/templates/gradeProfile.view.client.html',
				controller: 'gradeProfileController',
				controllerAs: 'model',
				resolve: {
					loggedGrade: isGrade
				}
			})

			.when('/adminPage', {
				templateUrl: 'Admin/templates/adminPage.view.client.html',
				controller: 'adminController',
				controllerAs: 'model',
				resolve: {
					loggedAdmin: isAdmin
				}

			})

			.when('/admin/schools', {
				templateUrl: 'Admin/templates/adminSchools.view.client.html',
				controller: 'adminController',
				controllerAs: 'model',
				resolve: {
					loggedAdmin: isAdmin
				}
			})
			
			// .when('/allGrades/:gradeId',{
			// 	templateUrl: 'grades/templates/gradeDetails.view.client.html',
			// 	controller: 'gradeDetailsController',
			// 	controllerAs: 'model'
			// })
			

			.when('/schoolProfile/gradesList', {
				templateUrl:  'AllUsers/templates/schoolGradesList.view.client.html',
				controller:   'schoolGradesListController',
				controllerAs: 'model',
				resolve: {
					loggedSchool: isSchool
				}
			})


			.when('/schoolProfile/newGrade', {
				templateUrl: 'AllUsers/templates/schoolNewGrade.view.client.html',
				controller: 'schoolNewGradeController',
				controllerAs: 'model',
				resolve: {
					loggedSchool: isSchool
				}
			})

			// .when('/schoolProfile/reNewCourse/:gradeId', {
			// 	templateUrl: 'AllUsers/templates/schoolReNewCourse.view.client.html',
			// 	controller: 'schoolReNewCourseController',
			// 	controllerAs: 'model',
			// 	resolve: {
			// 		loggedSchool: isSchool
			// 	}
			// })

			.when('/schoolProfile/editGrade', {
				templateUrl: 'AllUsers/templates/schoolEditGrade.view.client.html',
				controller: 'schoolEditGradeController',
				controllerAs: 'model',
				resolve: {
					loggedSchool: isSchool
				}
			})


			.when('/schoolProfile/schoolGradeDetails/:gradeId', {
				templateUrl: 'grades/templates/schoolGradeDetails.view.client.html',
				controller: 'schoolGradeDetails',
				controllerAs: 'model',
				resolve: {
					loggedSchool: isSchool
				}
			})

			.when('/contact', {
				templateUrl: '../views/pages/contact.view.client.html',
				controller: 'homePageController',
				controllerAs: 'model'
			})
			.when('/about', {
				templateUrl: '../views/pages/about.view.client.html',
				controller: 'homePageController',
				controllerAs: 'model'
			});
	}
	
	// check the user if still logged in through the server cockies if the user logged in he is in the cockies based on that we can protect the url
	function isParent(userService, $q, $location){
		var deferred = $q.defer();
		userService
			.checkUserLogin()
			.then(function(user){
				if(user === null){
					deferred.reject();
					$location.url('/login');
				} else{
					deferred.resolve(user);
				}
			});
		return deferred.promise;
	}

	function isSchool(userService, $q, $location){
		var deferred = $q.defer();
		userService
			.isSchool()
			.then(function(school){
				if(school === null){
					deferred.reject();
					$location.url('/login');
				} else{
					deferred.resolve(school);
				}
			});
		return deferred.promise;
	}

	function isGrade(userService, $q, $location){
		var deferred = $q.defer();
		userService
			.isGrade()
			.then(function(grade){
				if(grade === null){
					deferred.reject();
					$location.url('/login');
				} else{
					deferred.resolve(grade);
				}
			});
		return deferred.promise;
	}

	function isAdmin(userService, $q, $location){
		var deferred = $q.defer();
		userService
			.isAdmin()
			.then(function(admin){
				if(admin === null){
					deferred.reject();
					$location.url('/');
				}else{
					deferred.resolve(admin);
				}
			});
			return deferred.promise;
	}

	function checkUserType(userService, $q, $location){
		var deferred = $q.defer();
		userService
			.checkUserLogin()
			.then(function(user){
				if(user.userType === 'parent'){
					deferred.resolve(user);
					$location.url('/parentProfile');
					return deferred.promise;
				} else if(user.userType === 'schoolAdmin'){
					deferred.resolve(user);
					$location.url('/schoolProfile');
					return deferred.promise;
				}else if(user.userType === 'gradeAdmin'){
					deferred.resolve(user);
					$location.url('/gradeProfile');
					return deferred.promise;
				}else if(user.userType === 'admin'){
					deferred.resolve(user);
					$location.url('/adminPage');
					return deferred.promise;
				}
			});
	}


})();