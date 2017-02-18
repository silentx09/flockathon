var dynamoObj = {};

function createDynamoInstanceObject(uid){
	dynamoObj[uid] = new AWSUsers[uid].DynamoDB({apiVersion: '2012-08-10'});
}

function listTables(uid, callback) {
	if(dynamoObj[uid]){
		dynamoObj[uid].listTables(function(err, response) {
			if (err){
				console.log(err);
			} else {
				 console.log("listTables success");
				 return callback(response);
			}               
		});
	}
	else{
		console.log("dynamoObject is not set for this user.");
	}	
}

/**
	data = tableName, parameter
**/
function describeTable(uid, data, callback){
	if(dynamoObj[uid]){
		dynamoObj[uid].describeTable({'TableName' : data.tableName},function(err, response) {
			if (err){
				console.log(err);
			} else {
				 console.log("describeTable success");
				 switch(data.parameter){
				 	case "TableStatus" :
				 		return callback(response.Table.TableStatus);
				 		break;
				 	case "TableSizeBytes" :
				 		return callback(response.Table.TableSizeBytes);
				 		break;
				 	case "ItemCount" :
				 		return callback(response.Table.ItemCount);
				 		break;
				 	case "CreationDateTime" :
				 		return callback(response.Table.CreationDateTime);
				 		break;
				 }
				 
			}               
		});
	}
	else{
		console.log("dynamoObject is not set for this user.");
	}	
}

module.exports = {
	createDynamoInstanceObject : createDynamoInstanceObject,
	listTables : listTables,
	describeTable : describeTable
}
