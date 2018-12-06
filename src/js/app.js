console.log("hello webpack");

require("../css/index.css");

const video = document.querySelector('video');


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
    <div class="cur-list">
      </ul>
      <ul id="curList" class="list-mode">
      </ul>
    </div>`;

    // r.appendChild(multiPage);
    var f = document.querySelector('#insertList');

    f.parentNode.insertBefore(multiPage, f);

    var listdoc = document.createDocumentFragment();

    playList.forEach(function(item, index) {
      var li = document.createElement("li");
      if (index == 0) {
        li.classList.add("on");
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

    li.forEach(function(item, index) {
      item.addEventListener("click", function() {
        li.forEach(function(item) {
          item.classList.remove("on");
        });
        item.classList.add("on");
        document.querySelector(".index-page").innerHTML = index + 1;
      });
    });
  }
}

loadList();

/////////////////////////////////////////////////
var mirror = document.querySelector("#mirror");
var lightoff = document.querySelector("#lightoff");

mirror.addEventListener("change", function() {
  if (mirror.checked) {
    video.style.transform = "rotateY(180deg)";
  } else {
    video.style.transform = "";
  }
});

lightoff.addEventListener("change", function() {
  var black = document.querySelector(".black");
  if (lightoff.checked) {
    black.style.display = "block";
    playerWrap.classList.add("lightoff-mode");
  } else {
    black.style.display = "";
  }
});

var vdesc = document.querySelector("#v-desc");
vdesc.addEventListener("click", function() {
  var info = document.querySelector(".video-desc .info");
  var span = this.querySelector("span");
  if (hasClass(this, "on")) {
    span.innerHTML = "展开更多";
    this.classList.remove("on");
    info.classList.remove("open");
  } else {
    span.innerHTML = "收起";
    this.classList.add("on");
    info.classList.add("open");
  }
});


