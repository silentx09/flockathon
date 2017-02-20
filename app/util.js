var mongoOperations = require('./db/mongo_operations');

function setProjectVariables(){
	mongoOperations.getUserData({}, function(docs){
		docs.forEach(function(doc){
			userTokens[doc.uid] = doc.token;
			var topicArns = doc.topicArn;
			var subscribedUsers;
			topicArns.forEach(function(topic){
				subscribedUsers = [];
				subscribedUsers = userTopics[topic];
				if(subscribedUsers){
					subscribedUsers.push(doc.uid);
				}
				else{
					subscribedUsers = [];
					subscribedUsers.push(doc.uid);
				}
				userTopics[topic] = subscribedUsers;
			});
		});
	});
}

function generateWidget(input, widgetUrl, callback){
	//src : https://bafc9b3e.ngrok.io/attachment
	var attachment = [{
        "views": {
            "widget": { "src": widgetUrl, "width": 400, "height": 700}
        }
    }];
	return callback(
		{
			msg : input,
			attachment : attachment
		}
	);
}

function generateSimpleText(input, command, callback){
	var textUI = "";
	var lineCount = 0;
	input.forEach(function(item){
		var itemStr = "";
		for(var key in item){
			itemStr += key + " : ";
			itemStr += item[key] + "<br>";
			lineCount++;
		}
		textUI += itemStr + "<br>"
	})
	console.log(textUI);
	var attachment = [{
        "views": {
            "html": { "inline": "<div style='background-color:#ECECEC; padding:10px;'>Command : /aws "+command+"</div><hr><div style='background-color:#ECECEC; padding : 10px'>" + textUI + "</div>", "width": 600, "height": 250 }
        }
    }];
	return callback(
		{
			msg : "",
			attachment : attachment
		}
	);
}

function generateText(input, callback){
	var textUI = "";
	input.forEach(function(item){
		var itemStr = "";
		var keys = Object.keys(item);
		var values = [];
		for(var key in item){
			values.push(item[key].toString());
		}
		var keyMaxlength = keys.sort(function (a, b) { return b.length - a.length; })[0].length;
		var valueMaxLength = values.sort(function (a, b) { return b.length - a.length; })[0].length;
		itemStr += "-".repeat(keyMaxlength + valueMaxLength + 23) + "\n";
		for(var key in item){
			itemStr += "|" + " ".repeat(1);
			itemStr += key;
			itemStr += " ".repeat(keyMaxlength - key.length + 1);
			itemStr += "|" + " ".repeat(1);
			itemStr += item[key];
			console.log(item[key]);
			console.log(item[key].toString());
			console.log(item[key].toString().length);
			itemStr += " ".repeat(valueMaxLength - item[key].toString().length + 1);
			itemStr += "|" + " ".repeat(1);
			itemStr += "\n";
			itemStr += "-".repeat(keyMaxlength + valueMaxLength + 23) + "\n";
		}
		itemStr += "\n";
		textUI += itemStr;
	})
	console.log(textUI);
	var attachment = [{
        "views": {
            "flockml": "<flockml>" + textUI + "</flockml>"
        }
    }];
	return callback(
		{
			msg : "",
			attachment : []
		}
	);
}

function jsonFormatter(fullcommand, input, callback){
	console.log("comand");
	console.log(fullcommand)
	var command = fullcommand.split(" ");
	switch(command[0]){
		case "help" :
			generateWidget(input, "https://bafc9b3e.ngrok.io/help", function(res){
				return callback(res);
			});
		break;
		case "list-instances":
			formatListInstances(input, function(instances){
				generateSimpleText(instances, fullcommand, function(resp){
					return callback(resp);
				});
			});
		break;
		case "show-instance":
			formatShowInstance(input, function(instance){
				generateSimpleText(instance, fullcommand, function(resp){
					return callback(resp);
				});
			});
		break;
		case "start-instance":
			formatStartInstance(input, function(instance){
				generateSimpleText(instance, fullcommand, function(resp){
					return callback(resp);
				});
			});
		break;
		case "stop-instance":
			formatStopInstance(input, function(instance){
				generateSimpleText(instance, fullcommand, function(resp){
					return callback(resp);
				});
			});
		break;
		case "list-buckets":
			formatListBuckets(input, function(instance){
				generateSimpleText(instance, fullcommand, function(resp){
					return callback(resp);
				});
			});
		break;
		case "list-files":
			formatListFiles(input, function(instance){
				generateSimpleText(instance, fullcommand, function(resp){
					return callback(resp);
				});
			});
		break;
		case "d-list-tables":
			formatListDynamoTables(input, function(instance){
				generateSimpleText(instance, fullcommand, function(resp){
					return callback(resp);
				});
			});
		break;
		case "list-apis":
			formatListAPIs(input, function(instance){
				generateSimpleText(instance, fullcommand, function(resp){
					return callback(resp);
				});
			});
		break;
		case "list-resources":
			formatListResources(input, function(instance){
				generateSimpleText(instance, fullcommand, function(resp){
					return callback(resp);
				});
			});
		break;
		case "list-stages":
			formatListStages(input, function(instance){
				generateSimpleText(instance, fullcommand, function(resp){
					return callback(resp);
				});
			});
		break;
		case "sns-list-topics":
			formatListSNSTopics(input, function(instance){
				generateSimpleText(instance, fullcommand, function(resp){
					return callback(resp);
				});
			});
		break;
		case "d-table-status" :
			return callback({
				msg : "Status : " + input,
				attachment : []
			});
		break;
		case "d-table-size" :
			return callback({
				msg : input + " Bytes",
				attachment : []
			});
		break;
		case "d-table-count" :
			return callback({
				msg : input + " Items",
				attachment : []
			});
		break;
		case "d-table-date" :
			return callback({
				msg : input.toString(),
				attachment : []
			});
		break;
		case "d-table-throughput" :
			return callback({
				msg : input,
				attachment : []
			});
		break;
	}
}

