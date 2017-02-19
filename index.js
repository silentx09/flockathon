var express = require('express');
var fs = require('fs');
var util = require('util');
var Mustache = require('mustache');
var nunjucks  = require('nunjucks');
var bodyParser = require('body-parser');

global.AWS = require('aws-sdk');
global.AWSUsers = {};
global.userTokens = {};
global.userTopics = {};
global.flock = require('flockos');
global.assert = require('assert');
global.app = express();

global.flockConfig = require('./config/flock_config');
var mongoConfig = require('./config/mongo_config');
var mongoOperations = require('./app/db/mongo_operations');
var util = require('./app/util');

app.use(flock.events.tokenVerifier);
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'html');
app.listen(8080, function () {
    console.log('Listening on 8080');
});

mongoConfig.connect(function(db){
	mongoOperations.setDBInstance(db);
	util.setProjectVariables();
});

flock.appId = flockConfig.appId;
flock.appSecret = flockConfig.appSecret;

var flockEvents = require('./app/flock/events');
var flockMethods = require('./app/flock/methods');

nunjucks.configure(`${__dirname}/views`, {
  autoescape: true,
  express   : app
});

app.post("/event", function(req, res) {	
	flockEvents.processEvent(req.body, res)
});

app.get("/config", function(req, res){
	res.render("config.html");
	//res.send("OK");
});

app.get("/forward", function(req, res){
  res.render("forward.html");
});

app.get("/attachment", function(req, res){
  res.render("attachment.html");
});

app.post("/users", function(req,res){
  flockMethods.listUsers(userTokens[req.body.uid], function(data){
    res.send(data);
  });
});

app.post("/groups", function(req, res){
  flockMethods.listGroups(userTokens[req.body.uid], function(data){
    res.send(data);
  });
});

app.post("/fetchMessageAndSend", function(req, res){
  console.log(req.body);
  var msgs = [];
  msgs.push(req.body.msg);
  flockMethods.fetchSpecificMessages(userTokens[req.body.uid], req.body.chat, msgs, function(data){
    console.log("Data fetched");
    console.log(data);
    var msgToSend = {
      to : req.body.sendToUser,
      text : data[0].text + " " + req.body.comment,
      attachments : data[0].attachments
    }
    flockMethods.simpleSendMessage(userTokens[req.body.uid], msgToSend, function(response){
      res.send("OK");
    });
  });
});

app.post("/receive", function(req, res){
	console.log(req);
	if(req['headers']['x-amz-sns-message-type']){
		if(req['headers']['x-amz-sns-message-type'] === "SubscriptionConfirmation"){
			var bodyarr = []
    		req.on('data', function(chunk){
      			bodyarr.push(chunk);
    		})  
    		req.on('end', function(){
      			var confirmationObj = JSON.parse(bodyarr.join(''));
      			confirmationObj['name'] = "confirmSNSSubscription";
      			flockEvents.processEvent(confirmationObj, res)
    		})  	
		}
		else if(req['headers']['x-amz-sns-message-type'] === "Notification"){
			var bodyarr = []
			req.on('data', function(chunk){
      			bodyarr.push(chunk);
    		})  
    		req.on('end', function(){
      			var notificationObj = JSON.parse(bodyarr.join(''));
      			console.log(notificationObj)
      			notificationObj['name'] = "alertNotification";
      			flockEvents.processEvent(notificationObj, res)
      			res.send("OK");
    		}) 
		}
	}
});

app.get("/test", function(req, res){
	res.render("test.html", {data : JSON.stringify(userTokens)})
});

app.get("/help", function(req, res){
  res.render("help.html");
});

/**
 * Dummy settings
**/
function dummy(){
	userTokens["u:yojzjjbd1btlzvml"] = "12dcb5a8-a30b-4d91-95f2-dd4fd425762b";
	userTopics["arn:aws:sns:us-east-1:418181703419:status_alert"] = ["u:yojzjjbd1btlzvml", "u:vfeexxqpnnnktfnv"];
}

//dummy()