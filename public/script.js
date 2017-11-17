$(function () {
  // var socket = io.connect('localhost:3000');
  var socket = io();
  console.log('connect');
  var playlist = [];
  var title = '';
  var url = '';
  var player;
  var controls;
  $('.play-button').click(function(){
    $('.container').addClass('hide');
    showPlayer();
    controls = $('.controls-container');
    controls.removeClass('hide');
    controls.addClass('show');
    player.get(0).play();
  });

  $('.control-play-button').click(function(){
    player.get(0).play();
  });
  $('.control-pause-button').click(function(){
    player.get(0).pause();
  });
  $('.control-exit-button').click(function(){
    player.get(0).pause();
    $('.container').removeClass('hide');
    $('.container').addClass('show');
    hidePlayer();
  });

  $('.listen-button').click(function(){
    socket.emit('listen');
    return false;
  });

  $('.video-button').click(function(e){
    var classList = e.currentTarget.className.split(/\s+/);
    var index = parseInt(classList[2].replace('video', ''));
    title = playlist[index].title;
    url = playlist[index].url;
    $('.title').html(title);

    // actual video
    $('.video-container').html('<video id="player"></video>');
    player = $('#player');
    player.addClass('hide');
    player.attr('src', url);

  });

  socket.on('response', function(data){
    console.log('response:', data);
    if(data.listening == true){
      showLoader();
      $('.button-text').html('LISTENING')
    }
    if(data.thinking == true){
      setTimeout(function(){
        $('.button-text').html('THINKING')
      }, 1000);
    }
    if(data.playlist){
      playlist = data.playlist;
      hideLoader();
      $('.button-text').html('LISTEN');

      playlist.forEach(function(video, index){
        $('.video' + index).html(index);
        $('.video' + index).removeClass('hide');
        $('.video' + index).removeClass('show');
      });
    }
  });

  socket.on('video:done', function(){
    // console.log('video done')
    $('.container').removeClass('hide');
  });

  function showPlayer(){
    player.removeClass('hide');
    player.addClass('show');
    $('.controls-container').addClass('hide');
    $('.controls-container').removeClass('show');
  }

  function hidePlayer(){
    player.addClass('hide');
    player.removeClass('show');
    $('.controls-container').addClass('show');
    $('.controls-container').removeClass('hide');
  }

  function showLoader(){
    $('.button-text').addClass('blink');
  }

  function hideLoader(){
    $('.button-text').removeClass('blink');
  }

  function showButton(class_name){
    $('.' + class_name).removeClass('hide');
    $('.' + class_name).addClass('show');
  }

  function hideButton(class_name){
    $('.' + class_name).removeClass('show');
    $('.' + class_name).addClass('hide');
  }


});
