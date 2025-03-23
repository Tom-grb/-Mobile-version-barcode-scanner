"use strict";
const common_vendor = require("../../../common/vendor.js");
const uni_modules_uniIdPages_config = require("../config.js");
const uniIdCo = common_vendor.er.importObject("uni-id-co");
const db = common_vendor.er.database();
const usersTable = db.collection("uni-id-users");
let hostUserInfo = common_vendor.index.getStorageSync("uni-id-pages-userInfo") || {};
const data = {
  userInfo: hostUserInfo,
  hasLogin: Object.keys(hostUserInfo).length != 0
};
const mutations = {
  // data不为空，表示传递要更新的值(注意不是覆盖是合并),什么也不传时，直接查库获取更新
  async updateUserInfo(data2 = false) {
    if (data2) {
      usersTable.where("_id==$env.uid").update(data2).then((e) => {
        if (e.result.updated) {
          common_vendor.index.showToast({
            title: "更新成功",
            icon: "none",
            duration: 3e3
          });
          this.setUserInfo(data2);
        } else {
          common_vendor.index.showToast({
            title: "没有改变",
            icon: "none",
            duration: 3e3
          });
        }
      });
    } else {
      const _id = common_vendor.er.getCurrentUserInfo().uid;
      this.setUserInfo({ _id }, { cover: true });
      const uniIdCo2 = common_vendor.er.importObject("uni-id-co", {
        customUI: true
      });
      try {
        let res = await usersTable.where("'_id' == $cloudEnv_uid").field("mobile,nickname,username,email,avatar_file").get();
        const realNameRes = await uniIdCo2.getRealNameInfo();
        this.setUserInfo({
          ...res.result.data[0],
          realNameAuth: realNameRes
        });
      } catch (e) {
        this.setUserInfo({}, { cover: true });
        common_vendor.index.__f__("error", "at uni_modules/uni-id-pages/common/store.js:60", e.message, e.errCode);
      }
    }
  },
  setUserInfo(data2, { cover } = { cover: false }) {
    let userInfo = cover ? data2 : Object.assign(store.userInfo, data2);
    store.userInfo = Object.assign({}, userInfo);
    store.hasLogin = Object.keys(store.userInfo).length != 0;
    common_vendor.index.setStorageSync("uni-id-pages-userInfo", store.userInfo);
    return data2;
  },
  async logout() {
    if (common_vendor.er.getCurrentUserInfo().tokenExpired > Date.now()) {
      try {
        await uniIdCo.logout();
      } catch (e) {
        common_vendor.index.__f__("error", "at uni_modules/uni-id-pages/common/store.js:79", e);
      }
    }
    common_vendor.index.removeStorageSync("uni_id_token");
    common_vendor.index.setStorageSync("uni_id_token_expired", 0);
    this.setUserInfo({}, { cover: true });
    common_vendor.index.$emit("uni-id-pages-logout");
    common_vendor.index.redirectTo({
      url: `/${common_vendor.pagesJson.uniIdRouter && common_vendor.pagesJson.uniIdRouter.loginPage ? common_vendor.pagesJson.uniIdRouter.loginPage : "uni_modules/uni-id-pages/pages/login/login-withoutpwd"}`
    });
  },
  loginBack(e = {}) {
    const { uniIdRedirectUrl = "" } = e;
    let delta = 0;
    let pages = getCurrentPages();
    pages.forEach((page, index) => {
      if (pages[pages.length - index - 1].route.split("/")[3] == "login") {
        delta++;
      }
    });
    if (uniIdRedirectUrl) {
      return common_vendor.index.redirectTo({
        url: uniIdRedirectUrl,
        fail: (err1) => {
          common_vendor.index.switchTab({
            url: uniIdRedirectUrl,
            fail: (err2) => {
              common_vendor.index.__f__("log", "at uni_modules/uni-id-pages/common/store.js:108", err1, err2);
            }
          });
        }
      });
    }
    if (delta) {
      const page = common_vendor.pagesJson.pages[0];
      return common_vendor.index.reLaunch({
        url: `/${page.path}`
      });
    }
    common_vendor.index.navigateBack({
      delta
    });
  },
  loginSuccess(e = {}) {
    const {
      showToast = true,
      toastText = "登录成功",
      autoBack = true,
      uniIdRedirectUrl = "",
      passwordConfirmed
    } = e;
    if (showToast) {
      common_vendor.index.showToast({
        title: toastText,
        icon: "none",
        duration: 3e3
      });
    }
    this.updateUserInfo();
    common_vendor.index.$emit("uni-id-pages-login-success");
    if (uni_modules_uniIdPages_config.config.setPasswordAfterLogin && !passwordConfirmed) {
      return common_vendor.index.redirectTo({
        url: uniIdRedirectUrl ? `/uni_modules/uni-id-pages/pages/userinfo/set-pwd/set-pwd?uniIdRedirectUrl=${uniIdRedirectUrl}&loginType=${e.loginType}` : `/uni_modules/uni-id-pages/pages/userinfo/set-pwd/set-pwd?loginType=${e.loginType}`,
        fail: (err) => {
          common_vendor.index.__f__("log", "at uni_modules/uni-id-pages/common/store.js:153", err);
        }
      });
    }
    if (autoBack) {
      this.loginBack({ uniIdRedirectUrl });
    }
  }
};
const store = common_vendor.reactive(data);
exports.mutations = mutations;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/uni_modules/uni-id-pages/common/store.js.map
