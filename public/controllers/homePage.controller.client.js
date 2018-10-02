(function(){
	angular
		.module("studentsPaging")
		.controller('homePageController', homePageController);

	function homePageController(userService, $location, $route, $interval){
		var model = this;
		model.logout = logout;
		

		function init(){
			userService
				.checkUserLogin()
				.then(function(result){
					if(result){
						model.loggedUser = result;
						return;
					}else{
						model.loggedUser = null;
						return;
					}
				});



			// This make the carousel works and set the sliding time
			$(document).ready(function() {
				$('.carousel').carousel({
					interval: 3000
				});  
	        });
		}

		init();


		function logout(){
			userService
				.logout()
				.then(function(){
					$location.url('/');
					$route.reload();
				});
		}


	}
})();