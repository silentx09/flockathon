function listGroups(_token, callback){
	flock.callMethod('groups.list', _token, {},function (error, response) {
    	if (!error) {
            return callback(response);
        	console.log(response);
    	}
    	else{
    		console.log(error)
    	}
	});
}

function listUsers(_token, callback){
	flock.callMethod('roster.listContacts', _token, {},function (error, response) {
    	if (!error) {
            return callback(response);
        	console.log(response);
    	}
    	else{
    		console.log(error)
    	}
	});
}

function fetchSpecificMessages(myToken, chat, msgs, callback){
    console.log("token" + myToken)
    console.log("chat" + chat)
    console.log("msgs" + msgs)
    flock.callMethod('chat.fetchMessages', myToken, {
        uids: msgs,
        chat: chat
    }, function (error, response) {
        if (!error) {
            console.log(response);
            return callback(response);
        }
        else{
            console.log(error)
        }
    });
}

function simpleSendMessage(token, msg, callback){
    flock.chat.sendMessage(token, msg, function (error, response) {
        if (error)
            console.log('error: ', error);
        else
            console.log(response)
            console.log("sendMessage success");
            return callback(response);
    });
}

module.exports = {
    listGroups : listGroups,
    listUsers : listUsers,
    fetchSpecificMessages : fetchSpecificMessages,
    simpleSendMessage : simpleSendMessage
};