"use strict";
const common_vendor = require("../../common/vendor.js");
const goodsInfoObj = common_vendor.er.importObject("goodsInfoObj");
const _sfc_main = {
  data() {
    return {
      showGoodsPopup: false,
      currentGoods: {},
      newGoods: {
        goods_name: "",
        goods_price: "",
        goods_notes: "",
        goods_sn: "",
        goods_num: ""
      }
    };
  },
  methods: {
    onShareAppMessage(res) {
      common_vendor.index.__f__("log", "at pages/home/home.vue:71", res);
      if (res.from === "menu") {
        return {
          title: "我的物品录",
          path: "/pages/home/home",
          imageUrl: "https://env-00jxt6l7w3we.normal.cloudstatic.cn/showPic/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-03-02%20170114.png"
        };
      }
    },
    onShareTimeline() {
      return {
        title: "我的物品录",
        imageUrl: "https://env-00jxt6l7w3we.normal.cloudstatic.cn/showPic/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-03-02%20170114.png"
      };
    },
    gotoLogin() {
      common_vendor.index.navigateTo({
        url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd"
      });
    },
    goToSearch() {
      common_vendor.index.navigateTo({
        url: "/pages/home/search"
      });
    },
    popopen() {
      this.$refs.addPopup.open();
      this.newGoods = {
        goods_name: "",
        goods_price: "",
        goods_notes: "",
        goods_sn: "",
        goods_num: ""
      };
    },
    async startScan() {
      try {
        const res = await common_vendor.index.scanCode({
          scanType: ["barCode", "qrCode"]
        });
        this.handleScanResult(res.result);
      } catch (e) {
        common_vendor.index.showToast({
          title: "扫描失败",
          icon: "error"
        });
      }
    },
    async handleScanResult(code) {
      try {
        const res = await goodsInfoObj.findGoods(code);
        if (res.code === 0) {
          this.currentGoods = res.data;
          this.showGoodsPopup = true;
        } else if (res.code === -1) {
          common_vendor.index.showToast({
            title: "未登录/登录过期",
            icon: "none"
          });
          setTimeout(() => {
            this.gotoLogin();
          }, 1e3);
          return;
        } else {
          this.newGoods.goods_sn = code;
          common_vendor.index.showModal({
            title: "提示",
            content: "没有该商品信息，是否添加？",
            success: (res2) => {
              if (res2.confirm) {
                this.$refs.addPopup.open();
              }
            }
          });
        }
      } catch (e) {
        common_vendor.index.showToast({
          title: "获取商品信息失败",
          icon: "error"
        });
      }
    },
    async confirmAdd() {
      try {
        this.newGoods.goods_price = parseFloat(this.newGoods.goods_price);
        if (isNaN(this.newGoods.goods_price) || this.newGoods.goods_price < 0) {
          common_vendor.index.showToast({
            title: "价格要求为数字且大于0",
            icon: "none"
          });
          return;
        }
        const res = await goodsInfoObj.addGoods(this.newGoods);
        if (res.code === -1) {
          common_vendor.index.showToast({
            title: "未登录/登录过期",
            icon: "none"
          });
          setTimeout(() => {
            this.gotoLogin();
          }, 1e3);
          return;
        } else {
          common_vendor.index.showToast({
            title: "添加成功",
            icon: "success"
          });
        }
        this.$refs.addPopup.close();
        this.newGoods = {
          goods_name: "",
          goods_price: "",
          goods_notes: "",
          goods_sn: "",
          goods_num: ""
        };
      } catch (e) {
        common_vendor.index.showToast({
          title: "添加失败",
          icon: "error"
        });
      }
    },
    closeAddPopup() {
      this.$refs.addPopup.close();
      this.newGoods = {
        goods_name: "",
        goods_price: "",
        goods_notes: "",
        goods_sn: "",
        goods_num: ""
      };
    },
    refreshGoods() {
      this.handleScanResult(this.currentGoods.goods_sn);
    }
  }
};
if (!Array) {
  const _easycom_goods_popup2 = common_vendor.resolveComponent("goods-popup");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_goods_popup2 + _easycom_uni_popup2)();
}
const _easycom_goods_popup = () => "../../components/goods-popup/goods-popup.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_goods_popup + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.goToSearch && $options.goToSearch(...args)),
    b: common_vendor.o((...args) => $options.startScan && $options.startScan(...args)),
    c: common_vendor.o((...args) => $options.popopen && $options.popopen(...args)),
    d: common_vendor.o(($event) => $data.showGoodsPopup = $event),
    e: common_vendor.o($options.refreshGoods),
    f: common_vendor.p({
      show: $data.showGoodsPopup,
      goods: $data.currentGoods
    }),
    g: common_vendor.o((...args) => $options.closeAddPopup && $options.closeAddPopup(...args)),
    h: $data.newGoods.goods_sn,
    i: common_vendor.o(($event) => $data.newGoods.goods_sn = $event.detail.value),
    j: $data.newGoods.goods_name,
    k: common_vendor.o(($event) => $data.newGoods.goods_name = $event.detail.value),
    l: $data.newGoods.goods_price,
    m: common_vendor.o(($event) => $data.newGoods.goods_price = $event.detail.value),
    n: $data.newGoods.goods_num,
    o: common_vendor.o(($event) => $data.newGoods.goods_num = $event.detail.value),
    p: $data.newGoods.goods_notes,
    q: common_vendor.o(($event) => $data.newGoods.goods_notes = $event.detail.value),
    r: common_vendor.o((...args) => $options.confirmAdd && $options.confirmAdd(...args)),
    s: common_vendor.sr("addPopup", "5b43d928-1"),
    t: common_vendor.p({
      type: "center"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
_sfc_main.__runtimeHooks = 6;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/home/home.js.map
