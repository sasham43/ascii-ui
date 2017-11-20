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

  cassette.auto();


  socket.on('listen', function(msg){
    listen()
  });

  socket.on('video', function(data){
    console.log('data', data.video);
    cassette.play(data.video).then(function(response){
      console.log('response', response);
      io.emit('video:done');
    });
  });

  function listen(){
    cassette.listen().then(function(videos){
        io.emit('response', {
          thinking: true
        });

        cassette.think(videos).then(function(data){
          if(data.worked){
            console.log('data.playlist', data.playlist)
            io.emit('response', {
              playlist: data.playlist
            });
          } else {
            listen();
          }
        });
    });

    io.emit('response', {
      listening: true
    });
  }
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
