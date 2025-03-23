const uniID = require('uni-id-common')

module.exports = {
	_before: async function() { // 通用预处理器
		this.uniID = uniID.createInstance({
			clientInfo: this.getClientInfo()
		})

	},
	// 增加商品信息
	async addGoods(params = {}) {
		const dbObj = uniCloud.databaseForJQL({
			clientInfo: this.getClientInfo()
		})
		const token = this.getUniIdToken()
		const payload = await this.uniID.checkToken(token)
		if (!payload.uid) {
			return {
				code: -1,
				msg: '用户未登录'
			}
		}
		
		// console.log(params)
		return await dbObj.collection('goods-info').add(params)
	},
	// 查找这个用户是否有这个商品
	async findGoods(goods_sn) {
		const dbObj = uniCloud.databaseForJQL({
			clientInfo: this.getClientInfo()
		})

		const token = this.getUniIdToken()
		const payload = await this.uniID.checkToken(token)
		if (!payload.uid) {
			return {
				code: -1,
				msg: '用户未登录'
			}
		}

		// 查询商品信息，同时验证用户ID和商品编号
		const goodsInfo = await dbObj.collection('goods-info')
			.where({
				goods_sn: goods_sn,
				user_id: payload.uid
			})
			.get()

		if (goodsInfo.data && goodsInfo.data.length > 0) {
			return {
				code: 0,
				msg: '查询成功',
				data: goodsInfo.data[0]
			}
		} else {
			return {
				code: -2,
				msg: '未找到相关商品',
				data: null
			}
		}
	},
	// 删除商品信息
	async removeGoods(params = {}) {
		const dbObj = uniCloud.databaseForJQL({
			clientInfo: this.getClientInfo()
		})
		const token = this.getUniIdToken()
		const payload = await this.uniID.checkToken(token)
		if (!payload.uid) {
			return {
				code: -1,
				msg: '用户未登录'
			}
		}

		return await dbObj.collection('goods-info').doc(params._id).remove()
	},
	// 修改商品信息
	async updateGoods(params = {}) {
		const dbObj = uniCloud.databaseForJQL({
			clientInfo: this.getClientInfo()
		})
		
		const token = this.getUniIdToken()
		const payload = await this.uniID.checkToken(token)
		if (!payload.uid) {
			return {
				code: -1,
				msg: '用户未登录'
			}
		}
		
		// 检查goods_price是否合法
		if (isNaN(params.goods_price)) {
			return {
				code: -1,
				msg: '商品价格不合法'
			}
		}

		const id = params._id
		delete params._id
		const tempGoodsInfo = {
			...params,
			goods_price: Number(params.goods_price),
			last_modify_date: new Date().getTime()
		}
		return await dbObj.collection('goods-info').doc(id).update(tempGoodsInfo)
	},
	// 搜索商品
	async searchGoods(params = {}) {
		const dbObj = uniCloud.databaseForJQL({
			clientInfo: this.getClientInfo()
		})

		const token = this.getUniIdToken()
		const payload = await this.uniID.checkToken(token)
		if (!payload.uid) {
			return {
				code: -1,
				msg: '用户未登录'
			}
		}

		const {
			keyword,
			page = 1,
			pageSize = 10
		} = params
		const skipAmount = (page - 1) * pageSize

		try {
			const result = await dbObj.collection('goods-info')
				.where({
					user_id: payload.uid,
					goods_name: new RegExp(keyword, 'i')
				})
				.skip(skipAmount)
				.limit(pageSize)
				.orderBy('last_modify_date', 'desc')
				.get()

			return {
				code: 0,
				msg: '搜索成功',
				data: result.data
			}
		} catch (err) {
			return {
				code: -2,
				msg: err.message
			}
		}
	},

	// 获取商品
	async getGoodsList({
		page = 1,
		pageSize = 20
	}) {
		const dbObj = uniCloud.databaseForJQL({
			clientInfo: this.getClientInfo()
		});

		const token = this.getUniIdToken();
		const payload = await this.uniID.checkToken(token);
		if (!payload.uid) {
			return {
				code: -1,
				msg: '用户未登录'
			};
		}
		try {
			// 查询商品信息，同时验证用户ID和商品编号
			const goodsInfo = await dbObj.collection('goods-info')
				.where({
					user_id: payload.uid,
				})
				.skip((page - 1) * pageSize)
				.limit(pageSize)
				.orderBy('last_modify_date', 'desc')
				.get();

			return {
				code: 0,
				msg: '获取成功',
				data: goodsInfo.data
			};
		} catch (error) {
			console.error('获取商品列表失败:', error);
			return {
				code: -2,
				msg: '获取商品列表失败',
				error: error.message
			};
		}
	}
}