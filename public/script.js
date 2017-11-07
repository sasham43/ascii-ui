$(function () {
  // var socket = io.connect('localhost:3000');
  var socket = io();
  console.log('connect')
  $('.button').click(function(){
    socket.emit('listen');
    // $('#m').val('');
    return false;
  });
  socket.on('response', function(data){
    console.log('response:', data);
    if(data.listening == true){
      showLoader();
      $('.button-text').html('listening')
    }
    if(data.playlist){
      hideLoader();
      $('.button-text').html('listen');

      data.playlist.forEach(function(video, index){
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
