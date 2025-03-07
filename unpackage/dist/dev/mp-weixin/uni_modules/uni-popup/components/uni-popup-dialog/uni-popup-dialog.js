"use strict";
const uni_modules_uniPopup_components_uniPopup_popup = require("../uni-popup/popup.js");
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uniPopup_components_uniPopup_i18n_index = require("../uni-popup/i18n/index.js");
const {
  t
} = common_vendor.initVueI18n(uni_modules_uniPopup_components_uniPopup_i18n_index.messages);
const _sfc_main = {
  name: "uniPopupDialog",
  mixins: [uni_modules_uniPopup_components_uniPopup_popup.popup],
  emits: ["confirm", "close", "update:modelValue", "input"],
  props: {
    inputType: {
      type: String,
      default: "text"
    },
    showClose: {
      type: Boolean,
      default: true
    },
    modelValue: {
      type: [Number, String],
      default: ""
    },
    placeholder: {
      type: [String, Number],
      default: ""
    },
    type: {
      type: String,
      default: "error"
    },
    mode: {
      type: String,
      default: "base"
    },
    title: {
      type: String,
      default: ""
    },
    content: {
      type: String,
      default: ""
    },
    beforeClose: {
      type: Boolean,
      default: false
    },
    cancelText: {
      type: String,
      default: ""
    },
    confirmText: {
      type: String,
      default: ""
    },
    maxlength: {
      type: Number,
      default: -1
    },
    focus: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dialogType: "error",
      val: ""
    };
  },
  computed: {
    okText() {
      return this.confirmText || t("uni-popup.ok");
    },
    closeText() {
      return this.cancelText || t("uni-popup.cancel");
    },
    placeholderText() {
      return this.placeholder || t("uni-popup.placeholder");
    },
    titleText() {
      return this.title || t("uni-popup.title");
    }
  },
  watch: {
    type(val) {
      this.dialogType = val;
    },
    mode(val) {
      if (val === "input") {
        this.dialogType = "info";
      }
    },
    value(val) {
      if (this.maxlength != -1 && this.mode === "input") {
        this.val = val.slice(0, this.maxlength);
      } else {
        this.val = val;
      }
    },
    val(val) {
      this.$emit("update:modelValue", val);
    }
  },
  created() {
    this.popup.disableMask();
    if (this.mode === "input") {
      this.dialogType = "info";
      this.val = this.value;
      this.val = this.modelValue;
    } else {
      this.dialogType = this.type;
    }
  },
  methods: {
    /**
     * 点击确认按钮
     */
    onOk() {
      if (this.mode === "input") {
        this.$emit("confirm", this.val);
      } else {
        this.$emit("confirm");
      }
      if (this.beforeClose)
        return;
      this.popup.close();
    },
    /**
     * 点击取消按钮
     */
    closeDialog() {
      this.$emit("close");
      if (this.beforeClose)
        return;
      this.popup.close();
    },
    close() {
      this.popup.close();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($options.titleText),
    b: common_vendor.n("uni-popup__" + $data.dialogType),
    c: $props.mode === "base"
  }, $props.mode === "base" ? {
    d: common_vendor.t($props.content)
  } : {
    e: $props.maxlength,
    f: $props.inputType,
    g: $options.placeholderText,
    h: $props.focus,
    i: $data.val,
    j: common_vendor.o(($event) => $data.val = $event.detail.value)
  }, {
    k: $props.showClose
  }, $props.showClose ? {
    l: common_vendor.t($options.closeText),
    m: common_vendor.o((...args) => $options.closeDialog && $options.closeDialog(...args))
  } : {}, {
    n: common_vendor.t($options.okText),
    o: common_vendor.n($props.showClose ? "uni-border-left" : ""),
    p: common_vendor.o((...args) => $options.onOk && $options.onOk(...args))
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog.js.map
