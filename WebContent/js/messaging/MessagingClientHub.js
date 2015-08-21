var targetUrl = document.referrer;
function initSubscriberListener() {
	var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
	var eventer = window[eventMethod];
	var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
	eventer(messageEvent, function (e) {		
       var message = e.data;
       callback(message.value);
       console.log('subscriber received message ' + message.topic + ', ' + message.value);		
	}, false); 
}
function subscribe(topic) {
	if (_SUBSCRIBER_ID_ === undefined) {
		console.log('Error : Subscriber could not be registered, please define _SUBSCRIBER_ID_ for subscriber');
		return;
	}
	console.log("subscribing to a hub on: " + targetUrl);
	window.parent.postMessage({op : 'subscribe', topic : topic, value: _SUBSCRIBER_ID_}, targetUrl);
}
function publish(topic, value){
	console.log("publishing to a target Client at: " + targetUrl);
	window.parent.postMessage({op: 'publish', topic: topic, value: value}, targetUrl);
}
function callback(message){
	document.getElementById("output").innerHTML += 
		"Message recieved: " + message + " on: "+ (new Date()).toString() + "<br/>";
}