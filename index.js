var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var url = require('url');
var config = require('/home/tomasz/dev/git/plain-config')();


app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
	res.send('Pulsar');
});

app.get('/:namespace/:endpoint/:display', function(req, res, next) {
	res.render(req.params.display);
});

var dgram = require('dgram');
var udp = dgram.createSocket('udp4');

udp.on('listening', function() {
	console.log('UDP Server listening on ' + config.udp.port);
});

udp.on('message', function(msg, remote) {
	var msg = msg.toString().split(' ');
	if(msg.length != 3) {
		console.error('Invalid msg');
		console.error(msg);
	} else {

		var room = msg[0] + msg[1];
		io.to(room).emit('data', msg[2]);
	}
});

server.listen(8081, function() {
	var address = server.address();
	console.log('Webserver is UP' + address.address + ":" + address.port);
	udp.bind(config.udp.port);
});


io.on('connection', function(socket) {
	var user, namespace;
	var items = String(url.parse(socket.request.headers.referer).pathname).split('/');
	user = items[1];
	namespace = items[2];
	var room = user + namespace;
	socket.join(room);
	socket.emit('service', 'test');
})
