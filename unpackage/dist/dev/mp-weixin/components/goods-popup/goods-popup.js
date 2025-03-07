"use strict";
const common_vendor = require("../../common/vendor.js");
const goodsInfoObj = common_vendor.er.importObject("goodsInfoObj");
const _sfc_main = {
  name: "goods-popup",
  props: {
    show: {
      type: Boolean,
      default: false
    },
    goods: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      isEditing: false,
      localGoods: {}
    };
  },
  watch: {
    goods: {
      handler(newVal) {
        this.localGoods = JSON.parse(JSON.stringify(newVal));
      },
      immediate: true
    }
  },
  methods: {
    cancel() {
      this.isEditing = false;
      this.$emit("update:show", false);
    },
    handleEdit() {
      this.isEditing = true;
    },
    handleCancel() {
      this.isEditing = false;
      this.localGoods = JSON.parse(JSON.stringify(this.goods));
    },
    async handleConfirm() {
      try {
        this.localGoods.goods_price = parseFloat(this.localGoods.goods_price);
        common_vendor.index.__f__("log", "at components/goods-popup/goods-popup.vue:92", "this.localGoods.goods_price", this.localGoods.goods_price);
        if (isNaN(this.localGoods.goods_price) || this.localGoods.goods_price < 0) {
          common_vendor.index.showToast({
            title: "价格要求为数字且大于0",
            icon: "none"
          });
          return;
        }
        await goodsInfoObj.updateGoods(this.localGoods);
        this.isEditing = false;
        this.$emit("refresh");
      } catch (e) {
        common_vendor.index.showToast({
          title: "更新失败",
          icon: "error"
        });
      }
    },
    async handleDelete() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除该商品吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              await goodsInfoObj.removeGoods({
                _id: this.goods._id
              });
              common_vendor.index.showToast({
                title: "删除成功",
                icon: "success"
              });
              this.cancel();
              this.$emit("refresh");
            } catch (e) {
              common_vendor.index.showToast({
                title: "删除失败",
                icon: "error"
              });
            }
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.show
  }, $props.show ? common_vendor.e({
    b: common_vendor.o((...args) => $options.cancel && $options.cancel(...args)),
    c: $data.isEditing
  }, $data.isEditing ? {
    d: $data.localGoods.goods_sn,
    e: common_vendor.o(($event) => $data.localGoods.goods_sn = $event.detail.value)
  } : {
    f: common_vendor.t($props.goods.goods_sn || "暂未填写")
  }, {
    g: $data.isEditing
  }, $data.isEditing ? {
    h: $data.localGoods.goods_name,
    i: common_vendor.o(($event) => $data.localGoods.goods_name = $event.detail.value)
  } : {
    j: common_vendor.t($props.goods.goods_name)
  }, {
    k: $data.isEditing
  }, $data.isEditing ? {
    l: $data.localGoods.goods_price,
    m: common_vendor.o(($event) => $data.localGoods.goods_price = $event.detail.value)
  } : {
    n: common_vendor.t($props.goods.goods_price)
  }, {
    o: $data.isEditing
  }, $data.isEditing ? {
    p: $data.localGoods.goods_notes,
    q: common_vendor.o(($event) => $data.localGoods.goods_notes = $event.detail.value)
  } : {
    r: common_vendor.t($props.goods.goods_notes || "暂无备注")
  }, {
    s: !$data.isEditing
  }, !$data.isEditing ? {
    t: common_vendor.o((...args) => $options.handleEdit && $options.handleEdit(...args))
  } : {
    v: common_vendor.o((...args) => $options.handleConfirm && $options.handleConfirm(...args)),
    w: common_vendor.o((...args) => $options.handleCancel && $options.handleCancel(...args))
  }, {
    x: common_vendor.o((...args) => $options.handleDelete && $options.handleDelete(...args)),
    y: common_vendor.o(() => {
    }),
    z: common_vendor.o((...args) => $options.cancel && $options.cancel(...args))
  }) : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/goods-popup/goods-popup.js.map
