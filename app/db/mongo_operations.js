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
				return callback(result);
			});
		}
		else{
			usersCollection.insert(data, function(err, result){
				assert.equal(err, null);
				console.log("insertUserData success");
				userTokens[data.uid] = data.token;
				return callback(result);
			});
		}
	})	
}

/**
 * data = uid, account-name, accessKey, secretKey, region, new-token, empty topicArn
**/
function updateUserData(data, callback){
	usersCollection.updateOne({uid : data.uid}
	,{$set : data}, function(err, result){
		assert.equal(err, null);
		console.log("updateUserData success");
		AWSUsers[data.uid] = AWS;
		AWSUsers[data.uid].config.update({accessKeyId: data.accessKey, secretAccessKey: data.secretKey, region: data.region});
		return callback(result);
	})
}

function updateArnArr(data, callback){
	usersCollection.updateOne({uid : data.uid}
	,{$addToSet: {topicArn: data.topicArn }}, function(err, result){
		assert.equal(err, null);
		console.log("updateArnArr success");
		return callback(result);
	})
}

/**
 * data = uid, token
**/
function getUserData(data, callback){
	usersCollection.find(data).toArray(function(err,docs){
        assert.equal(err, null);
        return callback(docs);
    });
}

/**
 * data = uid, token
**/
function deleteUserData(data, callback){
	usersCollection.deleteOne(data, function(err, result){
		assert.equal(err, null);
		console.log("deleteUserData success");
		return callback(result);
	});
}


module.exports = {
	setDBInstance : setDBInstance
	, insertUserData : insertUserData
	, updateUserData : updateUserData
	, updateArnArr : updateArnArr
	, getUserData : getUserData
	, deleteUserData : deleteUserData
}