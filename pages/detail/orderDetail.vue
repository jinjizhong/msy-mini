<template>
	<view class="container">
		<!-- 车店信息 -->
		<view class="content">
			<view class="inner-content">
				<text class="title">{{formData.packageName}}</text>
				<view class="title2">
					<text>已付款金额：<text class="color">￥{{formData.orderAmount}}</text></text>
				</view>
				<view class="line"></view>
				<view class="title2"><text class="title-hit">使用门店</text></view>
				<view class="title2">{{formData.storeName}}</view>
				<view class="line"></view>
				<view class="title2"><text class="title-hit">门店联系电话</text></view>
				<view class="title2" @click="toCall">{{formData.storePhone}} <image class="img" src="/static/logo/call.png" mode=""></image></view>
				<view class="line"></view>
				<!-- <view class="title2"><text class="title-hit">预约时间</text></view>
				<view class="title2">{{formData.yuyueTime|formatTime}}</view> -->
				<view class="line"></view>
				<view class="title2 flex-jus">
					<text class="title-hit">订单信息</text>
					<view class="tag-bg" @click="tagClick">
						<text style="color:#764098">订单退款</text>
					</view>
				</view>
				<view class="title2">订单编号：{{formData.orderNo}}</view>
				<view class="title2">下单时间：{{formData.orderTime|formatTime}}</view>
			</view>
		</view>
		<view class="con-bottom flex_column_center" @click="verification">使用核销</view>
		<!-- 弹框 -->
		<uni-popup ref="popup" type="dialog">
		    <uni-popup-dialog type="input" message="成功消息" title="订单取消原因" :duration="2000" :before-close="true" @close="close">
				<slot>
					<view class="soltview">
						<radio-group @change="radioChange">
							<label class="radio-item" v-for="(item, index) in reasonList" :key="item.value">
								<view>{{item.name}}</view>
								<radio :value="item.id" :checked="index === current" />
							</label>
						</radio-group>
						<view class="btns">
							<button class="cancel" @click="cancel" type="default">取消</button>
							<button @click="confirm" type="default">确认</button>
						</view>
					</view>
				</slot>
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
import uniPopup from '@/components/uni-pop/uni-popup.vue'
import uniPopupDialog from '@/components/uni-pop/uni-popup-dialog.vue'
import {formatTime} from '@/common/js/util.js';
export default {
	components: {
		uniPopup,
		uniPopupDialog
	},
	data() {
		return {
			formData:{
				packageName:'',
				orderAmount:'',
				storeName:'',
				storePhone:'',
				orderNo:"",
				orderTime:''
			},
			reasonId:'',
			reasonList:[],
			orderId:'',
			pageOptions:{}
		};
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
	onLoad(options){
		this.pageOptions = options
		this.orderId=options.orderId||''
		this.getData(options.orderNo)
	},
	onShareAppMessage() {},
	methods: {
		async getData(orderNo){
			let params={
				memberId :uni.getStorageSync('memberId'),
				orderNo: orderNo
			}
			let res= await this.$store.dispatch('orderDetail',params)
			let data=res.data
			this.formData={
				packageName:data.packageName||'',
				orderAmount:data.cashAmount||'',
				storeName:data.storeName||'',
				storePhone:data.storePhone||'',
				orderNo:data.orderNo||'',
				orderTime:data.orderCreateTime||''
			}
		},
		toCall(){
			wx.makePhoneCall({
			  phoneNumber: this.formData.storePhone,
			})
		},
		async tagClick(e) {
			let res=await this.$store.dispatch('refundList')
			
			if(res.success){
				this.reasonList=res.data
				this.$refs.popup.open()
			}
			
		},
		/* 确认提交退款 */
		confirm(){
			if(this.reasonId==''){
				this.$api.msg('请选择退款原因')
				return
			}
			let that=this
			wx.getSetting({
				withSubscriptions: true,
				success (res) {
				if(res.subscriptionsSetting){
					let hit=that
					wx.requestSubscribeMessage({
						tmplIds: ['Jy5IVZC6YfTrTZgzTTc-py0NNw247RPlhG8T4pG0pFE'],
						success (res) {
							console.log(res)
							let resCode=res['Jy5IVZC6YfTrTZgzTTc-py0NNw247RPlhG8T4pG0pFE']
							if(resCode=='accept'){
								hit.toRefound('1')
							}else{
								hit.toRefound('0')
							}
						},
						fail(err){
							console.log('错误==》',err)
						}
					})
				}else{
					this.$api.msg('用户未授权')
				}
				}
			})
		},
		/* 提交申请退款 */
		async toRefound(sendWxMsgFlag){
			let params={
				orderNo:this.formData.orderNo,
				reasonId:this.reasonId,
				sendWxMsgFlag:sendWxMsgFlag//推送通知：0不发送，1发送
			}
			let res= await this.$store.dispatch('refundApply',params)
			if(res.success){
				await this.$api.msg('操作成功')
				uni.navigateBack()
			}else{
				this.$api.msg(res.message)
			}
		},
		cancel(){
			this.$refs.popup.close()
		},
		radioChange(e){
			this.reasonId=e.target.value
		},
		verification(){
			uni.navigateTo({
				url:`/pages/money/hexiao?orderId=${this.orderId}&orderNo=${this.formData.orderNo}&title=${this.pageOptions.title}&img=${this.pageOptions.img}`
			})
		}
	}
};
</script>

<style lang="scss" scoped>
.container {
	background: #f4f4f4;
	height: 100vh;
}
.flex-jus{
	justify-content: space-between;
}
.content {
	padding: 20upx 25upx 0px 25upx;
	.inner-content {
		width: 100%;
		padding: 20upx;
		background: #ffffff;
		border-radius: 22upx;
		.title {
			font-size: 30upx;
			font-family: PingFang SC;
			font-weight: 800;
			color: rgba(60, 56, 54, 1);
		}
		.title2 {
			font-size: 28upx;
			font-family: PingFang SC;
			font-weight: 500;
			color: rgba(60, 56, 54, 1);
			margin-top: 30upx;
			display: flex;
			align-items: center;
			.color {
				color: #c8a230;
				font-size: 32upx;
			}
			.title-hit{
				color:rgba(60,56,54,0.5);
			}
			.img{
				margin-left: 18upx;
				width: 37upx;
				height: 37upx;
			}
		}
		.line {
			width: 100%;
			margin-top: 20upx;
			margin-bottom: 20upx;
			height: 1upx;
			background: rgba(0, 0, 0, 0.07);
		}
		.tag-bg{
			width:150upx;
			height:40upx;
			background:rgba(118,64,152,0.12);
			text-align: center;
			border-radius:10upx;
		}
	}
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
.soltview{
	.radio-item{
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 60upx;
		label{
			font-size: 30upx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #3C3835;
		}
	}
	.btns{
		padding-top: 20upx;
		display: flex;
		justify-content: space-between;
		button{
			width:236upx;
			height:72upx;
			background:rgba(0, 177, 169, 1);
			border-radius:22upx;
			line-height: 72upx;
			font-size:30upx;
			font-family:PingFang SC;
			font-weight:500;
			color: #fff;
			margin: 0 10upx;
		}
		button::after{
			border: none;
		}
		.cancel{
			background-color: rgba(254, 249, 236, 1);
			color:rgba(199,162,47,1);
		}
	}
}
</style>
