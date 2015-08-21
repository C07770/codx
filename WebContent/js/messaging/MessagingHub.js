var messageArray = new Array();

function initMessagingHubListener(){
	var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
	var eventer = window[eventMethod];
	var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
	
	eventer(messageEvent, function (e) {
		var message = e.data;
		
	   	console.log('Hub router is intiated with message [OP:' + message.op + '] [topic: ' + message.topic + '] [value: ' + message.value + ']');
		
	   	switch(message.op) {
			case 'publish': 
				onPublish(message.topic, message.value);
				break;
			case 'subscribe':
				var clientId = document.getElementById(message.value);
				var url = clientId.src;				
				onSubscribe(message.topic, message.value, url);
				break;
		}		   			
	}, false);
}

function onSubscribe(topic, id, url) {
	var subscribers = messageArray[topic];
	if (subscribers == undefined) {
		subscribers = new Array();
		messageArray[topic] = subscribers;
	}
	
	subscribers[id] = url;
	console.log('added subscriber with clientId = ' + id + ' and url ' + subscribers[id]);
}

function onPublish(topic, value) {
	var subscribers = messageArray[topic];

	if (subscribers == undefined) {
		console.log('No subscriber with topic = ' + topic + ' is registered, returning');
		return;
	}
		
	for (id in subscribers) {
		var url = subscribers[id];
		console.log('Found a subscriber with clientid: ' + id + 'and  url: ' + url);
		
		if (url != undefined) {
			var clientId = document.getElementById(id);
			clientId.contentWindow.postMessage({topic: topic, value: value}, url);
		}
	}
}	






 