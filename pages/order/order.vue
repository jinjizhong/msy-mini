<template>
	<view class="content">
		<!-- 顶部的tabbar -->
		<view class="navbar">
			<view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{ current: tabCurrentIndex === index }" @click="tabCurrentIndex = index">
				{{ item.text }}
			</view>
		</view>
		<!-- 下面的list -->
		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
			<swiper-item class="tab-content" v-for="(tabItem, tabIndex) in navList" :key="tabIndex">
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="getMoreData">
					<!-- 空白页 -->
					<empty v-if="tabItem.loaded === true && tabItem.orderList.length === 0" text='暂无任何订单'/>
					<!-- 订单列表 -->
					<view v-for="(item, index) in tabItem.orderList" :key="index" class="box-shadow order-item" @click="itemClick(item)">
						<!-- 已完成 2，待评价3 -->
						<view class="top-title" v-if="tabCurrentIndex==2||tabCurrentIndex==3" @click="toStore(item)">
							{{item.storeName}}
						</view>
						<view class="line" v-if="tabCurrentIndex==2||tabCurrentIndex==3"/>
						<view class="order-inner">
							<image class="image-bg" :src="item.packageThumbUrl||item.thumbUrl" mode="aspectFill" />
							<view class="item-right">
								<text class="clamp2 title">{{ item.packageName }}</text>
								<view class="pflex">
									<text class="price">￥{{ item.packagePrice||item.orderAmount }}</text>
								</view>
								<!--待核销 0，已退单 4，待支付 1-->
								<view class="yuyue" v-if="tabCurrentIndex==0||tabCurrentIndex==1||tabCurrentIndex==4">
									<!-- 待核销 -->
									<text :class="tabCurrentIndex == 0 ? 't1' : 't2'" v-if="tabCurrentIndex==0">
										{{item.isAppointment|formApoint}}
									</text>
									<text class="t11" v-if="tabCurrentIndex==0&&item.isAppointment==1&&item.appointmentTime">
										请在{{item.appointmentTime|formatTime}}到店
									</text>
									<!-- 待支付 -->
									<text class="t3" v-if="tabCurrentIndex==1">{{item.time_end1}}</text>
									<text class="t31 flex_column_center" v-if="tabCurrentIndex==4">{{item.refundStatus|refundFormat}}</text> 
									<!-- <text class="t31 flex_column_center" v-if="tabCurrentIndex==1">已超时</text> -->
									<view class="btn1 flex_column_center" v-if="tabCurrentIndex==1" @click="goPay(item)">去支付</view>
									<!-- <view class="btn2 flex_column_center">重新购买</view> -->
								</view>
							</view>
						</view>
						<!-- 已完成 2，待评价 3 -->
						<view class="bottom" v-if="tabCurrentIndex==2||tabCurrentIndex==3">
							<view class="flex_row_center" v-if="tabCurrentIndex==2&&item.orderTime">
								该服务已于{{item.orderTime|formatTime}}完成
							</view>
							<view :class="item.status==3?'statu3':'statu'||item.status==4?'statu4':'statu'" v-if="tabCurrentIndex==2">
								{{item.status|statusForm}}
							</view>
							<view v-if="tabCurrentIndex==3"></view>
							<view class="flex_row_center" v-if="tabCurrentIndex==3">
								<view class="flex_column_center right-btn c0" @click="deleteTo(item)"> 删除 </view>
								<!-- 是否已评价：0->否；1->是 -->
								<view class="flex_column_center right-btn c1" v-if="item.isComment==0" @click="pingjia(item)"> 评价 </view>
							</view>
						</view>
					</view>
					<!-- 加载更多 -->
					<uni-load-more v-if="tabItem.orderList.length>=6" :status="tabItem.loadingType" />
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import { orderStatus } from '@/common/js/common.js';
import empty from '@/components/empty';
import {formatTime} from '@/common/js/util.js';
export default {
	components: {
		uniLoadMore,
		empty
	},
	data() {
		return {
			tabCurrentIndex: 0,
			navList: orderStatus,
			pageNum:1, //当前页码
			pageSize:6,//每页数据量
			dataList:[],
			djs:"",
		};
	},
	onLoad(options) {
		/**
		 * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
		 * 替换onLoad下代码即可
		 */
		this.tabCurrentIndex = +options.state;
	},
	onShow() {
		let pages = getCurrentPages();
		let currPage = pages[pages.length - 1]; //当前页面
		let returnType = currPage.data.returnType;
		this.pageNum=1
		if(this.tabCurrentIndex==0){
			this.navList[0].orderList=[] //清除首次加载数据缓存
			this.navList[1].orderList=[] //清除首次加载数据缓存
			this.navList[2].orderList=[] //清除首次加载数据缓存
			this.navList[3].orderList=[] //清除首次加载数据缓存
			this.navList[4].orderList=[] //清除首次加载数据缓存
			this.loadData();
		}
		if(returnType == 'dpj'){
			this.navList[3].orderList=[] //清除首次加载数据缓存
			this.loadData();
		}
	},
	filters:{
		/* 退款状态 */
		refundFormat(value){
			/* 0:待处理,1:已审核,2:已拒绝,3:已退款,4:退款失败 */
			switch (value){
				case 0:
				return '待处理'
					break;
				case 1:
				return '已审核'
					break;
				case 2:
				return '已拒绝'
					break;
				case 3:
				return '已退款'
					break;
				case 4:
				return '退款失败'
					break;
				default:
				return''
					break;
			}
		},
		/* 订单状态 */
		statusForm(value){
			switch (value){
				case 0:
					return '待付款'
					break;
				case 1:
					return '待核销'
					break;
				case 2:
					return '已完成'
					break;
				case 3:
					return '已退款'
					break;
				case 4:
					return '已关闭'
					break;
				default:
					return ''
					break;
			}
		},
		/* 格式化时间 */
		formatTime(value){
			if(value&&value!==''&&value!=null){
				return value;
			}else{
				return ''
			}
		},
		/* 是否预约 */
		formApoint(value){
			if(value==0){
				return '已预约，请等待门店商户与您联系'
			}else{
				return '预约成功'
			}
		}
	},
	onShareAppMessage() {},
	methods: {
		//获取订单列表
		async loadData(source) {
			//这里是将订单挂载到tab列表下
			let navItem = this.navList[this.tabCurrentIndex];
			// if (source === 'tabChange' && navItem.loaded === true) {
			// 	//tab切换只有第一次需要加载数据
			// 	return;
			// }
			navItem.loadingType='loading'
			let params={
				"memberId": uni.getStorageSync('memberId'),
				"orderType": this.tabCurrentIndex,
				"pageNum": this.pageNum,
				"pageSize": this.pageSize
			}
			let res=null 
			if(this.tabCurrentIndex==4){
				res=await this.$store.dispatch('refundOrder',params)
			}else{
				res=await this.$store.dispatch('orderList',params)
			}
			let orderList=res.data.list //获取到的订单列表数据
			//console.log(orderList,'哈哈啊哈')
			if(orderList.length>0){
				navItem.loadingType='more'
				orderList.forEach(item => {
					navItem.orderList.push(item);
				});
			}else{
				navItem.loadingType='noMore'
			}
			//loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
			this.$set(navItem, 'loaded', true);
			//判断是否还有数据， 有改为 more， 没有改为noMore
			//navItem.loadingType='noMore'
			
			if(this.tabCurrentIndex == 1){
				this.dataList = orderList;
				//console.log(565656565,this.dataList)
				this.countDown()
			}
		},
		/* 加载更多 */
		getMoreData(){
			this.pageNum+=1
			this.loadData('more');
		},
		/* 去查看门店 */
		toStore(item){
			uni.navigateTo({
				url:`/pages/detail/storeDetail?storeId=${item.storeId}`
			})
		},
		/* 订单点击 */
		itemClick(item){
			switch (this.tabCurrentIndex){
				case 0:
					uni.navigateTo({
						url:`/pages/detail/orderDetail?orderNo=${item.orderNo}&orderId=${item.orderId}&title=${item.packageName}&img=${item.packageThumbUrl}`
					})
				break;
				// case 2:
				// 	if(item.status==2){
				// 		uni.navigateTo({
				// 			url:`/pages/money/hexiao?orderId=${item.orderId}&orderNo=${item.orderNo}`
				// 		})
				// 	}
				// break;
				case 4:
					uni.navigateTo({
						url:`/pages/order/tuikuan?details=${JSON.stringify(item)}`
					})
				break;
				default:
					break;
			}
		},
		goPay(item){
			uni.navigateTo({
				url:`/pages/order/confirmOrder?orderNo=${item.orderNo}&type=dzf`
			})
		},
		//swiper 切换
		async changeTab(e) {
			this.tabCurrentIndex = e.target.current;
			this.navList[this.tabCurrentIndex].orderList=[]
			this.pageNum=1;
			await this.loadData('tabChange');
		},
		/* 删除 */
		deleteTo(item){
			let that=this
			uni.showModal({
				title: "删除订单",
				content: "是否删除当前订单？",
				confirmText: "确定",
				cancelText: "取消",
				success: async (res)=>{
					if (res.confirm) {
						let res= await that.$store.dispatch('deleteOrder',{orderNo:item.orderNo})
						if(res.success){
							that.navList[that.tabCurrentIndex].orderList=[]
							that.loadData()
							that.$api.msg('删除成功')
						}else{
							that.$api.msg('删除失败')
						}
					}
				}
			})
		},
		/* 评价 */
		pingjia(item){
			console.log(item)
			uni.navigateTo({
				// url: `/pages/order/pingjia?title=${item.packageName}&img=${item.packageThumbUrl}&orderId=${item.orderId}&storeId=${item.storeId}`
				url: `/pages/order/pingjia?orderNo=${item.orderNo}`
			});
		},
		// 活动倒计时函数
		countDown() {
		  let _this = this;
		  let obj = null;
		  // 如果活动未结束，对时间进行处理
		  let newTime = new Date().getTime();
		  let carList = this.navList[this.tabCurrentIndex].orderList
		  for (let i in carList) {
		    let _endTime = carList[i].orderExpireDate;
		    _endTime = formatTime(_endTime)
		    _endTime = new Date(_endTime).getTime();
		    _endTime = _endTime - newTime;
		    obj = _this.count(_endTime / 1000);
		    carList[i].time_end1 = `${obj.hou}${obj.min}${obj.sec}`
			
		  }
		  this.$forceUpdate();
		  setTimeout(this.countDown, 1000);
		},
		count(_endTime) {
		  let obj = {};
		  if (_endTime > 0) {
		    // 获取天、时、分、秒
		    let day = parseInt(_endTime / (60 * 60 * 24));
		    let hou = parseInt(_endTime % (60 * 60 * 24) / 3600);
		    let min = parseInt(_endTime % (60 * 60 * 24) % 3600 / 60);
		    let sec = parseInt(_endTime % (60 * 60 * 24) % 3600 % 60);
		    obj = {
		      day: day + '天',
		      hou: '剩余支付时间：'+hou + '时',
		      min: min + '分',
		      sec: sec + '秒'
		    }
		  } else {//活动已结束，全部设置为'00'
		    obj = {
		      hou: '',
			  min:'',
			  sec:''
		    }
		  }
		  return obj;
		},
	}
};
</script>

