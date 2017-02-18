var byteMeDB, usersCollection;

function setDBInstance(db){
	byteMeDB = db;
	usersCollection = byteMeDB.collection('users');
}
/**
 * data = uid, token
**/
function insertUserData(data, callback){
	getUserData({
		uid : data.uid
	}, function(doc){
		if(doc.length > 0){
			console.log("UID already exists. Updating data");
			updateUserData(data, function(result){
				userTokens[data.uid] = data.token;
				callback(result);
			});
		}
		else{
			usersCollection.insert(data, function(err, result){
				assert.equal(err, null);
				console.log("insertUserData success");
				userTokens[data.uid] = data.token;
				callback(result);
			});
		}
	})	
}

/**
 * data = uid, account-name, accessKey, secretKey, region, new-token
**/
function updateUserData(data, callback){
	usersCollection.updateOne({uid : data.uid}
	,{$set : data}, function(err, result){
		assert.equal(err, null);
		console.log("updateUserData success");
		AWSUsers[data.uid] = AWS;
		AWSUsers[data.uid].config.update({accessKeyId: data.accessKey, secretAccessKey: data.secretKey, region: data.region});
		callback(result);
	})
}

/**
 * data = uid, token
**/
function getUserData(data, callback){
	usersCollection.find(data).toArray(function(err,docs){
        assert.equal(err, null);
        callback(docs);
    });
}

/**
 * data = uid, token
**/
function deleteUserData(data, callback){
	usersCollection.deleteOne(data, function(err, result){
		assert.equal(err, null);
		console.log("deleteUserData success");
		callback(result);
	});
}


module.exports = {
	setDBInstance : setDBInstance
	, insertUserData : insertUserData
	, updateUserData : updateUserData
	, getUserData : getUserData
	, deleteUserData : deleteUserData
}