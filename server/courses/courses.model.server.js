var mongoose = require('mongoose');
var gradesSchema = require('./grades.schema.server.js');

var parentsDB = require('../AllUsers/parents.model.server.js');

var gradesDB = mongoose.model('gradesDB', gradesSchema);

module.exports = gradesDB;

gradesDB.findCourseByCourseId = findCourseByCourseId;
gradesDB.findGradesByCenterId = findGradesByCenterId;
gradesDB.getallGrades = getallGrades;
gradesDB.addNewCourse = addNewCourse;
gradesDB.updateCourse = updateCourse;
gradesDB.removeCourse = removeCourse;
gradesDB.updateGradeByAdmin = updateGradeByAdmin;
gradesDB.addMemberToCourse = addMemberToCourse;
gradesDB.addToDiscountedMembers = addToDiscountedMembers;
gradesDB.addExpense = addExpense;
gradesDB.addToFrozeMembers = addToFrozeMembers;
gradesDB.removeFrozen = removeFrozen;

function removeFrozen(ids){
	// console.log(ids);
	var gradeId = ids.gradeId;
	var userId = ids.userId;
	var originalCourseId = ids.originalCourseId;
	return gradesDB
				.findById(gradeId)
				.then(function(grade){
					console.log('the found grade is:');
					console.log(grade);
					for(var f in grade.frozeMembers){
						if(grade.frozeMembers[f].userId === userId){
							// instead of remove the frozen members set the compensated to true
							// grade.frozeMembers.splice(f,1);
							grade.frozeMembers[f].compensated = true;
							console.log('compensated after is: ',grade.frozeMembers[f].compensated);
						}
					}
					return grade.save();
					// return parentsDB.findById(userId);
				})
				// .then(function(user){
				.then(
					parentsDB
						.findById(userId)
						.then(function(user){
							console.log('the user is: ');
							console.log(user);
							for(var i in user.userCourseParameters){
								if(user.userCourseParameters[i].gradeId === originalCourseId){
									user.userCourseParameters[i].freezeDays.splice(0, user.userCourseParameters[i].freezeDays.length);
								}
							}
							return user.save();
							
						})

					);
}




function addToFrozeMembers(freezeObject){
	var gradeId = freezeObject.gradeId;
	return gradesDB
			.findById(gradeId)
			.then(function(grade){
				grade.frozeMembers.push(freezeObject);
				return grade.save();
			});
}


function addExpense(gradeId, expense){
	return gradesDB
				.findById(gradeId)
				.then(function(grade){
					grade.expenses.push(expense);
					return grade.save();
				});
}


function addToDiscountedMembers(ids){
	var gradeId = ids.gradeId;
	var userId = ids.userId;
	return gradesDB
				.findById(gradeId)
				.then(function(grade){
					for(var u in grade.discountedMembers){
						if(grade.discountedMembers[u] === userId){
							var err = 'You Already had a discount!';
							return (err);
						}else{
							grade.discountedMembers.push(userId);
							return grade.save();
						}
					}
				});
}


function addMemberToCourse(gradeId, userId){
	return gradesDB
			.findById(gradeId)
			.then(function(grade){
				grade.registeredMembers.push(userId);
				return grade.save();
			});
}


function findCourseByCourseId(gradeId){
	return gradesDB
				.findById(gradeId)
				.populate('registeredMembers')
				.exec();
}

function findGradesByCenterId(schoolId){
	return gradesDB
				.find({schoolId: schoolId})
				.sort('startingDate')
				.populate('registeredMembers')
				.exec();
}

function getallGrades(){
	return gradesDB
				.find({})
				// .populate('school')
				// .exec()
				.then(function(result){
					return result;
				});
}

function addNewCourse(schoolId, grade){
	var gradeTemp = null;
	return gradesDB
				.create(grade)
				.then(function(addedCourse){
					gradeTemp = addedCourse;
					return parentsDB.addCourseId(schoolId, addedCourse._id);
				})
				.then(function(school){
					return gradeTemp;
				});
}


function updateGradeByAdmin(gradeId, updatedCourse){
	return gradesDB.update({_id: gradeId}, {$set: updatedCourse});
}


function updateCourse(gradeId, updatedCourse){
	return gradesDB.update({_id: gradeId}, {$set: updatedCourse});
}

function removeCourse(schoolId, gradeId){
	return gradesDB
				.remove({_id: gradeId})
				.then(function(status){
					return parentsDB.removeCourseFromList(schoolId, gradeId);
				})
				.then(function(removedCourse){
					return removedCourse;
				});
}