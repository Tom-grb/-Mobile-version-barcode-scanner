"use strict";
const common_vendor = require("../../common/vendor.js");
const goodsCloudObj = common_vendor.er.importObject("goodsInfoObj");
const _sfc_main = {
  data() {
    return {
      goodsList: [],
      // 存储商品列表数据
      page: 1,
      // 当前页码
      pageSize: 20,
      // 每页数据量
      isLoading: false,
      // 是否正在加载数据
      isNoMore: false,
      // 是否已经没有更多数据
      showPopup: false,
      currentGoods: {}
    };
  },
  onLoad() {
    this.getGoods();
  },
  onPullDownRefresh() {
    common_vendor.index.__f__("log", "at pages/list/list.vue:44", 123);
    this.page = 1;
    this.pageSize = 20;
    this.goodsList = [];
    this.isNoMore = false;
    this.getGoods();
  },
  onReachBottom() {
    common_vendor.index.__f__("log", "at pages/list/list.vue:52", "bottom");
    this.getGoods();
  },
  methods: {
    async getGoods() {
      if (this.isLoading || this.isNoMore) {
        return;
      }
      this.isLoading = true;
      const result = await goodsCloudObj.getGoodsList({
        page: this.page,
        pageSize: this.pageSize
      });
      if (result.code === 0) {
        if (result.data.length < this.pageSize) {
          this.isNoMore = true;
        }
        this.goodsList = [...this.goodsList, ...result.data];
        this.page++;
      } else if (result.code === -1) {
        common_vendor.index.showToast({
          title: "未登录/登录过期",
          icon: "none"
        });
        setTimeout(() => {
          common_vendor.index.navigateTo({
            url: "/uni_modules/uni-id-pages/pages/login/login-withoutpwd"
          });
        }, 1e3);
        return;
      } else {
        common_vendor.index.showToast({
          title: result.msg,
          icon: "none"
        });
      }
      common_vendor.index.stopPullDownRefresh();
      this.isLoading = false;
    },
    showGoodsDetail(goods) {
      this.currentGoods = goods;
      this.showPopup = true;
    },
    refreshList() {
      this.page = 1;
      this.pageSize = 20;
      this.goodsList = [];
      this.isNoMore = false;
      this.getGoods();
      this.showPopup = false;
    }
  }
};
if (!Array) {
  const _easycom_goods_item2 = common_vendor.resolveComponent("goods-item");
  const _easycom_goods_popup2 = common_vendor.resolveComponent("goods-popup");
  (_easycom_goods_item2 + _easycom_goods_popup2)();
}
const _easycom_goods_item = () => "../../components/goods-item/goods-item.js";
const _easycom_goods_popup = () => "../../components/goods-popup/goods-popup.js";
if (!Math) {
  (_easycom_goods_item + _easycom_goods_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.goodsList.length > 0
  }, $data.goodsList.length > 0 ? common_vendor.e({
    b: common_vendor.f($data.goodsList, (item, k0, i0) => {
      return {
        a: "21ffa888-0-" + i0,
        b: common_vendor.p({
          item
        }),
        c: item._id,
        d: common_vendor.o(($event) => $options.showGoodsDetail(item), item._id)
      };
    }),
    c: $data.isLoading
  }, $data.isLoading ? {} : {}) : {}, {
    d: common_vendor.o(($event) => $data.showPopup = $event),
    e: common_vendor.o($options.refreshList),
    f: common_vendor.p({
      show: $data.showPopup,
      goods: $data.currentGoods
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/list/list.js.map
