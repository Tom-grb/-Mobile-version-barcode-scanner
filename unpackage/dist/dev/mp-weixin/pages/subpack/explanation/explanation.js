"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      imageUrl: "https://env-00jxt6l7w3we.normal.cloudstatic.cn/showPic/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-03-21%20203123.png",
      tableBody: [
        {
          name: "商品条形码 (选填)",
          desc: "用于唯一标识商品的条形码信息。用于商品的识别操作。",
          isBold: true
        },
        {
          name: "商品名称 (必填)",
          desc: "商品的具体名称，方便直观地了解商品内容。",
          isBold: true
        },
        {
          name: "商品价格 (必填，填数字且大于等于零)",
          desc: "记录商品的销售价格信息。",
          isBold: true
        },
        {
          name: "商品数量 (选填，填数字且大于等于零)",
          desc: "记录商品的数量。",
          isBold: true
        },
        {
          name: "商品备注 (选填)",
          desc: "可填写关于商品的额外信息，如商品的特性、使用说明、注意事项等补充内容。",
          isBold: true
        }
      ]
    };
  },
  methods: {
    copyText() {
      common_vendor.index.setClipboardData({
        data: "https://env-00jxt6l7w3we.normal.cloudstatic.cn/model/ImportModel2.xlsx",
        success() {
          common_vendor.index.showToast({
            title: "复制成功",
            icon: "none"
          });
        },
        fail(err) {
          common_vendor.index.showToast({
            title: "复制失败",
            icon: "none"
          });
          common_vendor.index.__f__("error", "at pages/subpack/explanation/explanation.vue:94", "复制失败", err);
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.copyText && $options.copyText(...args)),
    b: $data.imageUrl,
    c: common_vendor.f($data.tableBody, (row, index, i0) => {
      return {
        a: common_vendor.t(row.name),
        b: row.isBold ? 1 : "",
        c: common_vendor.t(row.desc),
        d: index
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/subpack/explanation/explanation.js.map
