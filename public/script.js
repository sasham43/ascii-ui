$(function () {
  // var socket = io.connect('localhost:3000');
  var socket = io();
  console.log('connect');
  var playlist = [];
  $('.listen-button').click(function(){
    socket.emit('listen');
    return false;
  });

  $('.video-button').click(function(e){
    console.log('e', e)
    var classList = $('.video-button').attr('class').split(/\s+/);
    console.log('classlist:', classList);
    var index = parseInt(classList[2].replace('video', ''));
    console.log('index:', index,playlist[index].url, playlist);
    socket.emit('video', {
      video: playlist[index].url
    });
  });

  socket.on('response', function(data){
    console.log('response:', data);
    if(data.listening == true){
      showLoader();
      $('.button-text').html('listening')
    }
    if(data.playlist){
      playlist = data.playlist;
      hideLoader();
      $('.button-text').html('listen');

      playlist.forEach(function(video, index){
        $('.video' + index).html(video.title);
        $('.video' + index).removeClass('hide');
        $('.video' + index).removeClass('show');
      })
    }
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
