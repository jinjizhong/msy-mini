<template>
	<view>
		<view class="storeBg">
			<image v-if="storeDetail.informationImgs.length == 0" class="bgimg" src="/static/msgLogo.png" mode=""></image>
			<!-- <image v-else class="storeImg" :src="storeDetail.informations.storeDoorHeaderImage" mode=""></image> -->
			<swiper v-else class="carousel" indicator-active-color="#4CC8C4" indicator-color="#FFFFFF" circular :indicator-dots="true"
				:autoplay="false" :interval="2000" :duration="500">
				<swiper-item v-for="(item, index) in storeDetail.informationImgs" :key="index" class="carousel-item">
					<image :src="item" />
				</swiper-item>
			</swiper>
		</view>
		<view class="list">
			<view class="card storeInfo">
				<view class="info1">
					<view class="cont1">
						<view class="name">{{storeDetail.name}}</view>
						<view class="rate">
							<image v-for="xing in storeDetail.starNum" :key="index" src="../../static/xing.png">
							<image v-for="xing2 in storeDetail.starNum2" :key="index" src="../../static/xing2.png">
							<label>{{storeDetail.star || 5}}</label>
						</view>
					</view>
					<view class="cont2">
						<image src="../../static/dizhi.png" mode=""></image>
						<view>{{storeDetail.distance || 0}}Km</view>
					</view>
				</view>
				<view class="info2" @click="showAppraise">
					<view class="pj">
						<label class="pj1" v-if="storeDetail.comments.length== 0">该门店暂无评价</label>
						<block v-else>
							<label class="pj1" v-for="(item,index) in storeDetail.comments2" :key="item.id">{{item.name}}({{item.num}})</label>
						</block>
					</view>
					<image class="right" src="/static/right.png">
				</view>
			</view>
			<view v-for="item in prodList" :key="item.packageId" class="card li" @click="navToDetailPage(item)">
				<view class="left">
					<image v-if="!item.imageUrl" class="bgimg" src="/static/msgLogo.png" mode=""></image>
					<image v-else class="prodImg" :src="item.imageUrl" mode=""></image>
				</view>
				<view class="right">
					<view class="clamp title">
						{{item.packageName}}
					</view>
					<view class="label">{{item.productDesc || ''}}</view>
					<view class="num"><label>{{item.saleCount || 0}}人已订购</label></view>
					<view class="price">
						<view class="price-v"><label>￥</label>{{item.price || 0}}</view>
						<button type="default" @click="buyTo(item)">购买</button>
						
					</view>
				</view>
			</view>
		</view>
		
		<uni-popup ref="popup" type="dialog">
		    <uni-popup-dialog type="input" message="成功消息" title="门店评价" :duration="2000" :before-close="true" ref="child" @close="close" @confirm="confirm">
				<slot>
					<view class="soltview">
						<label class="pj1" v-if="storeDetail.comments.length== 0">该门店暂无评价</label>
						<view class="pj" v-else>
							<label class="pj1" v-for="(item,index) in storeDetail.comments2" :key="item.id">{{item.name}}({{item.num}})</label>
						</view>
						<button class="ok" @click="quit" type="default">我知道了</button>
					</view>
				</slot>
			</uni-popup-dialog>
		</uni-popup>
		<uni-load-more v-if="goodsList.length>5" :status="loadingType"></uni-load-more>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import uniPopup from '@/components/uni-pop/uni-popup.vue'
	import uniPopupDialog from '@/components/uni-pop/uni-popup-dialog.vue'
	import util from '../../common/js/util.js'
	export default {
		components: {
			uniPopup,
			uniPopupDialog,
			uniLoadMore
		},
		data() {
			return {
				storeId:'',//门店id
				prodList:[],//产品列表
				storeDetail:{},//详情
				pageNum:1, //当前页码
				pageSize:10,//每页数据量
				loadingType: 'more', //加载更多状态
			}
		},
		onLoad(options){
			console.log(options)
			this.storeId = options.storeId
			this.getStoreDetail()
			this.getStorePackage()
		},
		//加载更多
		onReachBottom() {
			this.pageNum+=1
			this.getStorePackage();
		},
		onShareAppMessage() {},
		methods: {
			showAppraise(){
				if(!this.storeDetail.comments){
					util.toast('该门店暂无评价')
				}else{
					this.$refs.popup.open()
				}
				
			},
			//获取门店详情
			async getStoreDetail(){
				let params = {
					latitude:wx.getStorageSync('getUserLocationInfo').latitude,
					longitude:wx.getStorageSync('getUserLocationInfo').longitude,
					storeId:this.storeId
				}
				let storeDetail = await this.$store.dispatch('getStoreDetail',params);
				storeDetail.data.starNum = Math.floor(storeDetail.data.star) || 5
				storeDetail.data.starNum2 = 5 - storeDetail.data.starNum
				storeDetail.data.informationImgs = JSON.parse(storeDetail.data.images)
				// storeDetail.data.informationImgs = this.getImgUrl(informationImgs)
				this.storeDetail = storeDetail.data
				this.storeDetail.comments2 =  this.storeDetail.comments.length > 3 ? this.storeDetail.comments.slice(0,3) : this.storeDetail.comments
			},
			//获取门店商品
			async getStorePackage(){
				if (this.loadingType === 'nomore') {
					return;
				}
				this.loadingType = 'loading';
				let params = {
					pageNum:this.pageNum,
					pageSize:this.pageSize,
					storeId:this.storeId
				}
				let prodList = await this.$store.dispatch('getStorePackage',params);
				prodList = prodList.data.list;
				if(prodList.length < this.pageSize){
					this.loadingType = 'nomore'
					uni.stopPullDownRefresh();
				}else{
					this.loadingType = 'more'
				}
				this.prodList = this.prodList.concat(prodList);
			},
			quit(){
				this.$refs.child.close()
			},
			/* 直接购买 */
			buyTo(item){
				console.log(item,334)
				uni.navigateTo({
					url:`/pages/order/confirmOrder?packageId=${item.packageId}&storeId=${this.storeId}&type=goods&img=${this.storeDetail.informationImgs[0]}`
				})
			},
			//详情页
			navToDetailPage(item) {
				//详情页面的title
				let title = item.packageName
				let id = item.packageId
				if(id){
					uni.navigateTo({
						url: `/pages/detail/goodsDetail?title=${title}&id=${id}`
					});
				}else{
					return ''
				}
			},
			getImgUrl(arr){
				let _arr = []
				// arr.businessLicenseImage1.forEach(x=>{
				// 	_arr.push(x)
				// })
				arr.storeAppearanceImage.forEach(x=>{
					_arr.push(x)
				})
				arr.storeDoorHeaderImage.forEach(x=>{
					_arr.push(x)
				})
				arr.storeExhibitImage.forEach(x=>{
					_arr.push(x)
				})
				return _arr
			}
		},
		/**
		   * 用户点击右上角分享
		   */
		onShareAppMessage: function () {
			return {
			  title: `您的好友发现了一个服务好，价格优的门店`,
			  imageUrl:`${this.storeDetail.informationImgs[0]}`,
			  path:`/pages/detail/storeDetail?storeId=${this.storeId}` 
			}
		},
	}
