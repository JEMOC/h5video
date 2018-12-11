require("../css/comment.css");
const emojiData = require("../emoji.json");


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
    mini, {
      top: btnTop - 40,
      opacity: 1
    },
    2,
    60,
    function () {
      console.log("finish");
      setTimeout(function () {
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
  var emojiBox = document.querySelector(".comment-module .emoji-box");

  emojiBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    emojiBox.style.display = "block";

    textarea.focus();
    textarea.parentNode.classList.add("focus");

    var element = this;
    var top = 0;
    var left = 0;
    while (element != comment) {
      top += element.offsetTop;
      left += element.offsetLeft;

      element = element.parentNode;
    }

    emojiBox.style.left = left + "px";
    emojiBox.style.top = top + this.offsetHeight + 3 + "px";

    var slider = emojiBox.querySelector(".emoji-tab-slider");
    var tabLinks = emojiBox.querySelectorAll(".tab-link");

    if (hasClass(send.parentNode, "reply-box")) {
      slider.style.display = "none";
      tabLinks.forEach(function (element, key) {
        if (key == 0) {
          element.click();
        } else {
          element.style.display = "none";
        }
      });
    } else {
      slider.style.display = "block";
      tabLinks.forEach(function (element) {
        element.style.display = "block";
      });
    }
  });

  document.addEventListener("click", function () {
    var emojiBox = document.querySelector(".comment-module .emoji-box");
    emojiBox.style.display = "none";
    document.querySelectorAll(".textarea-container").forEach(function (element) {
      element.classList.remove("focus");
    });
  });

  btn.addEventListener("click", function () {
    var text = textarea.value;
    console.log(textarea.value);

    if (text.length > 2) {
      var data = {
        text
      };
      var reply;

      if (hasClass(send.parentNode, "reply-box")) {
        reply = generateReply(data, false);
        send.parentNode.appendChild(reply);
        send.parentNode.removeChild(send);
      } else {
        reply = generateReply(data);
        textarea.value = "";
        commentList.appendChild(reply);
      }
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

  var boxTitle = element.querySelector(".emoji-title");
  var boxWrap = element.querySelector(".emoji-wrap");
  var tabWrap = element.querySelector(".emoji-tab-wrap");

  for (let key in emojiData) {
    var tab = document.createElement("a");
    tab.className = "tab-link";
    tab.title = key;

    var img = document.createElement("img");
    img.src = `/emoji/base/${emojiData[key].icon}`;
    tab.appendChild(img);

    tab.addEventListener('click', function () {
      var links = tabWrap.querySelectorAll(".tab-link");

      links.forEach(function (link) {
        link.classList.remove("on");
      });

      this.classList.add("on");

      boxTitle.innerHTML = key;
      boxWrap.innerHTML = "";

      var data = emojiData[key].data;

      for (let title in data) {
        var emojiList = document.createElement("a");
        emojiList.className = "emoji-list";
        emojiList.setAttribute("emoji-data-text", title);

        emojiList.addEventListener("click", function () {
          var textarea = document.querySelector(
            ".textarea-container.focus textarea"
          );
          var box = document.querySelector(".emoji-box");
          textarea.value += this.getAttribute("emoji-data-text");
          textarea.focus();
          box.style.display = "none";
        });

        if (key === "颜文字") {
          emojiList.classList.add("emoji-text");
          emojiList.innerHTML = data[title];
        } else {
          emojiList.classList.add("emoji-icon");

          var img = document.createElement("img");
          img.src = `/emoji/${key}/${data[title]}`;
          img.title = title;

          emojiList.appendChild(img);
        }

        boxWrap.appendChild(emojiList);
      }
    })
    tabWrap.appendChild(tab);
    element.querySelector('.tab-link').click();
  }

  element.addEventListener("click", function (event) {
    event.stopPropagation();
  });

  (function () {
    var tabWrap = element.querySelector(".emoji-tab-wrap");
    var prevBtn = element.querySelector(".emoji-tab-slider .prev");
    var nextBtn = element.querySelector(".emoji-tab-slider .next");

    var length = Object.keys(emojiData).length;
    var width = length * 46;
    var index = 1;
    var page = Math.ceil(width / 322);

    tabWrap.style.width = width + "px";

    if (page > 1) {
      nextBtn.classList.add("on");
    }

    foo();

    prevBtn.addEventListener("click", function () {
      index--;
      foo();
    });

    nextBtn.addEventListener("click", function () {
      index++;
      foo();
    });

    function foo() {
      if (index <= 1) {
        index = 1;
        prevBtn.classList.remove("on");
      }

      if (index < page) {
        nextBtn.classList.add("on");
      }

      if (index >= page) {
        index = page;
        nextBtn.classList.remove("on");
      }

      if (index > 1) {
        prevBtn.classList.add("on");
      }
      tabWrap.style.left = (index - 1) * -322 + "px";
    }
  })();

  return element;
}

function generateReply(replyData, state = true) {
  var replyWrap = document.createElement("div");
  var replyHtml = "";
  replyWrap.className = "reply-wrap";

  var text = replyData.text;


  if (state) {

    replyWrap.classList.add("list-item");

    var reg = /\[\S+?\]/g;

    if (reg.test(text)) {
      var es = text.match(reg);

      es.forEach(function (e) {
        var title = e.split('_')[0].replace('[', '');
        var src = emojiData[title].data[e];
        text = text.replace(e, `<img src="/emoji/${title}/${src}"></img>`);
      })

    }


    replyHtml = `
    <div class="user-face">
      <a href="">
        <img src="http://localhost:10010/1.webp" alt="">
      </a>
    </div>
    <div class="comment-con">
      <div class="user">
        <a href="" class="name">up</a>
      </div>
      <p class="comment-text">${text}</p>
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

    replyWrap.innerHTML = replyHtml;

    var replyBtn = replyWrap.querySelector(".reply");
    var replyBox = replyWrap.querySelector(".reply-box");
    replyBtn.addEventListener("click", function () {
      var send = replyBox.querySelector(".comment-send");
      if (send) {
        replyBox.removeChild(send);
        replyWrap.classList.remove("reply-on");
      } else {
        var listItem = document.querySelectorAll(".list-item");

        listItem.forEach(function (element) {
          element.classList.remove("reply-on");
          var box = element.querySelector(".reply-box");
          var send = box.querySelector(".comment-send");
          if (send) {
            box.removeChild(send);
          }
        });
        replyBox.append(generateSend());
        replyWrap.classList.add("reply-on");
      }
    });
  } else {
    replyWrap.classList.add("reply-item");
    replyHtml = `
    <a href="" class="reply-face">
      <img src="http://localhost:10010/1.webp" alt="">
    </a>
    <div class="reply-con">
      <div class="user-con">
        <div class="user">
          <a href="" class="name">up</a>
          <a href="" class="level"><i></i></a>
          <span class="reply-text">${replyData.text}</span>
        </div>
      </div>
      <div class="user-info">
        <span class="time">1分钟前</span>
        <span class="like"><i></i></span>
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
    </div>`;

    replyWrap.innerHTML = replyHtml;
  }

  var operBtn = replyWrap.querySelector(".oper .more");
  var operList = replyWrap.querySelector(".oper .oper-list ul");
  operBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    operList.style.display = "block";
  });
  operList.addEventListener("click", function (event) {
    event.stopPropagation();
  });
  document.addEventListener("click", function () {
    operList.style.display = "none";
  });

  return replyWrap;
}

function generateIndex() {

}

(function () {
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

(function () {
  var page = 100;
  var index = 1;

  var bottom = document.querySelector('.bottom-page');

  function generagePage() {
    var innerHtml = '';

    bottom.innerHTML = innerHtml;

    if (index != 1) {
      innerHtml += '<a class="prev">上一页</a>';
    }

    if (index - 4 > 0) {
      innerHtml += '<a class="tcd-number">1</a>';

      if (index - 4 <= 2) {
        var num = index - 4;
        for (let i = num; i > 0; i--) {
          innerHtml += `<a class="tcd-number">${index - 2 - i}</a>`;
        }
      } else {
        innerHtml += '<span class="dian">...</span>';
      }

      if (index == page) {
        innerHtml += `<a class="tcd-number">${page - 3}</a>`
      }

    } else {
      if (index > 3) {
        innerHtml += '<a class="tcd-number">1</a>';
      }

    }




    for (let i = -2; i <= 2; i++) {
      if (i == 0) {
        innerHtml += `<span class="current">${index}</span>`
      } else {
        var t = index + i;
        // console.log(t);
        if ((t < 1) || (t > page)) {
          // ex.push(i);
        } else {
          innerHtml += `<a class="tcd-number">${t}</a>`
        }
      }
    }

    if (index + 3 <= page) {
      if (index == 1) {
        innerHtml += '<a class="tcd-number">4</a>';
      }
      if (page - index - 2 <= 2) {
        var num = page - index - 2;
        for (let i = 1; i <= num; i++) {
          innerHtml += `<a class="tcd-number">${index + 2 + i}</a>`;
        }
      } else {
        innerHtml += `<span class="dian">...</span><a class="tcd-number">${page}</a>`;
      }
    }



    if (index != page) {
      innerHtml += '<a class="next">下一页</a>';
    }


    innerHtml += `
    <div class="page-jump">
    共<span>${page}</span>页, 跳至<input type="text">页
    </div>
    `

    bottom.innerHTML = innerHtml;

    var tcd = bottom.querySelectorAll('.tcd-number');
    tcd.forEach(function (el) {
      el.addEventListener('click', function () {
        index = parseInt(this.innerHTML);
        // console.log(this.innerHTML);
        generagePage();
      })
    });

    var prev = bottom.querySelector('.prev');
    console.log(prev);
    if (prev) {
      prev.addEventListener('click', function () {
        console.log('prev');
        index--;
        generagePage();
      })
    }

    var next = bottom.querySelector('.next');
    if (next) {
      next.addEventListener('click', function () {
        index++;
        generagePage();
      })
    }
  }




  generagePage();


})()