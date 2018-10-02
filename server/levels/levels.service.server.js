var schoolsDB = require('./schools.model.server.js');

module.exports = function(app) {
	// ---------- http handlers --------------------
	app.get('/api/schools/getAllSchools', getAllSchools);
	app.get('/api/schools/school/:schoolId', findSchoolBySchoolId);
	app.put('/api/schools/updateSchool', checkAdmin, updateSchool);


	// ---------- Functions --------

	function checkAdmin(req, res, next){
		if(req.user && req.user.userType === "admin"){
			next();
		}else{
			res.sendStatus(401);
		}
	}

	function findSchoolBySchoolId(req, res){
		var schoolId = req.params.schoolId;
		schoolsDB
			.findSchoolBySchoolId(schoolId)
			.then(function(school){
				res.send(school);
				return;
			});
	}

	function getAllSchools(req, res){
		schoolsDB
			.getAllSchools()
			.then(function(result){
				res.send(result);
				return;
			});
	}

	function updateSchool(req, res){
		var schoolId = req.query.schoolId;
		var updatedSchool = req.body;
		updatedSchool.approved = false;
		updatedSchool.special = false;
		schoolsDB
			.updateSchool(schoolId, updatedSchool)
			.then(function(status){
				schoolsDB
					.findSchoolBySchoolId(schoolId)
					.then(function(school){
						res.send(school);
						return;
					});
			});
	}

};