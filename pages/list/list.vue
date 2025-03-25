<template>
	<view class="goods-list-page">
		<!-- 直接在页面中展示商品列表，不使用 scroll-view -->
		<view v-if="goodsList.length > 0">
			<view class="goods-item" v-for="item in goodsList" :key="item._id" @click="showGoodsDetail(item)">
				<goods-item :item="item"></goods-item>
			</view>

			<!-- 加载更多 -->
			<view class="load-more" v-if="isLoading">
				<text class="loading-text">加载中...</text>
			</view>
			<view class="no-more" v-else>
				<text class="no-more-text">没有更多了</text>
			</view>
		</view>

		<view class="nothing" v-else-if="goodsList.length === 0 && isLoading">
			<text class="font">加载中...</text>
		</view>
		<view class="nothing" v-else-if="goodsList.length === 0 && !isLoading">
			<text class="font">--您还未添加商品--</text>
			<image class="empty-icon"
				src="https://env-00jxt6l7w3we.normal.cloudstatic.cn/showPic/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-03-23%20135635.png">
			</image>
		</view>

		<!-- 商品详情弹窗 -->
		<goods-popup :show="showPopup" :goods="currentGoods" @update:show="showPopup = $event" @refresh="refreshList" />
	</view>
</template>

<script>
	const goodsCloudObj = uniCloud.importObject('goodsInfoObj');
	export default {
		data() {
			return {
				goodsList: [], // 存储商品列表数据
				page: 1, // 当前页码
				pageSize: 20, // 每页数据量
				isLoading: false, // 是否正在加载数据
				isNoMore: false, // 是否已经没有更多数据
				showPopup: false,
				currentGoods: {}
			};
		},
		onLoad() {
			this.getGoods();
		},
		onPullDownRefresh() {
			console.log(123);
			this.page = 1;
			this.pageSize = 20;
			this.goodsList = []
			this.isNoMore = false
			this.getGoods();
		},
		onReachBottom() {
			console.log('bottom')
			this.getGoods();
		},
		methods: {
			async getGoods() {
				if (this.isLoading || this.isNoMore) {
					return;
				}
				this.isLoading = true;
				const result = await goodsCloudObj.getGoodsList({
					page: this.page,
					pageSize: this.pageSize
				});

				if (result.code === 0) {
					if (result.data.length < this.pageSize) {
						this.isNoMore = true;
					}
					this.goodsList = [...this.goodsList, ...result.data];
					this.page++;
				} else if (result.code === -1) {
					uni.showToast({
						title: '未登录/登录过期',
						icon: 'none'
					});
					this.isLoading = false;
					uni.stopPullDownRefresh();
					setTimeout(() => {
						uni.navigateTo({
							url: '/uni_modules/uni-id-pages/pages/login/login-withoutpwd'
						})
					}, 1000)
					return
				} else {
					uni.showToast({
						title: result.msg,
						icon: 'none'
					});
				}
				// 数据获取完成，停止下拉刷新动画
				uni.stopPullDownRefresh();
				this.isLoading = false;
			},

			showGoodsDetail(goods) {
				this.currentGoods = goods;
				this.showPopup = true;
			},
			refreshList() {
				this.page = 1;
				this.pageSize = 20;
				this.goodsList = []
				this.isNoMore = false
				this.getGoods();
				this.showPopup = false;
			}
		}
	};
</script>

<style lang="scss">
	.goods-list-page {
		padding: 20rpx;
	}

	.goods-item {
		border: 1rpx solid #ccc;
		padding: 10rpx;
		border-radius: 20rpx;
		margin-bottom: 10rpx;
	}

	.nothing {
		padding: 30rpx 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	.font {
		font-size: 38rpx;
		color: #c7ccd7;
	}

	.empty-icon {
		width: 500rpx;
		height: 500rpx;
	}

	.load-more,
	.no-more {
		text-align: center;
		padding: 30rpx 0;
	}

	.loading-text,
	.no-more-text {
		font-size: 24rpx;
		color: #999;
	}
</style>