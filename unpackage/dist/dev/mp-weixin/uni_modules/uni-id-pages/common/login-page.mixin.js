"use strict";
const common_vendor = require("../../../common/vendor.js");
const uni_modules_uniIdPages_common_store = require("./store.js");
const uni_modules_uniIdPages_config = require("../config.js");
const mixin = {
  data() {
    return {
      config: uni_modules_uniIdPages_config.config,
      uniIdRedirectUrl: "",
      isMounted: false
    };
  },
  onUnload() {
  },
  mounted() {
    this.isMounted = true;
  },
  onLoad(e) {
    if (e.is_weixin_redirect) {
      common_vendor.index.showLoading({
        mask: true
      });
      if (window.location.href.includes("#")) {
        const paramsArr = window.location.href.split("?")[1].split("&");
        paramsArr.forEach((item) => {
          const arr = item.split("=");
          if (arr[0] == "code") {
            e.code = arr[1];
          }
        });
      }
      this.$nextTick((n) => {
        this.$refs.uniFabLogin.login({
          code: e.code
        }, "weixin");
      });
    }
    if (e.uniIdRedirectUrl) {
      this.uniIdRedirectUrl = decodeURIComponent(e.uniIdRedirectUrl);
    }
    if (getCurrentPages().length === 1) {
      common_vendor.index.hideHomeButton();
      common_vendor.index.__f__("log", "at uni_modules/uni-id-pages/common/login-page.mixin.js:52", "已隐藏：返回首页按钮");
    }
  },
  computed: {
    needAgreements() {
      if (this.isMounted) {
        if (this.$refs.agreements) {
          return this.$refs.agreements.needAgreements;
        } else {
          return false;
        }
      }
    },
    agree: {
      get() {
        if (this.isMounted) {
          if (this.$refs.agreements) {
            return this.$refs.agreements.isAgree;
          } else {
            return true;
          }
        }
      },
      set(agree) {
        if (this.$refs.agreements) {
          this.$refs.agreements.isAgree = agree;
        } else {
          common_vendor.index.__f__("log", "at uni_modules/uni-id-pages/common/login-page.mixin.js:80", "不存在 隐私政策协议组件");
        }
      }
    }
  },
  methods: {
    loginSuccess(e) {
      uni_modules_uniIdPages_common_store.mutations.loginSuccess({
        ...e,
        uniIdRedirectUrl: this.uniIdRedirectUrl
      });
    }
  }
};
exports.mixin = mixin;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/uni_modules/uni-id-pages/common/login-page.mixin.js.map
