// 将rgb颜色转成hex  输入(24,12,255)
export function colorRGB2Hex(r, g, b) {
  let hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  return hex;
}

//生成uuid
export function uuid() {
  const s = [];
  const hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.slice(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  const uuid = s.join("");
  return uuid;
}

//获取被卷去的高度
export function st() {
  return (
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop
  );
}

//获取屏幕自身的高度
export function wh() {
  return (
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight
  );
}

//获取可滚动的高度
export function sh() {
  return document.documentElement.scrollHeight || document.body.scrollHeight;
}

//取随机值
export const getRdNum = function (min, max) {
  return ~~(Math.random() * (max - min) + min);
};

export const addCommaToNum = function (num) {
  let res = "";
  let flag = false;
  const numArr = num.toString().split(".");
  //负号处理
  if (numArr[0].indexOf("-") !== -1) {
    flag = true;
  }
  try {
    numArr[0]
      .split("")
      .reverse()
      .forEach((item, index) => {
        res += item;
        if (flag && index + 1 === numArr[0].length - 1) {
          throw "over";
        }
        if ((index + 1) % 3 === 0 && index + 1 !== numArr[0].length) {
          res += ",";
        }
      });
  } catch (e) {
    console.log(e);
  }
  res = res.split("").reverse().join("");
  if (numArr[1]) {
    res += `.${numArr[1]}`;
  }
  if (flag) {
    res = "-" + res;
  }
  return res;
};

export const formatTimeToText = (time) => {
  let res = "";
  const dd = ~~(time / 60 / 60 / 24);
  const hh = checkTime(~~((time / 60 / 60) % 24));
  const mm = checkTime(~~((time / 60) % 60));
  const ss = checkTime(~~(time % 60));

  if (hh !== "00") {
    res = `${hh}:${mm}:${ss}`;
  } else {
    res = `${mm}:${ss}`;
  }

  return res;
};

//辅助格式化函数
export const checkTime = (index) => {
  if (index < 10) {
    index = "0" + index;
    //时间补零的操作
  }
  return index;
};

//计算进度条的值
export const computedProgressVal = (cur, total) => {
  return +(cur / total).toFixed(2);
};

export function fullScreen() {
  //全屏
  var docElm = document.documentElement; //W3C
  if (docElm.requestFullscreen) {
    docElm.requestFullscreen();
  } //FireFox
  else if (docElm.mozRequestFullScreen) {
    docElm.mozRequestFullScreen();
  } //Chrome等
  else if (docElm.webkitRequestFullScreen) {
    docElm.webkitRequestFullScreen();
  } //IE11
  else if (docElm.msRequestFullscreen) {
    docElm.msRequestFullscreen();
  }
}

export function outFullScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } //FireFox
  else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } //Chrome等
  else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen();
  } //IE11
  else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

const debounce = (cb, ms) => {
  let timer = null;
  return (...args) => {
    const clearTimer = () => {
      clearTimeout(timer);
      timer = null;
    };
    if (timer) {
      clearTimer();
    }

    timer = setTimeout(() => {
      cb.apply(this, args);
      clearTimer();
    }, ms);
  };
};

const throttle = (cb,ms) => {
    let flag = false
    return (...args) => {
        if(!flag) return
        flag = true
        const timer = setTimeout(() => {
            cb.apply(this, args);
            clearTimeout(timer);
            timer = null;
            flag = false
        }, ms);
    }
}


