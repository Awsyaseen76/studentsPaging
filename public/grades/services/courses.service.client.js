(function() {
	angular
		.module("studentsPaging")
		.service('gradeService', gradeService);

	function gradeService($http) {

		function init() {}
		init();


		this.getallGrades = getallGrades;
		this.findCourseByCourseId = findCourseByCourseId;
		this.findGradesByCenterId = findGradesByCenterId;
		this.addNewCourse = addNewCourse;
		this.updateCourse = updateCourse;
		this.removeCourse = removeCourse;
		this.updateGradeByAdmin = updateGradeByAdmin;
		this.gradeConfig = gradeConfig;
		this.getMapBoxKey = getMapBoxKey;
		this.addToDiscountedMembers = addToDiscountedMembers;
		this.addExpense = addExpense;
		this.addToFrozeMembers = addToFrozeMembers;
		// this.removeFromFrozeMembers = removeFromFrozeMembers;
		this.removeFrozen = removeFrozen;


		function removeFrozen(ids){
			var userId = String(ids.userId);
			var gradeId = String(ids.gradeId);
			var originalCourseId = String(ids.originalCourseId);
			return $http.put('/api/grade/removeFrozen', ids);
		}

		function addToFrozeMembers(freezeObject){
			return $http.put('/api/grade/addToFrozeMembers', freezeObject);
		}

		function addExpense(expense){
			return $http.put('/api/grade/addExpense', expense);
		}

		function addToDiscountedMembers(ids){
			return $http.put('/api/grade/addToDiscountedMembers', ids);
		}

		function getMapBoxKey(){
			return $http.get('/api/getMapBoxKey');
		}

		function gradeConfig(){
			return $http.get('/api/gradeConfig');
		}

		function updateGradeByAdmin(grade){
			return $http.put('/api/admin/updateGradeByAdmin/'+grade._id, grade)
				.then(function(response){
					return response.data;
				});
		}


		function getallGrades(){
			return $http.get('/api/allGrades')
				.then(function(response){
					return response.data;
				});
		}

		function findCourseByCourseId(gradeId){
			return $http.get('/api/grade/' + gradeId)
				.then(function(response){
					return response.data;
				});
		}

		function findGradesByCenterId(schoolId) {
			return $http.get('/api/schoolGrades/' + schoolId)
				.then(function(response){
					return response.data;
				});
		}

		function addNewCourse(newGrade){
			return $http.post('/api/grade/', newGrade)
				.then(function(response){
					return response.data;
				});
			// grades.push(newGrade);
		}

		function updateCourse(updatedCourse, gradeId){
			// var url = '/api/grade/' + gradeId;
			return $http.put('/api/grade/?gradeId='+gradeId, updatedCourse)
				.then(function (response){
					return response.data;					
				});			
		}


		function removeCourse(schoolId, gradeId){
			var url = '/api/grade/?gradeId=' + gradeId + '&schoolId='+schoolId;
			return $http.delete(url)
				.then(function(response){
					return response.data;
				});
			// for(var e in grades){
			// 	if (grades[e].gradeId === gradeId){
			// 		grades.splice(e,1);
			// 		return grades;
			// 	}
			// }
		}




	}
})();