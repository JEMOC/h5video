require("../css/comment.css");

var commentList = document.querySelector(".comment-list");
var comment = document.querySelector(".comment-module .comment");

//comment-send
function error() {
  var div = document.createElement("div");
  div.classList.add("mini-error");
  var bg = document.createElement("div");
  bg.classList.add("bg");
  var content = document.createElement("div");
  content.classList.add("content");
  content.innerHTML = "请发送2到1000字且非纯表情的评论";

  var btn = document.querySelector("#commentSubmit");
  var btnTop = getPoint(btn).top;
  var btnLeft = getPoint(btn).left;

  div.style.setProperty("top", btnTop - 32 + "px");
  div.style.setProperty("left", btnLeft - 80 + "px");
  div.style.setProperty("opacity", 0);

  div.style.setProperty("z-index", 1999);

  bg.append(content);
  div.append(bg);

  document.body.appendChild(div);

  var mini = document.querySelector(".mini-error");
  // animate(mini, 'top', btnTop - 40);
  animate(
    mini,
    {
      top: btnTop - 40,
      opacity: 1
    },
    2,
    60,
    function() {
      console.log("finish");
      setTimeout(function() {
        document.body.removeChild(div);
      }, 2000);
    }
  );
}

// generate send
function generateSend() {
  var send = document.createElement("div");
  send.className = "comment-send";
  send.innerHTML = `
    <div class="user-face">
      <img src="http://localhost:10010/1.webp" alt="">
    </div>
    <div class="textarea-container">
      <textarea name="" id="" cols="80" rows="5" placeholder="请自觉遵守互联网相关的政策法规，严禁发布色情、暴力、反动的言论。"></textarea>
      <a class="btn" id="commentSubmit">发表评论</a>
    </div>
    <div class="emoji-btn">
    <span class="btn-text">表情</span>
    </div>`;

  var btn = send.querySelector("#commentSubmit");
  var textarea = send.querySelector("textarea");
  var emojiBtn = send.querySelector(".emoji-btn");

  emojiBtn.addEventListener("click", function(event) {
    var emojiBox = document.querySelector(".comment-module .emoji-box");

    event.stopPropagation();
    emojiBox.style.display = "block";

    var element = this;
    var top = 0;
    var left = 0;
    while (element != comment) {
      console.log(element, element.offsetLeft, element.offsetTop);

      top += element.offsetTop;
      left += element.offsetLeft;

      element = element.parentNode;
    }

    emojiBox.style.left = left + "px";
    emojiBox.style.top = top + this.offsetHeight + 3 + "px";
  });

  document.addEventListener("click", function() {
    var emojiBox = document.querySelector(".comment-module .emoji-box");
    emojiBox.style.display = "none";
  });

  btn.addEventListener("click", function() {
    var text = textarea.value;
    console.log(textarea.value);

    if (text.length > 2) {
      var data = {
        text
      };
      var reply = generateReply(data);
      textarea.value = "";
      commentList.appendChild(reply);
    } else {
      if (document.querySelector(".mini-error")) {
        return;
      } else {
        error();
      }
    }
  });

  return send;
}