</script>

<style lang="scss">
.storeBg{
	width: 100%;
	height: 406upx;
	background:rgba(255,251,242,1);
	display: flex;
	align-items: center;
	justify-content: center;
	.bgimg{
		width: 108upx;
		height: 127upx;
		opacity: 0.5;
	}
	.storeImg{
		height: 100%;
	}
}
.list{
	margin: 0 auto;
	width:700upx;
}
.card{
	margin-bottom: 20upx;
	padding: 30upx 25upx;
	background:rgba(255,255,255,1);
	border-radius:22upx;
	box-shadow:0upx 9upx 15upx 1upx rgba(8,52,59,0.06);
}
.pj{
	width: 650upx;
	label{
		font-size:24upx;
		font-family:PingFang SC;
		color:rgba(0,177,169,1);
		border-radius:20px;
		padding: 2upx 12upx;
		margin-right: 20upx;
	}
	.pj1{
		background:rgba(231,249,249,1);
	}
	.pj2{
		background:rgba(253,243,219,1);
		color:rgba(220,162,9,1);
	}
	.pj3{
		color:#BFD72F;
		background:rgba(191,215,47,0.1);
	}
}
.storeInfo{
	.info1{
		width: 100%;
		height: 101upx;
		display: flex;
		.cont1{
			height: 100%;
			width: 500upx;
			.name{
				font-size:36upx;
				font-family:PingFang SC;
				font-weight:800;
				color:rgba(59,55,53,1);
				line-height:32upx;
			}
			.rate{
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
					color:rgba(60,56,53,0.5);
					line-height:32upx;
				}
			}
		}
		.cont2{
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			align-items: center;
			width: calc(100% - 500upx);
			height: 100%;
			border-left: 2upx solid rgba(0,0,0,0.07);
			image{
				width: 24upx;
				height: 30upx;
			}
			view{
				font-size:28upx;
				font-family:PingFang SC;
				color:rgba(59,55,53,0.5);
				line-height:32upx;
			}
		}
	}
	.info2{
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 10upx;
		.right{
			width: 15upx;
			height: 30upx;
			margin-top: 7upx;
		}
	}
}
.li{
	display: flex;
	.left{
		width:208upx;
		height:208upx;
		background:rgba(255,251,242,1);
		display: flex;
		align-items: center;
		justify-content: center;
		.bgimg{
			width: 108upx;
			height: 127upx;
			opacity: 0.5;
		}
		.prodImg{
			height: 100%;
		}
	}
	.right{
		width: 420upx;
		margin-left: 28upx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.label{
			font-size:28upx;
			font-family:PingFang SC;
			color:rgba(60,56,53,1);
			line-height:32upx;
			opacity:0.5;
		}
		.title{
			font-size:28upx;
			font-family:PingFang SC;
			color:#3C3835;
			line-height:32upx;
		}
		.num{
			display: flex;
			label{
				font-size:22upx;
				font-family:PingFang SC;
				color:rgba(0,177,169,1);
				line-height:38upx;
				background:rgba(0,177,169,0.17);
				border-radius:4px;
				padding: 5upx 10upx;
			}
		}
		.price{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.price-v{
				font-size:28upx;
				font-family:PingFang SC;
				font-weight:500;
				color:rgba(199,162,47,1);
				label{
					font-weight:200;
				}
			}
			button{
				margin: 0;
				padding: 13upx;
				font-size:26upx;
				font-family:PingFang SC;
				font-weight:500;
				color:rgba(59,55,53,1);
				line-height:38upx;
				height: initial;
				background:rgba(253,185,35,1);
				border-radius:21upx 21upx 21upx 0upx;
			}
		}
	}
}
.soltview{
	.pj{
		width: 540upx;
		display: flex;
		// justify-content: space-around;
		flex-wrap:wrap;
		label{
			margin-top: 15upx;
		}
	}
	.ok{
		margin-top: 20upx;
		width: 230upx;
		height:72upx;
		background:rgba(75,199,195,1);
		border-radius:22upx;
		font-size:30upx;
		font-family:PingFang SC;
		color:rgba(255,255,255,1);
		line-height:72upx;
		margin-top: 50upx;
	}
}.carousel {
	width: 100%;
	height: 406upx;
	margin-top: 27upx;
	.carousel-item {
		width: 100%;
		height: 100%;
		padding: 0 25upx;
		padding-bottom: 20upx;
		overflow: hidden;
	}
	image {
		width: 100%;
		height: 100%;
		border-radius: 10upx;
		box-shadow: 0upx 9upx 14upx 2upx rgba(8, 52, 59, 0.06);
	}
}
</style>
