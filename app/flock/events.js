var mongoEventsOperations = require('../db/mongo_operations')

function processEvent(event, res){
	console.log(event.name)
	switch(event.name){
		case "app.install" :
			installEvent(event, res);
			break;
	}
}

function installEvent(event, res){
	mongoOperations.setFlockCredentials({
    	uid : event.userId,
    	token : event.token
    }, function(){
    	res.send("OK")
    });
}

module.exports = {
	processEvent : processEvent
}