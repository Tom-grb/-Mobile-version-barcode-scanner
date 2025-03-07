<template>
	<view class="container">
		<!-- 用户信息卡片 -->
		<view class="user-card">
			<view class="avatar-section" @click="changeAvatar">
				<image class="avatar" :src="userInfo.avatar_file || '/static/default-avatar.png'" mode="aspectFill">
				</image>
			</view>
			<view class="user-info">
				<view class="nickname-wrapper" @click="showNicknameInput">
					<text class="nickname">{{ userInfo.nickname || '未登录' }}</text>
					<text class="iconfont icon-edit"></text>
				</view>
			</view>
		</view>

		<!-- 功能列表 -->
		<view class="feature-list">
			<view class="feature-item" @click="handleModel">
				<text class="iconfont icon-import"></text>
				<text class="feature-text">导入模板以及导入说明</text>
				<text class="iconfont icon-right"></text>
			</view>

			<view class="feature-item" @click="handleImport">
				<text class="iconfont icon-import"></text>
				<text class="feature-text">导入Excel</text>
				<text class="iconfont icon-right"></text>
			</view>

			<view class="feature-item" @click="handleExport">
				<text class="iconfont icon-export"></text>
				<text class="feature-text">导出Excel</text>
				<text class="iconfont icon-right"></text>
			</view>

			<view class="feature-item" @click="showFeedback">
				<text class="iconfont icon-feedback"></text>
				<text class="feature-text">意见反馈</text>
				<text class="iconfont icon-right"></text>
			</view>
		</view>

		<!-- 修改昵称弹窗 -->
		<uni-popup ref="nicknamePopup" type="center">
			<view class="popup-content">
				<view class="popup-title">修改昵称</view>
				<input class="nickname-input" v-model="newNickname" placeholder="请输入新昵称" maxlength="12" />
				<view class="popup-buttons">
					<button class="cancel-btn" @click="closeNicknamePopup">取消</button>
					<button class="confirm-btn" @click="updateNickname">确认</button>
				</view>
			</view>
		</uni-popup>

		<!-- 意见反馈弹窗 -->
		<uni-popup ref="feedbackPopup" type="center">
			<view class="popup-content">
				<view class="popup-title">意见反馈</view>
				<textarea class="mobile-input" v-model="mobile" placeholder="请输入您的电话，方便与您联系" />
				<textarea class="feedback-input" v-model="feedbackContent" placeholder="请输入您的意见或建议" maxlength="500" />
				<view class="popup-buttons">
					<button class="cancel-btn" @click="closeFeedbackPopup">取消</button>
					<button class="confirm-btn" @click="submitFeedback">提交</button>
				</view>
			</view>
		</uni-popup>

		<uni-popup ref="exportPopup" type="center">
			<view class="popup-content">
				<view class="popup-title">复制成功√</view>
				<view class="export-content">您已复制下载连接，请粘贴到【浏览器】中下载。当前连接10分钟后过期</view>
				<input class="tmpurl-input" v-model="tmpurl" />
				<view class="popup-buttons">
					<button class="confirm-btn" @click="coypContent">复制</button>
					<button class="confirm-btn" @click="closeexportPopup">好的</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	const db = uniCloud.database()
	const goodsExportImport = uniCloud.importObject('goodsExportImport')
	import * as XLSX from 'xlsx';

	export default {
		data() {
			return {
				userInfo: {},
				newNickname: '',
				feedbackContent: '',
				mobile: '',
				tmpurl: ''
			}
		},
		onLoad() {
			this.getUserInfo()
			console.log('onLoad')
		},
		onshow() {
			this.getUserInfo()
		},
		methods: {
			handleModel() {
				uni.navigateTo({
					url: "/pages/subpack/explanation/explanation"
				})
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
					let userInfo = uni.getStorageSync('uni-id-pages-userInfo')
					if (this.isJSON(userInfo)) {
						userInfo = JSON.parse(userInfo)
					}

					// console.log('获取用户信息', userInfo);

					if (userInfo) {
						this.userInfo = userInfo;
						// console.log('有用户信息', this.userInfo);
					} else {
						// console.log('解析后没有用效用户信息');
						this.handleRelogin();
					}
				} catch (error) {
					console.error('获取用户信息时发生错误:', error);
					this.handleRelogin();
				}
			},


			showNicknameInput() {
				this.newNickname = this.userInfo.nickname || '未知昵称'
				this.$refs.nicknamePopup.open()
			},

			closeNicknamePopup() {
				this.$refs.nicknamePopup.close()
			},


			// 抽取重新登录逻辑为单独方法
			handleRelogin() {
				// 清除所有存储
				if (uni.getStorageSync('uni_id_token')) {
					uni.removeStorageSync('uni_id_token')
				}
				if (uni.getStorageSync('uni-id-pages-userInfo')) {
					uni.removeStorageSync('uni-id-pages-userInfo')
				}
				if (uni.getStorageSync('uni_id_token_expired')) {
					uni.removeStorageSync('uni_id_token_expired')
				}

				uni.showToast({
					title: '请登录',
					icon: 'none'
				})

				setTimeout(() => {
					uni.redirectTo({
						url: '../../uni_modules/uni-id-pages/pages/login/login-withoutpwd'
					})
				}, 1500)
			},

			changeAvatar() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: async (res) => {
						const tempFilePath = res.tempFilePaths[0]

						// 显示上传中提示
						uni.showLoading({
							title: '上传中...'
						})
						console.log(tempFilePath)
						try {
							// 上传图片到云存储
							const uploadRes = await uniCloud.uploadFile({
								filePath: tempFilePath,
								cloudPath: `avatar/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.jpg`
							})
							const tempFileURL = await uniCloud.getTempFileURL({
								fileList: [uploadRes.fileID]
							})
							
							let avatarUrl = tempFileURL.fileList[0].tempFileURL

							const questionMarkIndex = avatarUrl.indexOf('?');
							if (questionMarkIndex !== -1) {
								avatarUrl = avatarUrl.substring(0, questionMarkIndex);
							}

							// 更新用户信息
							await db.collection('uni-id-users').doc(this.userInfo._id).update({
								avatar_file: avatarUrl
							})

							// 更新本地存储
							this.userInfo.avatar_file = avatarUrl


							uni.setStorageSync('uni-id-pages-userInfo', JSON.stringify(this.userInfo))

							uni.hideLoading()
							uni.showToast({
								title: '头像更新成功',
								icon: 'success'
							})
						} catch (e) {
							console.error('头像更新失败:', e)
							uni.hideLoading()
							uni.showToast({
								title: e.message || '上传失败',
								icon: 'error'
							})
						}
					},
					fail: (err) => {
						console.error('选择图片失败:', err)
						uni.showToast({
							title: '选择图片失败',
							icon: 'none'
						})
					}
				})
			},

			async updateNickname() {
				if (!this.newNickname.trim()) {
					uni.showToast({
						title: '昵称不能为空',
						icon: 'none'
					})
					return
				}

				try {

					console.log(this.userInfo._id)
					await db.collection('uni-id-users').where('_id==$env.uid').update({
						nickname: this.newNickname
					})

					this.userInfo.nickname = this.newNickname
					uni.setStorageSync('uni-id-pages-userInfo', JSON.stringify(this.userInfo))

					this.closeNicknamePopup()
					uni.showToast({
						title: '昵称更新成功',
						icon: 'success'
					})
				} catch (e) {
					uni.showToast({
						title: '更新失败',
						icon: 'error'
					})
				}
			},

			async handleImport() {
				try {
					// 选择文件
					const chooseRes = await uni.chooseMessageFile({
						count: 1,
						type: 'file',
						extension: ['xlsx', '.xlsx']
					});

					const filePath = chooseRes.tempFiles[0].path

					// 创建文件系统管理器
					const fs = wx.getFileSystemManager();

					// 读取文件内容
					let fileData;
					try {
						fileData = fs.readFileSync(filePath, 'base64');
					} catch (error) {
						console.error('读取文件失败:', error);
						uni.showToast({
							title: '读取文件失败',
							icon: 'none',
							duration: 2000
						});
						return;
					}

					// 使用 xlsx 解析 Excel 文件
					const workbook = XLSX.read(fileData, {
						type: 'base64'
					});
					const worksheet = workbook.Sheets[workbook.SheetNames[0]];
					
					// 将工作表转换为 JSON 数据
					const jsonData = XLSX.utils.sheet_to_json(worksheet, {
						header: 1
					});
					jsonData.shift()
					
					console.log(jsonData)
					
					// 检查 goods_price 列是否包含非数字
					const hasNonNumericPrice = jsonData.some(row => {
						const price = row[2];
						return !(typeof price === 'number' && !isNaN(price) && Number(price) >= 0);
					});

					// 检查名字是否有空
					const hasEmptyName = jsonData.some(row => {
						const name = row[1];
						return !name || name.trim() === '';
					});

					if (hasNonNumericPrice) {
						uni.showToast({
							title: '价格列包含非数字或者负数,请修改后重新上传',
							icon: 'none',
							duration: 2000
						});
						return;
					} else if (hasEmptyName) {
						uni.showToast({
							title: '商品名称不能为空',
							icon: 'none',
							duration: 2000
						});
						return;
					}
					// console.log(hasNonNumericPrice,hasEmptyName)
					// console.log(jsonData)

					// 调用云对象处理数据
					const res = await goodsExportImport.importGoods(jsonData);
					console.log('返回',res)
					if (res.code === 500) {
						uni.showToast({
							title: res.message,
							icon: 'none',
							duration: 2000
						})
					} else {
						uni.showToast({
							title: res.message,
							icon: 'none',
							duration: 2000
						})
					}

				} catch (error) {
					console.error('发生错误:', error);
					uni.showToast({
						title: '发生错误',
						icon: 'none',
						duration: 2000
					});
				}
			},



			async handleExport() {
				try {
					const res = await goodsExportImport.exportGoods();
					if (res.code) {
						this.tmpurl = res.downloadUrl
						this.$refs.exportPopup.open()
						this.coypContent(this.tmpurl)
					} else {
						uni.showToast({
							title: '导出失败',
							icon: 'none'
						})
					}
				} catch (e) {
					uni.showToast({
						title: '导出失败',
						icon: 'none'
					})
				}
			},

			coypContent() {
				uni.setClipboardData({
					data: this.tmpurl,
					success: () => {
						uni.showToast({
							title: '复制成功',
							icon: 'success'
						})
					},
					fail: () => {
						uni.showToast({
							title: '复制失败',
							icon: 'none'
						})
					}
				})
			},

			closeexportPopup() {
				this.$refs.exportPopup.close()
			},

			showFeedback() {
				this.$refs.feedbackPopup.open()
			},
			closeFeedbackPopup() {
				this.$refs.feedbackPopup.close()
				this.feedbackContent = ''
			},
			async submitFeedback() {
				const regex = /^1[3-9]\d{9}$/;
				if (!this.feedbackContent.trim()) {
					uni.showToast({
						title: '请输入反馈内容',
						icon: 'none'
					})
					return
				} else if (this.mobile === '') {
					uni.showToast({
						title: '手机号不能为空',
						icon: 'none'
					})
					return
				} else if (!regex.test(this.mobile)) {
					console.log(this.mobile);
					uni.showToast({
						title: '请输入有效的手机号',
						icon: 'none'
					})
					return
				}

				try {
					const res = await db.collection('opendb-feedback').add({
						user_id: this.userInfo._id,
						content: this.feedbackContent,
						mobile: this.mobile,
						create_date: Date.now()
					})

					console.log(res)

					this.closeFeedbackPopup()
					uni.showToast({
						title: '反馈提交成功',
						icon: 'success'
					})
				} catch (e) {
					console.log(e)
					uni.showToast({
						title: '提交失败',
						icon: 'error'
					})
				}
			}

		}
	}
