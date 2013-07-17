(function() {
  'use strict';

  function ShyPlayer(videoComponent, playlist, width, height) {
    var videoEl = null;
    var currentPlayedIndex = 0;
    var images = {
      fullscreen: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAAwBQTFRFAAAA////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZ3bsYwAAAQB0Uk5T////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AFP3ByUAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41Ljg3O4BdAAAAPklEQVQoU7VPSQoAQAiy/z+6UhJmu46X1IIUQaQgCit7iJy9brIvOAbkNOyIwlvPP8b19hHsjL5oFu62e/0CFqTLaX136gAAAAAASUVORK5CYII=',
      pause:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAABGdBTUEAALGeYUxB9wAAACBjSFJNAAB6JQAAgIMAAPn/AACA6AAAUggAARVYAAA6lwAAF2/XWh+QAAACgklEQVR42lyR22pbRxSGv5nZZ21H2kqxIrdur+JQ0ppepPEjhIS0F3Gfpn2Y4pbSF+gDlARKIL02hIJTCsanOKmsw97aM7OmF5LlqAsGBr41//rXPyqEwOMnTz978PWDfRExCsVoNGoODn78dTIev7390SZ7e3t3H+49/LZpGq21Vm8vLiY//3Twy3Q6HUUAu7tfPvpuf/+HWV0rEUEk2Jcv/3jz56tXv03GV9y7t/PN/rNn34+urlQIgdba5sWL54fA7xrg7s7Obrfb65dlWRVFp9ocDDY//mR7F6BpagaDwVfdXtXf2Nioik6nunNnOBwOtz4HiBZNTTurZ9R1g/celMLa1rKsZj5v6w+4SMA661YC3nusdVjn8N4TOUeQcP0eEaFt7YprYyAs+FJAsNZinUWWdwk3At57rLM4Z/FeMMYgywEawIvHOodbHvlg+rWDBfNLLiumryc45/DOE4A4jtBK3TgQobUW5xxKKZIkQWu1voKXhbUoMvy/JpMpR3//Q9s0pGmK0nrFIgAFJHGMbVsu370nzeq1DMQL3jkkLPKZzWarNSMAbTTT6ZTziwuMiej3CyJz40QbTZalRMaQJDFlWWKWPAJoW8vVeEye52RpxkZZYsyNTRNp8izHx44sTdd4BGCMpuyUaA1ZltO9dWsti9jEdDoF4j15vuBrDsqyjHu9LlorOkXB7aoiidPoWqDI87jqdhEROkVBv+oRx7FZfeNfr18fpUni8jSVyBh5P/rXHh8fHwNorTk/PztKksRlWSJRZOTy8t389OT0FECFEFBKxdvbn36htYoXmbT25OTkEJgrpTDGpMOtrftaKQNKNU09Pzs7Owwh2P8GAAruVo9cZ9KlAAAAAElFTkSuQmCC',
      play:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACUklEQVR42mNkAAIOTk4mTU0tdXsHB5sF8+ct//D+/RcGIgEjiFBT1xDz8vJOjImNqezu6qpctXLFjP9AQLQBAUHBup6enmUe7h4x33/8YNixY/v27q7OnKdPntwjygBvX18tV1e3Umdnl4RPnz4BvcTB8Orlq/fTpk2p2Lxx4yyCBnj5+Gk5OTuVOjg4Jnz+/Inh9+8/QBlGBjZWVoajR45snzZlcs7Tp9hdAzbAw9tHy9HRsdTWxi7h0+fPDH/+/mH4/+8fAyMTEwM/Pz/Dl8+f38+YPrVi4/r1s7Ab4OWjZWdnV2ppbZ3w5QskAliYmRlYWFjAmJubm4GPl5dh794929paWkCuuY9igLuHl5aNrW2phZVVwq+fPxlYgU6HY6ABbOxsDBzs7AxioqIMHz58+BQcHOR/4fz5A3AD3KAG2DvYJ/z+BfQ/w3+4F9jYWBm4ODnBrhAVEWEAWRAQ4B9x6tSpDUCFPyEu8PTWsre3L7WysUn48P4DSDvYRm4uLgYeoEYBAX4GPj4+hj179lytqqosuHf37h6MQLS0tCo1MjZJ+P//HwMPUCPIRh4ebgYRYWGGjx8//u7o6JgKTKVN//79e48RiJ7evlrWNjaltra2CUxMjGBb+YE2gmIAZGt1VWXhnTt3duNPB05OpW5ubgnMQH+LiAgzfPr48U87xNZGdFuxJOUQHU9Pj/KAgIAYUPQBo+tqVSVuWzEMUFJWlgoODslKT0+v7uzsmDx37tz6f3//viekGW4ACLCzs3Pz8vLKvHnz5jaQ+48YzSAAAGPF5xGsLhIBAAAAAElFTkSuQmCC'
    };

    function onIdle(idleStart, idleEnd) {
      var idleTime = 0;
      var idleInterval = null;
      var lastMouseMove = {x: 0, y: 0};
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
      function timerIncrement() {
        idleTime = idleTime + 1;
        if (idleTime > 1) { // 2 seconds
          clearInterval(idleInterval);
          idleStart();
        }
      }
    }

    function videoPlayPause() {
      if (!videoEl.paused && !videoEl.ended) {
        videoEl.pause();
      } else {
        videoEl.play();
      }
    }

    function isFullscreen() {
      return !window.screenTop && !window.screenY;
    }

    function toggleFullscreen() {
      if (!isFullscreen()){
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
             break;
           case 70: // f
             toggleFullscreen();
             break;
         }
      });
    }

    function createControls() {
      videoEl = document.createElement("video");
      videoEl.style.width = "100%";
      videoEl.style.height = "100%";
      bindClickToPlay(videoEl);
      videoComponent.style.width = width;
      videoComponent.style.height = height;
      videoComponent.appendChild(videoEl);
      var controls = document.createElement("ul");
      controls.id = "shyplayer_controls";
      var playEl = createButton(images.play, function () {
        videoPlayPause();
      });
      bindVideoPauseChange(videoEl, playEl);
      controls.appendChild(playEl);
      var progressEl = document.createElement("progress");
      progressEl.max = 100;
      progressEl.value = 0;
      progressEl.style.width = "75%";
      progressEl.style.display = "inline-block";
      progressEl.style.verticalAlign = "middle";
      bindChangePosition(videoEl, progressEl);
      controls.appendChild(progressEl);
      var timeEl = document.createElement("span");
      timeEl.style.display = "inline-block";
      timeEl.style.verticalAlign = "middle";
      bindVideoPositionChange(videoEl, timeEl, progressEl);
      controls.appendChild(timeEl);
      controls.appendChild(createButton(images.fullscreen, function (target) {
        toggleFullscreen();
      }));
      videoComponent.appendChild(controls);
      videoComponent.style.position = "relative";
      controls.style.position = "absolute";
      controls.style.bottom = "0";
      hideOnIdle(controls, videoComponent);
    }

    function bindVideoPauseChange(videoEl, playEl) {
      videoEl.addEventListener('play', function() {
        playEl.innerHTML = "<img src='" + images.pause + "'/>";
      });
      videoEl.addEventListener('pause', function() {
        playEl.innerHTML = "<img src='" + images.play + "'/>";
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
    function bindVideoPositionChange(videoEl, timeEl, progressEl) {
      videoEl.addEventListener('timeupdate', function() {
        updateVideoPosition(videoEl, timeEl, progressEl);
      });
      videoEl.addEventListener('durationchange', function() {
        updateVideoPosition(videoEl, timeEl, progressEl);
      });
    }
    function updateVideoPosition(videoEl, timeEl, progressEl) {
      var durationText = "";
      var currentTimeText = "";
      durationText = parseVideoTime(videoEl.duration || 0);
      currentTimeText = parseVideoTime(videoEl.currentTime);
      timeEl.innerText = currentTimeText + " / " + durationText;
      progressEl.value = (videoEl.currentTime / videoEl.duration) * 100;
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

    function hideOnIdle(controls, videoComponent) {
      onIdle(function hideControls() {
        controls.style.visibility = "hidden";
        videoComponent.style.cursor = "none";
      }, function showControls() {
        controls.style.visibility = "visible";
        videoComponent.style.cursor = "pointer";
      });
    }

    function createButton(image, handler) {
      var button = document.createElement("button");
      button.style.backgroundColor = "transparent";
      button.style.border = "none";
      button.style.color = "transparent";
      button.style.display = "inline-block";
      button.style.verticalAlign = "middle";
      button.innerHTML = "<img src='" + image + "'/>";
      button.addEventListener('click', handler);
      return button;
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

    function play() {
      createControls();
      handlePlaylist();
      bindShortcuts();

      videoEl.volume = 1;  // use system's volume controls
      videoEl.removeAttribute('controls');

      videoEl.play();
    }

    play();
  }

  window.ShyPlayer = ShyPlayer;
})();
