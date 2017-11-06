var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var listen = require('./listen.js');

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
  // console.log('a user connected');
  socket.on('listen', function(msg){
    // io.emit('chat message', msg);
    console.log('listen', listen)
    if(process.env.ENV != 'dev'){
      listen().then(function(playlist){
        io.emit('response', {data: playlist})
      });
    } else {
      io.emit('response', {data: 'something'})
    }

  });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
