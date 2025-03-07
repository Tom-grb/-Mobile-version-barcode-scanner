<template>
	<view class="container">
		<!-- 扫码区域 -->
		<view class="camera-section">
			<camera 
				device-position="back" 
				flash="off" 
				class="camera"
				mode="scanCode"
				@scancode="handleScanWithThrottle"
			/>
			<view class="scan-overlay">
				<view class="scan-line"></view>
			</view>
			<view class="scan-tips">
				<text class="tips-text">将商品二维码放入框内</text>
			</view>
		</view>
		
		<!-- 商品列表 -->
		<view class="goods-section">
			<view class="section-header">
				<text class="section-title">商品列表</text>
			</view>
			
			<scroll-view 
				scroll-y 
				class="goods-list"
				v-if="goodsList.length > 0"
			>
				<view 
					class="goods-item"
					v-for="(item, index) in goodsList" 
					:key="index"
					:class="{'slide-in': item.isNew}"
				>
					<view class="goods-info">
						<text class="goods-name">{{item.goods_name}}</text>
						<text class="goods-price">￥{{item.goods_price}}</text>
					</view>
					<view class="goods-action">
						<view class="quantity-control">
							<button 
								class="qty-btn minus" 
								@click="updateQuantity(index, -1)"
								:class="{'disabled': item.quantity <= 1}"
							>-</button>
							<text class="quantity">{{item.quantity}}</text>
							<button 
								class="qty-btn plus" 
								@click="updateQuantity(index, 1)"
							>+</button>
						</view>
						<view class="delete-btn-wrapper">
							<button class="delete-btn" @click="removeItem(index)">
								<text class="iconfont icon-delete"></text>
								<text class="delete-text">删除</text>
							</button>
						</view>
					</view>
				</view>
			</scroll-view>
			
			<!-- 空状态 -->
			<view class="empty-state" v-else>
				<image class="empty-icon" src="/static/empty-cart.png"></image>
				<text class="empty-text">暂无商品，请扫码添加</text>
			</view>
		</view>
		
		<!-- 底部结算栏 -->
		<view class="footer" :class="{'has-goods': goodsList.length > 0}">
			<view class="total-info">
				<button class="clear-btn" @click="showClearConfirm" v-if="goodsList.length > 0">
					<text class="iconfont icon-delete"></text>
					<text>清空</text>
				</button>
				<text class="total-label">合计：</text>
				<text class="total-price">￥{{totalPrice}}</text>
			</view>
		</view>
	</view>
</template>

<script>
const goodsInfoObj = uniCloud.importObject('goodsInfoObj')
import { store } from '@/uni_modules/uni-id-pages/common/store.js'

export default {
	data() {
		return {
			goodsList: [],
			scanning: false,
			lastScanTime: 0
		}
	},
	computed: {
		totalPrice() {
			return this.goodsList.reduce((total, item) => {
				return total + (item.goods_price * item.quantity)
			}, 0).toFixed(2)
		}
	},
	methods: {
		checkLogin() {
			if (!store.hasLogin) {
				uni.navigateTo({
					url: '/uni_modules/uni-id-pages/pages/login/login-withoutpwd'
				})
				return false
			}
			return true
		},

		// 添加限流处理方法
		handleScanWithThrottle(e) {
			if (!this.checkLogin()){
				return
			}
			console.log('扫码结果：', e.detail.result)
			const currentTime = Date.now()
			if (this.scanning) {
				return
			}
			
			if (currentTime - this.lastScanTime < 2000) {
				return
			}
			console.log('整备调用')
			this.lastScanTime = currentTime
			
			// 调用原来的扫码处理方法
			this.handleScan(e)
			
			
		},

		async handleScan(e) {
			if (this.scanning) return
			this.scanning = true
			try {
				const code = e.detail.result
				console.log('handleScan', code)
				// 检查是否已存在
				const existingItem = this.goodsList.find(item => item.goods_sn === code)
				if (existingItem) {
					// 已存在则直接增加数量
					const index = this.goodsList.indexOf(existingItem)
					this.updateQuantity(index, 1)
					this.scanning = false
					return
				}
				
				const res = await goodsInfoObj.findGoods(code)
				
				if (res.code === 0) {
					const goods = res.data
					// 添加新商品
					this.goodsList.unshift({
						...goods,
						quantity: 1,
						isNew: true
					})
					
					// 移除新商品标记（用于动画）
					setTimeout(() => {
						this.goodsList[0].isNew = false
					}, 500)
					
				} else {
					uni.showToast({
						title: '商品不存在',
						icon: 'error'
					})
				}
			} catch(e) {
				uni.showToast({
					title: '扫描失败',
					icon: 'error'
				})
			} finally {
				this.scanning = false
			}
		},
		updateQuantity(index, change) {
			const newQuantity = this.goodsList[index].quantity + change
			if (newQuantity < 1) return
			
			this.goodsList[index].quantity = newQuantity
		},
		removeItem(index) {
			uni.showModal({
				title: '提示',
				content: '确定要删除该商品吗？',
				success: (res) => {
					if (res.confirm) {
						this.goodsList.splice(index, 1)
					}
				}
			})
		},
		showClearConfirm() {
			uni.showModal({
				title: '提示',
				content: '确定要清空所有商品吗？',
				success: (res) => {
					if (res.confirm) {
						this.goodsList = []
					}
				}
			})
		}
	}
}
</script>

