var gradesDB = require('./grades.model.server.js');

module.exports = function(app) {

	

	// http handlers
	app.get('/api/allGrades', getallGrades);
	// app.get('/api/grade/:gradeId', findCourse);
	// app.get('/api/grade/', findCourse);
	app.get('/api/schoolGrades/:schoolId', findGradesByCenterId);
	app.get('/api/grade/:gradeId', findCourseByCourseId);
	app.post('/api/grade/', addNewCourse);
	app.put('/api/grade/', updateCourse);
	app.delete('/api/grade/', removeCourse);
	app.put('/api/admin/updateGradeByAdmin/:gradeId', checkAdmin, updateGradeByAdmin);
	app.get('/api/gradeConfig', gradeConfig);
	app.get('/api/getMapBoxKey', getMapBoxKey);
	app.put('/api/grade/addToDiscountedMembers', addToDiscountedMembers);
	app.put('/api/grade/addExpense', addExpense);
	app.put('/api/grade/addToFrozeMembers', addToFrozeMembers);
	// app.delete('/api/grade/removeFromFrozeMembers/:userId/:gradeId', removeFromFrozeMembers);
	// app.put('/api/grade/removeFrozen/:userId/:gradeId/:originalCourseId', removeFrozen);
	app.put('/api/grade/removeFrozen', removeFrozen);


	function removeFrozen(req, res){
		var ids = req.body;
		console.log(ids);
		gradesDB
			.removeFrozen(ids)
			.then(function(result){
				console.log('the result of remove frozen is: ');
				console.log(result);
				res.send(result);
			});
	}


	function addToFrozeMembers(req, res){
		var freezeObject = req.body;
		gradesDB
			.addToFrozeMembers(freezeObject)
			.then(function(result){
				res.send(result);
			});
	}

	function addExpense(req, res){
		var expense = req.body;
		var gradeId = expense.gradeId;
		delete(expense.gradeId);
		gradesDB
			.addExpense(gradeId, expense)
			.then(function(result){
				res.send(result);
			});
	}

	function addToDiscountedMembers(req, res){
		var ids = req.body;
		gradesDB
			.addToDiscountedMembers(ids)
			.then(function(result){
				res.send(result);
			});
	}


	function getMapBoxKey(req, res){
		var mapBoxKey = process.env.mapboxAccessToken;
		res.send(mapBoxKey);
	}
	

	function gradeConfig(req, res){
		var gradesParams = {};
		gradesParams.mapBoxKey = process.env.mapboxAccessToken;

		gradesDB
			.getallGrades()
			.then(function(grades){
				gradesParams.gradesList = grades;
				res.send(gradesParams);
			});
	}


	function checkAdmin(req, res, next){
		if(req.user && req.user.userType === "admin"){
			next();
		}else{
			res.sendStatus(401);
		}
	}


	function updateGradeByAdmin(req, res){
		var gradeId = req.params.gradeId;
		var updatedCourse = req.body;
		gradesDB
			.updateGradeByAdmin(gradeId, updatedCourse)
			.then(function(status){
				res.send(status);
				return;
			});
	}

	// function findCourse(req, res){
	// 	if(req.query.gradeId){
	// 		res.send(gradesDB
	// 					.findCourseByCourseId(req.query.gradeId)
	// 					.then(function(grade){
	// 						res.send(grade);
	// 						return;
	// 					})
	// 				);
	// 	}
	// 	if(req.query.schoolId){
	// 		res.send(gradesDB
	// 					.findGradesByCenterId(req.query.schoolId)
	// 					.then(function(grade){
	// 						res.send(grade);
	// 						return;
	// 					})
	// 				);
	// 		return;
	// 	}
		
	// }
	
	function findGradesByCenterId(req, res){
		var schoolId = req.params.schoolId;

		gradesDB
			.findGradesByCenterId(schoolId)
			.then(function(grades){
				res.send(grades);
				return;
			});

	}

	function findCourseByCourseId(req, res){
		var gradeId = req.params.gradeId;
		gradesDB
			.findCourseByCourseId(gradeId)
			.then(function(grade){
				res.send(grade);
				return;
			});
	}

	function getallGrades(req, res){
		gradesDB
			.getallGrades()
			.then(function(result){
				res.send(result);
				return;
			});
	}

	// function findCourseByCourseId(gradeId){
	// 	gradesDB
	// 		.findCourseByCourseId(gradeId)
	// 		.then(function(foundCourse){
	// 			return foundCourse;
	// 		});
		// for(var e in grades){
		// 	if(gradeId === grades[e].gradeId){
		// 		return(grades[e]);
		// 	}
		// }
		// return ('error');
	// }

	// function findGradesByCenterId(schoolId){
	// 	var gradesList = [];
	// 		for(var e in grades){
	// 			if(schoolId === grades[e].schoolId){
	// 				gradesList.push(grades[e]);
	// 			}
	// 		}
	// 		return (gradesList);
	// }

	function addNewCourse(req, res){
		var newGrade = req.body;
		var schoolId = newGrade.schoolId;
		// grades.push(newGrade);
		gradesDB
			.addNewCourse(schoolId, newGrade)
			.then(function(addedCourse){
				res.send(addedCourse);
				return;
			});
	}

	function updateCourse(req, res){
		var gradeId = req.query.gradeId;
		var updatedCourse = req.body;
		// request the admin to approve the amendments
		updatedCourse.approved = false;
		updatedCourse.special = false;
		gradesDB
			.updateCourse(gradeId, updatedCourse)
			.then(function(status){
				// res.send(status);
				// return;
				gradesDB
					.findCourseByCourseId(gradeId)
					.then(function(grade){
						res.send(grade);
						return;
					});
			});
	}

	function removeCourse(req, res){
		var schoolId = req.query.schoolId;
		var gradeId = req.query.gradeId;

		gradesDB
			.removeCourse(schoolId, gradeId)
			.then(function(status){
				res.send(status);
				return;
			});
		// for(var e in grades){
		// 	if(gradeId === grades[e].gradeId){
		// 		grades.splice(e, 1);
		// 		res.send('grade deleted');
		// 		return;
		// 	}
		// }
	}




};