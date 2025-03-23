const ExcelJS = require('exceljs');
const uniID = require('uni-id-common')


module.exports = {
	_before: async function () { // 通用预处理器
		this.uniID = uniID.createInstance({
			clientInfo: this.getClientInfo()
		})

	},
	async checkLogin(){
		const dbObj = uniCloud.databaseForJQL({
			clientInfo: this.getClientInfo()
		})
		
		const token = this.getUniIdToken();
		const payload = await this.uniID.checkToken(token);
		if (!payload.uid) {
		    return {
		        code: -1,
		        msg: '用户未登录'
		    };
		}else{
			return {
				code:200
			}
		}
	},
	
	async exportGoods() {
		const dbObj = uniCloud.databaseForJQL({
			clientInfo: this.getClientInfo()
		})
		
		const token = this.getUniIdToken();
		const payload = await this.uniID.checkToken(token);
		if (!payload.uid) {
		    return {
		        code: -1,
		        msg: '用户未登录'
		    };
		}


		try {
			const allData = [];
			let offset = 0;
			const limit = 200;
			while (true) {
				const res = await dbObj.collection('goods-info').where('user_id==$env.uid').skip(offset).limit(limit).get();
				const data = res.data;
				if (data.length === 0) {
					break;
				}
				allData.push(...data);
				offset += limit;
			}
			const workbook = new ExcelJS.Workbook();
			const worksheet = workbook.addWorksheet('Goods');
			// 添加表头
			worksheet.addRow(['商品条形码', '商品名称', '商品价格', '商品数量','商品备注', '修改时间'])

			// 添加数据行
			allData.forEach(goods => {
				const date = new Date(goods.last_modify_date)
				const year = date.getFullYear()
				const month = String(date.getMonth() + 1).padStart(2, '0')
				const day = String(date.getDate()).padStart(2, '0')
				const formatTime = `${year}-${month}-${day}`
				worksheet.addRow([
					goods.goods_sn,
					goods.goods_name,
					goods.goods_price,
					goods.goods_num,
					goods.goods_notes,
					formatTime
				]);
			});
			const buffer = await workbook.xlsx.writeBuffer();
			const fileResult = await uniCloud.uploadFile({
				cloudPath: `exportfile/goods_export_${Math.random().toString(36).substring(2, 15)}.xlsx`,
				fileContent: buffer
			});
			// 生成临时下载链接（5分钟有效期）
			const fileID = fileResult.fileID;
			const expiredTime = Date.now() + 10 * 60 * 1000;; // 5分钟后过期
			const downloadURL = await uniCloud.getTempFileURL({
				fileList: [fileID],
				expire: expiredTime
			});

			return {
				code: 200,
				downloadUrl: downloadURL.fileList[0].tempFileURL
			};
		} catch (e) {
			console.log(e)
			return {
				code: 500,
				message: '数据导出失败',
				error: e
			};
		}
	},

	async importGoods(data) {
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
	        const userId = payload.uid;
	        const tasks = data.map(item => {
	            const goods = {
	                goods_sn: item[0] ? String(item[0]) : "",
	                goods_name: String(item[1]),
	                goods_price: Number(item[2]),
					goods_num: item[3]?Number(item[3]):"",
	                goods_notes: item[4] ? String(item[4]) : ""
	            };
				
	
	            // 检查数据是否存在，使用当前 item 生成查询条件
	            const queryCondition = item[0]
	                ? { user_id: userId, goods_sn: goods.goods_sn }
	                : { user_id: userId, goods_name: goods.goods_name };
					
					
				// console.log('goods',goods)
	            return dbObj.collection('goods-info').where(queryCondition).get()
	              .then(res => {
	                    if (res.data.length > 0) {
	                        // 如果数据存在，则更新
	                        return dbObj.collection('goods-info').doc(res.data[0]._id).update(goods);
	                    } else {
	                        // 如果数据不存在，则添加
	                        return dbObj.collection('goods-info').add(goods);
	                    }
	                })
	              .catch(error => {
	                    console.error('处理商品信息时出错:', error);
	                    // 可以选择返回一个错误对象，或者其他处理方式
	                    return { error: error };
	                });
	        });
	
	        const res = await Promise.all(tasks);
	        return {
	            code: 200,
	            message: '数据导入成功',
	            res: res
	        };
	    } catch (e) {
	        return {
	            code: 500,
	            message: '数据导入失败',
	            error: e
	        };
	    }
	}
}