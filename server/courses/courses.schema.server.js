var mongoose = require('mongoose');

var gradesSchema = mongoose.Schema({
			name: String,
			// school: {type: mongoose.Schema.Types.ObjectId, ref: 'schoolsDB'},
			school: {},
			details: String,
			created: {type: Date, default: Date.now()},
			schoolId: {type: mongoose.Schema.Types.ObjectId, ref: 'parentsDB'},
			startingDate: Date,
			expiryDate: Date,
			daysPerWeek: [],
			gradeDays: [],
			practiceDailyDetails: {},
			price: Number,
			images:{
				img750x450: {
					type: String,
					default: "http://placehold.it/750x450",
				},
				img1200x300: {
					type: String,
					default: "http://placehold.it/1200x300"
				}
			},
			approved: Boolean,
			special: Boolean,
			address: String,
			coordinates: [Number],
			registeredMembers: [{type: mongoose.Schema.Types.ObjectId, ref: 'parentsDB'}],
			originalCourseId: String,
			frozeMembers: [
								{
									_id: false, 
									userId: String,
									gradeId: String,
									userFullName: String,
									days: [],
									compensated: {type: Boolean, default: false}
								}
							],
			discountedMembers: [],
			expenses: [
						{
							_id: false,
							expenseDate: Date, 
							expenseType: String, 
							expenseDetails: String, 
							expenseAmount: Number
						}
					  ]
}, {collection: 'grades'});

module.exports = gradesSchema;