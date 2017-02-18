var byteMeDB, usersCollection;

function setDBInstance(db){
	byteMeDB = db;
	usersCollection = byteMeDB.collection('users');
}
/**
 * data = uid, token
**/
function setFlockCredentials(data, callback){
	console.log("settng flock")
	usersCollection.insert(data, function(err, result){
		assert.equal(err, null);
		console.log("setFlockCredentials success");
		callback(result);
	});
}

/**
 * data = uid, account-name, accessKey, secretKey
**/
function setAWSCredentials(data, callback){
	usersCollection.updateOne({uid : data.uid}
	,{$set : data}, function(err, result){
		assert.equal(err, null);
		console.log("setAWSCredentials success");
		callback(result);
	})
}

/**
 * data = uid, token
**/
function getUserData(data, callback){
	usersCollection.find(data, function(err, doc){
		assert.equal(err, null);
		console.log("getUserData success");
		callback(doc);
	})
}

/**
 * data = uid, token
**/
function deleteUserData(data, callback){
	usersCollection.deleteOne(data, function(err, result){
		assert.equal(err, null);
		console.log("deleteUserData success");
		callback(result);
	})
}

module.exports = {
	setDBInstance : setDBInstance
	, setFlockCredentials : setFlockCredentials
	, setAWSCredentials : setAWSCredentials
	, getUserData : getUserData
	, deleteUserData : deleteUserData
}