<style lang="scss">
page,
.content {
	background: $page-color-base;
	height: 100%;
}

.swiper-box {
	height: calc(100% - 40px);
}
.list-scroll-content {
	height: 100%;
}

.navbar {
	display: flex;
	height: 40px;
	padding: 0 5px;
	background: #fff;
	box-shadow: 0 1px 5px rgba(0, 0, 0, 0.06);
	position: relative;
	z-index: 10;
	.nav-item {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		font-size: $font-base;
		color: $font-color-dark;
		position: relative;
		&.current {
			color: $uni-color-success;
			font-size: $font-lg;
			&:after {
				content: '';
				position: absolute;
				left: 50%;
				bottom: 0;
				transform: translateX(-50%);
				width: 44px;
				height: 0;
				border-bottom: 2px solid $uni-color-success;
			}
		}
	}
}

.uni-swiper-item {
	height: auto;
}
/* 订单 */
.order-item {
	margin: 20upx 25upx 0px 25upx;
	background: #fff;
	.order-inner {
		display: flex;
		align-items: center;
		position: relative;
		padding: 5upx 5upx 20upx 10upx;
		.image-bg {
			width: 155upx;
			height: 145upx;
			border-radius: 8upx;
		}
		.item-right {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			height: 145upx;
			flex: 1;
			overflow: hidden;
			padding-left: 30upx;
			font-size: $font-base;
			font-family: PingFang SC;
			font-weight: 500;
			.title {
				color: #3c3836;
			}
			.pflex {
				display: flex;
				align-items: center;
				justify-content: space-between;
				.price {
					color: $font-color-price;
				}
			}
			/* 预约状态 */
			.yuyue {
				font-size: 22upx;
				font-family: PingFang SC;
				font-weight: 500;
				display: flex;
				align-items: center;
				// justify-content: space-between;
				.t1 {
					color: $uni-color-success;
				}
				.t11 {
					padding-left: 18upx;
					color: #3c3836;
				}
				.t2 {
					color: #763f98;
				}
				.t3{
					color: #764098;
				}
				.t31{
					min-width:34upx;
					padding-left: 20upx;
					padding-right: 20upx;
					height:34upx;
					color: #764098;
					background:rgba(118,64,152,0.17);
				}
				.btn1 {
					width: 107upx;
					height: 48upx;
					background: #FDBA24;
					border-radius: 21upx 21upx 21upx 0px;
				}
				.btn2 {
					width: 127upx;
					height: 48upx;
					background: #FFFFFF;
					color: #C8A230;
					border: 2upx solid rgba(200, 162, 48, 1);
					border-radius: 21upx 21upx 21upx 0px;
				}
			}
		}
	}
	.top-title{
		display: flex;
		justify-content: space-between;
		font-size:24upx;
		font-family:PingFang SC;
		font-weight:500;
		color:rgba(60,56,54,1);
		opacity:0.68;
	}
	.bottom{
		display: flex;
		justify-content: space-between;
		font-size:24upx;
		font-family:PingFang SC;
		font-weight:500;
		color:rgba(60,56,54,0.38);
		.right-btn{
			width:102upx;
			height:48upx;
			color: #3C3836;
			font-size:24upx;
			font-family:PingFang SC;
			font-weight:500;
			border-radius:19upx;
		}
		.c0{
			border:1px solid rgba(60, 56, 54, 0.2);
		}
		.c1{
			margin-left: 19upx;
			background: #FDBA24;
		}
		.statu{
			color: #00B1A9;
		}
		/* 已退款颜色 */
		.statu3{
			color: #763F98;
		}
		/* 已关闭颜色 */
		.statu4{
			color: #BFD730;
		}
	}
	.line {
		width: 100%;
		height: 1upx;
		margin-top: 25upx;
		margin-bottom: 25upx;
		background-color: rgba(0, 0, 0, 1);
		opacity: 0.07;
	}
}

