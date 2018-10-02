var mongoose = require('mongoose');

var schoolsSchema = mongoose.Schema({
	email: String,
	password: String,
	name: String,
	profileImage: {
		type: {},
		default: {
			filename: "./public/img/profileImages/avatar.png"
		}
	},
	google: {
		id: String,
		token: String
	},
	contacts: [],
	address: String,
	notes: String,
	resetPasswordToken: String,
	resetPasswordExpires: Date,
	grades: [{type: mongoose.Schema.Types.ObjectId, ref: 'gradesDB'}]
}, {
	collection: 'schools'
});

module.exports = schoolsSchema;