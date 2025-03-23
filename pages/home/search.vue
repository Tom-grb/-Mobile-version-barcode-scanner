<template>
	<view class="search-container">
		<!-- 搜索头部 -->
		<view class="search-header">
			<view class="search-input-box">
				<text class="iconfont icon-search"></text>
				<input class="search-input" type="text" v-model="searchKeyword" placeholder="搜索商品名称"
					confirm-type="search" @confirm="handleSearch" focus />
				<text v-if="searchKeyword" class="clear-icon" @click="clearSearch">×</text>
			</view>
			<text class="cancel-btn" @click="goBack">取消</text>
		</view>

		<!-- 搜索结果列表 -->
		<scroll-view class="search-results" scroll-y @scrolltolower="loadMore" v-if="goodsList.length > 0">
			<view class="goods-item" v-for="item in goodsList" :key="item._id" @click="showGoodsDetail(item)">
				<goods-item :item="item"></goods-item>
			</view>

			<!-- 加载更多 -->
			<view class="load-more" v-if="hasMore">
				<text class="loading-text">加载中...</text>
			</view>
			<view class="no-more" v-else>
				<text class="no-more-text">没有更多了</text>
			</view>
		</scroll-view>

		<!-- 无搜索结果 -->
		<view class="empty-result" v-else-if="searched">
			<text class="empty-text">未找到相关商品</text>
		</view>
		
		<!-- 商品详情弹窗 -->
		<goods-popup :show="showPopup" :goods="currentGoods" @update:show="showPopup = $event" @refresh="refreshList" />
		
	</view>
</template>

<script>


	const goodsInfoObj = uniCloud.importObject('goodsInfoObj')

	export default {
		data() {
			return {
				searchKeyword: '',
				goodsList: [],
				pageSize: 10,
				page: 1,
				hasMore: true,
				searched: false,
				showPopup: false,
				currentGoods: {}
			}
		},
		methods: {
			goBack() {
				uni.navigateBack()
			},
			clearSearch() {
				this.searchKeyword = ''
				this.goodsList = []
				this.searched = false
			},
			async handleSearch() {
				if (!this.searchKeyword.trim()) {
					uni.showToast({
						title: '请输入搜索关键词',
						icon: 'none'
					})
					return
				}

				this.page = 1
				this.hasMore = true
				this.searched = true
				await this.searchGoods()
			},
			async searchGoods() {
				try {
					const res = await goodsInfoObj.searchGoods({
						keyword: this.searchKeyword,
						page: this.page,
						pageSize: this.pageSize
					})
					if(res.code===-1){
						uni.showToast({
							title: '未登录/登录过期',
							icon:'none'
						})
						setTimeout(()=>{
							uni.navigateTo({
								url: '/uni_modules/uni-id-pages/pages/login/login-withoutpwd'
							})
						},1000)
						return
					}

					if (this.page === 1) {
						this.goodsList = res.data
					} else {
						this.goodsList = [...this.goodsList, ...res.data]
					}

					this.hasMore = res.data.length === this.pageSize
				} catch (e) {
					uni.showToast({
						title: '搜索失败',
						icon: 'error'
					})
				}
			},
			async loadMore() {
				if (!this.hasMore) return
				this.page++
				await this.searchGoods()
			},
			showGoodsDetail(goods) {
				this.currentGoods = goods
				this.showPopup = true
			},
			refreshList() {
				this.handleSearch()
				this.showPopup = false
			},

		}
	}
</script>

<style>
	.search-container {
		min-height: 100vh;
		background: #f5f5f5;
	}

	.search-header {
		position: sticky;
		top: 0;
		z-index: 100;
		display: flex;
		align-items: center;
		padding: 20rpx 32rpx;
		background: #fff;
	}

	.search-input-box {
		flex: 1;
		height: 72rpx;
		background: #f5f5f5;
		border-radius: 36rpx;
		display: flex;
		align-items: center;
		padding: 0 24rpx;
		margin-right: 20rpx;
	}

	.icon-search {
		font-size: 32rpx;
		color: #999;
		margin-right: 12rpx;
	}

	.search-input {
		flex: 1;
		height: 72rpx;
		font-size: 28rpx;
	}

	.clear-icon {
		font-size: 40rpx;
		color: #999;
		padding: 0 12rpx;
	}

	.cancel-btn {
		font-size: 28rpx;
		color: #007AFF;
	}

	.search-results {
		height: calc(100vh - 112rpx);
		padding: 20rpx;
		box-sizing: border-box;
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

	.empty-result {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: 200rpx;
	}

	.empty-image {
		width: 200rpx;
		height: 200rpx;
		margin-bottom: 20rpx;
	}

	.empty-text {
		font-size: 28rpx;
		color: #999;
	}

	/* 添加动画效果 */
	.goods-item {
		animation: slideIn 0.3s ease-out;
		margin-bottom: 17rpx;
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
</style>