/* load-more */
.uni-load-more {
	display: flex;
	flex-direction: row;
	height: 80upx;
	align-items: center;
	justify-content: center;
}

.uni-load-more__text {
	font-size: 28upx;
	color: #999;
}

.uni-load-more__img {
	height: 24px;
	width: 24px;
	margin-right: 10px;
}

.uni-load-more__img > view {
	position: absolute;
}

.uni-load-more__img > view view {
	width: 6px;
	height: 2px;
	border-top-left-radius: 1px;
	border-bottom-left-radius: 1px;
	background: #999;
	position: absolute;
	opacity: 0.2;
	transform-origin: 50%;
	animation: load 1.56s ease infinite;
}

.uni-load-more__img > view view:nth-child(1) {
	transform: rotate(90deg);
	top: 2px;
	left: 9px;
}

.uni-load-more__img > view view:nth-child(2) {
	transform: rotate(180deg);
	top: 11px;
	right: 0;
}

.uni-load-more__img > view view:nth-child(3) {
	transform: rotate(270deg);
	bottom: 2px;
	left: 9px;
}

.uni-load-more__img > view view:nth-child(4) {
	top: 11px;
	left: 0;
}

.load1,
.load2,
.load3 {
	height: 24px;
	width: 24px;
}

.load2 {
	transform: rotate(30deg);
}

.load3 {
	transform: rotate(60deg);
}

.load1 view:nth-child(1) {
	animation-delay: 0s;
}

.load2 view:nth-child(1) {
	animation-delay: 0.13s;
}

.load3 view:nth-child(1) {
	animation-delay: 0.26s;
}

.load1 view:nth-child(2) {
	animation-delay: 0.39s;
}

.load2 view:nth-child(2) {
	animation-delay: 0.52s;
}

.load3 view:nth-child(2) {
	animation-delay: 0.65s;
}

.load1 view:nth-child(3) {
	animation-delay: 0.78s;
}

.load2 view:nth-child(3) {
	animation-delay: 0.91s;
}

.load3 view:nth-child(3) {
	animation-delay: 1.04s;
}

.load1 view:nth-child(4) {
	animation-delay: 1.17s;
}

.load2 view:nth-child(4) {
	animation-delay: 1.3s;
}

.load3 view:nth-child(4) {
	animation-delay: 1.43s;
}

@-webkit-keyframes load {
	0% {
		opacity: 1;
	}

	100% {
		opacity: 0.2;
	}
}
</style>
