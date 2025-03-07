"use strict";
const common_vendor = require("../../common/vendor.js");
const uni_modules_uniIdPages_common_store = require("../../uni_modules/uni-id-pages/common/store.js");
const common_assets = require("../../common/assets.js");
const goodsInfoObj = common_vendor.er.importObject("goodsInfoObj");
const _sfc_main = {
  data() {
    return {
      goodsList: [],
      scanning: false,
      lastScanTime: 0
    };
  },
  computed: {
    totalPrice() {
      return this.goodsList.reduce((total, item) => {
        return total + item.goods_price * item.quantity;
      }, 0).toFixed(2);
    }
  },
  methods: {
    checkLogin() {
      if (!uni_modules_uniIdPages_common_store.store.hasLogin) {
        common_vendor.index.navigateTo({
          url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd"
        });
        return false;
      }
      return true;
    },
    // 添加限流处理方法
    handleScanWithThrottle(e) {
      if (!this.checkLogin()) {
        return;
      }
      common_vendor.index.__f__("log", "at pages/complate/complate.vue:120", "扫码结果：", e.detail.result);
      const currentTime = Date.now();
      if (this.scanning) {
        return;
      }
      if (currentTime - this.lastScanTime < 2e3) {
        return;
      }
      common_vendor.index.__f__("log", "at pages/complate/complate.vue:129", "整备调用");
      this.lastScanTime = currentTime;
      this.handleScan(e);
    },
    async handleScan(e) {
      if (this.scanning)
        return;
      this.scanning = true;
      try {
        const code = e.detail.result;
        common_vendor.index.__f__("log", "at pages/complate/complate.vue:143", "handleScan", code);
        const existingItem = this.goodsList.find((item) => item.goods_sn === code);
        if (existingItem) {
          const index = this.goodsList.indexOf(existingItem);
          this.updateQuantity(index, 1);
          this.scanning = false;
          return;
        }
        const res = await goodsInfoObj.findGoods(code);
        if (res.code === 0) {
          const goods = res.data;
          this.goodsList.unshift({
            ...goods,
            quantity: 1,
            isNew: true
          });
          setTimeout(() => {
            this.goodsList[0].isNew = false;
          }, 500);
        } else {
          common_vendor.index.showToast({
            title: "商品不存在",
            icon: "error"
          });
        }
      } catch (e2) {
        common_vendor.index.showToast({
          title: "扫描失败",
          icon: "error"
        });
      } finally {
        this.scanning = false;
      }
    },
    updateQuantity(index, change) {
      const newQuantity = this.goodsList[index].quantity + change;
      if (newQuantity < 1)
        return;
      this.goodsList[index].quantity = newQuantity;
    },
    removeItem(index) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除该商品吗？",
        success: (res) => {
          if (res.confirm) {
            this.goodsList.splice(index, 1);
          }
        }
      });
    },
    showClearConfirm() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要清空所有商品吗？",
        success: (res) => {
          if (res.confirm) {
            this.goodsList = [];
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.handleScanWithThrottle && $options.handleScanWithThrottle(...args)),
    b: $data.goodsList.length > 0
  }, $data.goodsList.length > 0 ? {
    c: common_vendor.f($data.goodsList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.goods_name),
        b: common_vendor.t(item.goods_price),
        c: common_vendor.o(($event) => $options.updateQuantity(index, -1), index),
        d: item.quantity <= 1 ? 1 : "",
        e: common_vendor.t(item.quantity),
        f: common_vendor.o(($event) => $options.updateQuantity(index, 1), index),
        g: common_vendor.o(($event) => $options.removeItem(index), index),
        h: index,
        i: item.isNew ? 1 : ""
      };
    })
  } : {
    d: common_assets._imports_0
  }, {
    e: $data.goodsList.length > 0
  }, $data.goodsList.length > 0 ? {
    f: common_vendor.o((...args) => $options.showClearConfirm && $options.showClearConfirm(...args))
  } : {}, {
    g: common_vendor.t($options.totalPrice),
    h: $data.goodsList.length > 0 ? 1 : ""
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/complate/complate.js.map