function generateEmojiBox() {
  const emojiData = require("../emoji.json");

  var element = document.createElement("div");
  element.className = "emoji-box";
  element.style.display = "none";

  element.innerHTML = `
  <div class="emoji-title"></div>
  <div class="emoji-wrap"></div>
  <div class="emoji-tabs">
    <div class="emoji-tab-con">
      <div class="emoji-tab-wrap clearfix"></div>
    </div>
    <div class="emoji-tab-slider">
      <span class="prev">
        <i class="prev-icon"></i>
      </span>
      <span class="next">
        <i class="next-icon"></i>
      </span>
    </div>
  </div>`;

  emojiData.forEach(function(item) {
    var title = item.title;
    var icon = item.icon;
    var type = item.type;
    var dataList = item.emojiList;

    var boxTitle = element.querySelector(".emoji-title");
    var boxWrap = element.querySelector(".emoji-wrap");
    var tabWrap = element.querySelector(".emoji-tab-wrap");

    var tab = document.createElement("a");
    tab.className = "tab-link";
    tab.title = title;
    tab.addEventListener("click", function() {
      var links = tabWrap.querySelectorAll(".tab-link");
      links.forEach(function(link) {
        link.classList.remove("on");
      });
      this.classList.add("on");

      boxTitle.innerHTML = title;
      boxWrap.innerHTML = "";

      dataList.forEach(function(item) {
        var emojiList = document.createElement("a");
        emojiList.className = "emoji-list";
        emojiList.setAttribute("emoji-data-text", item.title);

        emojiList.addEventListener("click", function() {
          var textarea = element.parentNode.querySelector("textarea");
          var box = document.querySelector(".emoji-box");
          textarea.value += this.getAttribute("emoji-data-text");
          textarea.focus();
          box.style.display = "none";
        });

        if (title === "颜文字") {
          emojiList.classList.add("emoji-text");
          emojiList.innerHTML = item.text;
        } else {
          emojiList.classList.add("emoji-icon");

          var img = document.createElement("img");
          img.src = `/emoji/${title}/${item.src}`;
          img.title = item.title;

          emojiList.appendChild(img);
        }

        boxWrap.appendChild(emojiList);
      });
    });

    var img = document.createElement("img");
    img.src = `/emoji/base/${icon}`;
    tab.appendChild(img);

    tabWrap.appendChild(tab);
  });

  element.querySelector(".tab-link").click();
  element.addEventListener("click", function(event) {
    event.stopPropagation();
  });

  (function() {
    var tabWrap = element.querySelector(".emoji-tab-wrap");
    var prevBtn = element.querySelector(".emoji-tab-slider .prev");
    var nextBtn = element.querySelector(".emoji-tab-slider .next");

    var width = emojiData.length * 46;
    var index = 1;
    var page = Math.ceil(width / 322);

    tabWrap.style.width = width + "px";

    if(page > 1) {
      nextBtn.classList.add('on');
    }

    prevBtn.addEventListener('click', function() {
      index--;
      if(index <= 1) {
        index = 1;
        prevBtn.classList.remove('on');
      }
      if(index < page) {
        nextBtn.classList.add('on');
      }
      foo();
    });

    nextBtn.addEventListener('click', function() {
      index++;
      if(index >= page) {
        index = page;
        nextBtn.classList.remove('on');
      }
      if(index > 1) {
        prevBtn.classList.add('on');
      }
      foo();
    });

    function foo() {
      tabWrap.style.left = (index - 1) * -322 + 'px';
    }

  })();

  return element;
}

function generateReply(replyData) {
  var replyHtml = `
  <div class="user-face">
    <a href="">
      <img src="http://localhost:10010/1.webp" alt="">
    </a>
  </div>
  <div class="comment-con">
    <div class="user">
      <a href="" class="name">up</a>
    </div>
    <p class="comment-text">${replyData.text}</p>
    <div class="user-info">
      <span class="floor">#1</span>
      <span class="time">1分钟前</span>
      <span class="like"><i></i>22</span>
      <span class="hate"><i></i>22</span>
      <span class="reply">回复</span>
      <div class="oper">
        <div class="more">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div class="oper-list">
          <ul style="display: none">
            <li class="blacklist">加入黑名单</li>
            <li class="report">举报</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="reply-box">
    </div>
  </div>`;

  var replyWrap = document.createElement("div");
  replyWrap.className = "reply-wrap";
  replyWrap.innerHTML = replyHtml;
  replyWrap.classList.add("list-item");

  var operBtn = replyWrap.querySelector(".oper .more");
  var operList = replyWrap.querySelector(".oper .oper-list ul");
  operBtn.addEventListener("click", function(event) {
    event.stopPropagation();
    operList.style.display = "block";
  });
  operList.addEventListener("click", function(event) {
    event.stopPropagation();
  });
  document.addEventListener("click", function() {
    operList.style.display = "none";
  });

  var replyBtn = replyWrap.querySelector(".reply");
  var replyBox = replyWrap.querySelector(".reply-box");
  replyBtn.addEventListener("click", function() {
    replyBox.append(generateSend());
  });

  return replyWrap;
}

(function() {
  var commentModule = document.querySelector(".comment-module");
  var sendElement = generateSend();
  var commentList = document.querySelector(".comment-module .comment-list");
  var loading = document.querySelector(".comment-module .comment-loading");

  var getData = true;

  if (getData) {
    commentModule.removeChild(loading);
    commentModule.appendChild(generateEmojiBox());
    comment.insertBefore(generateSend(), commentList);
  }
})();
