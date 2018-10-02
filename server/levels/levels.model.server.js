var mongoose = require('mongoose');
var schoolsSchema = require('./schools.schema.server.js');

var parentsDB = require('../AllUsers/parents.model.server.js');

var schoolsDB = mongoose.model('schoolsDB', schoolsSchema);

module.exports = schoolsDB;

schoolsDB.findSchoolBySchoolId = findSchoolBySchoolId;
schoolsDB.getAllSchools = getAllSchools;
schoolsDB.updateSchool = updateSchool;


function findSchoolBySchoolId(schoolId){
	return schoolsDB
				.findById(schoolId)
				.exec();
}

function getAllSchools(){
	return schoolsDB
				.find({})
				.then(function(result){
					return result;
				});
}

function updateSchool(schoolId, updatedSchool){
	return schoolsDB.update({_id: schoolId}, {$set: updatedSchool});
}

