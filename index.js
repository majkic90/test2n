var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var PORT = 8080;

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
})

io.on('connect' , function(socket){
    console.log('test!');
})

http.listen(PORT, function(){
    console.log('listen' , PORT);
})