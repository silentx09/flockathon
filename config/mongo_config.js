var MongoClient = require('mongodb').MongoClient
  , dbInstance
  , assert = require('assert');

var url = 'mongodb://localhost:27017/byteme';

function connectToDB(callback){
	MongoClient.connect(url, function(err, db) {
  		assert.equal(null, err);
  		console.log("mongoDB connected");
  		dbInstance = db;
  		return callback(dbInstance);
 	});
}

function closeDB(){
	dbInstance.close();
}

function getDBInstance(){
	return dbInstance;
}

module.exports = {
	connect : connectToDB,
	disconnect : closeDB,
	instance : getDBInstance
}