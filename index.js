var config = require('./config.js');
var flock = require('flockos');
var express = require('express');
var store = require('./store.js');
var fs = require('fs');
var util = require('util');
var Mustache = require('mustache');

flock.appId = config.appId;
flock.appSecret = config.appSecret;

var app = express();
app.use(flock.events.tokenVerifier);
app.post('/events', flock.events.listener);

app.listen(8080, function () {
    console.log('Listening on 8080');
});

flock.events.on('app.install', function (event, callback) {
    store.saveToken(event.userId, event.token);
    callback();
});

//var messageTemplate = require('fs').readFileSync('message.mustache.flockml', 'utf8');
flock.events.on('client.pressButton', function (event, callback) {
	//var flockml = Mustache.render(messageTemplate, { event: event, widgetURL: 'https://drawingboard-qqtudaqxcu.now.sh/' });
//     flock.callMethod('chat.sendMessage', store.getToken(event.userId), {
// 	  to: event.chat,
// 	  text: "Here is your server",
// 	  attachments: [{
//     "description": "drawing board",
//     "views": {
//         "widget": { "src": "https://drawingboard-qqtudaqxcu.now.sh/", "width": 400, "height": 400 }
//     },
//     "buttons": [{
//         "name": "Send",
//         "action": { "type": "openWidget", "desktopType": "modal", "mobileType": "modal", "url": "" },
//         "id": "Send"
//     }, {
//         "name": "Cancel",
//         "action": { "type": "openWidget", "desktopType": "sidebar", "mobileType": "modal", "url": "" },
//         "id": "Cancel"
//     }]
// }]
// 	}, 
// 	function (error, response) {
// 		console.log("Send message done: " + JSON.stringify(response));
// 		console.log("error: " + error + JSON.stringify(error));
// 	if (!error) {
// 		console.log(response);
// 	}
// 	callback();
// 	});
});
