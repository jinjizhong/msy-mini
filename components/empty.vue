<template>
	<view class="empty-content">
		<image class="empty-content-image" src="/static/orderNull.png" mode="aspectFit"></image>
		<text>{{text}}</text>
	</view>
</template>

<script>
	export default {
		props: {
			src: {
				type: String,
				default: 'empty'
			},
			text:{
				type: String,
				default: ''
			}
		},
		data() {
			return {
			}
		}
	}
</script>

<style lang="scss">
	.empty-content {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background: $page-color-base;
		padding-bottom: 120upx;

		&-image {
			width: 80%;
			height: 50%;
		}
		text{
			font-size:34upx;
			font-family:PingFang SC;
			font-weight:500;
			color:rgba(60,56,54,1);
			opacity:0.68;
		}
	}
</style>
