"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_tool = require("../../utils/tool.js");
const goodsInfoObj = common_vendor.er.importObject("goodsInfoObj");
const _sfc_main = {
  data() {
    return {
      searchKeyword: "",
      goodsList: [],
      pageSize: 10,
      page: 1,
      hasMore: true,
      searched: false,
      showPopup: false,
      currentGoods: {}
    };
  },
  methods: {
    formatMillisecondsToDate: utils_tool.formatMillisecondsToDate,
    goBack() {
      common_vendor.index.navigateBack();
    },
    clearSearch() {
      this.searchKeyword = "";
      this.goodsList = [];
      this.searched = false;
    },
    async handleSearch() {
      if (!this.searchKeyword.trim()) {
        common_vendor.index.showToast({
          title: "请输入搜索关键词",
          icon: "none"
        });
        return;
      }
      this.page = 1;
      this.hasMore = true;
      this.searched = true;
      await this.searchGoods();
    },
    async searchGoods() {
      try {
        const res = await goodsInfoObj.searchGoods({
          keyword: this.searchKeyword,
          page: this.page,
          pageSize: this.pageSize
        });
        if (this.page === 1) {
          this.goodsList = res.data;
        } else {
          this.goodsList = [...this.goodsList, ...res.data];
        }
        this.hasMore = res.data.length === this.pageSize;
      } catch (e) {
        common_vendor.index.showToast({
          title: "搜索失败",
          icon: "error"
        });
      }
    },
    async loadMore() {
      if (!this.hasMore)
        return;
      this.page++;
      await this.searchGoods();
    },
    showGoodsDetail(goods) {
      this.currentGoods = goods;
      this.showPopup = true;
    },
    refreshList() {
      this.handleSearch();
      this.showPopup = false;
    }
  }
};
if (!Array) {
  const _easycom_goods_popup2 = common_vendor.resolveComponent("goods-popup");
  _easycom_goods_popup2();
}
const _easycom_goods_popup = () => "../../components/goods-popup/goods-popup.js";
if (!Math) {
  _easycom_goods_popup();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.handleSearch && $options.handleSearch(...args)),
    b: $data.searchKeyword,
    c: common_vendor.o(($event) => $data.searchKeyword = $event.detail.value),
    d: $data.searchKeyword
  }, $data.searchKeyword ? {
    e: common_vendor.o((...args) => $options.clearSearch && $options.clearSearch(...args))
  } : {}, {
    f: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    g: $data.goodsList.length > 0
  }, $data.goodsList.length > 0 ? common_vendor.e({
    h: common_vendor.f($data.goodsList, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.goods_name),
        b: common_vendor.t(item.goods_price),
        c: common_vendor.t(item.goods_sn),
        d: common_vendor.t($options.formatMillisecondsToDate(item.last_modify_date)),
        e: item._id,
        f: common_vendor.o(($event) => $options.showGoodsDetail(item), item._id)
      };
    }),
    i: $data.hasMore
  }, $data.hasMore ? {} : {}, {
    j: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args))
  }) : $data.searched ? {} : {}, {
    k: $data.searched,
    l: common_vendor.o(($event) => $data.showPopup = $event),
    m: common_vendor.o($options.refreshList),
    n: common_vendor.p({
      show: $data.showPopup,
      goods: $data.currentGoods
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/home/search.js.map
