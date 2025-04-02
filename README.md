# 手机版扫码枪项目说明文档

## 项目概述
本项目是一款基于移动端的商品管理系统，通过集成条码扫描技术实现快速商品信息管理。支持主流条形码格式（EAN-13/UPC-A等）解析，适用于零售店的商品扫码查询，商品结算等场景。核心功能包括：
- ​**扫码管理**：实时扫描反馈商品信息，支持扫码记录存储与查询
- ​**数据交互**：Excel格式数据导入导出
- ​**商品管理**：完整的CRUD操作

## 使用方法

### 环境要求

- Node.js v20.0+

- HBuilderX 4.0+

- 微信开发者工具最新版

- npm 或 yarn 包管理工具

# 开通支付宝云服务

1. 打开uniCloud Web控制台

2. 右击cloudfunctions，上传所有云函数及公共模块

3. 右击database，上传所有DB Schema

# 安装依赖

1. 在项目根目录右击使用命令行窗口打开目录，执行npm install 安装node_modules依赖

# 小程序配置

1. 微信公众平台获取appid

2. 在manifest.json中配置小程序appid

3. 在\uni_modules\uni-config-center\uniCloud\cloudfunctions\common\uni-config-center\uni-id\config.josn配置微信的appid和appsecret

# 运行

1. 在HBuilderX中选择”运行“->"运行到小程序模拟器"

## 小程序体验入口
- 名称：我的物品录
- ![gh_401c931e7c59_258](https://github.com/user-attachments/assets/3e00847d-66b3-4bdd-9985-ad49cd3137c9)