</script>

<style>
	.container {
		min-height: 100vh;
		background: #f5f5f5;
		padding: 30rpx;
	}

	.user-card {
		background: #fff;
		border-radius: 20rpx;
		padding: 40rpx;
		display: flex;
		align-items: center;
		margin-bottom: 30rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
	}

	.avatar-section {
		position: relative;
		margin-right: 30rpx;
	}

	.avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 60rpx;
		background: #eee;
	}

	.edit-badge {
		position: absolute;
		right: -6rpx;
		bottom: -6rpx;
		width: 40rpx;
		height: 40rpx;
		background: #007AFF;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.edit-badge .icon-camera {
		color: #fff;
		font-size: 24rpx;
	}

	.user-info {
		flex: 1;
	}

	.nickname-wrapper {
		display: flex;
		align-items: center;
	}

	.nickname {
		font-size: 36rpx;
		color: #333;
		font-weight: 500;
		margin-right: 16rpx;
	}

	.icon-edit {
		font-size: 32rpx;
		color: #999;
	}

	.feature-list {
		background: #fff;
		border-radius: 20rpx;
		padding: 0 20rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
	}

	.feature-item {
		display: flex;
		align-items: center;
		padding: 30rpx 20rpx;
		border-bottom: 1rpx solid #eee;
	}

	.feature-item:last-child {
		border-bottom: none;
	}

	.feature-item .iconfont {
		font-size: 40rpx;
		color: #007AFF;
		margin-right: 20rpx;
	}

	.feature-item .icon-right {
		margin-left: auto;
		color: #999;
		font-size: 32rpx;
	}

	.feature-text {
		font-size: 28rpx;
		color: #333;
	}

	.popup-content {
		background: #fff;
		border-radius: 20rpx;
		width: 600rpx;
		padding: 30rpx;
	}

	.export-content {
		margin-bottom: 25rpx;
	}

	.popup-title {
		font-size: 32rpx;
		color: #333;
		font-weight: 500;
		text-align: center;
		margin-bottom: 30rpx;
	}

	.nickname-input {
		height: 80rpx;
		background: #f5f5f5;
		border-radius: 8rpx;
		padding: 0 20rpx;
		font-size: 28rpx;
		margin-bottom: 30rpx;
	}

	.tmpurl-input {
		width: 100%;
		height: 80rpx;
		background: #f5f5f5;
		border-radius: 8rpx;
		padding: 0 20rpx;
		margin-bottom: 30rpx;
		box-sizing: border-box;
	}

	.mobile-input {
		width: 100%;
		height: 80rpx;
		background: #f5f5f5;
		border-radius: 8rpx;
		padding: 20rpx;
		font-size: 28rpx;
		margin-bottom: 30rpx;
		box-sizing: border-box;
	}


	.feedback-input {
		height: 300rpx;
		width: 100%;
		background: #f5f5f5;
		border-radius: 8rpx;
		padding: 20rpx;
		font-size: 28rpx;
		margin-bottom: 30rpx;
		box-sizing: border-box;
	}

	.popup-buttons {
		display: flex;
		justify-content: space-between;
	}

	.popup-buttons button {
		width: 260rpx;
		height: 80rpx;
		border-radius: 8rpx;
		font-size: 28rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.cancel-btn {
		background: #f5f5f5;
		color: #666;
	}

	.confirm-btn {
		background: #007AFF;
		color: #fff;
	}

	/* 添加动画效果 */
	.user-card {
		animation: slideDown 0.5s ease-out;
	}

	.feature-list {
		animation: slideUp 0.5s ease-out;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-20rpx);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes slideUp {
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