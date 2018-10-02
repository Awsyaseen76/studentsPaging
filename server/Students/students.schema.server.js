var mongoose = require('mongoose');

var studentsSchema = mongoose.Schema({
	name: {
		firstName: String,
		middleName: String,
		lastName: String
	},
	DOB: Date,
	gender: String,
	parentEmail: String,
	password: String,
	parentName: String,
	fatherPhone: String,
	motherPhone: String,
	gradeId: {type: mongoose.Schema.Types.ObjectId, ref: 'gradesDB'}
}, {
	collection: 'students'
});

module.exports = studentsSchema;