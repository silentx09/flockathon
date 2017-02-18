var apiGatewayObj = {};

function createApiGatewayInstanceObject(uid){
	apiGatewayObj[uid] = new AWSUsers[uid].APIGateway();
}

function listRestApis(uid, callback) {
	if(apiGatewayObj[uid]){
		apiGatewayObj[uid].getRestApis(function(err, response) {
			if (err){
				console.log(err);
			} else {
				 console.log("listRestApis success");
				 return callback(response);
			}               
		});
	}
	else{
		console.log("apiGatewayObj is not set for this user.");
	}
	
}

/**
* data = name of the api => restApiId : 'STRING_VALUE'
**/
function listResources(uid, data, callback) {
	if(apiGatewayObj[uid]){
		listApiDetails(uid, data, function(detail){
			if(detail){
				apiGatewayObj[uid].getResources({restApiId : detail.id},function(err, response) {
					if (err){
						console.log(err);
					} else {
				 		console.log("listResources success");
				 		return callback(response);
					}               
				});
			}
			else{
				console.log("apiKeyID not found for the provided API")
			}
		});
	}
	else{
		console.log("apiGatewayObj is not set for this user.");
	}
}

/**
* data = name of the api => restApiId : 'STRING_VALUE'
**/
function listStages(uid, data, callback) {
	if(apiGatewayObj[uid]){
		listApiDetails(uid, data, function(detail){
			if(detail){
				apiGatewayObj[uid].getStages({restApiId : detail.id},function(err, response) {
					if (err){
						console.log(err);
					} else {
				 		console.log("listResources success");
				 		return callback(response);
					}               
				});
			}
			else{
				console.log("apiKeyID not found for the provided API")
			}
		});
	}
	else{
		console.log("apiGatewayObj is not set for this user.");
	}
}

/**
	data = name of the API
**/
function listApiDetails(uid, data, callback){
	listRestApis(uid, function(res){
		if(res.items){
			res.items.forEach(function(item){
				if(item.name === data){
					return callback(item);
				}
			});
		}
	});
}

module.exports = {
	createApiGatewayInstanceObject : createApiGatewayInstanceObject,
	listRestApis : listRestApis,
	listResources : listResources,
	listStages : listStages
}