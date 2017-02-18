var mongoEventsOperations = require('../db/mongo_operations');
var ec2 = require('../aws/ec2');
var s3 = require('../aws/s3');
var dynamo = require('../aws/dynamo');
var apiGateway = require('../aws/api_gateway');

function processEvent(event, res){
	console.log(event.name)
	switch(event.name){
		case "app.install" :
			installEvent(event, res);
			break;
		case "client.slashCommand" :
			res.send({"text": "Received your slash command"})
			slashEvent(event, res)
			break;
	}
}

function installEvent(event, res){
	mongoEventsOperations.insertUserData({
    	uid : event.userId,
    	token : event.token
    }, function(){
    	res.send("OK")
    });
}


function slashEvent(event, res){
	var command = event.text.trim().split(" ");
	switch(command[0]){
		case "configure" :
			mongoEventsOperations.updateUserData({
				uid : event.userId,
				accessKey : command[1].split("=")[1],
				secretKey : command[2].split("=")[1],
				region : command[3].split("=")[1]
			}, function(){
				ec2.createEC2InstanceObject(event.userId);
				s3.createS3InstanceObject(event.userId);
				dynamo.createDynamoInstanceObject(event.userId);
				apiGateway.createApiGatewayInstanceObject(event.userId);
			});
		break;
		case "list-instances" :
			ec2.listInstances(event.userId, function(instances){
				sendMessage(userTokens[event.userId], event.chat, instances)
			});
		break;
		case "show-instance" :
			var instanceIdArr = [];
			instanceIdArr.push(command.slice(1,command.length).join(" "));
			ec2.describeInstance(event.userId, {"InstanceIds" : instanceIdArr}, function(_instance){
				sendMessage(userTokens[event.userId], event.chat, _instance)
			});
		break;
		case "start-instance" :
			var instanceIdArr = [];
			instanceIdArr.push(command.slice(1,command.length).join(" "));
			ec2.startInstance(event.userId, {"InstanceIds" : instanceIdArr}, function(response){
				sendMessage(userTokens[event.userId], event.chat, response)
			});
		break;
		case "stop-instance" :
			var instanceIdArr = [];
			instanceIdArr.push(command.slice(1,command.length).join(" "));
			ec2.stopInstance(event.userId, {"InstanceIds" : instanceIdArr}, function(response){
				sendMessage(userTokens[event.userId], event.chat, response)
			});
		break;
		case "delete-instance" : //Not tested!!!!!!!
			var instanceIdArr = [];
			instanceIdArr.push(command.slice(1,command.length).join(" "));
			ec2.deleteInstance(event.userId, {"InstanceIds" : instanceIdArr}, function(response){
				sendMessage(userTokens[event.userId], event.chat, response)
			});
		break;
		case "reboot-instance" :
			var instanceIdArr = [];
			instanceIdArr.push(command.slice(1,command.length).join(" "));
			ec2.rebootInstance(event.userId, {"InstanceIds" : instanceIdArr}, function(response){
				sendMessage(userTokens[event.userId], event.chat, response)
			});
		break;
		case "list-buckets" :
			s3.listBuckets(event.userId, function(buckets){
				sendMessage(userTokens[event.userId], event.chat, buckets)
			});
		break;
		case "list-files" :
			var bucketName = command.slice(1,command.length).join(" ");
			s3.listFilesInBucket(event.userId, {'Bucket' : bucketName}, function(files){
				sendMessage(userTokens[event.userId], event.chat, files)
			});
		break;
		case "d-list-tables" :
			dynamo.listTables(event.userId, function(tables){
				sendMessage(userTokens[event.userId], event.chat, tables)
			});
		break;
		case "d-table-status" :
			var tableName = command.slice(1,command.length).join(" ");
			dynamo.describeTable(event.userId, {'tableName' : tableName, 'parameter' : 'TableStatus'}, function(status){
				sendMessage(userTokens[event.userId], event.chat, status)
			});
		break;
		case "d-table-size" :
			var tableName = command.slice(1,command.length).join(" ");
			dynamo.describeTable(event.userId, {'tableName' : tableName, 'parameter' : 'TableSizeBytes'}, function(size){
				sendMessage(userTokens[event.userId], event.chat, size)
			});
		break;
		case "d-table-count" :
			var tableName = command.slice(1,command.length).join(" ");
			dynamo.describeTable(event.userId, {'tableName' : tableName, 'parameter' : 'ItemCount'}, function(count){
				sendMessage(userTokens[event.userId], event.chat, count)
			});
		break;
		case "d-table-date" :
			var tableName = command.slice(1,command.length).join(" ");
			dynamo.describeTable(event.userId, {'tableName' : tableName, 'parameter' : 'CreationDateTime'}, function(date){
				sendMessage(userTokens[event.userId], event.chat, date)
			});
		break;
		case "d-table-throughput" :
			var tableName = command.slice(1,command.length).join(" ");
			dynamo.describeTable(event.userId, {'tableName' : tableName, 'parameter' : 'ProvisionedThroughput'}, function(throughput){
				sendMessage(userTokens[event.userId], event.chat, throughput)
			});
		break;
		case "list-apis" :
			apiGateway.listRestApis(event.userId, function(APIs){
				sendMessage(userTokens[event.userId], event.chat, APIs)
			});
		break;
		case "list-resources" :
			var apiName = command.slice(1,command.length).join(" ");
			apiGateway.listResources(event.userId, apiName, function(resources){
				sendMessage(userTokens[event.userId], event.chat, resources)
			});
		break;
		case "list-stages" :
			var apiName = command.slice(1,command.length).join(" ");
			apiGateway.listStages(event.userId, apiName, function(stages){
				sendMessage(userTokens[event.userId], event.chat, stages)
			});
		break;
	}
}

function sendMessage(token, to, msg, _attachments){
	let attachments = _attachments || []
	flock.chat.sendMessage(token, {
    	to: to,
    	text: msg,
    	attachments : attachments
	}, 
	function (error, response) {
    	if (error)
        	console.log('error: ', error);
    	else
        	console.log("sendMessage success");
	})
}

module.exports = {
	processEvent : processEvent
}