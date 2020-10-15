<template>
	<view class="container">
		<!-- 车店信息 -->
		<view class="content">
			<view class="inner-content">
				<text class="title">{{title}}</text>
				<image class="banner" :src="img" mode="aspectFill"/>
			</view>
		</view>
		<!-- 服务评分 -->
		<view class="content">
			<view class="inner-content">
				<text class="title">服务评分</text>
				<view class="line"></view>
				<view class="star">
					<image :src="label>=1?xing:xing2" @click="label=1">
					<image :src="label>=2?xing:xing2" @click="label=2">
					<image :src="label>=3?xing:xing2" @click="label=3">
					<image :src="label>=4?xing:xing2" @click="label=4">
					<image :src="label>=5?xing:xing2" @click="label=5">
					<label>{{label}}.0</label>
				</view>
			</view>
		</view>
		<!-- 服务评价 -->
		<view class="content">
			<view class="inner-content">
				<text class="title">服务评价</text>
				<view class="line"></view>
				<view class="pingjia">
					<view class="p-tag" v-for="(item,index) in pingjiaList" :key="index" :class='item.choose?"bc2":"bc1"'
						 @click="tagClick(item)">{{item.name}}
					</view>
				</view>
			</view>
		</view>

		<view class="con-bottom flex_column_center" @click="confirmTo">提交</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			title:'',
			img:'',
			orderId:'',
			storeId:'',
			label:1,
			xing:'/static/xing.png',
			xing2:'/static/xing2.png',
			choosedItem:{
				name:'',
				id:''
			},
			pingjiaList:[],
			orderNo:''
		};
	},
	async onLoad(options) {
		console.log(options,1111222)
		this.orderNo = options.orderNo
		// this.title=options.title
		// this.img=options.img
		// this.orderId=options.orderId
		// this.storeId=options.storeId
		let res=await this.$store.dispatch('commentList')
		if(res.success){
			this.pingjiaList=res.data
			for(let it of this.pingjiaList){
				it.choose=false
			}
		}
		this.queryOrderPackage()
	},
	onShareAppMessage() {},
	methods: {
		async queryOrderPackage(){
			let params = {orderNo:this.orderNo}
			let res= await this.$store.dispatch('queryOrderPackage',params)
			let data = res.data
			this.title=data.packageName
			this.img=data.packageUrl
			this.orderId=data.orderId
			this.storeId=data.storeId
			console.log(res,12345)
		},
		tagClick(item){
			for(let it of this.pingjiaList){
				if(item.id===it.id){
					it.choose=true
					this.choosedItem={
						name:it.name,
						id:it.id
					}
				}else{
					it.choose=false
				}
			}
			this.$forceUpdate();
		},
		async confirmTo(){
			let params={
				  "optionIds": this.choosedItem.id,
				  "optionNames": this.choosedItem.name,
				  "orderId": this.orderId,
				  "score": this.label,
				  "storeId": this.storeId
				}
			let res= await this.$store.dispatch('commentSave',params)
			if(res.success){
				this.$api.msg('提交成功')
				setTimeout(()=>{
					// let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
					// let prevPage = pages[ pages.length - 2 ];
					// prevPage.setData({
					// 	returnType: 'dpj',　　　　　　// 设置需要传递的参数
					// })
					// uni.navigateBack({
					//   delta: 1  // 返回上一级页面。
					// })
					uni.navigateTo({
						url:'/pages/order/order?state=2'
					})
				},1000)
				// uni.navigateBack()
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
		.title{
			font-size:34upx;
			font-family:PingFang SC;
			font-weight:800;
			color:rgba(60,56,54,1);
		}
		.banner{
			height: 279upx;
			width: 100%;
		}
		.line{
			width:100%;
			margin-top: 20upx;
			margin-bottom: 20upx;
			height:1upx;
			border:1upx solid rgba(0,0,0,1);
			opacity:0.07;
		}
		.star{
			margin-top: 16upx;
			display: flex;
			align-items: center;
			image{
				width:38upx;
				height:37upx;
				margin-right: 16upx;
			}
			label{
				font-size:28upx;
				font-family:PingFang SC;
				font-weight:500;
				color:rgba(60,56,53,1);
				line-height:32upx;
				opacity:0.5;
			}
		}
		.pingjia{
			width: 100%;
			height: 160upx;
			.p-tag{
				width:146upx;
				height:48upx;
				border:1px solid rgba(60, 56, 54, 0);
				font-size:24upx;
				font-family:PingFang SC;
				font-weight:500;
				border-radius:24upx;
				float: left;
				margin-left: 10upx;
				margin-top: 20upx;
				display: flex;
				align-items: center;
				flex-direction: column;
				flex-wrap: nowrap;
				justify-content: center;
			}
			.bc1{
				background: #F9F5ED;
				color: rgba(60,56,54,0.8);
			}
			.bc2{
				background: #FDBA24;
				color: #FFFFFF;
			}
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
</style>
