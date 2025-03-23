"use strict";
const utils_tool = require("../../utils/tool.js");
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "goods-item",
  data() {
    return {};
  },
  methods: {
    formatMillisecondsToDate: utils_tool.formatMillisecondsToDate
  },
  props: {
    item: {
      type: Object,
      default() {
        return {};
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($props.item.goods_name),
    b: common_vendor.t($props.item.goods_price),
    c: common_vendor.t($props.item.goods_sn || "未添加"),
    d: common_vendor.t($options.formatMillisecondsToDate($props.item.last_modify_date))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ce82559b"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/goods-item/goods-item.js.map
