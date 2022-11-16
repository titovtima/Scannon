var express = require('express')
var app = express()
var server = require('http').Server(app)

app.use(express.json({limit: '80mb'}));
app.use(express.urlencoded({limit: '80mb'}));

app.use("/js", express.static('./js/'))
app.use("/resources", express.static('./resources/'))
app.use("/fonts", express.static('./fonts/'))
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
})

var port = process.env.PORT || 8081
server.listen(port, function() {
	console.log(`Listening on ${server.address().port}`);
});