"use strict";const t=require("../../common/vendor.js"),o=require("../../uni_modules/uni-id-pages/common/store.js"),s=require("../../common/assets.js"),i=t.er.importObject("goodsInfoObj"),e={data:()=>({goodsList:[],scanning:!1,lastScanTime:0}),computed:{totalPrice(){return this.goodsList.reduce(((t,o)=>t+o.goods_price*o.quantity),0).toFixed(2)}},methods:{checkLogin:()=>!!o.store.hasLogin||(t.index.navigateTo({url:"/uni_modules/uni-id-pages/pages/login/login-withoutpwd"}),!1),handleScanWithThrottle(t){if(!this.checkLogin())return;console.log("扫码结果：",t.detail.result);const o=Date.now();this.scanning||o-this.lastScanTime<2e3||(console.log("整备调用"),this.lastScanTime=o,this.handleScan(t))},async handleScan(o){if(!this.scanning){this.scanning=!0;try{const s=o.detail.result;console.log("handleScan",s);const e=this.goodsList.find((t=>t.goods_sn===s));if(e){const t=this.goodsList.indexOf(e);return this.updateQuantity(t,1),void(this.scanning=!1)}const n=await i.findGoods(s);if(0===n.code){const t=n.data;this.goodsList.unshift({...t,quantity:1,isNew:!0}),setTimeout((()=>{this.goodsList[0].isNew=!1}),500)}else t.index.showToast({title:"商品不存在",icon:"error"})}catch(s){t.index.showToast({title:"扫描失败",icon:"error"})}finally{this.scanning=!1}}},updateQuantity(t,o){const s=this.goodsList[t].quantity+o;s<1||(this.goodsList[t].quantity=s)},removeItem(o){t.index.showModal({title:"提示",content:"确定要删除该商品吗？",success:t=>{t.confirm&&this.goodsList.splice(o,1)}})},showClearConfirm(){t.index.showModal({title:"提示",content:"确定要清空所有商品吗？",success:t=>{t.confirm&&(this.goodsList=[])}})}}};const n=t._export_sfc(e,[["render",function(o,i,e,n,a,c){return t.e({a:t.o(((...t)=>c.handleScanWithThrottle&&c.handleScanWithThrottle(...t))),b:a.goodsList.length>0},a.goodsList.length>0?{c:t.f(a.goodsList,((o,s,i)=>({a:t.t(o.goods_name),b:t.t(o.goods_price),c:t.o((t=>c.updateQuantity(s,-1)),s),d:o.quantity<=1?1:"",e:t.t(o.quantity),f:t.o((t=>c.updateQuantity(s,1)),s),g:t.o((t=>c.removeItem(s)),s),h:s,i:o.isNew?1:""})))}:{d:s._imports_0},{e:a.goodsList.length>0},a.goodsList.length>0?{f:t.o(((...t)=>c.showClearConfirm&&c.showClearConfirm(...t)))}:{},{g:t.t(c.totalPrice),h:a.goodsList.length>0?1:""})}]]);wx.createPage(n);
