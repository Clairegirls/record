// 获取URL查询字符串中某个参数的值
function ____getQueryString(paramName) {
  var b = new RegExp("(^|&)" + paramName + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(b);
  if (r != null) return unescape(r[2]);
  return null
}

// 诸葛（埋点）
(function () {
  if (window.zhuge) return;
  window.zhuge = [];
  window.zhuge.methods = "_init identify track trackRevenue getDid getSid getKey setSuperProperty setUserProperties setWxProperties setPlatform".split(" ");
  window.zhuge.factory = function (b) {
    return function () {
      var a = Array.prototype.slice.call(arguments);
      a.unshift(b);
      window.zhuge.push(a);
      return window.zhuge;
    }
  };
  for (var i = 0; i < window.zhuge.methods.length; i++) {
    var key = window.zhuge.methods[i];
    window.zhuge[key] = window.zhuge.factory(key);
  }
  window.zhuge.load = function (b, x) {
    if (!document.getElementById("zhuge-js")) {
      var a = document.createElement("script");
      var verDate = new Date();
      var verStr = verDate.getFullYear().toString() + verDate.getMonth().toString() + verDate.getDate().toString();

      a.type = "text/javascript";
      a.id = "zhuge-js";
      a.async = !0;
      // a.src = "https://io-data.immelo.com/zhuge.js?v=" + verStr;
      a.src = "/common/js/zhugeSdk.js?v=202210241916";
      a.onerror = function () {
        window.zhuge.identify = window.zhuge.track = function (ename, props, callback) {
          if (callback && Object.prototype.toString.call(callback) === '[object Function]') {
            callback();
          } else if (Object.prototype.toString.call(props) === '[object Function]') {
            props();
          }
        };
      };
      var c = document.getElementsByTagName("script")[0];
      c.parentNode.insertBefore(a, c);
      window.zhuge._init(b, x)
    }
  };
  // fa991b421a634f43bb7f4d917cead76e 花茶
  // b7a7ffd5ab9e42068b61f4dcc194dd78 海外 melo tandoo
  window.zhuge.load('b7a7ffd5ab9e42068b61f4dcc194dd78', { //配置应用的AppKey
    superProperty: { //全局的事件属性(选填)
      '应用名称': '数据分析'
    },
    // debug: true,
    adTrack: false, //广告监测开关，默认为false
    zsee: false, //视屏采集开关， 默认为false
    duration: true, // 页面停留时长采集，默认false
    autoTrack: false, //启用全埋点采集（选填，默认false）
    singlePage: false //是否是单页面应用（SPA），启用autoTrack后生效（选填，默认false）
  });
  // 识别用户
  var uid = ____getQueryString('uid')
  if (uid) {
    window.zhuge.identify(uid);
  }
})();
