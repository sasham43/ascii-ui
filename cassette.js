var cp = require('child_process');
var _ = require('underscore');
var q = require('q');
// var inquirer = require('inquirer');

var args = process.argv;

var all_videos = [];

var cmd = 'ruby';
var r_args = [
  'tape-read.rb'
];

module.exports = {
  listen: listen,
  play: play,
  think: think,
  auto: auto,
  all_videos: all_videos
};

function listen_cb(err, response){
  think(response, function(err, response){
    console.log('auto done thunk:', response);

    if(response.worked){
      response.playlist.forEach(function(r){
        var present = _.findWhere(all_videos, {title: r.title});

        if(!present){
          all_videos.push(r);
        }
      });
    }

    console.log('how many videos do we got?', all_videos.length);
  });

  console.log('recursing');

  listen(listen_cb);
}

function auto(){

  // listen(listen_cb);

  listen().then(function(response){
    console.log('auto:', response);

    return think(response);
  })
  .then(function(response){
    console.log('auto done thunk:', response);

    if(response.worked){
      response.playlist.forEach(function(r){
        var present = _.findWhere(all_videos, {title: r.title});

        if(!present){
          all_videos.push(r);
        }
      });
    }

    console.log('how many videos do we got?', all_videos.length);

    auto();
  })
  .catch(function(err){
    console.log('auto err:', err);
  });
}




function play(url){
  var deferred = q.defer();

  cp.exec('omxplayer \'' + url + '\'', function(err){
    if(err){
      console.log('err:', err);
      deferred.reject(err);
    }

    deferred.resolve();
  });

  return deferred.promise;
}

function think(videos, done){
  var d = q.defer();

  console.log('thinking...');
  var url_promises = [];
  videos.forEach(function(video){
    var quote_re = /\"/g;
    video = video.replace(quote_re, '');
    video = video.toString().replace(/\r?\n|\r/g, ''); // remove line endings
    // console.log('video', video.length);

    if((video.includes("https://www.youtube.com") && (video.length == 43))){
      var request = 'youtube-dl -e -f \'worst[ext=mp4]\' -g ' + video;
      var promise = q.ninvoke(cp, 'exec', request);
      url_promises.push(promise);
    }
  });

  q.allSettled(url_promises).then(function(responses){

    if(responses.length > 0){
      // console.log('responses:', responses);
      var playlist = [];
      var choices = [];

      var item = {};

      responses.forEach(function(r,i){
        if(r.state == 'fulfilled'){
          var item = {
            title: '',
            url: ''
          };
          // var values = r.value.split('\n');
          r.value.forEach(function(v){
            if(v != ''){
              var values = v.split('\n');
              values.forEach(function(value){
                if(value.includes('http')){
                  item.url = value.toString().replace(/\r?\n|\r/g, '');
                } else if(value.length > 4){
                  item.title = value.toString().replace(/\r?\n|\r/g, '');
                  choices.push(value.toString().replace(/\r?\n|\r/g, ''));
                }
              });
            }
          });
          playlist.push(item);
        } else {
          // console.log('not fulfilled:', r);
        }
      });
    } else {
      // listen();
      if(done){
        done(null, {
          worked: false
        });
      } else {
        d.resolve({
          worked: false
        });
      }
    }

    if(done){
      done(null, {
        worked: true,
        playlist: playlist
      });
    } else {
      d.resolve({
        worked: true,
        playlist: playlist
      });
    }
  })
  .catch(function(err){
    console.log('did an oopsie:', err);
    if(done){
      done(err);
    } else {
      d.reject(err);
    }
  });

  return d.promise;
}

function listen(done){
  var d = q.defer();
  var tape = cp.spawn(cmd, r_args);
  var playlist = '';
  console.log('listening')
  tape.stdout.on('data', function(data) {
    playlist += data.toString();
  });
  tape.stderr.on('error', function(error) {
    console.log('error:', error);
  });
  tape.stdout.on('end', function(){
      // console.log('playlist',playlist);

      videos = playlist.split('\n');

      if(done){
        done(null, videos);
      } else {
        d.resolve(videos);
      }
      // console.log('loading urls...');
  });

  return d.promise;
}
