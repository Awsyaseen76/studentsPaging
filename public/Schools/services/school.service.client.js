(function() {
	angular
		.module("studentsPaging")
		.service('schoolService', schoolService);

	function schoolService($http) {

		this.getAllSchools = getAllSchools;
		this.findSchoolById = findSchoolById;
		this.findSchoolByName = findSchoolByName;
		this.updateSchool = updateSchool;


		function init() {}
		init();

		function getAllSchools(){
			return $http.get('/api/schools/getAllSchools');
		}

		function findSchoolById(schoolId) {
			var url = '/api/schools/findschoolById/' + schoolId;
			return $http.get(url)
				.then(function(response) {
					var schoolDetails = response.data;
					return schoolDetails;
				});
		}

		function findSchoolByName(schoolName){
			return $http.get('/api/schools/findSchoolByName/'+schoolName);
		}
		

		function updateSchool(updatedSchool){
			var url = '/api/schools/updateSchool';
			return $http.put(url, updatedSchool);
		}

	}
})();