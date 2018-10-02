var mongoose = require('mongoose');

var schoolsSchema = mongoose.Schema({
			name: String,
			details: String,
			books: [{title: String, pages: {}}],
			created: {type: Date, default: Date.now()}
			
}, {collection: 'schools'});

module.exports = schoolsSchema;