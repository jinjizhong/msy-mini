<template>
	<view class="content">
		<text class="success-icon yticon icon-xuanzhong2"></text>
		<text class="tit">支付成功</text>
		
		<view class="btn-group">
			<navigator @click="toOrderDetail" open-type="redirect" class="mix-btn">查看订单</navigator>
			<navigator url="/pages/index/index" open-type="switchTab" class="mix-btn hollow">返回首页</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				lookOrderDetail:''
			}
		},
		onLoad(options) {
			this.lookOrderDetail=`/pages/detail/orderDetail?orderNo=${options.orderNo}&orderId=${options.orderId}&img=${options.img}`
		},
		onShareAppMessage() {},
		methods: {
			toOrderDetail(){
				uni.redirectTo({
				    url: this.lookOrderDetail
				});
			}
		}
	}
</script>

<style lang='scss'>
	.content{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.success-icon{
		font-size: 160upx;
		color: $uni-color-success;
		margin-top: 100upx;
	}
	.tit{
		font-size: 38upx;
		color: #303133;
	}
	.btn-group{
		padding-top: 100upx;
	}
	.mix-btn {
		margin-top: 30upx;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 600upx;
		height: 80upx;
		font-size: $font-lg;
		color: #fff;
		background-color: $uni-color-success;
		border-radius: 10upx;
		&.hollow{
			background: #fff;
			color: #303133;
			border: 1px solid #ccc;
		}
	}
</style>
