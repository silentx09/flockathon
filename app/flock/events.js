var mongoEventsOperations = require('../db/mongo_operations');
var util = require('../util');
var ec2 = require('../aws/ec2');
var s3 = require('../aws/s3');
var dynamo = require('../aws/dynamo');
var apiGateway = require('../aws/api_gateway');
var sns = require('../aws/sns');

function processEvent(event, res){
	console.log(event.name)
	switch(event.name){
		case "app.install" :
			installEvent(event, res);
			break;
		case "client.slashCommand" :
			res.send({"text": "Gotcha! I am on it."})
			slashEvent(event, res)
			break;
		case "confirmSNSSubscription" :
			var token = event.Token;
			var topicArn = event.TopicArn;
			var _userId = userTopics[topicArn];
			var _chatId = '';
			sns.confirmSubscription(_userId, {'Token' : token, 'TopicArn' : topicArn}, function(topics){
				console.log("Subscription confirmed");
				res.send("OK");
				//sendMessage(userTokens[event.userId], _chatId, topics)
			});
		break;
		case "alertNotification" :
			console.log("Alerting");
			var _token = flockConfig.botToken;
			var _toArr = userTopics[event.TopicArn];
			var subject = event.Subject;
			var message = event.Message;
			_toArr.forEach(function(to){
				sendMessage(_token, to, message);
			});
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
	var fullCommand = event.text.trim();
	switch(command[0]){
		case "configure" :
			mongoEventsOperations.updateUserData({
				uid : event.userId,
				accessKey : command[1].split("=")[1],
				secretKey : command[2].split("=")[1],
				region : command[3].split("=")[1],
				topicArn : [] //remove this later.
			}, function(){
				ec2.createEC2InstanceObject(event.userId);
				s3.createS3InstanceObject(event.userId);
				dynamo.createDynamoInstanceObject(event.userId);
				apiGateway.createApiGatewayInstanceObject(event.userId);
				sns.createSNSInstanceObject(event.userId);
			});
		break;
		case "help" :
			sendMessage(fullCommand, userTokens[event.userId], event.chat, "");
		break;
		case "list-instances" :
			ec2.listInstances(event.userId, function(instances){
				console.log(command);
				sendMessage(fullCommand, userTokens[event.userId], event.chat, instances)
			});
		break;
		case "show-instance" :
			var instanceIdArr = [];
			instanceIdArr.push(command.slice(1,command.length).join(" "));
			ec2.describeInstance(event.userId, {"InstanceIds" : instanceIdArr}, function(_instance){
				sendMessage(fullCommand, userTokens[event.userId], event.chat, _instance)
			});
		break;
		case "start-instance" :
			var instanceIdArr = [];
			instanceIdArr.push(command.slice(1,command.length).join(" "));
			ec2.startInstance(event.userId, {"InstanceIds" : instanceIdArr}, function(response){
				sendMessage(fullCommand, userTokens[event.userId], event.chat, response)
			});
		break;
		case "stop-instance" :
			var instanceIdArr = [];
			instanceIdArr.push(command.slice(1,command.length).join(" "));
			ec2.stopInstance(event.userId, {"InstanceIds" : instanceIdArr}, function(response){
				sendMessage(fullCommand, userTokens[event.userId], event.chat, response)
			});
		break;
		case "delete-instance" : //Not tested!!!!!!!
			var instanceIdArr = [];
			instanceIdArr.push(command.slice(1,command.length).join(" "));
			ec2.deleteInstance(event.userId, {"InstanceIds" : instanceIdArr}, function(response){
				sendMessage(fullCommand, userTokens[event.userId], event.chat, response)
			});
		break;
		case "reboot-instance" :
			var instanceIdArr = [];
			instanceIdArr.push(command.slice(1,command.length).join(" "));
			ec2.rebootInstance(event.userId, {"InstanceIds" : instanceIdArr}, function(response){
				sendMessage(fullCommand, userTokens[event.userId], event.chat, response)
			});
		break;
		case "list-buckets" :
			s3.listBuckets(event.userId, function(buckets){
				sendMessage(fullCommand, userTokens[event.userId], event.chat, buckets)
			});
		break;
		case "list-files" :
			var bucketName = command.slice(1,command.length).join(" ");
			s3.listFilesInBucket(event.userId, {'Bucket' : bucketName}, function(files){
				sendMessage(fullCommand, userTokens[event.userId], event.chat, files)
			});
		break;
		case "d-list-tables" :
			dynamo.listTables(event.userId, function(tables){
				sendMessage(fullCommand, userTokens[event.userId], event.chat, tables)
			});
		break;
		case "d-table-status" :
			var tableName = command.slice(1,command.length).join(" ");
			dynamo.describeTable(event.userId, {'tableName' : tableName, 'parameter' : 'TableStatus'}, function(status){
				sendMessage(fullCommand, userTokens[event.userId], event.chat, status)
			});
		break;
		case "d-table-size" :
			var tableName = command.slice(1,command.length).join(" ");
			dynamo.describeTable(event.userId, {'tableName' : tableName, 'parameter' : 'TableSizeBytes'}, function(size){
				sendMessage(fullCommand, userTokens[event.userId], event.chat, size)
			});
		break;
		case "d-table-count" :
			var tableName = command.slice(1,command.length).join(" ");
			dynamo.describeTable(event.userId, {'tableName' : tableName, 'parameter' : 'ItemCount'}, function(count){
				sendMessage(fullCommand, userTokens[event.userId], event.chat, count)
			});
		break;
		case "d-table-date" :
			var tableName = command.slice(1,command.length).join(" ");
			dynamo.describeTable(event.userId, {'tableName' : tableName, 'parameter' : 'CreationDateTime'}, function(date){
				sendMessage(fullCommand, userTokens[event.userId], event.chat, date)
			});
		break;
		case "d-table-throughput" :
			var tableName = command.slice(1,command.length).join(" ");
			dynamo.describeTable(event.userId, {'tableName' : tableName, 'parameter' : 'ProvisionedThroughput'}, function(throughput){
				sendMessage(fullCommand, userTokens[event.userId], event.chat, throughput)
			});
		break;
		case "list-apis" :
			apiGateway.listRestApis(event.userId, function(APIs){
				sendMessage(fullCommand, userTokens[event.userId], event.chat, APIs)
			});
		break;
		case "list-resources" :
			var apiName = command.slice(1,command.length).join(" ");
			apiGateway.listResources(event.userId, apiName, function(resources){
				sendMessage(fullCommand, userTokens[event.userId], event.chat, resources)
			});
		break;
		case "list-stages" :
			var apiName = command.slice(1,command.length).join(" ");
			apiGateway.listStages(event.userId, apiName, function(stages){
				sendMessage(fullCommand, userTokens[event.userId], event.chat, stages)
			});
		break;
		case "sns-list-topics" :
			sns.listTopics(event.userId, function(topics){
				sendMessage(fullCommand, userTokens[event.userId], event.chat, topics)
			});
		break;
		case "sns-subscribe" :
			var topicArn = command.slice(1,command.length).join(" ");
			sns.subscribeToTopic(event.userId, {'Protocol' : 'https', 'TopicArn' : topicArn, 'Endpoint' : 'https://bafc9b3e.ngrok.io/receive'}, function(response){				
				mongoEventsOperations.updateArnArr({
					uid : event.userId,
					topicArn : topicArn
				}, function(){});

				if(userTopics[topicArn]){
					var subscribedUsers = userTopics[topicArn];
					subscribedUsers.push(event.userId);
					userTopics[topicArn] = event.userId;
				}
				else{
					var subscribedUsers = [];
					subscribedUsers.push(event.userId);
					userTopics[topicArn] = event.userId;
				}
				sendMessage(fullCommand, userTokens[event.userId], event.chat, response)
			});
		break;	
	}
}

function sendMessage(fullCommand, token, to, msg, _attachments){
	
	var attachments = _attachments || [];
	util.jsonFormatter(fullCommand, msg, function(msgObj){
		msg = msgObj.msg;
		var attachmentObj = msgObj.attachment || attachments;
		flock.chat.sendMessage(token, {
			to: to,
	    	text: msg,
	    	attachments : attachmentObj
		}, 
		function (error, response) {
	    	if (error)
	        	console.log('error: ', error);
	    	else
	    		console.log(response)
	        	console.log("sendMessage success");
		});
	});
}

module.exports = {
	processEvent : processEvent
}