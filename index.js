var express = require('express')
var app = express()
var server = require('http').Server(app)

app.use("/js", express.static('./js/'))
app.use("/fonts", express.static('./fonts/'))
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
})

var port = process.env.PORT || 8081
server.listen(8081, function() {
	console.log(`Listening on ${server.address().port}`);
});