var video = document.querySelector("video");
video.addEventListener(
  "contextmenu",
  function(e) {
    console.log("right click");
    e.preventDefault();
  },
  false
);

var player = document.querySelector(".player");

// play
var playerBtn = document.querySelector(".player-status-btn");
var playerStatus = true;
var canplay = false;

function play() {
  if (canplay) {
    if (playerStatus) {
      video.play();
    } else {
      video.pause();
    }
    playerStatus = !playerStatus;
  }
}

playerBtn.addEventListener("click", function() {
  play(playerStatus);
});

video.addEventListener("pause", function() {
  player.classList.add("player-pause");
});

video.addEventListener("play", function() {
  player.classList.remove("player-pause");

  var videoWrap = document.querySelector(".videoWrap");
  var timeout;
  videoWrap.addEventListener("mousemove", function() {
    clearTimeout(timeout);
    showControl();
    timeout = setTimeout(hiddenControl, 3000);
  });
});

video.addEventListener("click", function() {
  play(playerStatus);

});

video.addEventListener("ended", function() {
  playerStatus = true;
});

//////
var durationTime = document.querySelector(".duration-time");
video.addEventListener("canplay", function() {
  canplay = true;
  console.log("canplay");
  if (hasClass(player, "player-pause")) {
    video.pause();
  } else {
    video.play();
  }
});

video.addEventListener("durationchange", function() {
  durationTime.innerHTML = Time(video.duration);
  video.currentTime = 0;
});

/////////

function getOffset(e, elem, dir) {
  var offset;
  var event = window.event || e;
  var rect = elem.getBoundingClientRect();
  if (dir) {
    var width = elem.offsetWidth;

    var cx = event.clientX;
    var left = rect.left;
    offset = (cx - left) / width;
  } else {
    var height = elem.offsetHeight;

    var cy = event.clientY;
    var top = rect.top;
    offset = 1 - (cy - top) / height;
  }

  if (offset > 1) {
    offset = 1;
  }

  if (offset < 0) {
    offset = 0;
  }
  return offset;
}
var videoProgree = document.querySelector(".video-progree");
var progreeBar = document.querySelector(".progreeBar");
var detailTime = document.querySelector(".progree-detail-wrap");
var progreePoint = document.querySelector(".progreePoint");
var time = document.querySelector(".detail-time");
var currentTime = document.querySelector(".progree-time");

function moveProgree(e) {
  var offset = getOffset.call(this, e, videoProgree, true);
  foo(offset);
  video.currentTime = offset * video.duration;
}

function foo(offset) {
  progreeBar.style.setProperty("--progree", offset);
  var width = videoProgree.offsetWidth - 12;
  progreePoint.style.setProperty("left", `${offset * width}px`);
}
videoProgree.addEventListener(
  "mousedown",
  function(e) {
    moveProgree.call(this, e);
    document.addEventListener("mousemove", moveProgree);
  },
  false
);
document.addEventListener("mouseup", function() {
  document.removeEventListener("mousemove", moveProgree);
});
videoProgree.addEventListener(
  "mousemove",
  function(e) {
    var offset = getOffset(e, this, true);
    detailTime.style.setProperty("left", `${offset * 100}%`);
    time.innerHTML = `${Time(offset * video.duration)}`;
  },
  false
);
video.addEventListener("timeupdate", function() {
  var offset = video.currentTime / video.duration;
  if (canplay) {
    foo(offset);
    currentTime.innerHTML = Time(video.currentTime);
  }
});

// volume

var volumeWrap = document.querySelector(".player-volume-wrap");
var volumeProgree = document.querySelector(".volumebar");
var volumeBar = document.querySelector(".volumebar-progree");
var volumeNum = document.querySelector(".volume-num");
var volumeDot = document.querySelector(".volumebar-dot");
var volumeBtn = document.querySelector(".player-volume-icon");
var v = 0.1;
volumeBtn.addEventListener("click", function() {
  if (video.volume) {
    v = video.volume;
    video.volume = 0;
  } else {
    video.volume = v;
    v = 0.1;
  }
});