function formatListStages(input, callback){
	var results = [];
	var listStages = input.item;
	for(i=0; i < listStages.length;i++) {
		var formatted_stages = {};
		formatted_stages['Deployment ID'] = listStages[i].deploymentId;
		formatted_stages['Stage Name'] = listStages[i].stageName;
		results.push(formatted_stages);
	}
	return callback(results);
}

function formatListSNSTopics(input, callback){
	console.log(input)
	var results = [];
	var topics = input.Topics;
	for(var i=0; i < topics.length; i++) {
		var obj = {};
		obj[i+1] = topics[i].TopicArn;
		
	}
	results.push(obj);
	return callback(results);
}

function formatListResources(input, callback){
	var results = [];
	var listResources = input.items;
	for(var i=0; i < listResources.length;i++) {		
		var formatted_api = {};
		formatted_api['Resource ID'] = listResources[i].id;
		formatted_api['Resource Path'] = listResources[i].path;
		results.push(formatted_api);		
	}
	return callback(results);
}

function formatListAPIs(input,callback){
	var results = [];
	var listApi = input.items;
	for(var i=0; i < listApi.length;i++) {
		var formatted_api = {};
		formatted_api['API ID'] = listApi[i].id;
		formatted_api['Name'] = listApi[i].name;
		formatted_api['Description'] = listApi[i].description;
		results.push(formatted_api);
	}
	return callback(results);
}

function formatListDynamoTables(input,callback){
	var results = [];
	var table = {};
	var dbTables = input.TableNames;
	for (i = 0; i < dbTables.length; i++){
		table[i + 1] = dbTables[i];
	}
	results.push(table);
	return callback(results);
}

function formatListFiles(input,callback) {
	var results = [];
	var uploadedFiles = input.Contents;
	for(var i=0; i < uploadedFiles.length; i++){
		var file = uploadedFiles[i];
		var formatted_bucket = {};
		formatted_bucket['Size'] = file.Size + " Bytes";
		formatted_bucket['Key'] = file.Key;
		formatted_bucket['Last Updated'] = file.LastModified;
		results.push(formatted_bucket);
	}
	return callback(results);
}

function formatListBuckets(input,callback){
	var results = [];
	var buckets = input.Buckets;
	for(var i=0; i < buckets.length; i++) {
		var obj = {};
		obj["Name"] = buckets[i].Name;
		obj["Created At"] = buckets[i].CreationDate
		results.push(obj);
	}
	console.log(results);
	return callback(results);
}

function formatListInstances(input, callback){
	var response = [];
	for (var i = 0; i < input.Reservations.length; i++) {
		var res = input.Reservations[i];
		var instances = res.Instances;
		for (let j = 0; j < instances.length; j++) {
			var instance = {};
			instance['Instance ID'] = instances[j].InstanceId;
			instance['State'] = instances[j].State.Name;
			instance['Public IP'] = instances[j].PublicIpAddress;
			instance['Image ID'] = instances[j].ImageId;
			response.push(instance);
		}
		return callback(response);
	}
}

function formatShowInstance(input, callback){
	var response = [];
	for (var i = 0; i < input.Reservations.length; i++) {
		var res = input.Reservations[i];
		var instances = res.Instances;
		for (let j = 0; j < instances.length; j++) {
			var instance = {};
			instance['Instance ID'] = instances[j].InstanceId;
			instance['State'] = instances[j].State.Name;
			instance['Public IP'] = instances[j].PublicIpAddress;
			instance['Image ID'] = instances[j].ImageId;
			response.push(instance);
		}
		return callback(response);
	}
}

function formatStartInstance(input, callback){
	var _root = input.StartingInstances[0];
	return callback([
		{
			"Message" : "Booting up!",
			"Instance ID" : _root.InstanceId,
			"Current State" : _root.CurrentState.Name,
			"Previous State" : _root.PreviousState.Name
		}
	])
}

function formatStopInstance(input, callback){
	var _root = input.StoppingInstances[0];
	return callback([
		{
			"Message" : "Shutting down!",
			"Instance ID" : _root.InstanceId,
			"Current State" : _root.CurrentState.Name,
			"Previous State" : _root.PreviousState.Name
		}
	])
}

String.prototype.repeat = function( num )
{
    return new Array( num + 1 ).join( this );
}

module.exports = {
	setProjectVariables :setProjectVariables,
	jsonFormatter : jsonFormatter
}

