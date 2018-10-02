module.exports = function(app) {


var usersDB = require('./users.model.server.js');
// var studentsDB 		= require('../Students/students.model.server.js');
// var gradesDB 		= require('../Grades/grades.model.server.js');
var passport 		= require('passport');
var bcrypt   		= require('bcrypt-nodejs');
var GoogleStrategy 	= require('passport-google-oauth').OAuth2Strategy;
var nodemailer 		= require('nodemailer');
var path 			= require('path');
var aws 			= require('aws-sdk');
var multerS3 		= require('multer-s3');
var multer 			= require('multer');
var fs 				= require('fs');
var crypto 			= require('crypto');
var LocalStrategy 	= require('passport-local').Strategy;
var async			= require('async');




// ---------------------------- configurations --------------------------------------------------------

// Google configuration
	var googleConfig = {
	    clientID     : process.env.GOOGLE_CLIENT_ID,
	    clientSecret : process.env.GOOGLE_CLIENT_SECRET,
	    callbackURL  : process.env.GOOGLE_CALLBACK_URL
	};


// AWS Configuration:
	aws.config.update({
	    secretAccessKey: process.env.AWSSecretKey,
	    accessKeyId: process.env.AWSAccessKeyId,
	    region: 'us-east-1'
	});
	var s3 = new aws.S3();


// Nodemailer configuration:
	var transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: process.env.GMAIL_ACCOUNT,
			pass: process.env.GMAIL_PASS
		},
	});



// Image upload configuration:
	var upload = multer({
		// storage: storage, for the local storage
		storage: multerS3({
	        s3: s3,
	        bucket: 'pagingSystemProject',
	        key: function (req, file, cb) {
	            // remove old image before upload new one
	            var params = {
	  					Bucket: "pagingSystemProject", 
	  					Key: req.user.profileImage.key
	 				};
				s3.deleteObject(params, function(err, data) {
			   		if (err) console.log(err, err.stack); // an error occurred
			   		else     console.log(data);           // successful response
			   
	 			});

	            var filelocation = 'profilepictures/'+req.user._id +'.'+ file.originalname.split('.')[1]; 
	            cb(null, filelocation);
	        	}
		}),
		limits: {fileSize: 1000000},
		fileFilter: function(req, file, cb){
			checkFileType(file, cb);
		}
	});

	function checkFileType(file, cb){
		// Allowed extension
		var filetypes = /jpeg|jpg|png|gif/;
		var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
		var mimetype = filetypes.test(file.mimetype);
		if(extname && mimetype){
			return cb(null, true);
		} else {
			return cb('Only (jpeg jpg png gif) images allowed');
		}
	}


// Local Stratigy configuration
	passport.use('localUser', new LocalStrategy(userStrategy));

// Google Stratigy configuration
	passport.use(new GoogleStrategy(googleConfig, googleStrategy));

// ---------------------------- /configurations --------------------------------------------------------




// ---------------------------------- APIs requests ----------------------------------

app.get('/api/user/getAllUsers', getAllUsers);
app.get('/api/user/findUserById/:userId', findUserById);
app.get('/api/user/findUserByEmail/:userEmail', findUserByEmail);
app.post('/api/user/login', passport.authenticate('localUser'), loginUser);
app.post('/api/user/', addNewUser);
app.get('/api/checkUserLogin', checkUserLogin);
app.get('/api/isSchool', isSchool);
app.get('/api/isGrade', isGrade);
app.get('/api/admin/isAdmin', checkAdmin, isAdmin);
app.post('/api/logout', logout);
// app.post('/api/addCourseToUser', addCourseToUserGradesList);

