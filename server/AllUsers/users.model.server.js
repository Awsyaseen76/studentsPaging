var mongoose = require('mongoose');
var usersSchema = require('./users.schema.server.js');

var usersDB = mongoose.model('usersDB', usersSchema);

module.exports = usersDB;

usersDB.addNewUser = addNewUser;
usersDB.loginUser = loginUser;
usersDB.getAllUsers = getAllUsers;
usersDB.findUserById = findUserById;
usersDB.findUserByEmail = findUserByEmail;
usersDB.findUserByGoogleId = findUserByGoogleId;
usersDB.addProfileImage = addProfileImage;
usersDB.addTokenToUser = addTokenToUser;
usersDB.findUserByToken = findUserByToken;
usersDB.resetPassword = resetPassword;
usersDB.updateProfile = updateProfile;


function addNewUser(user){
	return usersDB.create(user);
}

function loginUser(username, password){
	return usersDB.findOne({email: username, password: password});
}

function getAllUsers(){
	return usersDB
				.find()
				.populate('grades')
				.populate('registeredGradesList')
				.exec();
}




function updateProfile(updatedProfile){
	return usersDB
			.findByIdAndUpdate(updatedProfile._id, updatedProfile)
			.then(function(result){
				return result;
			});
}

function resetPassword(user, newPassword){
	return usersDB
			.findById(user._id)
			.then(function(user){
				user.password = newPassword;
				user.resetPasswordToken = undefined;
				user.resetPasswordExpires = undefined;
				return user.save();
			});
}

function findUserByToken(token){
	return usersDB
		.findOne({resetPasswordToken: token, resetPasswordExpires: {$gt: Date.now()}})
		.then(function(user){
			return user;
		}, function(err){
			console.log(err);
			return err;
		});
}


function addTokenToUser(userEmail, token){
	return usersDB
			.findUserByEmail(userEmail)
			.then(function(user){
				user.resetPasswordToken = token;
        		user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        		return user.save();
		}, function(err){
			console.log(err);
		});
}
		


function addProfileImage(userId, profileImage){
	return usersDB
				.findUserById(userId)
				.then(function(user){
					user.profileImage = profileImage;
					return user.save();
				});
}



function findUserByGoogleId(googleId){
	return usersDB.findOne({'google.id' : googleId});
}




function findUserById(userId){
	return usersDB
				.findById(userId)
				.populate('grades')
				.populate('registeredGradesList')
				.exec();
}

function findUserByEmail(userEmail){
	return usersDB.findOne({email: userEmail});
}


