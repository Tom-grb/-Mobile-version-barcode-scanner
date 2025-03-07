# 手机版扫码枪项目说明文档

## 项目概述
本项目是一款基于移动端的商品管理系统，通过集成条码扫描技术实现快速商品信息管理。支持主流条形码格式（EAN-13/UPC-A等）解析，适用于零售店的商品扫码查询，商品结算等场景。核心功能包括：
- ​**扫码管理**：实时扫描反馈商品信息，支持扫码记录存储与查询
- ​**数据交互**：Excel格式数据导入导出
- ​**商品管理**：完整的CRUD操作

## 使用方法
- 在文件\uni_modules\uni-config-center\uniCloud\cloudfunctions\common\uni-config-center\uni-id，添加appid,appsecret
  ```vue
  "mp-weixin": {
    "tokenExpiresIn": 2592000,
    "tokenExpiresThreshold": 864000,
    "oauth": {
       
      "weixin": {
        "appid": "你的微信appid",
        "appsecret": "你的微信密钥"
      }
    }
  },
  ```
- 在文件 manifest.json 添加微信appid

