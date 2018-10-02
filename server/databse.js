var mongoose = require('mongoose');

var connectionString = 'mongodb://localhost:27017/pagingsystem'; // for local

// check if running remotely
// if(process.env.GOOGLE_CALLBACK_URL) { 
//         var username = process.env.MLAB_USERNAME;
//         var password = process.env.MLAB_PASSWORD;
//         connectionString = 'mongodb://' + username + ':' + password;
//         connectionString += '@ds143262.mlab.com:43262/ucmas';
// }


// Another abroach
if(process.env.MONGODB_URI) { 
        connectionString = process.env.MONGODB_URI;
}

// establish the connection and test it
mongoose.connect(connectionString, { useNewUrlParser: true }, function(err, db){
	if(err){
		console.log(err);
	}else{
		var collection = db.collection('test');
		collection.find().toArray(function(err, items){
			console.log(items[0].test);
		});
	}
});