// login with google
app.get('/pagingSystem/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
app.get('/pagingSystem/auth/google/callback',
passport.authenticate('google', {
    successRedirect: '/#!/profile',
    failureRedirect: '/#!/loginUser'
}));
//------------------
app.post('/api/schoolProfile/uploadProfilePic', upload.single('profilePicture'), uploadImage);
app.post('/api/forgetPassword/:email', forgetPassword);
app.post('/api/resetPassword/:token', checkToken, resetPassword);
app.put('/api/user/updateProfile', updateProfile);


// ---------------------------------- /APIs requests ----------------------------------

	


// ------------------------------ Functions ------------------------------



function updateProfile(req, res){
	var updatedProfile = req.body;
	usersDB
		.updateProfile(updatedProfile)
		.then(function(result){
			res.send(result);
		});
}

// Do the action here
function checkToken(req, res, next){
	var token = req.params.token;
	var password = req.body.password;
	var emailAddress = process.env.GMAIL_ACCOUNT;
	// resetPassword(req, res, password);

	usersDB
		.findUserByToken(token)
		.then(function(user){
			// console.log(user);
			if(user){
				newPassword = bcrypt.hashSync(password);
				usersDB
					.resetPassword(user, newPassword)
					.then(function(result){
						// send email to reset password
						var mailOptions = {
							from: emailAddress,
							to: result.email,
							subject: 'Password changed...',
							html: 
								'<div align="center" style="background-color: beige">'+
										'<br><br>'+
										'<img src="cid:pagingSystemLogo001" style="width: 200px; height: 200px;"/>'+
										'<br>'+
										'<p style="color: indianred; font-size: 2em;">Welcome '+ result.name.firstName + '!'+'</p>'+
										'<p style="font-size: 1.5em;" > You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>'+
										'<br>'+
										'<p style="font-size: 1.5em;">This is to confirm that your password has been changed successfully. </p>'+
										'<br>'+ 
										'<p style="font-size: 1.5em;">You can login to your account with your new password normally. </p>'+
										'<br>'+ 
										'<p style="font-size: 1.5em;"> http://' + req.headers.host + '/#!/login'+'</p>'+
										'<br>'+
										'<p style="font-size: 1.5em;">Paging System Team</p>'+
										'<br>'+
										'<p> --   </p>'+
								'</div>',
								
								attachments: [{
						        	filename: 'sps-logo-sqr.jpg',
						        	path: __dirname+'/../../public/img/logo/sps-logo-sqr.jpg',
						        	cid: 'pagingSystemLogo001' 
						    	}]
							
						};
						transporter.sendMail(mailOptions, function(error, info){
							console.log('Email sent to: ' + result.email);
							res.sendStatus(200);
						});


						resetPassword(req, res, result);
					});
			}
		}, function(err){
			console.log(err);
			return err;
		});
}


// send the status from here
function resetPassword(req, res, user){
	console.log('Password changed');
	req.login(user, function(err){
		if(err){
			return err;
		} else{
			res.send(user.data);
		}
	});
}

function forgetPassword(req, res){
	var userEmail = req.params.email;
	var emailAddress = process.env.GMAIL_ACCOUNT;

	crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        usersDB
        	.addTokenToUser(userEmail, token)
        	.then(function(user){
				// send email to reset password
				var mailOptions = {
					from: emailAddress,
					to: userEmail,
					subject: 'Password reset...',
					html: 
						'<div align="center" style="background-color: beige">'+
								'<br><br>'+
								'<img src="cid:pagingSystemLogo001" style="width: 200px; height: 200px;"/>'+
								'<br>'+
								'<p style="color: indianred; font-size: 2em;">Welcome '+ user.name.firstName + '!'+'</p>'+
								'<p style="font-size: 1.5em;" > You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>'+
								'<br>'+
								'<p style="font-size: 1.5em;">Please click on the following link, or paste this into your browser to complete the process: </p>'+
								'<br>'+
								'<p style="font-size: 1.5em;"> http://' + req.headers.host + '/#!/resetPassword/' + token +'</p>'+
								'<br>'+
								'<p style="font-size: 1.5em;">If you did not request this, please ignore this email and your password will remain unchanged. </p>'+
								'<br>'+
								'<p style="font-size: 1.5em;">Paging System Team</p>'+
								'<br>'+
								'<p> --   </p>'+
						'</div>',
						
						attachments: [{
				        	filename: 'logo2.jpg',
				        	path: __dirname+'/../../public/img/logo/logo2.jpg',
				        	cid: 'pagingSystemLogo001' 
				    	}]
					
				};
				transporter.sendMail(mailOptions, function(error, info){
					console.log('Email sent to: ' + user.email);
					res.sendStatus(200);
				});
		    });
    });
}





function findUserByEmail(req, res){
	var userEmail = req.params.userEmail;
	usersDB
		.findUserByEmail(userEmail)
		.then(
			// if seccess
			function(result){
				if(result){
					res.send(result);
					return;
				} else {
					res.send('error');
					return;
				}
			},
			function(err){
				res.sendStatus(404).send(err);
				return;
			}
		);
}

function findUserById(req, res){
	var userId = req.params.userId;
		usersDB
			.findUserById(userId)
			.then(function(result){
				if(result){
					res.send(result);
					return;
				} else {
					res.send('error');
					return;
				}
			});
}




