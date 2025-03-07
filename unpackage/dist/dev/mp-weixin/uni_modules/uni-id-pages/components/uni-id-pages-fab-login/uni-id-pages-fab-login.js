"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_uniIdPages_config = require("../../config.js");
const uni_modules_uniIdPages_common_store = require("../../common/store.js");
const _sfc_main = {
  computed: {
    agreements() {
      if (!uni_modules_uniIdPages_config.config.agreements) {
        return [];
      }
      let {
        serviceUrl,
        privacyUrl
      } = uni_modules_uniIdPages_config.config.agreements;
      return [
        {
          url: serviceUrl,
          title: "用户服务协议"
        },
        {
          url: privacyUrl,
          title: "隐私政策条款"
        }
      ];
    },
    agree: {
      get() {
        return this.getParentComponent().agree;
      },
      set(agree) {
        return this.getParentComponent().agree = agree;
      }
    }
  },
  data() {
    return {
      servicesList: [
        {
          "id": "username",
          "text": "账号登录",
          "logo": "/uni_modules/uni-id-pages/static/login/uni-fab-login/user.png",
          "path": "/uni_modules/uni-id-pages/pages/login/login-withpwd"
        },
        {
          "id": "smsCode",
          "text": "短信验证码",
          "logo": "/uni_modules/uni-id-pages/static/login/uni-fab-login/sms.png",
          "path": "/uni_modules/uni-id-pages/pages/login/login-withoutpwd?type=smsCode"
        },
        {
          "id": "weixin",
          "text": "微信登录",
          "logo": "/uni_modules/uni-id-pages/static/login/uni-fab-login/weixin.png"
        },
        {
          "id": "huawei",
          "text": "华为登录",
          "logo": "/uni_modules/uni-id-pages/static/login/uni-fab-login/huawei.png",
          "path": "/uni_modules/uni-id-pages/pages/login/login-withoutpwd?type=huawei"
        },
        {
          "id": "huaweiMobile",
          "text": "华为账号一键登录",
          "logo": "/uni_modules/uni-id-pages/static/login/uni-fab-login/huawei.png",
          "path": "/uni_modules/uni-id-pages/pages/login/login-withoutpwd?type=huaweiMobile"
        }
      ],
      univerifyStyle: {
        //一键登录弹出窗的样式配置参数
        "fullScreen": true,
        // 是否全屏显示，true表示全屏模式，false表示非全屏模式，默认值为false。
        "backgroundColor": "#ffffff",
        // 授权页面背景颜色，默认值：#ffffff
        "buttons": {
          // 自定义登录按钮
          "iconWidth": "45px",
          // 图标宽度（高度等比例缩放） 默认值：45px
          "list": []
        },
        "privacyTerms": {
          "defaultCheckBoxState": false,
          // 条款勾选框初始状态 默认值： true
          "textColor": "#BBBBBB",
          // 文字颜色 默认值：#BBBBBB
          "termsColor": "#5496E3",
          //  协议文字颜色 默认值： #5496E3
          "prefix": "我已阅读并同意",
          // 条款前的文案 默认值：“我已阅读并同意”
          "suffix": "并使用本机号码登录",
          // 条款后的文案 默认值：“并使用本机号码登录”
          "privacyItems": []
        }
      }
    };
  },
  watch: {
    agree(agree) {
      this.univerifyStyle.privacyTerms.defaultCheckBoxState = agree;
    }
  },
  async created() {
    let servicesList = this.servicesList;
    let loginTypes = uni_modules_uniIdPages_config.config.loginTypes;
    servicesList = servicesList.filter((item) => {
      if (item.id == "apple") {
        return false;
      }
      return loginTypes.includes(item.id);
    });
    if (loginTypes.includes("univerify")) {
      this.univerifyStyle.privacyTerms.privacyItems = this.agreements;
      servicesList.forEach(({
        id,
        logo,
        path
      }) => {
        if (id != "univerify") {
          this.univerifyStyle.buttons.list.push({
            "iconPath": logo,
            "provider": id,
            path
            //路径用于点击快捷按钮时判断是跳转页面
          });
        }
      });
    }
    this.servicesList = servicesList.filter((item) => {
      let path = item.path ? item.path.split("?")[0] : "";
      return path != this.getRoute(1);
    });
  },
  methods: {
    getParentComponent() {
      return this.$parent;
    },
    setUserInfo(e) {
      common_vendor.index.__f__("log", "at uni_modules/uni-id-pages/components/uni-id-pages-fab-login/uni-id-pages-fab-login.vue:207", "setUserInfo", e);
    },
    getRoute(n = 0) {
      let pages = getCurrentPages();
      if (n > pages.length) {
        return "";
      }
      return "/" + pages[pages.length - n].route;
    },
    toPage(path, index = 0) {
      common_vendor.index.__f__("log", "at uni_modules/uni-id-pages/components/uni-id-pages-fab-login/uni-id-pages-fab-login.vue:217", "比较", this.getRoute(1), this.getRoute(2), path);
      if (this.getRoute(1) == path.split("?")[0] && this.getRoute(1) == "/uni_modules/uni-id-pages/pages/login/login-withoutpwd") {
        let loginType = path.split("?")[1].split("=")[1];
        common_vendor.index.$emit("uni-id-pages-setLoginType", loginType);
      } else if (this.getRoute(2) == path) {
        common_vendor.index.navigateBack();
      } else if (this.getRoute(1) != path) {
        if (index === 0) {
          common_vendor.index.navigateTo({
            url: path,
            animationType: "slide-in-left",
            complete(e) {
            }
          });
        } else {
          common_vendor.index.redirectTo({
            url: path,
            animationType: "slide-in-left",
            complete(e) {
            }
          });
        }
      } else {
        common_vendor.index.__f__("log", "at uni_modules/uni-id-pages/components/uni-id-pages-fab-login/uni-id-pages-fab-login.vue:244", "出乎意料的情况,path：" + path);
      }
    },
    async login_before(type, navigateBack = true, options = {}) {
      var _a, _b;
      common_vendor.index.__f__("log", "at uni_modules/uni-id-pages/components/uni-id-pages-fab-login/uni-id-pages-fab-login.vue:248", type, options);
      if ([
        "qq",
        "xiaomi",
        "sinaweibo",
        "taobao",
        "facebook",
        "google",
        "alipay",
        "douyin"
      ].includes(type)) {
        return common_vendor.index.showToast({
          title: "该登录方式暂未实现，欢迎提交pr",
          icon: "none",
          duration: 3e3
        });
      }
      common_vendor.index.__f__("log", "at uni_modules/uni-id-pages/components/uni-id-pages-fab-login/uni-id-pages-fab-login.vue:266", "检查当前环境是否支持这种登录方式");
      if (
        //非app端使用了，app特有登录方式
        ["univerify", "apple"].includes(type)
      ) {
        return common_vendor.index.showToast({
          title: "当前设备不支持此登录，请选择其他登录方式",
          icon: "none",
          duration: 3e3
        });
      }
      let needAgreements = (((_b = (_a = uni_modules_uniIdPages_config.config) == null ? void 0 : _a.agreements) == null ? void 0 : _b.scope) || []).includes("register");
      if (type != "univerify" && needAgreements && !this.agree) {
        let agreementsRef = this.getParentComponent().$refs.agreements;
        return agreementsRef.popup(() => {
          this.login_before(type, navigateBack, options);
        });
      }
      common_vendor.index.__f__("log", "at uni_modules/uni-id-pages/components/uni-id-pages-fab-login/uni-id-pages-fab-login.vue:360", "login ----");
      common_vendor.index.showLoading({
        mask: true
      });
      if (type == "univerify") {
        let closeUniverify = function() {
          common_vendor.index.hideLoading();
          univerifyManager.close();
          univerifyManager.offButtonsClick(onButtonsClickFn);
        };
        let univerifyManager = common_vendor.index.getUniverifyManager();
        let clickAnotherButtons = false;
        let onButtonsClickFn = async (res) => {
          common_vendor.index.__f__("log", "at uni_modules/uni-id-pages/components/uni-id-pages-fab-login/uni-id-pages-fab-login.vue:372", "点击了第三方登录，provider：", res, res.provider, this.univerifyStyle.buttons.list);
          clickAnotherButtons = true;
          let checkBoxState = await common_vendor.index.getCheckBoxState();
          this.agree = checkBoxState.state;
          let {
            path
          } = this.univerifyStyle.buttons.list[res.index];
          if (path) {
            if (this.getRoute(1).includes("login-withoutpwd") && path.includes("login-withoutpwd")) {
              this.getParentComponent().showCurrentWebview();
            }
            this.toPage(path, 1);
            closeUniverify();
          } else {
            if (this.agree) {
              closeUniverify();
              setTimeout(() => {
                this.login_before(res.provider);
              }, 500);
            } else {
              common_vendor.index.showToast({
                title: "你未同意隐私政策协议",
                icon: "none",
                duration: 3e3
              });
            }
          }
        };
        univerifyManager.onButtonsClick(onButtonsClickFn);
        return univerifyManager.login({
          "univerifyStyle": this.univerifyStyle,
          success: (res) => {
            this.login(res.authResult, "univerify");
          },
          fail(err) {
            common_vendor.index.__f__("log", "at uni_modules/uni-id-pages/components/uni-id-pages-fab-login/uni-id-pages-fab-login.vue:422", err);
            if (!clickAnotherButtons) {
              common_vendor.index.navigateBack();
            }
          },
          complete: async (e) => {
            common_vendor.index.hideLoading();
            univerifyManager.offButtonsClick(onButtonsClickFn);
          }
        });
      }
      if (type === "weixinMobile" || type === "huaweiMobile") {
        return this.login({
          phoneCode: options.phoneNumberCode
        }, type);
      }
      common_vendor.index.login({
        "provider": type,
        "onlyAuthorize": true,
        success: async (e) => {
          if (type == "apple") {
            let res = await this.getUserInfo({
              provider: "apple"
            });
            Object.assign(e.authResult, res.userInfo);
            common_vendor.index.hideLoading();
          }
          this.login(["huawei", "weixin"].includes(type) ? {
            code: e.code
          } : e.authResult, type);
        },
        fail: async (err) => {
          common_vendor.index.__f__("error", "at uni_modules/uni-id-pages/components/uni-id-pages-fab-login/uni-id-pages-fab-login.vue:468", JSON.stringify(err));
          common_vendor.index.showModal({
            content: `登录失败; code: ${err.errCode || -1}`,
            confirmText: "知道了",
            showCancel: false
          });
          common_vendor.index.hideLoading();
        }
      });
    },
    login(params, type) {
      common_vendor.index.__f__("log", "at uni_modules/uni-id-pages/components/uni-id-pages-fab-login/uni-id-pages-fab-login.vue:480", { params, type });
      let action = "loginBy" + type.trim().replace(type[0], type[0].toUpperCase());
      const uniIdCo = common_vendor.er.importObject("uni-id-co", {
        customUI: true
      });
      uniIdCo[action](params).then((result) => {
        common_vendor.index.showToast({
          title: "登录成功",
          icon: "none",
          duration: 2e3
        });
        uni_modules_uniIdPages_common_store.mutations.loginSuccess(result);
      }).catch((e) => {
        common_vendor.index.showModal({
          content: e.message,
          confirmText: "知道了",
          showCancel: false
        });
      }).finally((e) => {
        if (type == "univerify") {
          common_vendor.index.closeAuthView();
        }
        common_vendor.index.hideLoading();
      });
    },
    async getUserInfo(e) {
      return new Promise((resolve, reject) => {
        common_vendor.index.getUserInfo({
          ...e,
          success: (res) => {
            resolve(res);
          },
          fail: (err) => {
            common_vendor.index.showModal({
              content: JSON.stringify(err),
              showCancel: false
            });
            reject(err);
          }
        });
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.servicesList, (item, index, i0) => {
      return {
        a: item.logo,
        b: common_vendor.t(item.text),
        c: index,
        d: common_vendor.o(($event) => item.path ? $options.toPage(item.path) : $options.login_before(item.id, false), index)
      };
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/uni_modules/uni-id-pages/components/uni-id-pages-fab-login/uni-id-pages-fab-login.js.map
