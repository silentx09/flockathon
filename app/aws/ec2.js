var ec2Obj = {};

function createEC2InstanceObject(uid){
	ec2Obj[uid] = new AWSUsers[uid].EC2();
}

function listInstances(uid, callback){
	if(ec2Obj[uid]){
		ec2Obj[uid].describeInstances(function(err, result) {
			if (err)
			{
				console.log(err);
			}
			else{
				return callback(result)
			}		
		});
	}
	else{
		console.log("ec2Object is not set for this user.");
	}
	
}

/**
* data = InstanceIds : [instance ids]. returns list of all Ids if empty array passed. we'll use it to only describe one instance at a time.
**/
function describeInstance(uid, data, callback){
	console.log(data)
	if(ec2Obj[uid]){
		ec2Obj[uid].describeInstances(data, function(err, result) {
			if (err){
				console.log(err);
			} 
  			else{
  				return callback(result)
  			}
		});
	}
	else{
	console.log("ec2Object is not set for this user.");
	}
}

/**
* data = InstanceIds : [instance ids]. returns list of all Ids if empty array passed. we'll use it to only describe one instance at a time.
**/
function startInstance(uid, data, callback){
	if(ec2Obj[uid]){
		ec2Obj[uid].startInstances(data, function(err, result) {
			if (err){
				console.log(err);
			} 
  			else{
  				return callback(result)
  			}
		});
	}
	else{
	console.log("ec2Object is not set for this user.");
	}
}

/**
* data = InstanceIds : [instance ids]. returns list of all Ids if empty array passed. we'll use it to only describe one instance at a time.
**/
function stopInstance(uid, data, callback){
	if(ec2Obj[uid]){
		ec2Obj[uid].stopInstances(data, function(err, result) {
			if (err){
				console.log(err);
			} 
  			else{
  				console.log("stopInstance Success")
  				return callback(result)
  			}
		});
	}
	else{
	console.log("ec2Object is not set for this user.");
	}
}

/**
* data = InstanceIds : [instance ids]. returns list of all Ids if empty array passed. we'll use it to only describe one instance at a time.
**/
function deleteInstance(uid, data, callback){
	if(ec2Obj[uid]){
		ec2Obj[uid].terminateInstances(data, function(err, result) {
			if (err){
				console.log(err);
			} 
  			else{
  				return callback(result)
  			}
		});
	}
	else {
		console.log("ec2Object is not set for this user.");
	}
}

/**
* data = InstanceIds : [instance ids]. returns list of all Ids if empty array passed. we'll use it to only describe one instance at a time.
**/
function rebootInstance(uid, data, callback){
	if(ec2Obj[uid]){
		ec2Obj[uid].rebootInstances(data, function(err, result) {
			if (err){
				console.log(err);
			} 
  			else{
  				return callback(result)
  			}
		});
	}
	else {
		console.log("ec2Object is not set for this user.");
	}
}

module.exports = {
	createEC2InstanceObject : createEC2InstanceObject,
	listInstances : listInstances,
	describeInstance : describeInstance,
	startInstance : startInstance,
	stopInstance : stopInstance,
	deleteInstance : deleteInstance,
	rebootInstance : rebootInstance
}