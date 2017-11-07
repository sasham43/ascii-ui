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

  $('.video-button').click(function(e, f){


    // $('.container').addClass('.hide');

    var classList = e.currentTarget.className.split(/\s+/);
    var index = parseInt(classList[2].replace('video', ''));
    title = playlist[index].title;
    url = playlist[index].url;
    $('.title').html(title);
    // socket.emit('video', {
    //   video: playlist[index].url
    // });
  });

  socket.on('response', function(data){
    if(data.listening == true){
      showLoader();
      $('.button-text').html('listening')
    }
    if(data.playlist){
      playlist = data.playlist;
      hideLoader();
      $('.button-text').html('listen');

      playlist.forEach(function(video, index){
        $('.video' + index).html(index);
        $('.video' + index).removeClass('hide');
        $('.video' + index).removeClass('show');
      })
    }
  });

  socket.on('video:done', function(){
    $('.container').removeClass('.hide');
  });

  function showLoader(){
    $('.loader2').addClass('show');
    $('.loader2').removeClass('hide');
  }

  function hideLoader(){
    $('.loader2').removeClass('show');
    $('.loader2').addClass('hide');
  }


});
