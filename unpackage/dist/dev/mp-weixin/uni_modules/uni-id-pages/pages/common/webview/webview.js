"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const _sfc_main = {
  onLoad({ url, title }) {
    if (url.substring(0, 4) != "http") {
      common_vendor.index.showModal({
        title: "错误",
        content: '不是一个有效的网站链接,"' + url + '"',
        showCancel: false,
        confirmText: "知道了",
        complete: () => {
          common_vendor.index.navigateBack();
        }
      });
      title = "页面路径错误";
    } else {
      this.url = url;
    }
    if (title) {
      common_vendor.index.setNavigationBarTitle({ title });
    }
  },
  data() {
    return {
      url: null
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.url
  }, $data.url ? {
    b: $data.url
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/uni_modules/uni-id-pages/pages/common/webview/webview.js.map