function moveVolume(e) {
  var offset = getOffset.call(this, e, volumeProgree, false);
  if (offset > 1) {
    offset = 1;
  }
  if (offset < 0) {
    offset = 0;
  }
  video.volume = offset.toFixed(2);
}
volumeProgree.addEventListener("mousedown", function(e) {
  volumeWrap.classList.add("volumebar-hover");
  moveVolume(e);
  document.addEventListener("mousemove", moveVolume);
});
document.addEventListener("mouseup", function() {
  document.removeEventListener("mousemove", moveVolume);
  volumeWrap.classList.remove("volumebar-hover");
});
video.addEventListener(
  "volumechange",
  function() {
    var volume = video.volume;
    volumeBar.style.setProperty("--volume", volume);
    volumeNum.innerHTML = parseInt(volume * 100);
    volumeDot.style.setProperty("bottom", `${volume * 50}px`);
    if (!volume) {
      player.classList.add("player-muted");
    } else {
      player.classList.remove("player-muted");
    }
  },
  false
);


///s


var widemode = document.querySelector(".widemode-wrap");
var bofangqi = document.querySelector(".player-main");
var fullpage = document.querySelector(".fullpage-wrap");

widemode.addEventListener("click", function() {
  if (!hasClass(player, "player-widemode")) {
    wideMode();
  } else {
    initPlayer();
  }
});

fullpage.addEventListener("click", function() {
  if (!hasClass(player, "player-fullpage")) {
    fullWebScreen();
  } else {
    initPlayer();
  }
});



function wideMode() {
  initPlayer();

  var content = document.querySelector(".container .content");

  var size = scale16(content);

  playerContent.style.setProperty("height", size.height + 45 + "px");

  player.classList.add("player-widemode");
  bofangqi.style.setProperty("position", "absolute");
  bofangqi.style.setProperty("height", size.height + 45 + "px");
  bofangqi.style.setProperty("width", size.width + "px");
}

function fullWebScreen() {
  initPlayer();

  player.classList.add("player-fullpage");
}

function initPlayer() {
  playerContent.style.setProperty("height", "auto");

  player.classList.remove("player-fullpage");
  player.classList.remove("player-widemode");

  bofangqi.style.setProperty("position", "static");
  bofangqi.style.setProperty("height", "");
  bofangqi.style.setProperty("width", "");

  initSize();
}

var playerWrap = document.querySelector(".playerWrap");

function initSize() {
  var size = scale16(playerWrap);
  var width = size.width;
  var height = size.height;

  bofangqi.style.setProperty("height", height + 45 + "px");
  bofangqi.style.setProperty("width", width + "px");
}

function FullScreen(el) {
  var isFullscreen =
    document.fullScreen ||
    document.mozFullScreen ||
    document.webkitIsFullScreen;
  if (!isFullscreen) {
    //进入全屏,多重短路表达式
    (el.requestFullscreen && el.requestFullscreen()) ||
      (el.mozRequestFullScreen && el.mozRequestFullScreen()) ||
      (el.webkitRequestFullscreen && el.webkitRequestFullscreen()) ||
      (el.msRequestFullscreen && el.msRequestFullscreen());
    player.classList.add("player-fullscreen");
  } else {
    //退出全屏,三目运算符
    document.exitFullscreen
      ? document.exitFullscreen()
      : document.mozCancelFullScreen
      ? document.mozCancelFullScreen()
      : document.webkitExitFullscreen
      ? document.webkitExitFullscreen()
      : "";
    player.classList.remove("player-fullscreen");
    initPlayer();
  }
}

function checkFull() {
  var isFull =
    document.fullscreenEnabled ||
    window.fullScreen ||
    document.webkitIsFullScreen ||
    document.msFullscreenEnabled;
  if (isFull === undefined) {
    isFull = false;
  }
  return isFull;
}

var fullscreenBtn = document.querySelector(".fullscreen-wrap");
fullscreenBtn.addEventListener("click", function() {
  FullScreen(player);
});

var playerArea = document.querySelector(".player-area");

function hiddenControl() {
  player.classList.remove("player-control-show");
  playerArea.classList.add("player-nocursor");
}

function showControl() {
  player.classList.add("player-control-show");
  playerArea.classList.remove("player-nocursor");
}

// controll-show

var videoCtr = document.querySelector(".videoCtrWrap");
videoCtr.addEventListener("mouseover", function() {
  this.classList.add("mouse-hover");
});

videoCtr.addEventListener("mouseout", function() {
  this.classList.remove("mouse-hover");
});


window.addEventListener("resize", function() {
  if (hasClass(player, "player-widemode")) {
    wideMode();
  } else {
    initPlayer();
  }

  if (!checkFull()) {
    player.classList.remove("player-fullscreen");
  }
});

window.addEventListener("load", function() {
  initSize();
});
