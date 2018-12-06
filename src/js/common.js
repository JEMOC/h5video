function isArray(arg) {
  if (typeof arg === "object") {
    return Object.prototype.toString.call(arg) === "[object Array]";
  } else {
    false;
  }
}

function getStyle(element, attr) {
  if (getComputedStyle) {
    return getComputedStyle(element, null)[attr];
  } else {
    return element.currentStyle[attr] || 0;
  }
}


function animate(element, eventObj, time, fps, callback) {
  clearInterval(element.timer);
  element.timer = setInterval(function() {
    for (var attr in eventObj) {
      if (attr === "opacity") {
        var current = getStyle(element, attr) * 10;
        var target = eventObj[attr] * 10;
        var step = (target - current) / (time * fps);
        step = step > 0 ? Math.ceil(step) : Math.floor(step);
        current += step;
        element.style[attr] = current / 10;
      } else if (attr === "zIndex") {
        element.style[attr] = eventObj[attr];
      } else {
        var current = parseInt(getStyle(element, attr));
        var target = eventObj[attr];
        var step = (target - current) / (time * fps);
        step = step > 0 ? Math.ceil(step) : Math.floor(step);
        current += step;
        element.style[attr] = current + "px";
      }

      if (current == target) {
        clearInterval(element.timer);
        callback();
      }
    }
  }, 1000 / fps);
}


Date.prototype.format = function(fmt) {
  var o = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S": this.getMilliseconds(),
  };

  if(new RegExp(/(y+)/.test(fmt))){
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }

  for(var k in o) {
    if(new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr((""+ o[k]).length)));
    }
  }

  return fmt;
}

console.log(new Date().format("yyyy/MM/dd hh:mm:ss"));


function getPoint(obj) {
  var t = obj.offsetTop;
  var l = obj.offsetLeft;

  while ((obj = obj.offsetParent)) {
    t += obj.offsetTop;
    l += obj.offsetLeft;
  }
  return {
    top: t,
    left: l
  };
}

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

function hasClass(elem, cl) {
  var classList = Array.from(elem.classList);
  if (classList.indexOf(cl) >= 0) {
    return true;
  } else {
    return false;
  }
}

function scale16(elem) {
  var width = elem.offsetWidth;
  var height = (width * 9) / 16;
  return {
    width,
    height
  };
}

console.log('common.js')