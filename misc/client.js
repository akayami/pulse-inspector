Math.getRandomRangeInt = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

var dgram = require('dgram');
var client = dgram.createSocket('udp4');
var config = require('/home/tomasz/dev/git/plain-config')(__dirname + '/../');


setInterval(function() {

	var message = new Buffer(['me', 'test1', Math.getRandomRangeInt(0, 1000)].join(' '));

	client.send(message, 0, message.length, config.udp.port, 'localhost', function(err, bytes) {
		if (err) throw err;
	});
}, 100);
