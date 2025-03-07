<template>
	<view class="container">
		<!-- 搜索框 -->
		<view class="search-box" @click="goToSearch">
			<text class="iconfont icon-search"></text>
			<text class="placeholder">搜索商品</text>
		</view>

		<!-- 扫描按钮 -->
		<view class="scan-section">
			<view class="scan-button" @click="startScan">
				<text class="iconfont icon-scan"></text>
				<text class="scan-text">扫描商品</text>
			</view>
		</view>

		<!-- 添加按钮 -->
		<view class="scan-section">
			<view class="scan-button" @click="popopen">
				<text class="iconfont icon-scan"></text>
				<text class="scan-text">添加商品</text>
			</view>
		</view>


		<!-- 商品信息弹窗 -->
		<goods-popup :show="showGoodsPopup" :goods="currentGoods" @update:show="showGoodsPopup = $event"
			@refresh="refreshGoods" />

		<!-- 添加商品弹窗 -->
		<uni-popup ref="addPopup" type="center">
			<view class="add-popup">
				<view class="add-header">
					<text class="add-title">添加商品</text>
					<text class="close-btn" @click="closeAddPopup">×</text>
				</view>
				<view class="add-body">
					<input v-model="newGoods.goods_sn" class="add-input" placeholder="商品条形码" />
					<input v-model="newGoods.goods_name" class="add-input" placeholder="商品名称" />
					<input v-model="newGoods.goods_price" class="add-input" type="digit" placeholder="商品价格" />
					<input v-model="newGoods.goods_notes" class="add-input" placeholder="商品备注" />
				</view>
				<view class="add-footer">
					<button @click="confirmAdd" class="add-btn">确认添加</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import { store } from '@/uni_modules/uni-id-pages/common/store.js'
const goodsInfoObj = uniCloud.importObject('goodsInfoObj')

export default {
	data() {
		return {
			showGoodsPopup: false,
			currentGoods: {},
			newGoods: {
				goods_name: '',
				goods_price: '',
				goods_notes: '',
				goods_sn: ''
			}
		}
	},
	methods: {
		onShareAppMessage(res) {
			console.log(res);
			if (res.from === 'menu') { // button：来自页面内分享按钮
				return {
					title: '我的物品录',
					path: '/pages/home/home',
					imageUrl: 'https://env-00jxt6l7w3we.normal.cloudstatic.cn/showPic/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-03-02%20170114.png'
				}
			}
		},

		onShareTimeline() {
			return {
				title: '我的物品录',
				imageUrl: 'https://env-00jxt6l7w3we.normal.cloudstatic.cn/showPic/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-03-02%20170114.png'
			};
		},

		checkLogin() {
			if (!store.hasLogin) {
				uni.navigateTo({
					url: '/uni_modules/uni-id-pages/pages/login/login-withoutpwd'
				})
				return false
			}
			return true
		},

		goToSearch() {
			if (!this.checkLogin()) return
			uni.navigateTo({
				url: '/pages/home/search'
			})
		},

		popopen() {
			if (!this.checkLogin()) return
			this.$refs.addPopup.open()
			this.newGoods = {
				goods_name: '',
				goods_price: '',
				goods_notes: '',
				goods_sn: ''
			}
		},

		async startScan() {
			if (!this.checkLogin()) return
			try {
				const res = await uni.scanCode({
					scanType: ['barCode', 'qrCode']
				})
				this.handleScanResult(res.result)
			} catch (e) {
				uni.showToast({
					title: '扫描失败',
					icon: 'error'
				})
			}
		},

		async handleScanResult(code) {
			try {
				const res = await goodsInfoObj.findGoods(code)
				if (res.code === 0) {
					this.currentGoods = res.data
					this.showGoodsPopup = true
				} else {
					this.newGoods.goods_sn = code
					uni.showModal({
						title: '提示',
						content: '没有该商品信息，是否添加？',
						success: (res) => {
							if (res.confirm) {
								this.$refs.addPopup.open()
							}
						}
					})
				}
			} catch (e) {
				uni.showToast({
					title: '获取商品信息失败',
					icon: 'error'
				})
			}
		},

		async confirmAdd() {
			try {
				this.newGoods.goods_price = parseFloat(this.newGoods.goods_price)
				console.log('this.newGoods.goods_price', this.newGoods.goods_price)
				if (isNaN(this.newGoods.goods_price) || this.newGoods.goods_price < 0) {
					uni.showToast({
						title: '价格要求为数字且大于0',
						icon: 'none'
					});
					return
				}
				const res = await goodsInfoObj.addGoods(this.newGoods)
				console.log(res)
				uni.showToast({
					title: '添加成功',
					icon: 'success'
				})
				this.$refs.addPopup.close()
				this.newGoods = {
					goods_name: '',
					goods_price: '',
					goods_notes: '',
					goods_sn: ''
				}
			} catch (e) {
				uni.showToast({
					title: '添加失败',
					icon: 'error'
				})
			}
		},
		closeAddPopup() {
			this.$refs.addPopup.close()
			this.newGoods = {
				goods_name: '',
				goods_price: '',
				goods_notes: '',
				goods_sn: ''
			}
		},
		refreshGoods() {
			// 刷新商品信息
			this.handleScanResult(this.currentGoods.goods_sn)
		}
	}
}
</script>

<style>
.container {
	padding: 40rpx;
	background: #f5f5f5;
	min-height: 100vh;
	box-sizing: border-box;
}

.search-box {
	background: #fff;
	height: 72rpx;
	border-radius: 36rpx;
	display: flex;
	align-items: center;
	padding: 0 32rpx;
	margin-bottom: 80rpx;
}

.icon-search {
	font-size: 40rpx;
	color: #999;
	margin-right: 16rpx;
}

.placeholder {
	font-size: 28rpx;
	color: #999;
}

.scan-section {
	display: flex;
	justify-content: center;
	padding: 61rpx 0;
}

.scan-button {
	width: 320rpx;
	height: 320rpx;
	background: #007aff;
	border-radius: 160rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	box-shadow: 0 16rpx 32rpx rgba(0, 122, 255, 0.2);
	transition: all 0.3s;
}

.scan-button:active {
	transform: scale(0.95);
	box-shadow: 0 8rpx 16rpx rgba(0, 122, 255, 0.2);
}

.icon-scan {
	font-size: 96rpx;
	color: #fff;
	margin-bottom: 16rpx;
}

.scan-text {
	font-size: 36rpx;
	color: #fff;
	font-weight: 500;
}

.uni-popup__wrapper {
	width: 600rpx;
}

.add-popup {
	background: #fff;
	border-radius: 32rpx;
	width: 90%;
	overflow: hidden;
}

.add-header {
	padding: 32rpx;
	border-bottom: 1px solid #eee;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.add-title {
	font-size: 36rpx;
	font-weight: 600;
	color: #333;
}

.add-body {
	padding: 32rpx;
}

.add-input {
	height: 80rpx;
	border: 2rpx solid #ddd;
	border-radius: 16rpx;
	padding: 0 24rpx;
	margin-bottom: 24rpx;
	font-size: 32rpx;
}


.add-input:focus {
	box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
	border-color: #007AFF;
}

.add-footer {
	padding: 0 32rpx 32rpx;
}

.add-btn {
	background: #34c759;
	color: #fff;
	height: 80rpx;
	border-radius: 16rpx;
	font-size: 32rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>