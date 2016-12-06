var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var PORT = 7010;

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
})

io.on('connection', function (socket) {
    socket.send("connect");
    socket.on('disconnect', function () {
    });
});

http.listen(PORT, function(){
    console.log('listen' , PORT);
})