var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('underscore');

var port = process.env.PORT || 3000;

var all_videos = [];

var cassette = require('./cassette.js');

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
  // console.log('a user connected');

  auto();


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



  function auto(){
    // listen(listen_cb);
    var new_videos = 0;
    cassette.listen().then(function(response){
      console.log('auto:', response);

      if(response[0] == ''){
        auto();
      } else {
        return cassette.think(response);
      }
    })
    .then(function(response){
      console.log('auto done thunk:', response);

      if(response.worked){
        response.playlist.forEach(function(r){
          var present = _.findWhere(all_videos, {title: r.title});

          if(!present){
            console.log('pushing:', r.title);
            new_videos++;
            all_videos.push(r);
          }
        });
      }

      console.log('how many videos do we got?', all_videos.length);

      if(all_videos.length > 0 && new_videos > 0){
        io.emit('videos', all_videos);
      }

      auto();
    })
    .catch(function(err){
      console.log('auto err:', err);
    });
  }

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


http.listen(port, function(){
  console.log('listening on *:' + port);
});
