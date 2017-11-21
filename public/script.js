$(function () {
  // var socket = io.connect('localhost:3000');
  var socket = io();
  console.log('connect');
  var playlist = [];
  var title = '';
  var url = '';
  var player;
  var controls;
  var pages = [];
  var current_page = 0;
  var max_pages;
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

  socket.on('videos', function(data){
    console.log('videos:', data);

    data.forEach(function(video){
      var present = playlist.find(function(p){
        return p.title == video.title;
      });

      if(!present){
        playlist.push(video);
      }
    });
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

      var i,j,temparray,chunk = 5;
      for (i=0,j=playlist.length; i<j; i+=chunk) {
          temparray = playlist.slice(i,i+chunk);
          // do whatever
          pages.push(temparray);
      }

      max_pages = pages.length - 1;

      makeVideoButtons(0);

      $('.page-button').removeClass('hide');
      $('.page-button').addClass('show');

      $('.page-up-button').on('click', pageUpHandler);
      $('.page-down-button').on('click', pageDownHandler);

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
    $('.controls-container').addClass('hide');
    $('.controls-container').removeClass('show');
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

  function videoButtonHandler(e){
    var classList = e.currentTarget.className.split(/\s+/);
    console.log('classList', classList);
    var index = parseInt(classList[2].replace('video', ''));
    index = index - 1;
    title = playlist[index].title;
    url = playlist[index].url;
    $('.title').html(title);

    // actual video
    $('.video-container').html('<video id="player"></video>');
    player = $('#player');
    player.addClass('hide');
    player.attr('src', url);
  }

  function pageUpHandler(){
    console.log('page', current_page);
    if(current_page < max_pages){
      current_page++;
      makeVideoButtons(current_page);
    }
  }
  function pageDownHandler(){
    console.log('page dn', current_page);
    if(current_page > 0){
      current_page--;
      makeVideoButtons(current_page);
    }
  }

  function makeVideoButtons(current){
    var mod = current * 5;
    // current page is 0
    // mod should be 1
    // current is 1, mod should be 5
    // current is 2, mod should be 10
    console.log('pages', pages[current])
    $('.video-buttons-container').html('');
    pages[current].forEach(function(video, index){
      var num = (index + 1) + mod;
      $('.video-buttons-container').append('<button id="video-button' + num + '"></button>');
      $('#video-button' + num).addClass("button video-button video" + num);
      $('#video-button' + num).html(num);
    });

    $('.video-button').on("click", videoButtonHandler);
  }


});
