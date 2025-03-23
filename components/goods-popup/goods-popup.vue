<template>
	<view class="popup-mask" v-if="show" @click.stop="cancel">
		<view class="popup-content" @click.stop>
			<view class="popup-header">
				<text class="title">商品信息</text>
				<text class="close-btn" @click="cancel">×</text>
			</view>

			<view class="popup-body">
				<view class="form-item">
					<text class="label">商品条形码</text>
					<input v-if="isEditing" v-model="localGoods.goods_sn" class="input" placeholder="请输入商品名称" />
					<text v-else class="value">{{goods.goods_sn || '暂未填写'}}</text>
				</view>

				<view class="form-item">
					<text class="label">商品名称</text>
					<input v-if="isEditing" v-model="localGoods.goods_name" class="input" placeholder="请输入商品名称" />
					<text v-else class="value">{{goods.goods_name}}</text>
				</view>

				<view class="form-item">
					<text class="label">商品价格</text>
					<input v-if="isEditing" v-model="localGoods.goods_price" class="input" type="digit"
						placeholder="请输入商品价格" />
					<text v-else class="value">￥{{goods.goods_price}}</text>
				</view>
				
				<view class="form-item">
					<text class="label">商品数量</text>
					<input v-if="isEditing" v-model="localGoods.goods_num" class="input" type="digit" placeholder="请输入商品数量" />
					<text v-else class="value">{{goods.goods_num || '暂无数量'}}</text>
				</view>

				<view class="form-item">
					<text class="label">商品备注</text>
					<input v-if="isEditing" v-model="localGoods.goods_notes" class="input" placeholder="请输入商品备注" />
					<text v-else class="value">{{goods.goods_notes || '暂无备注'}}</text>
				</view>
			</view>

			<view class="popup-footer">
				<button v-if="!isEditing" @click="handleEdit" class="btn edit-btn">编辑</button>
				<block v-else>
					<button @click="handleConfirm" class="btn confirm-btn">确认</button>
					<button @click="handleCancel" class="btn back-btn">返回</button>
				</block>
				<button @click="handleDelete" class="btn delete-btn">删除</button>
			</view>
		</view>
	</view>
</template>

<script>
	const goodsInfoObj = uniCloud.importObject('goodsInfoObj')

	export default {
		name: 'goods-popup',
		props: {
			show: {
				type: Boolean,
				default: false
			},
			goods: {
				type: Object,
				default: () => ({})
			}
		},
		data() {
			return {
				isEditing: false,
				localGoods: {}
			}
		},
		watch: {
			goods: {
				handler(newVal) {
					this.localGoods = JSON.parse(JSON.stringify(newVal))
				},
				immediate: true
			}
		},
		methods: {
			gotoLogin(){
				uni.navigateTo({
					url: '/uni_modules/uni-id-pages/pages/login/login-withoutpwd'
				})
			},
			
			cancel() {
				this.isEditing = false
				this.$emit('update:show', false)
			},
			handleEdit() {
				this.isEditing = true
			},
			handleCancel() {
				this.isEditing = false
				this.localGoods = JSON.parse(JSON.stringify(this.goods))
			},
			async handleConfirm() {
				try {
					this.localGoods.goods_price = parseFloat(this.localGoods.goods_price)
					this.localGoods.goods_num = parseFloat(this.localGoods.goods_num)
					if (isNaN(this.localGoods.goods_price) || this.localGoods.goods_price < 0) {
						uni.showToast({
							title: '价格要求为数字且大于0',
							icon: 'none'
						});
						return
					}
					if (isNaN(this.localGoods.goods_num) || this.localGoods.goods_num < 0) {
						uni.showToast({
							title: '数量要求为数字且大于0',
							icon: 'none'
						});
						return
					}

					const res = await goodsInfoObj.updateGoods(this.localGoods)
					if(res.code===-1){
						uni.showToast({
							title: '未登录/登录过期',
							icon:'none'
						})
						setTimeout(()=>{
							this.gotoLogin()
						},1000)
						return
					}
					this.isEditing = false
					this.$emit('refresh')

				} catch (e) {
					uni.showToast({
						title: '更新失败',
						icon: 'error'
					})
				}
			},
			async handleDelete() {
				uni.showModal({
					title: '提示',
					content: '确定要删除该商品吗？',
					success: async (res) => {
						if (res.confirm) {
							try {
								const rescode = await goodsInfoObj.removeGoods({
									_id: this.goods._id
								})
								if(rescode.code===-1){
									uni.showToast({
										title: '未登录/登录过期',
										icon:'none'
									})
									setTimeout(()=>{
										this.gotoLogin()
									},1000)
									return
								}
								uni.showToast({
									title: '删除成功',
									icon: 'success'
								})
								this.cancel()
								this.$emit('refresh')
							} catch (e) {
								uni.showToast({
									title: '删除失败',
									icon: 'error'
								})
							}
						}
					}
				})
			}
		}
	}
</script>

<style>
	.popup-mask {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		animation: fadeIn 0.2s ease-out;
	}

	.popup-content {
		width: 80%;
		background: #fff;
		border-radius: 32rpx;
		overflow: hidden;
		animation: slideIn 0.2s ease-out;
	}

	.popup-header {
		padding: 0 24rpx;
		border-bottom: 2rpx solid #eee;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.title {
		font-size: 36rpx;
		font-weight: 600;
		color: #333;
	}

	.close-btn {
		font-size: 48rpx;
		color: #999;
		padding: 8rpx 16rpx;
	}

	.popup-body {
		padding: 24rpx 24rpx;
	}

	.form-item {
		margin-bottom: 10rpx;
	}
	

	.label {
		font-size: 28rpx;
		color: #666;
		margin-bottom: 7rpx;
		display: block;
	}

	.input {
		height: 80rpx;
		border: 2rpx solid #ddd;
		border-radius: 16rpx;
		padding: 0 24rpx;
		font-size: 32rpx;
		transition: all 0.3s;
		height: 70rpx;
	}

	.input:focus {
		border-color: #007aff;
		box-shadow: 0 0 0 4rpx rgba(0, 122, 255, 0.1);
	}

	.value {
		font-size: 32rpx;
		color: #333;
	}

	.popup-footer {
		padding: 0 25rpx 25rpx;
		display: flex;
		gap: 24rpx;
	}

	.btn {
		flex: 1;
		height: 80rpx;
		border-radius: 16rpx;
		font-size: 32rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s;
	}

	.edit-btn {
		background: #007aff;
		color: #fff;
	}

	.confirm-btn {
		background: #34c759;
		color: #fff;
	}

	.back-btn {
		background: #ff9500;
		color: #fff;
	}

	.delete-btn {
		background: #ff3b30;
		color: #fff;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}

		to {
			opacity: 1;
		}
	}

	@keyframes slideIn {
		from {
			transform: translateY(20px);
			opacity: 0;
		}

		to {
			transform: translateY(0);
			opacity: 1;
		}
	}
</style>