const { SITE_URL, TITLE } = require("../../config.js");

// 只允许打开本站路径，防止分享参数被用来打开其他地址
function safePath(value) {
  const path = decodeURIComponent(value || "/");
  return path.charAt(0) === "/" && path.charAt(1) !== "/" ? path : "/";
}

Page({
  data: { url: SITE_URL + "/" },

  onLoad(options) {
    this.setData({ url: SITE_URL + safePath(options.path) });
  },

  // 分享时带上 H5 当前页面路径，好友打开后直达同一件作品
  onShareAppMessage(options) {
    const current = (options && options.webViewUrl) || this.data.url;
    const path = current.indexOf(SITE_URL) === 0 ? current.slice(SITE_URL.length) || "/" : "/";
    return {
      title: TITLE,
      path: "/pages/index/index?path=" + encodeURIComponent(path)
    };
  }
});
