<!-- 免密登录页 -->
<template>
	<view class="uni-content animated-bg">
		<!-- 动态背景元素 -->
		<view class="floating-bubble b1"></view>
		<view class="floating-bubble b2"></view>
		<view class="floating-bubble b3"></view>

		<!-- 顶部文字 -->
		<text class="app-name">码上识货铺</text>
		
		<!-- 顶部文字 -->
		<!-- 快捷登录框 当url带参数时有效 -->
		<template v-if="['apple','weixin', 'weixinMobile', 'huawei', 'huaweiMobile'].includes(type)">
			<view class="quickLogin">
				<image v-if="type !== 'weixinMobile' && type !== 'huaweiMobile'" @click="quickLogin" :src="imgSrc"
					mode="widthFix" class="quickLoginBtn"></image>
				<view v-else style="position: relative">
					<button v-if="type ==='weixinMobile'" type="primary" open-type="getPhoneNumber"
						@getphonenumber="quickLogin" class="uni-btn">微信授权手机号登录</button>
					<button v-if="type === 'huaweiMobile'" open-type="getPhoneNumber" @getphonenumber="quickLogin"
						class="quickLoginBtn" style="padding: 0; display: flex">
						<image :src="imgSrc" mode="widthFix"></image>
					</button>
					<view v-if="this.needAgreements && !this.agree" class="mobile-login-agreement-layer"
						@click="showAgreementModal"></view>
				</view>
				<uni-id-pages-agreements scope="register" ref="agreements"></uni-id-pages-agreements>
			</view>
		</template>
		<template v-else>
			<text class="tip">未注册的账号验证通过后将自动注册</text>
			<view class="phone-box">
				<view @click="chooseArea" class="area">+86</view>
				<uni-easyinput trim="both" :focus="focusPhone" @blur="focusPhone = false" class="input-box"
					type="number" :inputBorder="false" v-model="phone" maxlength="11" placeholder="请输入手机号" />
			</view>
			<uni-id-pages-agreements scope="register" ref="agreements"></uni-id-pages-agreements>
			<button class="uni-btn" type="primary" @click="toSmsPage">获取验证码</button>
		</template>
		<!-- 固定定位的快捷登录按钮 -->
		<uni-id-pages-fab-login ref="uniFabLogin"></uni-id-pages-fab-login>
	</view>
</template>

