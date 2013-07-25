(function() {
  'use strict';

  function ShyPlayer(videoComponent, playlist, width, height) {
    var videoEl = null;
    var currentPlayedIndex = 0;
  
    function onIdle(idleStart, idleEnd) {
      var idleTime = 0;
      var idleInterval = null;
      var lastMouseMove = {x: 0, y: 0};
      function timerIncrement() {
        idleTime = idleTime + 1;
        if (idleTime > 1) { // 2 seconds
          clearInterval(idleInterval);
          idleStart();
        }
      }
      function setIdleInterval() {
        idleInterval = setInterval(timerIncrement, 1000); // each second
      }
      setIdleInterval();
      function onIdleEnd (e) {
        // workaround http://crbug.com/103041
        if (e.type == "mousemove" && e.x == lastMouseMove.x &&
          e.y == lastMouseMove.y) {
          return;
        } else {
          lastMouseMove.x = e.x;
          lastMouseMove.y = e.y;
        }
        clearInterval(idleInterval);
        idleTime = 0;
        idleEnd();
        setIdleInterval();
      }
      document.onmousemove = onIdleEnd;
      document.onkeypress = onIdleEnd;
    }
    
    function hideOnIdle(elementToHide, elementToHideCursor) {
      onIdle(function hideElementAndCursor() {
        elementToHide.style.visibility = "hidden";
        elementToHideCursor.style.cursor = "none";
      }, function showControls() {
        elementToHide.style.visibility = "visible";
        elementToHideCursor.style.cursor = "pointer";
      });
    }


    function videoPlayPause() {
      if (!videoEl.paused && !videoEl.ended) {
        videoEl.pause();
      } else {
        videoEl.play();
      }
    }

    function isFullscreen(el) {
      return (el.offsetWidth == screen.width && el.offsetHeight == screen.height);
    }

    function toggleFullscreen() {
      if (!isFullscreen(videoComponent)){
        videoComponent.webkitRequestFullscreen();
      } else {
        document.webkitExitFullscreen();
      }
    }

    function bindShortcuts() {
      document.addEventListener('keydown', function(ev) {
         if (ev.ctrlKey) {
           return;
         }
         switch(ev.keyCode) {
           case 32: // space
             videoPlayPause();
             ev.preventDefault();
             break;
           case 70: // f
             toggleFullscreen();
             break;
         }
      });
    }

    function createButton(name, handler) {
      var button = document.createElement("div");
      button.className = name + "_button button";
      button.addEventListener('click', handler);
      return button;
    }

    function bindVideoPauseChange(videoEl, playEl) {
      videoEl.addEventListener('play', function() {
        playEl.className = "pause_button button";
      });
      videoEl.addEventListener('pause', function() {
        playEl.className = "play_button button";
      });
    }

    function bindChangePosition(videoEl, progressEl) {
      progressEl.addEventListener('click', function (e) {
        var clicked = e.offsetX * videoEl.duration/progressEl.offsetWidth;
        videoEl.currentTime = clicked;
      }, false);
    }
    function bindClickToPlay(videoEl) {
      videoEl.addEventListener('click', function () {
        videoPlayPause();
      });
    }

    function parseVideoTime(time) {
      var totalSeconds = Math.floor(time);
      var totalMinutes = Math.floor(totalSeconds / 60);
      var hours = Math.floor(totalMinutes / 60);
      var minutes = totalMinutes % 60;
      var seconds = totalSeconds % 60;
      return ("0" + hours).slice(-2) + ":" +
             ("0" + minutes).slice(-2) + ":" +
             ("0" + seconds).slice(-2);
    }

    function updateVideoPosition(videoEl, timeEl, progressValueEl) {
      var durationText = "";
      var currentTimeText = "";
      durationText = parseVideoTime(videoEl.duration || 0);
      currentTimeText = parseVideoTime(videoEl.currentTime);
      timeEl.innerText = currentTimeText + " / " + durationText;
      if (videoEl.duration) {
        progressValueEl.style.width = (videoEl.currentTime / videoEl.duration) * 100  + '%';
      }
    }

    function bindVideoPositionChange(videoEl, timeEl, progressValueEl) {
      videoEl.addEventListener('timeupdate', function() {
        updateVideoPosition(videoEl, timeEl, progressValueEl);
      });
      videoEl.addEventListener('durationchange', function() {
        updateVideoPosition(videoEl, timeEl, progressValueEl);
      });
    }

    function handlePlaylist() {
      currentPlayedIndex = 0;
      videoEl.src = playlist[0];
      videoEl.addEventListener('ended', function() {
        if (currentPlayedIndex + 1 < playlist.length) {
          videoEl.src = playlist[++currentPlayedIndex];
          videoEl.load();
          videoEl.play();
        }
      });
    }

    function createControls(videoEl) {
      var controls = document.createElement("div");
      controls.className = "shyplayer_controls";
      var playEl = createButton('play', function () {
        videoPlayPause();
      });
      bindVideoPauseChange(videoEl, playEl);
      controls.appendChild(playEl);
      // order is important
      controls.appendChild(createButton('fullscreen', function (target) {
        toggleFullscreen();
      }));
      var progressEl = document.createElement("div");
      progressEl.className = "progress";
      progressEl.max = 100;
      progressEl.value = 0;
      bindChangePosition(videoEl, progressEl);
      var progressValueEl = document.createElement("div");
      progressValueEl.className = "progressValue";
      progressEl.appendChild(progressValueEl);
      var timeEl = document.createElement("div");
      timeEl.className = "time";
      bindVideoPositionChange(videoEl, timeEl, progressValueEl);
      controls.appendChild(timeEl);
      controls.appendChild(progressEl);
      videoComponent.appendChild(controls);
      return controls;
    }

    function play() {
      videoComponent.className = "shyplayer_video";
      videoEl = document.createElement("video");
      bindClickToPlay(videoEl);
      videoComponent.style.width = width;
      videoComponent.style.height = height;
      videoComponent.appendChild(videoEl);
      var controls = createControls(videoEl);
      hideOnIdle(controls, videoComponent);
      handlePlaylist();
      bindShortcuts();

      videoEl.volume = 1;  // use system's volume controls
      videoEl.removeAttribute('controls');

      videoEl.play();
    }

    play();

    return videoEl;
  }

  window.ShyPlayer = ShyPlayer;
}());
