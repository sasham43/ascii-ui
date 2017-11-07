var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var cassette = require('./cassette.js');

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
  // console.log('a user connected');
  socket.on('listen', function(msg){
    if(process.env.NODE_ENV != 'dev'){
      cassette.listen().then(function(playlist){
        io.emit('response', {
          playlist: playlist
        });
      });

      io.emit('response', {
        listening: true
      });
    } else {
      io.emit('response', {
        data: 'something',
        listening: true
      });
    }

  });

  socket.on('video', function(data){
    console.log('data', data.video);
    cassette.play(data.video).then(function(response){
      console.log('response', response);
    });
  });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