<script>
	let currentWebview; //当前窗口对象
	import config from '@/uni_modules/uni-id-pages/config.js'
	import mixin from '@/uni_modules/uni-id-pages/common/login-page.mixin.js';
	export default {
		mixins: [mixin],
		data() {
			return {
				type: "", //快捷登录方式
				phone: "", //手机号码
				focusPhone: false,
				logo: "/static/logo.png"
			}
		},
		computed: {
			async loginTypes() { //读取配置的登录优先级
				return config.loginTypes
			},
			isPhone() { //手机号码校验正则
				return /^1\d{10}$/.test(this.phone);
			},
			imgSrc() { //大快捷登录按钮图
				const images = {
					weixin: '/uni_modules/uni-id-pages/static/login/weixin.png',
					apple: '/uni_modules/uni-id-pages/static/app/apple.png',
					huawei: '/uni_modules/uni-id-pages/static/login/huawei.png',
					huaweiMobile: '/uni_modules/uni-id-pages/static/login/huawei-mobile.png',
				}
				return images[this.type]
			}
		},
		async onLoad(e) {
			//获取通过url传递的参数type设置当前登录方式，如果没传递直接默认以配置的登录
			let type = e.type || config.loginTypes[0]
			this.type = type

			// console.log("this.type: -----------",this.type);
			if (type != 'univerify') {
				this.focusPhone = true
			}
			this.$nextTick(() => {
				//关闭重复显示的登录快捷方式
				if (['weixin', 'apple', 'huawei', 'huaweiMobile'].includes(type)) {
					this.$refs.uniFabLogin.servicesList = this.$refs.uniFabLogin.servicesList.filter(item =>
						item.id != type)
				}
			})
			uni.$on('uni-id-pages-setLoginType', type => {
				this.type = type
			})
		},
		onShow() {
			// #ifdef H5
			document.onkeydown = event => {
				var e = event || window.event;
				if (e && e.keyCode == 13) { //回车键的键值为13
					this.toSmsPage()
				}
			};
			// #endif
		},
		onUnload() {
			uni.$off('uni-id-pages-setLoginType')
		},
		onReady() {
			// 是否优先启动一键登录。即：页面一加载就启动一键登录
			//#ifdef APP-PLUS
			if (config.loginTypes.includes('univerify') && this.type == "univerify") {
				uni.preLogin({
					provider: 'univerify',
					success: () => {
						const pages = getCurrentPages();
						currentWebview = pages[pages.length - 1].$getAppWebview();
						currentWebview.setStyle({
							"top": "2000px" // 隐藏当前页面窗体
						})
						// this.type == this.loginTypes[1]
						// console.log('开始一键登录');
						this.$refs.uniFabLogin.login_before('univerify')
					},
					fail: (err) => {
						console.log(err);
						if (config.loginTypes.length > 1) {
							this.$refs.uniFabLogin.login_before(config.loginTypes[1])
						} else {
							uni.showModal({
								content: err.message,
								showCancel: false
							});
						}
					}
				})
			}
			//#endif
		},
		methods: {
			showCurrentWebview() {
				// 恢复当前页面窗体的显示 一键登录，默认不显示当前窗口
				currentWebview.setStyle({
					"top": 0
				})
			},
			showAgreementModal() {
				this.$refs.agreements.popup()
			},
			quickLogin(e) {
				let options = {}
				console.log(e)
				if (e.detail?.code) {
					options.phoneNumberCode = e.detail.code
				}

				if ((this.type === 'weixinMobile' || this.type === 'huaweiMobile') && !e.detail?.code) return

				this.$refs.uniFabLogin.login_before(this.type, true, options)
			},
			toSmsPage() {
				if (!this.isPhone) {
					this.focusPhone = true
					return uni.showToast({
						title: "手机号码格式不正确",
						icon: 'none',
						duration: 3000
					});
				}
				if (this.needAgreements && !this.agree) {
					return this.$refs.agreements.popup(this.toSmsPage)
				}
				// 发送验证吗
				uni.navigateTo({
					url: '/uni_modules/uni-id-pages/pages/login/login-smscode?phoneNumber=' + this.phone
				});
			},
			//去密码登录页
			toPwdLogin() {
				uni.navigateTo({
					url: '../login/password'
				})
			},
			chooseArea() {
				uni.showToast({
					title: '暂不支持其他国家',
					icon: 'none',
					duration: 3000
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
/* 通用样式 */
.uni-content {
  height: 100vh;
  background: linear-gradient(135deg, #1a73e8, #2196F3);
  overflow: hidden;
  position: relative;
}

.floating-bubble {
  position: absolute;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
  animation: float 8s infinite linear;
  opacity: 0.8;
  
  &.b1 {
    width: 200rpx;
    height: 200rpx;
    left: 15%;
    top: 20%;
    animation: float 6s infinite linear;
    animation-delay: 0.5s;
  }
  &.b2 {
    width: 150rpx;
    height: 150rpx;
    right: 15%;
    top: 35%;
    animation: float 8s infinite linear;
  }
  &.b3 {
    width: 180rpx;
    height: 180rpx;
    left: 25%;
    top: 65%;
    animation: float 7s infinite linear;
    animation-delay: 1.5s;
  }
}

@keyframes float {
  0% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0.8;
  }
  33% {
    transform: translateY(-100rpx) translateX(30rpx) scale(0.9);
  }
  66% {
    transform: translateY(50rpx) translateX(-20rpx) scale(1.1);
  }
  100% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0.4;
  }
}
.app-name {
  display: block;
  text-align: center;
  color: #fff;
  font-size: 62rpx;
  font-weight: bold;
  text-shadow: 
    0 4rpx 8rpx rgba(0,0,0,0.2),
    0 0 20rpx rgba(255,255,255,0.3);

  margin: 600rpx 0 0;
  position: relative;
  z-index: 2;
}


/* 登录按钮居中样式 */
.quickLogin {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 80rpx;
  
  .quickLoginBtn {
    width: 500rpx;
    margin: 0 auto;
    animation: btnScale 1.5s infinite ease-in-out;
    position: relative;
    transition: transform 0.3s;
    
    &:active {
      transform: scale(0.95);
    }
  }
}

@keyframes btnScale {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 10rpx 30rpx rgba(33, 150, 243, 0.3);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 15rpx 40rpx rgba(33, 150, 243, 0.5);
  }
}

/* 手机号登录部分居中 */
.phone-box {
  width: 80%;
  margin: 40rpx auto;
}

.uni-btn {
  display: block;
  width: 500rpx;
  margin: 40rpx auto;
}
</style>