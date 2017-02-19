var snsObj = {};

function createSNSInstanceObject(uid){
	snsObj[uid] = new AWSUsers[uid].SNS();
}

function listTopics(uid, callback) {
	if(snsObj[uid]){
		snsObj[uid].listTopics({},function(err, response) {
			if (err){
				console.log(err);
			} else {
				 console.log("listTopics success");
				 return callback(response);
			}               
		});
	}
	else{
		console.log("snsObj is not set for this user.");
	}	
}

/**
* data = protocol : https, topicArn : topicArn
**/
function subscribeToTopic(uid, data, callback){
	if(snsObj[uid]){
		snsObj[uid].subscribe(data,function(err, response) {
			if (err){
				console.log(err);
			} else {
				 console.log("subscribetoTopic success");
				 return callback(response);
			}               
		});
	}
	else{
		console.log("snsObj is not set for this user.");
	}	
}

/**
* data = Token=token, TopicArn=TopicArn
**/
function confirmSubscription(uid, data, callback){
	if(snsObj[uid]){
		snsObj[uid].confirmSubscription(data,function(err, response) {
			if (err){
				console.log(err);
			} else {
				 console.log("subscribetoTopic success");
				 return callback(response);
			}               
		});
	}
	else{
		console.log("snsObj is not set for this user.");
	}
}

module.exports = {
	createSNSInstanceObject : createSNSInstanceObject,
	listTopics : listTopics,
	subscribeToTopic : subscribeToTopic,
	confirmSubscription : confirmSubscription
}