<template>
	<view class="com-content">
		<view class="flex_column">
			<text class="title">联系方式</text>
			<text class="content">您可拨打电话联系客服，或点击在线客服，即可在线 沟通客服反馈您所遇到的情况；</text>
		</view>
		<view class="box-content">
			<view class="inner-content">
				<view class="flex_row_center" @tap='freeTell' >
					<image src="/static/logo/dianhua.png" />
					<text>拨打客服电话</text>
				</view>
				<view class="line"></view>
				<button class="flex_row_center cont" open-type="contact" session-from="weapp">
					<image src="/static/logo/message.png" />
					<text>在线客服</text>
				</button>
				<!-- <view class="flex_row_center">
					<image src="/static/logo/message.png" />
					<text>在线客服</text>
				</view> -->
			</view>
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {};
	},
	onLoad() {},
	onShareAppMessage() {},
	methods: {
		toCall() {},
		freeTell(){
			wx.makePhoneCall({
			  phoneNumber: '03123688777',
			})
		}
	}
};
</script>
<style lang="scss" scoped>
	.cont{
		background-color: #ffffff;
		margin: 0;
	}
	button::after{
		border: 0;
	}
.com-content {
	background: $page-color-base;
	height: calc(100vh - 44px);
}
.title {
	padding: 25upx 49upx 16upx 49upx;
	font-size: 32upx;
	font-family: PingFang SC;
	font-weight: 800;
	color: rgba(60, 56, 54, 1);
}
.content {
	padding: 0upx 49upx 0upx 49upx;
	font-size: 28upx;
	width: 100%;
	font-family: PingFang SC;
	font-weight: 500;
	color: rgba(60, 56, 54, 1);
	opacity: 0.68;
}
.box-content{
	margin: 38upx 25upx 0upx 25upx;
	.inner-content{
		width:100%;
		height:208upx;
		background:#FFFFFF;
		border-radius:22px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0upx 50upx 0px 50upx;
		image{
			width: 68upx;
			height: 68upx;
		}
		text{
			padding-left: 19upx;
			font-size:28upx;
			font-family:PingFang SC;
			font-weight:500;
			color:rgba(60,56,54,1);
		}
	}
	.line{
		width:1upx;
		height:99upx;
		background:rgba(244,244,244,0.07);
	}
}
</style>
