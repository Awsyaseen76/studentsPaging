(function() {
	angular
		.module("studentsPaging")
		.controller('schoolGradeDetails', schoolGradeDetails);

	function schoolGradeDetails($routeParams, gradeService, userService, $location, $route, loggedSchool) {

		var model = this;
		model.logout = logout;
		model.makePayment = makePayment;
		model.getTotals = getTotals;
		model.confirmAttendance = confirmAttendance;
		model.today = new Date();
		model.attendanceArray = [];
		model.countAttendance = countAttendance;
		model.specialDiscountAmount = 1;
		model.hadDiscount = hadDiscount;
		model.selectDiscount = selectDiscount;
		model.selectPaymentType = selectPaymentType;
		model.giveADiscountError = false;
		model.giveADiscount = giveADiscount;
		model.getUserPayments = getUserPayments;
		model.getGrandTotals = getGrandTotals;
		model.getCourseFeedbacks = getCourseFeedbacks;
		model.getAttendance = getAttendance;
		model.freezeMember = freezeMember;
		model.prepareFreezeDays = prepareFreezeDays;
		model.getFrozeMembers = getFrozeMembers;
		model.prepareExpenses = prepareExpenses;
		model.addExpense = addExpense;
		model.attendanceReportCreater = attendanceReportCreater;
		model.isParentFreezeToday = isParentFreezeToday;
		model.removeFrozen = removeFrozen;
		model.showPaidMembers = showPaidMembers;

		




		// this is temporary in future the grade school created the discountTypes array
		model.discountTypes = [{
				name: 'Discount type...',
				amount: 0
			}, {
				name: 'No discount',
				amount: 0
			}, {
				name: 'family',
				amount: 10
			}, {
				name: 'group',
				amount: 10
			}, {
				name: 'special',
				types: [{
					name: 'special25',
					amount: 25
				}, {
					name: 'special50',
					amount: 50
				}, {
					name: 'special75',
					amount: 75
				}, {
					name: 'special100',
					amount: 100
				}]
			}

		];

		model.paymentTypes = [{
			name: 'Payment type...'
		}, {
			name: 'Down payment'
		}, {
			name: 'Weekly payment'
		}, {
			name: 'Full payment'
		}, ];

		model.expensesTypes = [{
			name: 'Expense type...'
		}, {
			name: 'Salary'
		}, {
			name: 'Hospitality'
		}, {
			name: 'Rental fees'
		}, {
			name: 'Misc'
		}];



		// Temporary
		// model.expensesDetails = [{amount: 100, details: 'test of first', type: 'Salary', date: 'Mon Aug 06 2018'}];

		// model.calculateSessions = calculateSessions;
		// model.getTotalIncome = getTotalIncome;


		function init() {
			model.loggedSchool = loggedSchool;
			model.error2 = null;
			model.grandTotalPayments = 0;
			var gradeId = $routeParams.gradeId;

			// for default select option the first one is the title
			model.selectedDiscount = model.discountTypes[0];
			model.typeOfPayment = model.paymentTypes[0];
			model.selectedExpenseType = model.expensesTypes[0];
			model.thereIsSpecialDiscount = false;
			// model.hadDiscount = hadDiscount;

			gradeService
				.findCourseByCourseId(gradeId)
				.then(function(gradeDetails) {
					model.gradeFeedbacks = [];
					model.frozeMembers = [];
					model.gradeDetails = gradeDetails;
					model.discountedMembers = gradeDetails.discountedMembers;
					model.grandTotals = 0;
					model.paidMembers = [];
					model.unPaidMembers = [];

					for (var i in model.gradeDetails.registeredMembers) {
						model.grandTotals += getTotals(model.gradeDetails.registeredMembers[i], model.gradeDetails._id).totalOfPayments;
						for(var l in model.gradeDetails.registeredMembers[i].userCourseParameters){
							if(model.gradeDetails.registeredMembers[i].userCourseParameters[l].gradeId == model.gradeDetails._id){
								if(model.gradeDetails.registeredMembers[i].userCourseParameters[l].payments.length>0){
									model.paidMembers.push(model.gradeDetails.registeredMembers[i]);
								}else{
									model.unPaidMembers.push(model.gradeDetails.registeredMembers[i]);
								}
							}
						}
					}
					// }

					for (var x in model.gradeDetails.registeredMembers) {
						// Calculate the grand total payments
						for (var j in model.gradeDetails.registeredMembers[x].userCourseParameters) {
							if (model.gradeDetails.registeredMembers[x].userCourseParameters[j].gradeId === model.gradeDetails._id) {
								for (var s in model.gradeDetails.registeredMembers[x].userCourseParameters[j].payments) {
									model.grandTotalPayments += model.gradeDetails.registeredMembers[x].userCourseParameters[j].payments[s].amount;
								}
								// collect the feedbacks
								for (var f in model.gradeDetails.registeredMembers[x].userCourseParameters[j].feedbacks) {
									var feed = model.gradeDetails.registeredMembers[x].userCourseParameters[j].feedbacks[f];
									feed.userName = model.gradeDetails.registeredMembers[x].name.firstName + " " + model.gradeDetails.registeredMembers[x].name.lastName;
									model.gradeFeedbacks.push(feed);
								}
								if (model.gradeDetails.registeredMembers[x].userCourseParameters[j].freezeDays.length > 0) {
									// for(var z in model.gradeDetails.registeredMembers[x].userCourseParameters[j]){
									var freeze = {};
									freeze.userName = model.gradeDetails.registeredMembers[x].name;
									freeze.days = model.gradeDetails.registeredMembers[x].userCourseParameters[j].freezeDays;
									model.frozeMembers.push(freeze);
									// }
								}
							}
						}
						// // Collect the feedbacks
						// for(var e in model.gradeDetails.registeredMembers[x].userFeedback){
						// 	if(model.gradeDetails.registeredMembers[x].userFeedback[e].gradeId === gradeId){
						// 		var feed = model.gradeDetails.registeredMembers[x].userFeedback[e];
						// 		feed.userName = model.gradeDetails.registeredMembers[x].name.firstName + " " + model.gradeDetails.registeredMembers[f].name.lastName;
						// 		model.gradeFeedbacks.push(feed);
						// 	}
						// }
					}
					// Calculate the total income from the grade
					var totalOfMembers = model.gradeDetails.registeredMembers.length;
					var membersWithoutDiscount = totalOfMembers - model.discountedMembers.length;
					// var incomeFromNoDiscount = membersWithoutDiscount * model.gradeDetails.price; 
					var incomeFromNoDiscount = 0;
					var incomeFromDiscounted = 0;

					// for(var n in model.discountedMembers){
					// 	incomeFromDiscounted += model.gradeDetails.price* model.discountedMembers[n].percentage;
					// }
					for (var n in model.gradeDetails.registeredMembers) {
						for (var k in model.gradeDetails.registeredMembers[n].userCourseParameters) {
							if (model.gradeDetails.registeredMembers[n].userCourseParameters[k].gradeId === model.gradeDetails._id) {
								incomeFromDiscounted += model.gradeDetails.registeredMembers[n].userCourseParameters[k].discountedCoursePrice;
								incomeFromNoDiscount += model.gradeDetails.registeredMembers[n].userCourseParameters[k].normalCoursePrice;
							}
						}
					}
					model.totalIncomeFromCourse = incomeFromDiscounted + incomeFromNoDiscount;
				});
		}
		init();



		function selectDiscount(name) {
			model.discountTags = {};
			var today = new Date();
			var tagCode = today.getHours() + '' + today.getDate() + '' + today.getMonth() + '' + today.getFullYear() + '';
			if (model.selectedDiscount.name === 'family') {
				model.discountTags.familyTag = name.middleName + name.lastName + tagCode;
				model.discountTags.groupTag = '';
				model.thereIsFamilyDiscount = true;
				model.thereIsSpecialDiscount = false;
				model.thereIsGroupDiscount = false;
				return;
			} else if (model.selectedDiscount.name === 'group') {
				model.discountTags.groupTag = tagCode;
				model.discountTags.familyTag = '';
				model.thereIsGroupDiscount = true;
				model.thereIsSpecialDiscount = false;
				model.thereIsFamilyDiscount = false;
				return;
			} else if (model.selectedDiscount.name === 'special') {
				model.thereIsSpecialDiscount = true;
				model.thereIsFamilyDiscount = false;
				model.thereIsGroupDiscount = false;
				return;
			} else if (model.selectedDiscount.name === 'No discount') {
				model.thereIsSpecialDiscount = false;
				model.thereIsFamilyDiscount = false;
				model.thereIsGroupDiscount = false;
				return;
			} else if (model.selectedDiscount.name === 'Discount type...') {
				model.thereIsSpecialDiscount = false;
				model.thereIsFamilyDiscount = false;
				model.thereIsGroupDiscount = false;

			}

		}


		// function calculateSessions(){
		// 	var newGradeDays;
		// 	var today = new Date();
		// 	var daysPerWeek = model.gradeDetails.daysPerWeek;
		// 	var weeks, days;

		// 	// create grade days array starting from the payment date
		// 	gradeDaysLoop:
		// 	for(var d in model.gradeDetails.gradeDays){
		// 		if(today <= new Date(model.gradeDetails.gradeDays[d])){
		// 			newGradeDays = model.gradeDetails.gradeDays.slice(d);
		// 			break gradeDaysLoop;
		// 		}
		// 	}

		// 	// calculating weeks and days
		// 	if(newGradeDays.length%daysPerWeek.length === 0){
		// 		weeks = newGradeDays.length/daysPerWeek.length;
		// 		days = 0;
		// 		return {gradeDays: newGradeDays, weeksDays:{weeks: weeks, days: days}};
		// 	}else {
		// 		weeks = Math.floor(newGradeDays.length/daysPerWeek.length);
		// 		days = newGradeDays.length%daysPerWeek.length;
		// 		return {gradeDays: newGradeDays, weeksDays:{weeks: weeks, days: days}};
		// 	}
		// }



		// steps of payment:
		//		1. school show registered members.
		// 		2. if he want to give a discount select discount button.
		// 		3. make a payment by select Pay button.
		// 		4. seslect Date
		// 		5. select payment type.
		// 		6. selectPaymentType function:
		//			- check if this is the first payment (looping user.payments for this gradeId)
		// 				. if it is the first payment (newUser):
		// 					1. call calculateSessions() which return the grade days.
		// 					2. check if user had discount then get the discount type and tag.
		// 					3. create memberObject containing:
		// 						{userId, discountType, discoutTag, gradeDays, totalPrice, freezeDays}
		// 				. if not: 
		// 					1. the gradeDays are the same of the gradeDetails.gradeDays.
		// 					2. check if user had discount then get the discount type and tag.
		// 					3. search for user in members array
		// 			- create an gradeMembers array:
		// 			- 
		// 



		// Create {{{{{{{{{gradeMembers}}}}}}}}} object instead of discounted members 
		// store:
		// {userId, discountType, discoutTag, gradeDays, totalPrice, freezeDays}
		// ?????Freeze???????
		// when member ask for freezing days:
		// 1. check if he had already use the freeze before.
		// 2. if not select show a modal of the remaining dates to select the freezign days from
		// 3. add the froze dates array to the user gradeMembers[user].freezeDays.
		// 4. when grade days end push the parents from gradeMembers whome they had freeze to the new grade they will create.
		// 5. when user register for new grade check if he already had a froze days and deduct them from the grade price.


		function selectPaymentType(paymentType, user) {
			var gradeId = model.gradeDetails._id;

			getTotals(user, gradeId, function(totals) {
				model.totals = totals;
				switch (paymentType.name) {
					case 'Weekly payment':
						model.paymentAmount = Number(model.totals.discountedWeeklyPrice.toFixed(2));
						break;
					case 'Full payment':
						model.paymentAmount = Math.abs(model.totals.balance);
						// document.getElementById('paymentAmount').value = model.paymentAmount;
						break;
					case 'Down payment':
						model.paymentAmount = Number(model.totals.discountedDailyPrice.toFixed(2));
						// document.getElementById('paymentAmount').value = model.paymentAmount;
						break;
					case 'Payment type...':
						model.paymentAmount = 0;
						// document.getElementById('paymentAmount').value = '';
						break;
				}
			});
		}



		function giveADiscount(user, gradeId, discountName, discountTags, specialDiscountType) {
			// Check first if the user already had a discount before...
			// for(var d in model.discountedMembers){
			// 	if(model.discountedMembers[d].userId === userId){
			// 		model.giveADiscountError = 'This user already had a '+ model.discountedMembers[d].discountType + 'discount';
			// 	}
			// }
			// How to cancel the request????????????
			
			var discount = {};
			var userId = user._id;
			discount.userId = userId;
			discount.gradeId = gradeId;
			switch (discountName) {
				case 'special':
					discount.discountType = discountName;
					switch (specialDiscountType) {
						case 'special25':
							discount.discountTag = 'special25';
							discount.percentage = 0.75;
							break;
						case 'special50':
							discount.discountTag = 'special50';
							discount.percentage = 0.50;
							break;
						case 'special75':
							discount.discountTag = 'special75';
							discount.percentage = 0.25;
							break;
						case 'special100':
							discount.discountTag = 'special100';
							discount.percentage = 0;
							break;
					}
					break;

				case 'family':
					discount.discountType = discountName;
					discount.discountTag = discountTags.familyTag;
					discount.percentage = 0.9;
					break;
				case 'group':
					discount.discountType = discountName;
					discount.discountTag = discountTags.groupTag;
					discount.percentage = 0.9;
					break;
				case 'No discount':
					discount.discountType = discountName;
					discount.discountTag = discountName;
					discount.percentage = 1;
					break;
			}


			// call getTotals instead of hadDiscout()
			getTotals(user, gradeId, function(totals) {
				var ids = {
					userId: userId,
					gradeId: gradeId
				};
				discount.gradeDays = totals.newGradeDays;
				discount.discountedCoursePrice = ((model.gradeDetails.price / model.gradeDetails.gradeDays.length) * discount.percentage) * discount.gradeDays.length;
				discount.normalCoursePrice = (model.gradeDetails.price / model.gradeDetails.gradeDays.length) * totals.newGradeDays.length;
				// Check if the user had frozen days to compensates
				for(var f in model.gradeDetails.frozeMembers){
					if(model.gradeDetails.frozeMembers[f].userId === user._id && model.gradeDetails.frozeMembers[f].days.length >0 && model.gradeDetails.frozeMembers[f].compensated == false){
						// Calculate the discounted daily price then multiply by frozenDays then deduct the number from the final discountedCoursePrice
						discount.discountedCoursePrice -= ((model.gradeDetails.price / model.gradeDetails.gradeDays.length) * discount.percentage) * (model.gradeDetails.frozeMembers[f].days.length);
						discount.normalCoursePrice -= ((model.gradeDetails.price / model.gradeDetails.gradeDays.length) * discount.percentage) * (model.gradeDetails.frozeMembers[f].days.length);
					}
				}
				if (discount.discountType !== 'No discount') {
					gradeService
						.addToDiscountedMembers(ids)
						.then(function(result) {
							if (result.data._id) {
								console.log('User Added...');
								model.giveADiscountError = false;
							} else {
								model.giveADiscountError = result.data;
							}
						});
					discount.normalCoursePrice = 0;
					userService
						.updateUserCourseParameters(discount)
						.then(function(result) {
							if (result.data._id) {
								console.log('User updated...');
								$route.reload();
							} else {
								model.giveADiscountError = result.data;
							}
						});
				} else {
					discount.discountedCoursePrice = 0;
					userService
						.updateUserCourseParameters(discount)
						.then(function(result) {
							if (result.data._id) {
								console.log('User updated...');
								$route.reload();
							} else {
								model.giveADiscountError = result.data;
							}
						});
				}

				for(var v in model.gradeDetails.frozeMembers){
					if(model.gradeDetails.frozeMembers[v].userId === user._id){
						removeFrozen(user._id, model.gradeDetails._id, model.gradeDetails.originalCourseId);						
					}
				}
			});
			
		}

		function removeFrozen(userId, gradeId, originalCourseId){
			console.log(originalCourseId);
			ids = {userId: userId, gradeId: gradeId, originalCourseId: originalCourseId};
			gradeService
				.removeFrozen(ids)
				.then(function(result){
					console.log(result.data);
				});
		}

		function getUserPayments(user, gradeId) {
			for (var e in user.userCourseParameters) {
				if (user.userCourseParameters[e].gradeId === gradeId) {
					return user.userCourseParameters[e].payments;
				}
			}
		}

		function getGrandTotals() {
			console.log(model.gradeDetails);
			var grandTotal = 0;
			for (var i in model.gradeDetails.registeredMembers) {
				grandTotal += getTotals(model.gradeDetails.registeredMembers[i], model.gradeDetails._id).totalOfPayments;
			}
			return grandTotal;
		}

		function getTotals(user, gradeId, callBack) {
			var totals = {};
			var gradePrice = null;
			// var discountTag = null;
			totals.totalOfPayments = 0;
			// var discountType = null;
			var originalDailyPrice = model.gradeDetails.price / model.gradeDetails.gradeDays.length;
			totals.originalDailyPrice = originalDailyPrice;
			var today = new Date();
			var daysPerWeek = model.gradeDetails.daysPerWeek;

			// create grade days array starting from the payment date
			gradeDaysLoop:
				for (var d in model.gradeDetails.gradeDays) {
					// var dayInCourseDays = new Date(model.gradeDetails.gradeDays[d]);
					if (today <= new Date(model.gradeDetails.gradeDays[d])) {
						totals.newGradeDays = model.gradeDetails.gradeDays.slice(d);
						break gradeDaysLoop;
					}
				}

			frozeMembersLoop:
				for(var z in model.gradeDetails.frozeMembers){
					if(model.gradeDetails.frozeMembers[z].userId == user._id){
						totals.userFrozeDetails = model.gradeDetails.frozeMembers[z];
						break frozeMembersLoop;
					}
				}
			
			// calculating weeks
			totals.gradeWeeks = Math.ceil(totals.newGradeDays.length / daysPerWeek.length);



			// Calculate the grade price for user whom have a discount
			for (var e in user.userCourseParameters) {
				if (user.userCourseParameters[e].gradeId === gradeId) {
					totals.discountedDailyPrice = originalDailyPrice * user.userCourseParameters[e].percentage;
					// totals.fullCoursePrice = totals.discountedDailyPrice * totals.newGradeDays.length;
					if(user.userCourseParameters[e].normalCoursePrice >0){
						totals.fullCoursePrice = user.userCourseParameters[e].normalCoursePrice;
					}else{
						totals.fullCoursePrice = user.userCourseParameters[e].discountedCoursePrice;
					}
					// totals.gradeNormalPrice = originalDailyPrice * totals.newGradeDays.length;
					totals.discountedWeeklyPrice = totals.fullCoursePrice / totals.gradeWeeks;
					totals.discountType = user.userCourseParameters[e].discountType;
					totals.discountTag = user.userCourseParameters[e].discountTag;
					totals.userPayments = user.userCourseParameters[e].payments;
					for (var x in user.userCourseParameters[e].payments) {
						totals.totalOfPayments += JSON.parse(user.userCourseParameters[e].payments[x].amount);
					}
				}
			}

			totals.balance = totals.totalOfPayments - totals.fullCoursePrice;


			if (callBack) {
				callBack(totals);
			} else {
				model.userTotals = totals;
				return totals;
			}

			// for(var d in model.discountedMembers){
			// 	if(model.discountedMembers[d].userId === user._id){
			// 		gradePrice = model.gradeDetails.price * model.discountedMembers[d].percentage;
			// 		discountType = model.discountedMembers[d].discountType; 
			// 		discountTag = model.discountedMembers[d].discountTag;
			// 	}
			// }


			// search for the user if he is in the discounted members then calculate the price and the balance
			// Calculate user's total of payments

			// for(var x in user.payments){
			// 	if(user.payments[x].gradeId === gradeId){
			// 		totalOfPayments+= JSON.parse(user.payments[x].paymentAmount);
			// 	}
			// }
			// if(gradePrice !== model.gradeDetails.price){
			// 	return {gradePrice: gradePrice, discountType: discountType, discountTag: discountTag, total: totalOfPayments, balance: totalOfPayments-gradePrice};	
			// }else{
			// 	return {gradePrice: model.gradeDetails.price, discountType: 'No discount.', discountTag: 'No discount', total: totalOfPayments, balance: totalOfPayments-model.gradeDetails.price};
			// }


			// return totals;
		}



		// Check if user had a discount to disabled the discount button
		function hadDiscount(userId) {
			var hadIt = false;
			if (model.gradeDetails.discountedMembers.indexOf(userId) !== -1) {
				hadIt = true;
			}
			return hadIt;
		}


		function makePayment(userId, gradeId, paymentDate, paymentAmount) {
			var payment = {};
			payment.gradeId = gradeId;
			payment.userId = userId;
			payment.paymentDate = paymentDate;
			payment.paymentAmount = paymentAmount;
			userService
				.makePayment(payment)
				.then(function(result) {
					console.log('Payment done...');
					$route.reload();
				});
		}

		function getCourseFeedbacks() {
			return model.gradeFeedbacks;
		}


		function countAttendance() {
			model.attendedM = 0;
			model.attendanceArray = [];
			var userFrozeToday = false;

			for (var m in model.gradeDetails.registeredMembers) {
				// console.log(model.gradeDetails.registeredMembers[m]);
				parametersLoop:
				for (var p in model.gradeDetails.registeredMembers[m].userCourseParameters) {
					for (var h in model.gradeDetails.registeredMembers[m].userCourseParameters[p]) {
						if (model.gradeDetails.registeredMembers[m].userCourseParameters[p].gradeId === model.gradeDetails._id) {
							// Check if the user freeze for this day?
							checkFreeze:
							for(var j in model.gradeDetails.registeredMembers[m].userCourseParameters[p].freezeDays){
								if(model.gradeDetails.registeredMembers[m].userCourseParameters[p].freezeDays[j] === new Date().toDateString()){
									userFrozeToday = true;
									break parametersLoop;
								}
							}
							for (var a in model.gradeDetails.registeredMembers[m].userCourseParameters[p].attendedDays) {
								if (model.gradeDetails.registeredMembers[m].userCourseParameters[p].attendedDays.length === 0) {
									attended = false;
									break parametersLoop;
								} else if (model.gradeDetails.registeredMembers[m].userCourseParameters[p].attendedDays[a].date === new Date().toDateString()) {
									attended = model.gradeDetails.registeredMembers[m].userCourseParameters[p].attendedDays[a].attended;
									break parametersLoop;
								}
							}
						}
					}
					attended = false;
				}
				// console.log(!userFrozeToday);
				if(!userFrozeToday){
					model.attendanceArray.push({
						name: model.gradeDetails.registeredMembers[m].name,
						userId: model.gradeDetails.registeredMembers[m]._id,
						gradeId: model.gradeDetails._id,
						date: new Date().toDateString(),
						attended: attended
					});
				}
			}
			console.log(model.attendanceArray);
		}


		// function countAttendance(attendees){
		// 	model.attendedM = 0;
		// 	model.attendanceArray = [];

		// 	for(var m in model.gradeDetails.registeredMembers){
		// 		model.attendanceArray.push({
		// 			gradeId: model.gradeDetails._id,
		// 			userId: model.gradeDetails.registeredMembers[m]._id,
		// 			date: new Date().toDateString(),
		// 			attended: false
		// 		});
		// 	}


		// 	for(var n in model.attendanceArray){
		// 		for(var x in Object.keys(attendees)){
		// 			if(Object.keys(attendees)[x] === model.attendanceArray[n].userId){
		// 				model.attendanceArray[n].attended = attendees[Object.keys(attendees)[x]];
		// 				Object.keys(attendees).splice(x, 1);
		// 			}
		// 		}
		// 	}


		// 	for(var j in model.attendanceArray){
		// 		if(model.attendanceArray[j].attended === true){
		// 			model.attendedM+=1;
		// 		}
		// 	}
		// }



		// make it on the database
		function confirmAttendance(totalAttended) {
			console.log(totalAttended);
			userService
				.confirmAttendance(totalAttended)
				.then(function(result) {
					console.log(result);
				});
		}


		function getAttendance(attended) {
			var att = {};
			att.attended = attended.filter(function(a) {
				return a.attended === true;
			});
			att.missed = attended.filter(function(a) {
				return a.attended === false;
			});
			return att;
		}


		// get attendance report
		function attendanceReportCreater(user){
			var attReport = {
						attendedDays: [],
						attendedTotals: 0,
						missedTotals: 0
					};
			var para = user.userCourseParameters.filter(function(parameter){
				return parameter.gradeId === model.gradeDetails._id;
			});
			var attendedDays = para[0].attendedDays;
			
			for(var i in attendedDays){
				if(attendedDays[i].attended === true){
					attReport.attendedDays.push({date: attendedDays[i].date, attMiss: 'attended'});
					attReport.attendedTotals +=1;
				}else if(attendedDays[i].attended === false){
					attReport.attendedDays.push({date: attendedDays[i].date, attMiss: 'missed'});
					// attReport.missed.missedDates.push(attendedDays[i].date);
					attReport.missedTotals +=1;
				}
			}
			model.attendanceReport = attReport;
			return attReport;
		}



		function isParentFreezeToday(user){
			var frozeToday = true;
			for(var i in user.userCourseParameters){
				if(user.userCourseParameters[i].gradeId === model.gradeDetails._id){
					for(var j in user.userCourseParameters[i].freezeDays){
						if(user.userCourseParameters[i].freezeDays[j] === new Date().toDateString()){
							return frozeToday;
						}
					}
				}
			}
			frozeToday = false;
			return frozeToday;
		}


		// function isParentFreezeToday(user){
		// 	for(var i in user.userCourseParameters){
		// 		if(user.userCourseParameters[i].gradeId === model.gradeDetails._id){
		// 			for(var j in user.userCourseParameters[i].freezeDays){
		// 				if(user.userCourseParameters[i].freezeDays[j] === new Date().toDateString()){
		// 					return true;
		// 				}else{
		// 					return false;
		// 				}
		// 			}
		// 		}
		// 	}
		// }


		function prepareFreezeDays(user) {
			model.userUseFreezeBefore = false;
			// check if user already freeze before
			for (var p in user.userCourseParameters) {
				if (user.userCourseParameters[p].gradeId === model.gradeDetails._id) {
					if (user.userCourseParameters[p].freezeDays.length > 0) {
						model.userUseFreezeBefore = true;
						model.alreadyFrozeDays = user.userCourseParameters[p].freezeDays;
					}
				}
			}
			model.frozeDays = {};
			var t = user.userCourseParameters.filter(function(parameter) {
				return parameter.gradeId === model.gradeDetails._id;
			});
			model.daysToFreezeFrom = t[0].gradeDays.filter(function(day) {
				return new Date(day) >= new Date();
			});
		}


		function freezeMember(userId, fullUserName, gradeId, days) {
			// collect froze days
			var final = [];
			userFullName = fullUserName.firstName+' '+fullUserName.middleName+' '+fullUserName.lastName;
			// filter the selected days from the days
			for (var i in days) {
				if (days[i] === true) {
					final.push(i);
				}
			}
			var freezeObject = {
				userId: userId,
				userFullName: userFullName,
				gradeId: gradeId,
				days: final
			};
			// make it on DB
			userService
				.freezeMembership(freezeObject)
				.then(function(result) {
					console.log(result.data);
				});
			gradeService
				.addToFrozeMembers(freezeObject)
				.then(function(result){
					console.log(result.data);
				});
		}

		function getFrozeMembers() {
			// var froze = [];
			// for(var u in model.gradeDetails.registeredMembers){
			// 	for(var p in model.gradeDetails.registeredMembers[u].userCourseParameters){
			// 		if(model.gradeDetails.registeredMembers[u].userCourseParameters[p].gradeId === model.gradeDetails._id && model.gradeDetails.registeredMembers[u].userCourseParameters[p].freezeDays.length > 0){
			// 			froze.push({
			// 				userName: model.gradeDetails.registeredMembers[u].name,
			// 				frozeDays: model.gradeDetails.registeredMembers[u].userCourseParameters[p].freezeDays
			// 			});
			// 		}
			// 	}
			// }
			// console.log(model.frozeMembers)
			return model.frozeMembers;
		}


		// groupBy function to create summary
		// the parameters:
		// 		arrayOfObjects: array of objects to grouped by
		// 		filterProperty: property or key to filter of
		// 		sumsProperty: the property or key to accumulate for the summary
		function groupBy(arrayOfObjects, filterProperty, sumsProperty) {
			return arrayOfObjects.reduce(function(resultArray, oneObject) {
				var key = oneObject[filterProperty];
				if (!resultArray[key]) {
					resultArray[key] = 0;
				}
				resultArray[key] += oneObject[sumsProperty];
				return resultArray;
			}, {});
		}



		function prepareExpenses() {
			model.gradeExpenses = model.gradeDetails.expenses;
			var grouped = groupBy(model.gradeExpenses, 'expenseType', 'expenseAmount');
			// console.log(grouped);
			model.expensesSummary = grouped;
			var totalExpenses = 0;
			for(var i in grouped){
				totalExpenses += grouped[i];
			}
			model.totalOfExpenses = totalExpenses;

			// console.log(model.gradeExpenses);
			// var totals = {
			// 				expenses: 0,
			// 				salaryEx: 0,
			// 				hospitalityEx: 0,
			// 				rentalFees: 0,
			// 				miscEx: 0,
			// };
			// for(var i in model.gradeExpenses){
			// 	totals.expenses += model.gradeExpenses[i].expenseAmount;
			// 	switch(model.gradeExpenses[i].expenseType){
			// 		case 'Salary':
			// 			totals.salaryEx += model.gradeExpenses[i].expenseAmount;
			// 			break;
			// 		case 'Hospitality':
			// 			totals.hospitalityEx += model.gradeExpenses[i].expenseAmount;
			// 			break;
			// 		case 'Rental fees':
			// 			totals.rentalFees += model.gradeExpenses[i].expenseAmount;
			// 			break;
			// 		case 'Misc':
			// 			totals.miscEx += model.gradeExpenses[i].expenseAmount;
			// 			break;
			// 	}
			// }
			// model.expensesSummary = totals;
			// console.log(totals);
		}


		function addExpense(expenses, expenseType) {
			var expense = {};

			expense.expenseDate = expenses.date;
			expense.expenseType = expenseType.name;
			expense.expenseDetails = expenses.details;
			expense.expenseAmount = JSON.parse(expenses.amount);
			expense.gradeId = model.gradeDetails._id;

			gradeService
				.addExpense(expense)
				.then(function(result) {
					console.log(result.data);
					document.getElementById('expensesForm').reset();
					$route.reload();
				});
		}


		function showPaidMembers(v){
			if(v){
				// console.log(model.gradeDetails.registeredMembers)
				model.gradeDetails.registeredMembers = model.paidMembers;
			}else{
				model.gradeDetails.registeredMembers = model.unPaidMembers;
			}
		}


		function logout() {
			userService
				.logout()
				.then(function() {
					$location.url('/');
				});
		}


	}

})();