function uploadImage(req, res){
		var profileImage = req.file;
		// if there is no file uploaded throw an error
		if(profileImage == undefined){
			res.send('No file selected');
			return;
		}else if (profileImage.size > 1000000){
			res.send('Image size is greater than 1MB');
			return;
		}
		// add the file data to user database
		usersDB
			.addProfileImage(req.user._id, profileImage)
			.then(function(user){
			});
		res.redirect('/#!/schoolProfile');
}





function userStrategy(username, password, done) {
	usersDB
		.findUserByEmail(username)
		.then(
			function(user){
				if(!user){
					return done(null, false);
				} else if(user && !bcrypt.compareSync(password, user.password)){
					return done(null, false);
				} else if(user && bcrypt.compareSync(password, user.password)){
					return done(null, user);
				} 
			},
			function(err){
				if(err){
					return done(err);
				}
			}
		);
}





function googleStrategy(token, refreshToken, profile, done) {
	usersDB
	    .findUserByGoogleId(profile.id)
	    .then(
	        function(user) {
	            if(user) {
	                return done(null, user);
	            } else {
	                var email = profile.emails[0].value;
	                var emailParts = email.split("@");
	                var newGoogleUser = {
	                    username:  emailParts[0],
	                    firstName: profile.name.givenName,
	                    lastName:  profile.name.familyName,
	                    email:     email,
	                    google: {
	                        id:    profile.id,
	                        token: token
	                    }
	                };
	                return usersDB.addNewUser(newGoogleUser);
	            }
	        },
	        function(err) {
	            if (err) { return done(err); }
	        }
	    )
	    .then(
	        function(user){
	            return done(null, user);
	        },
	        function(err){
	            if (err) { return done(err); }
	        }
	    );
}




function logout(req, res){
	req.session.destroy();
	req.logout();
	res.sendStatus(200);
}


function loginUser(req, res){
	var user = req.user;
	res.json(user);
}




function getAllUsers(req, res) {
	usersDB
		.getAllUsers()
		.then(function(result){
			if(result){
				res.send(result);
				return;
			} else {
				res.send('error');
				return;
			}
		});
}


function addNewUser(req, res){
	var newUser = req.body;
	var emailAddress = process.env.GMAIL_ACCOUNT;
	
	newUser.password = bcrypt.hashSync(newUser.password);
	usersDB
		.addNewUser(newUser)
		.then(function (addedUser){
			req.login(addedUser, function(err){
				if(err){
					return err;
				}else{
					var mailOptions = {
						from: emailAddress,
						to: addedUser.email,
						subject: 'Registration completed',
						html: 
							'<div align="center" style="background-color: beige">'+
									'<br><br>'+
									'<img src="cid:pagingSystemLogo001" style="width: 200px; height: 200px;"/>'+
									'<br>'+
									'<h1 style="color: indianred; font-size: 6em;">Welcome '+ addedUser.name.firstName + '!'+'</h1>'+
									'<h3 style="font-size: 3em;" >Your registration has been completed...</h3>'+
									'<br>'+
									'<p style="font-size: 2em;">You can now enjouy our services by logging in to <a href="http://studentsPagingSystem.herokuapp.com">our site</a> and enjoy our services.</p>'+
									'<br>'+
									'<h3 style="font-size: 3em;">Paging System Team</h3>'+
									'<br><br><br><br><br>'+
							'</div>',
							
							attachments: [{
					        	filename: 'logo2.jpg',
					        	path: __dirname+'/../../public/img/logo/logo2.jpg',
					        	cid: 'pagingSystemLogo001' 
					    	}]
						
						};

					transporter.sendMail(mailOptions, function(error, info){
						if (error) {
							console.log(error);
						} else {
							console.log('Email sent: ' + info.response);
						}
					});

					res.json(addedUser);
				}
			});
		});
}


function checkUserLogin(req, res){
	console.log('step 8');
	res.send(req.isAuthenticated()? req.user : null);
}

function isSchool(req, res){
	res.send(req.isAuthenticated() && req.user.userType === 'schoolAdmin' ? req.user : null);
}

function isGrade(req, res){
	res.send(req.isAuthenticated() && req.user.userType === 'gradeAdmin' ? req.user : null);
}

function isAdmin(req, res){
	var admin = req.user;
	res.send(admin);
}

function checkAdmin(req, res, next){
	if(req.isAuthenticated() && req.user.userType === 'admin'){
		next();
	}
	else{
		return null;
	}
}




};