<style>
.container {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background: #f5f5f5;
}

.camera-section {
	position: relative;
	width: 100%;
	height: 350rpx;
	background: #000;
}

.camera {
	width: 100%;
	height: 100%;
}

.scan-overlay {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 100%;
	height: 400rpx;
	border: 2rpx solid rgba(255, 255, 255, 0.6);
	border-radius: 20rpx;
}

.scan-line {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 4rpx;
	background: #007AFF;
	animation: scan 2s linear infinite;
}

.scan-tips {
	position: absolute;
	bottom: 40rpx;
	left: 0;
	right: 0;
	text-align: center;
}

.tips-text {
	color: #fff;
	font-size: 28rpx;
	text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

.goods-section {
	flex: 1;
	padding: 20rpx;
	overflow: hidden;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
}

.clear-btn {
	display: flex;
	align-items: center;
	padding: 5rpx 82rpx;
	background: #ff3b30;
	border-radius: 15rpx;
	border: none;
}

.clear-btn text {
	color: #fff;
	font-size: 24rpx;
}

.goods-list {
	height: calc(100% - 80rpx);
}

.goods-item {
	background: #fff;
	border-radius: 16rpx;
	padding: 24rpx;
	margin-bottom: 20rpx;
	animation: slideIn 0.3s ease-out;
}

.goods-item.slide-in {
	animation: slideInNew 0.5s ease-out;
}

.goods-info {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}

.goods-name {
	font-size: 28rpx;
	color: #333;
}

.goods-price {
	font-size: 32rpx;
	color: #ff3b30;
	font-weight: 500;
}

.goods-action {
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex: 1;
}

.quantity-control {
	display: flex;
	align-items: center;
	background: #f5f5f5;
	border-radius: 8rpx;
	overflow: hidden;
}

.qty-btn {
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: none;
	border: none;
	font-size: 28rpx;
	color: #333;
}

.qty-btn.disabled {
	color: #999;
}

.quantity {
	width: 80rpx;
	text-align: center;
	font-size: 28rpx;
}

.delete-btn-wrapper {
	margin-left: 20rpx;
}

.delete-btn {
	min-width: 120rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #ff3b30;
	border-radius: 8rpx;
	border: none;
	padding: 0 20rpx;
}

.delete-btn .icon-delete {
	font-size: 28rpx;
	color: #fff;
	margin-right: 8rpx;
}

.delete-btn .delete-text {
	font-size: 24rpx;
	color: #fff;
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
}

.empty-icon {
	width: 200rpx;
	height: 200rpx;
	margin-bottom: 20rpx;
}

.empty-text {
	font-size: 28rpx;
	color: #999;
}

.footer {
	padding: 20rpx 32rpx;
	background: #fff;
	transform: translateY(100%);
	transition: transform 0.3s ease-out;
}

.footer.has-goods {
	transform: translateY(0);
}

.total-info {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.total-label {
	font-size: 28rpx;
	color: #666;
	margin-left: auto;
	margin-right: 20rpx;
}

.total-price {
	font-size: 40rpx;
	color: #ff3b30;
	font-weight: 600;
}

@keyframes scan {
	0% {
		top: 0;
	}
	50% {
		top: 100%;
	}
	100% {
		top: 0;
	}
}

@keyframes slideIn {
	from {
		opacity: 0;
		transform: translateY(20rpx);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes slideInNew {
	from {
		opacity: 0;
		transform: translateX(-100%);
	}
	to {
		opacity: 1;
		transform: translateX(0);
	}
}
</style>
