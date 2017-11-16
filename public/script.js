$(function () {
  // var socket = io.connect('localhost:3000');
  var socket = io();
  console.log('connect');
  var playlist = [];
  var title = '';
  var url = '';
  $('.play-button').click(function(){
    $('.container').addClass('hide');
    socket.emit('video', {
      video: url
    });
  });

  $('.listen-button').click(function(){
    socket.emit('listen');
    return false;
  });

  // $('.listen-button-mini').click(function(){
  //   showButton('listen-button');
  //   socket.emit('listen');
  //   return false;
  // });

  $('.video-button').click(function(e){
    var classList = e.currentTarget.className.split(/\s+/);
    var index = parseInt(classList[2].replace('video', ''));
    title = playlist[index].title;
    url = playlist[index].url;
    $('.title').html(title);
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
      // $('.listen-button-mini').addClass('show');
      // $('.listen-button-mini').removeClass('hide');
    }
  });

  socket.on('video:done', function(){
    // console.log('video done')
    $('.container').removeClass('hide');
  });

  function showLoader(){
    $('.loader2').addClass('show');
    $('.loader2').removeClass('hide');
  }

  function hideLoader(){
    $('.loader2').removeClass('show');
    $('.loader2').addClass('hide');

    // $('.listen-button').addClass('hide');
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
