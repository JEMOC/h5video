console.log("hello webpack");

require("./index.css");

const playerContent = document.querySelector(".player-content");

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

function Time(sec) {
  var a = parseInt(sec / 60);
  var b = parseInt(sec % 60);
  if (isNaN(a) && isNaN(b)) {
    return "00:00";
  } else {
    var min, second;

    min = a >= 10 ? a : "0" + a;
    second = b >= 10 ? b : "0" + b;
    return `${min}:${second}`;
  }
}

// video
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
  // if (canplay) {
  //   hiddenControl();
  // }
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

function hasClass(elem, cl) {
  var classList = Array.from(elem.classList);
  if (classList.indexOf(cl) >= 0) {
    return true;
  } else {
    return false;
  }
}

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

function scale16(elem) {
  var width = elem.offsetWidth;
  var height = (width * 9) / 16;
  return {
    width,
    height
  };
}

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

// playList
var playIndex = 1;

var playList = [
  {
    title: "世界奇妙物语 17深夜特别篇 1",
    src: "/世界奇妙物语/1.MP4"
  },
  {
    title: "世界奇妙物语 17深夜特别篇 2",
    src: "/世界奇妙物语/2.MP4"
  },
  {
    title: "世界奇妙物语 17深夜特别篇 3",
    src: "/世界奇妙物语/3.MP4"
  },
  {
    title: "世界奇妙物语 17深夜特别篇 4",
    src: "/世界奇妙物语/4.MP4"
  },
  {
    title: "世界奇妙物语 17深夜特别篇 5",
    src: "/世界奇妙物语/5.MP4"
  }
];

function loadList() {
  video.src = playList[0].src;
  if (playList.length > 1) {
    var r = document.querySelector(".right-content");

    var multiPage = document.createElement("div");
    multiPage.classList.add("multi-page");

    multiPage.innerHTML = `
    <div class="head-content">
    <h3>视频选集</h3>
    <div class="range-box">
      <div class="select-icon">
        <button id="select">&nbsp0&nbsp</button>
      </div>
      <div class="current-page">
        <span class="index-page">${playIndex}</span><span>/</span><span class="total-page">${
      playList.length
    }</span>
      </div>
    </div>
  </div>
  <div class="cur-list"></ul>
              <ul id="curList" class="list-mode">
              </ul>
              </div>`;

    r.appendChild(multiPage);

    var listdoc = document.createDocumentFragment();

    playList.forEach(function(item, index) {
      var li = document.createElement("li");
      if(index == 0) {
        li.classList.add('on');
      }
      li.innerHTML = `<a title="${item.title}"><span>P${index + 1}</span>${
        item.title
      }</a>`;

      li.addEventListener("click", function() {
        video.src = item.src;
        this.classList.add("on");
      });

      listdoc.append(li);
    });

    var curList = document.querySelector("#curList");
    curList.append(listdoc);

    var select = document.querySelector("#select");

    var li = document.querySelectorAll("#curList li");

    select.addEventListener("click", function() {
      if (hasClass(curList, "list-mode")) {
        curList.classList.remove("list-mode");
        curList.classList.add("block-mode");
        li.forEach(function(item, index) {
          item.querySelector("a").innerHTML = index + 1;
        });
      } else {
        curList.classList.remove("block-mode");
        curList.classList.add("list-mode");
        li.forEach(function(item) {
          var a = item.querySelector("a");
          a.innerHTML = a.title;
        });
      }
    });

    li.forEach(function(item, index){
      item.addEventListener('click', function() {
        li.forEach(function(item) {
          item.classList.remove('on');
        })
        item.classList.add('on');
        document.querySelector('.index-page').innerHTML = index + 1;
      })
    })
  }
}

loadList();

/////////////////////////////////////////////////
var mirror = document.querySelector("#mirror");
var lightoff = document.querySelector("#lightoff");

mirror.addEventListener("change", function() {
  if (mirror.checked) {
    video.style.setProperty("transform", "rotateY(180deg)");
  } else {
    video.style.setProperty("transform", "");
  }
});

lightoff.addEventListener("change", function() {
  var black = document.querySelector(".black");
  if (lightoff.checked) {
    black.style.setProperty("display", "block");
    playerWrap.classList.add("lightoff-mode");
  } else {
    black.style.setProperty("display", "");
  }
});



var vdesc = document.querySelector('#v-desc');
vdesc.addEventListener('click', function() {
  var info = document.querySelector('.video-desc .info');
  var span = this.querySelector('span');
  if(hasClass(this, 'on')){
    span.innerHTML = '展开更多';
    this.classList.remove('on');
    info.classList.remove('open');
  } else {
    span.innerHTML = '收起';
    this.classList.add('on');
    info.classList.add('open');
  }
})
