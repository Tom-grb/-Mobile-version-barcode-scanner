<template>
	<view class="goodsBox">
		<view class="goods-info">
			<text class="goods-name">{{item.goods_name}}</text>
			<text class="goods-price">￥{{item.goods_price}}</text>
		</view>
		<view class="goods-meta">
			<text class="goods-code">编码：{{item.goods_sn || '未添加'}}</text>
			<text class="goods-time">{{formatMillisecondsToDate(item.last_modify_date)}}</text>
		</view>
	</view>
</template>

<script>
	import {
		formatMillisecondsToDate
	} from '@/utils/tool.js'
	export default {
		name: "goods-item",
		data() {
			return {

			};
		},
		methods:{
			formatMillisecondsToDate,
		},
		props:{
			item:{
				type:Object,
				default(){
					return {}
				}
			}
		}
	}
</script>

<style scoped>
	.goodsBox{
		padding: 25rpx;
		border-radius: 8rpx;
		background: #fff;
	}
	.goods-item:active {
		transform: scale(0.98);
	}

	.goods-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16rpx;
	}

	.goods-name {
		font-size: 32rpx;
		color: #333;
		font-weight: 500;
	}

	.goods-price {
		font-size: 32rpx;
		color: #ff3b30;
		font-weight: 500;
	}

	.goods-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.goods-code {
		font-size: 24rpx;
		color: #666;
	}

	.goods-time {
		font-size: 24rpx;
		color: #999;
	}
</style>