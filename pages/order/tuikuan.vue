<template>
	<view class="container">
		<!-- 车店信息 -->
		<view class="content">
			<view class="inner-content flex_column_center">
				<text class="title">{{title}}</text>
				<view class="flex-text">
					<text class="text1">
						已付款金额：
						<text class="text2">￥{{price}}</text>
					</text>
				</view>
				<view class="line" />
				<image class="banner" :src="state|formatImg" mode="aspectFill" />
				<text class="order-statu color-shz" v-if="state==0"> {{status}}</text>
				<text class="order-statu color-yes" v-if="state==1||state==3"> {{status}}</text>
				<text class="order-statu color-no" v-if="state==2||state==4"> {{status}}</text>
				<text class="order-content">{{content}}</text>
				<view class="line" />
				<view class="flex-text text-hit"> 订单信息 </view>
				<view class="flex-text"> 订单编号：{{orderNum}} </view>
				<view class="flex-text"> 下单时间：{{orderTime|formatTime}} </view>
			</view>
		</view>

		<view class="con-bottom flex_column_center" @click="clickBack">我知道了</view>
	</view>
</template>

<script>
import {formatTime} from '@/common/js/util.js';
export default {
	data() {
		return {
			title:'',
			price:'',
			state:0,
			status:'',
			content:'',
			orderNum:'',
			orderTime:'',
			sourceFlag:''
		};
	},
	onLoad(options) {
		//console.log(JSON.parse(options.details))
		this.getData(JSON.parse(options.details))
	},
	filters:{
		formatTime(value){
			if(value&&value!==''&&value!=null){
				return value;
			}else{
				return ''
			}
		},
		formatImg(value){
			/* 0:待处理,1:已审核,2:已拒绝,3:已退款,4:退款失败 */
			if(value!==''&&value!=null){
				console.log('value11',value)
				switch (value){
					case 0:
						return '/static/logo/shenhezhong.png'
						break;
					case 1:
						return '/static/logo/shenhe.png'
						break;
					case 2:
						return '/static/logo/shibai.png'
						break;
					case 3:
						return '/static/logo/shenhe.png'
						break;	
					case 4:
						return '/static/logo/shibai.png'
						break;
				}
			}else{
				return ''
			}
		}
	},
	onShareAppMessage() {},
	methods: {
		getData(details){
				this.title= details.packageName,
				this.price=details.orderAmount,
				this.state=details.refundStatus,
				this.orderNum=details.orderNo,
				this.orderTime=details.applyTime
				this.sourceFlag=details.sourceFlag || null
			/* 0:待处理,1:已审核,2:已拒绝,3:已退款,4:退款失败 */
			switch (this.state){
				case 0:
					this.status='订单退款处理中...'
					this.content=''
					break;
				case 1:
					this.status='订单退款审核成功！'
					this.content=''
					break;
				case 2:
					this.status='退款已拒绝'
					this.content='请联系客服'
					break;
				case 3:
					this.status='订单退款成功！'
					this.content='已付款金额将于3个工作日内退还 至您的资金来源账户'
					break;
				case 4:
					this.status='退款失败'
					this.content='请联系客服'
					break;
			}
		},
		clickBack() {
			if(this.sourceFlag){
				wx.navigateBack({
				      delta: 1
				    })
			}else{
				uni.navigateBack()
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.container {
	background: #f4f4f4;
	height: 100vh;
}
.content {
	padding: 20upx 25upx 0px 25upx;
	.inner-content {
		width: 100%;
		padding: 20upx;
		background: #ffffff;
		border-radius: 22upx;
		.title {
			font-size: 34upx;
			padding-bottom: 36upx;
			font-family: PingFang SC;
			font-weight: 800;
			color: rgba(60, 56, 54, 1);
		}
		.flex-text {
			width: 100%;
			padding-bottom: 36upx;
			display: flex;
			font-size:28upx;
			align-items: center;
			justify-content: space-between;
			font-family: PingFang SC;
			font-weight: 500;
			.text1 {
				color: #3c3836;
			}
			.text2 {
				font-size: 32upx;
				color: #c8a230;
			}
		}
		.order-statu {
			font-size: 36upx;
			font-family: PingFang SC;
			font-weight: 800;
		}
		.color-shz{
			color: #BFD730;
		}
		.color-yes{
			color: #28a6a2;
		}
		.color-no{
			color: #764098;
		}
		.order-content{
			font-size:28upx;
			font-family:PingFang SC;
			width: 60%;
			padding-top: 25upx;
			text-align: center;
			font-weight:500;
			color:rgba(60,56,54,0.5);
		}
		.banner {
			height: 245upx;
			width: 332upx;
			margin-top: 50upx;
			margin-bottom: 20upx;
		}
		.line {
			width: 100%;
			margin-top: 20upx;
			margin-bottom: 20upx;
			height: 1upx;
			background: rgba(0, 0, 0, 0.07);
		}
		.star {
			margin-top: 16upx;
			display: flex;
			align-items: center;
			image {
				width: 38upx;
				height: 37upx;
				margin-right: 16upx;
			}
			label {
				font-size: 28upx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(60, 56, 53, 1);
				line-height: 32upx;
				opacity: 0.5;
			}
		}
		.pingjia {
			width: 100%;
			height: 160upx;
			.p-tag {
				width: 146upx;
				height: 48upx;
				border: 1px solid rgba(60, 56, 54, 0);
				font-size: 24upx;
				font-family: PingFang SC;
				font-weight: 500;
				border-radius: 24upx;
				float: left;
				margin-left: 10upx;
				margin-top: 20upx;
				display: flex;
				align-items: center;
				flex-direction: column;
				flex-wrap: nowrap;
				justify-content: center;
			}
			.bc1 {
				background: #f9f5ed;
				color: rgba(60, 56, 54, 0.8);
			}
			.bc2 {
				background: #fdba24;
				color: #ffffff;
			}
		}
	}
}
.text-hit{
	color: rgba(60,56,54,0.5);
}
.con-bottom {
	width: 80%;
	height: 88upx;
	position: fixed;
	bottom: 20upx;
	left: 10%;
	font-size: 34upx;
	font-family: PingFang SC;
	font-weight: 500;
	color: #ffffff;
	background: rgba(0, 178, 170, 1);
	border-radius: 22upx;
}
</style>
