<template>
	<view class="container">
		<view class="bg-content flex_column_yCenter">
			<view class="bg-img flex_column_yCenter">
				<text class="title" v-if="isCheck"> 待核销凭证 </text>
				<text class="title" v-if="!isCheck"> 已核销 </text>
				<text class="con" v-if="isCheck">将下方核销码展示给店家，进行核销</text>
				<text class="con" v-if="!isCheck">该商品已于{{verificationTime|formatTime}}核销完成！</text>
				<text class="num">{{verificationCode||''}}</text>
				<view class="coute">
					<image class="yishixiao" v-if="!isCheck" src="/static/logo/yishixiao.png" mode=""></image>
					<image class="coute" :class="!isCheck?'opacity':''" :src="verificationCodeUrl||'/static/errorImage.jpg'" mode="aspectFill"></image>
				</view>
			</view>
			<view class="warning flex_column_center" v-if="isCheck">
				注：核销成功后该核销码与核销号作废
			</view>
			<view v-if="!isCheck" @click="goPj" class="con-bottom flex_column_center">
				去评价该门店服务
			</view>
		</view>
	</view>
</template>

<script>
	import {formatTime} from '@/common/js/util.js';
	export default {
		data() {
			return {
				isCheck:true, //是否核销
				verificationCode:'',//核销码
				verificationCodeUrl:'',//核销二维码
				verificationTime:'',//核销时间
				pageOptions:{},
			}
		},
		filters:{
			formatTime(value){
				if(value&&value!==''&&value!=null){
					return value;
				}else{
					return ''
				}
			}
		},
		onLoad(options) {
			let that =this
			this.pageOptions = options
			console.log(this.pageOptions,1234)
			that.getVerificationInfo(options)
			// setInterval(res=>{
			// 	that.getVerificationInfo(options)
			// }, 2000);
		},
		onShareAppMessage() {},
		methods: {
			/* 获取核销信息 */
			async getVerificationInfo(options){
				let params={
				  "memberId": uni.getStorageSync('memberId'),
				  "orderNo": options.orderNo
				}
				await this.$store.dispatch('getVerificationInfo',params).then(res=>{
					if(res.success){
						this.verificationCode=res.data.verificationCode
						this.verificationCodeUrl=res.data.verificationCodeUrl
						this.pageOptions.storeId = res.data.storeId
						this.orderNo = res.data.orderNo
						/* 是否已核销 */
						console.log(res.data.isVerification)
						if(res.data.isVerification){
							this.isCheck=false
							this.verificationTime=res.data.verificationTime
						}else{
							this.isCheck=true
						}
					}
				})
			},
			goPj(){
				uni.navigateTo({
					// url: `/pages/order/pingjia?title=${this.pageOptions.title}&img=${this.pageOptions.img}&orderId=${this.pageOptions.orderId}&storeId=${this.pageOptions.storeId}`
					url: `/pages/order/pingjia?orderNo=${this.orderNo}`
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
.container{
	width: 100%;
	height: 100vh;
	background: #00B2AA;
}
.bg-content{
	padding: 100upx 70upx 0upx 70upx;
	font-family:PingFang SC;
	font-weight:500;
	.bg-img{
		width: 100%;
		height: 700upx;
		background-image: url(../../static/hexiao.png);
		background-repeat:no-repeat;
		background-size:100% 100%;
	}
	.title{
		padding-top: 70upx;
		font-size:34upx;
		color:rgba(60,56,54,1);
	}
	.con{
		padding-top: 20upx;
		font-size:24upx;
		color:rgba(0,178,170,1);
	}
	.num{
		padding: 20upx 0upx 20upx 0upx;
		max-width: 70%;
		word-break: break-all;
		font-size:36upx;
		color: #3C3836;
	}
	.coute{
		width:323upx;
		height:323upx;
		.yishixiao{
			position: absolute;
			margin-top: 60upx;
			z-index: 99;
			width: 150px;
			height: 200upx;
		}
		.opacity{
			opacity: 0.14;
		}
	}
}
.con-bottom {
	width: 88%;
	height: 88upx;
	margin-top: 50upx;
	font-size: 34upx;
	font-family: PingFang SC;
	font-weight: 500;
	color: #3C3836;
	background: #FDBA24;
	border-radius: 22upx;
}
.warning{
	color: #FFFFFF;
	font-size: 14px;
	
}
</style>
