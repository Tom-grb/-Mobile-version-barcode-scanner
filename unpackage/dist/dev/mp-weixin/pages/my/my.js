"use strict";
const common_vendor = require("../../common/vendor.js");
const db = common_vendor.er.database();
const goodsExportImport = common_vendor.er.importObject("goodsExportImport");
const _sfc_main = {
  data() {
    return {
      userInfo: {},
      newNickname: "",
      feedbackContent: "",
      mobile: "",
      tmpurl: ""
    };
  },
  onLoad() {
    this.getUserInfo();
    common_vendor.index.__f__("log", "at pages/my/my.vue:100", "onLoad");
  },
  onshow() {
    this.getUserInfo();
  },
  methods: {
    handleModel() {
      common_vendor.index.navigateTo({
        url: "/pages/subpack/explanation/explanation"
      });
    },
    isJSON(str) {
      try {
        JSON.parse(str);
        return true;
      } catch (e) {
        return false;
      }
    },
    async getUserInfo() {
      try {
        let userInfo = common_vendor.index.getStorageSync("uni-id-pages-userInfo");
        if (this.isJSON(userInfo)) {
          userInfo = JSON.parse(userInfo);
        }
        if (userInfo) {
          this.userInfo = userInfo;
        } else {
          this.handleRelogin();
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/my/my.vue:138", "获取用户信息时发生错误:", error);
        this.handleRelogin();
      }
    },
    showNicknameInput() {
      this.newNickname = this.userInfo.nickname || "未知昵称";
      this.$refs.nicknamePopup.open();
    },
    closeNicknamePopup() {
      this.$refs.nicknamePopup.close();
    },
    // 抽取重新登录逻辑为单独方法
    handleRelogin() {
      if (common_vendor.index.getStorageSync("uni_id_token")) {
        common_vendor.index.removeStorageSync("uni_id_token");
      }
      if (common_vendor.index.getStorageSync("uni-id-pages-userInfo")) {
        common_vendor.index.removeStorageSync("uni-id-pages-userInfo");
      }
      if (common_vendor.index.getStorageSync("uni_id_token_expired")) {
        common_vendor.index.removeStorageSync("uni_id_token_expired");
      }
      common_vendor.index.showToast({
        title: "请登录",
        icon: "none"
      });
      setTimeout(() => {
        common_vendor.index.redirectTo({
          url: "../../uni_modules/uni-id-pages/pages/login/login-withoutpwd"
        });
      }, 1500);
    },
    changeAvatar() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: async (res) => {
          const tempFilePath = res.tempFilePaths[0];
          common_vendor.index.showLoading({
            title: "上传中..."
          });
          common_vendor.index.__f__("log", "at pages/my/my.vue:191", tempFilePath);
          try {
            const uploadRes = await common_vendor.er.uploadFile({
              filePath: tempFilePath,
              cloudPath: `avatar/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.jpg`
            });
            const tempFileURL = await common_vendor.er.getTempFileURL({
              fileList: [uploadRes.fileID]
            });
            let avatarUrl = tempFileURL.fileList[0].tempFileURL;
            const questionMarkIndex = avatarUrl.indexOf("?");
            if (questionMarkIndex !== -1) {
              avatarUrl = avatarUrl.substring(0, questionMarkIndex);
            }
            await db.collection("uni-id-users").doc(this.userInfo._id).update({
              avatar_file: avatarUrl
            });
            this.userInfo.avatar_file = avatarUrl;
            common_vendor.index.setStorageSync("uni-id-pages-userInfo", JSON.stringify(this.userInfo));
            common_vendor.index.hideLoading();
            common_vendor.index.showToast({
              title: "头像更新成功",
              icon: "success"
            });
          } catch (e) {
            common_vendor.index.__f__("error", "at pages/my/my.vue:226", "头像更新失败:", e);
            common_vendor.index.hideLoading();
            common_vendor.index.showToast({
              title: e.message || "上传失败",
              icon: "error"
            });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/my/my.vue:235", "选择图片失败:", err);
          common_vendor.index.showToast({
            title: "选择图片失败",
            icon: "none"
          });
        }
      });
    },
    async updateNickname() {
      if (!this.newNickname.trim()) {
        common_vendor.index.showToast({
          title: "昵称不能为空",
          icon: "none"
        });
        return;
      }
      try {
        common_vendor.index.__f__("log", "at pages/my/my.vue:255", this.userInfo._id);
        await db.collection("uni-id-users").where("_id==$env.uid").update({
          nickname: this.newNickname
        });
        this.userInfo.nickname = this.newNickname;
        common_vendor.index.setStorageSync("uni-id-pages-userInfo", JSON.stringify(this.userInfo));
        this.closeNicknamePopup();
        common_vendor.index.showToast({
          title: "昵称更新成功",
          icon: "success"
        });
      } catch (e) {
        common_vendor.index.showToast({
          title: "更新失败",
          icon: "error"
        });
      }
    },
    async handleImport() {
      try {
        const chooseRes = await common_vendor.index.chooseMessageFile({
          count: 1,
          type: "file",
          extension: ["xlsx", ".xlsx"]
        });
        const filePath = chooseRes.tempFiles[0].path;
        const fs = common_vendor.wx$1.getFileSystemManager();
        let fileData;
        try {
          fileData = fs.readFileSync(filePath, "base64");
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/my/my.vue:295", "读取文件失败:", error);
          common_vendor.index.showToast({
            title: "读取文件失败",
            icon: "none",
            duration: 2e3
          });
          return;
        }
        const workbook = common_vendor.readSync(fileData, {
          type: "base64"
        });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = common_vendor.utils.sheet_to_json(worksheet, {
          header: 1
        });
        jsonData.shift();
        common_vendor.index.__f__("log", "at pages/my/my.vue:316", jsonData);
        const hasNonNumericPrice = jsonData.some((row) => {
          const price = row[2];
          return !(typeof price === "number" && !isNaN(price) && Number(price) >= 0);
        });
        const hasEmptyName = jsonData.some((row) => {
          const name = row[1];
          return !name || name.trim() === "";
        });
        if (hasNonNumericPrice) {
          common_vendor.index.showToast({
            title: "价格列包含非数字或者负数,请修改后重新上传",
            icon: "none",
            duration: 2e3
          });
          return;
        } else if (hasEmptyName) {
          common_vendor.index.showToast({
            title: "商品名称不能为空",
            icon: "none",
            duration: 2e3
          });
          return;
        }
        const res = await goodsExportImport.importGoods(jsonData);
        common_vendor.index.__f__("log", "at pages/my/my.vue:350", "返回", res);
        if (res.code === 500) {
          common_vendor.index.showToast({
            title: res.message,
            icon: "none",
            duration: 2e3
          });
        } else {
          common_vendor.index.showToast({
            title: res.message,
            icon: "none",
            duration: 2e3
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/my/my.vue:366", "发生错误:", error);
        common_vendor.index.showToast({
          title: "发生错误",
          icon: "none",
          duration: 2e3
        });
      }
    },
    async handleExport() {
      try {
        const res = await goodsExportImport.exportGoods();
        if (res.code) {
          this.tmpurl = res.downloadUrl;
          this.$refs.exportPopup.open();
          this.coypContent(this.tmpurl);
        } else {
          common_vendor.index.showToast({
            title: "导出失败",
            icon: "none"
          });
        }
      } catch (e) {
        common_vendor.index.showToast({
          title: "导出失败",
          icon: "none"
        });
      }
    },
    coypContent() {
      common_vendor.index.setClipboardData({
        data: this.tmpurl,
        success: () => {
          common_vendor.index.showToast({
            title: "复制成功",
            icon: "success"
          });
        },
        fail: () => {
          common_vendor.index.showToast({
            title: "复制失败",
            icon: "none"
          });
        }
      });
    },
    closeexportPopup() {
      this.$refs.exportPopup.close();
    },
    showFeedback() {
      this.$refs.feedbackPopup.open();
    },
    closeFeedbackPopup() {
      this.$refs.feedbackPopup.close();
      this.feedbackContent = "";
    },
    async submitFeedback() {
      const regex = /^1[3-9]\d{9}$/;
      if (!this.feedbackContent.trim()) {
        common_vendor.index.showToast({
          title: "请输入反馈内容",
          icon: "none"
        });
        return;
      } else if (this.mobile === "") {
        common_vendor.index.showToast({
          title: "手机号不能为空",
          icon: "none"
        });
        return;
      } else if (!regex.test(this.mobile)) {
        common_vendor.index.__f__("log", "at pages/my/my.vue:442", this.mobile);
        common_vendor.index.showToast({
          title: "请输入有效的手机号",
          icon: "none"
        });
        return;
      }
      try {
        const res = await db.collection("opendb-feedback").add({
          user_id: this.userInfo._id,
          content: this.feedbackContent,
          mobile: this.mobile,
          create_date: Date.now()
        });
        common_vendor.index.__f__("log", "at pages/my/my.vue:458", res);
        this.closeFeedbackPopup();
        common_vendor.index.showToast({
          title: "反馈提交成功",
          icon: "success"
        });
      } catch (e) {
        common_vendor.index.__f__("log", "at pages/my/my.vue:466", e);
        common_vendor.index.showToast({
          title: "提交失败",
          icon: "error"
        });
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  _easycom_uni_popup2();
}
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  _easycom_uni_popup();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.userInfo.avatar_file || "/static/default-avatar.png",
    b: common_vendor.o((...args) => $options.changeAvatar && $options.changeAvatar(...args)),
    c: common_vendor.t($data.userInfo.nickname || "未登录"),
    d: common_vendor.o((...args) => $options.showNicknameInput && $options.showNicknameInput(...args)),
    e: common_vendor.o((...args) => $options.handleModel && $options.handleModel(...args)),
    f: common_vendor.o((...args) => $options.handleImport && $options.handleImport(...args)),
    g: common_vendor.o((...args) => $options.handleExport && $options.handleExport(...args)),
    h: common_vendor.o((...args) => $options.showFeedback && $options.showFeedback(...args)),
    i: $data.newNickname,
    j: common_vendor.o(($event) => $data.newNickname = $event.detail.value),
    k: common_vendor.o((...args) => $options.closeNicknamePopup && $options.closeNicknamePopup(...args)),
    l: common_vendor.o((...args) => $options.updateNickname && $options.updateNickname(...args)),
    m: common_vendor.sr("nicknamePopup", "1265ce88-0"),
    n: common_vendor.p({
      type: "center"
    }),
    o: $data.mobile,
    p: common_vendor.o(($event) => $data.mobile = $event.detail.value),
    q: $data.feedbackContent,
    r: common_vendor.o(($event) => $data.feedbackContent = $event.detail.value),
    s: common_vendor.o((...args) => $options.closeFeedbackPopup && $options.closeFeedbackPopup(...args)),
    t: common_vendor.o((...args) => $options.submitFeedback && $options.submitFeedback(...args)),
    v: common_vendor.sr("feedbackPopup", "1265ce88-1"),
    w: common_vendor.p({
      type: "center"
    }),
    x: $data.tmpurl,
    y: common_vendor.o(($event) => $data.tmpurl = $event.detail.value),
    z: common_vendor.o((...args) => $options.coypContent && $options.coypContent(...args)),
    A: common_vendor.o((...args) => $options.closeexportPopup && $options.closeexportPopup(...args)),
    B: common_vendor.sr("exportPopup", "1265ce88-2"),
    C: common_vendor.p({
      type: "center"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/my/my.js.map
