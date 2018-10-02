var mongoose = require('mongoose');


var usersSchema = mongoose.Schema({
	userType: {type: String, default: 'parent', enum:['admin', 'schoolAdmin', 'gradeAdmin', 'parent']},
	email: String,
    password: String,
    name:{
        firstName: String,
        middleName: String,
        lastName: String
    },
    gender: String,
    DOB: Date,
    address: String,
    contact:{
        phone1:String,
        phone2:String,
        phone3: String,
        phone4: String
    },
    profileImage: {
        type: {},
        default: {filename: "./public/img/profileImages/avatar.png"}
    },
    google: {
        id: String,
        token: String
    },
    resetPasswordToken: String,
 	resetPasswordExpires: Date,
    notes: String
}, {collection: 'users'});



module.exports = usersSchema;