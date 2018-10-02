var mongoose = require('mongoose');

var gradesSchema = mongoose.Schema({
	email: String,
	password: String,
	schooldId : {type: mongoose.Schema.Types.ObjectId, ref: 'schoolsDB'},
	name: String,
	teacher: String,
	notes: String,
	students: [{type: mongoose.Schema.Types.ObjectId, ref: 'studentsDB'}]
}, {
	collection: 'grades'
});

module.exports = gradesSchema;