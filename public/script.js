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
      $('.loader2').addClass('show');
      $('.loader2').removeClass('hide');
      $('.button-text').html('listening')
    }
  });
});
