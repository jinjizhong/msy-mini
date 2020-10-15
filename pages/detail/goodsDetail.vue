<template>
	<view>
		<swiper class="carousel" indicator-active-color="#4CC8C4" indicator-color="#FFFFFF" circular :indicator-dots="true" 
			:autoplay="false" :interval="2000" :duration="500">
			<swiper-item v-for="(item, index) in goodsInfo.contentImg" :key="index" class="carousel-item">
				<image :src="item" />
			</swiper-item>
		</swiper>
		<view class="info">
			<view class="flex ac jbt">
				<view class="flex_row_yCenter">
					<text class="price">{{ goodsInfo.price }}</text>
					<text class="price-hit">{{goodsInfo.originalPrice}}</text>
					<view class="yigou"><text>{{goodsInfo.saleCount || 0}}</text></view>
				</view>
				<button open-type="share" class="share-btn">
					<image class="logo" src="/static/logo/fenxiang.png" @click="share" mode="" />
				</button>
			</view>
			<view class="title">{{goodsInfo.title}}</view>
			<view class="peizhi">
				<view v-for="(item,index) in goodsInfo.peizhi">{{item.name}}(¥{{item.price}})</view>
			</view>
			<view class="text-content content" v-if="!showDetails">
				{{goodsInfo.content}}
			</view>
			<view class="content" v-if="showDetails">
				{{goodsInfo.content}}
				<!-- <image class="content-img" v-for="(item,index) in goodsInfo.contentImg" :key='index' :src="item" mode="aspectFit"/> -->
			</view>
			<view class="flex_row_center actions" @click="lookDetails">
				<text class="yticon">查看商品详情</text>
				<text class="yticon" :class="showDetails?'icon-shang':'icon-xia'" />
			</view>
		</view>
		<!-- 销售门店 -->
		<view class="stores">
			<view class="flex_row_yCenter">
				<view class="bg"></view>
				<text class="title">销售门店</text>
			</view>
			<!-- 门店item -->
			<view class="item box-shadow" v-for="(item,index) in storeList" :key="index">
				<view class="v1">
					<view class="store" @click="toStoreDetail(item.storeId)">{{item.storeName}}</view>
					<view class="btn" @click="buyTo(item)">购买使用</view>
				</view>
				<view class="star" @click="toStoreDetail(item.storeId)">
					<image v-for="xing in item.starNum" :key="index" src="/static/xing.png">
					<image v-for="xing2 in item.starNum2" :key="index" src="/static/xing2.png">
					<label>{{item.star || 0}}</label>
				</view>
				<view class="address" @click="toStoreDetail(item.storeId)">
					<label class="l1">{{item.address || ''}}</label>
					<label class="l2">{{item.storeDistance || ''}}Km</label>
					<image src="/static/right.png">
				</view>
			</view>
		</view>
		<!-- 分享 -->
		<share ref="share" :contentHeight="580" :shareList="shareList"></share>
	</view>
</template>

<script>
import share from '@/components/uni-pop/share.vue';
export default {
	components: {
		share
	},
	data() {
		return {
			loaded: false,
			currentEpd: 1,
			goodsId:'',
			goodsInfo: {
				bannerImg: '/static/errorImage.jpg',
				originalPrice:'',
				price: '',
				title:'',
				peizhi:'',
				content:'',
				contentImg:[],
				buyNum:''
			},
			storeList:[],
			showDetails:false,
			shareList: [],
			pageOptions:{},//页面options
		};
	},
	async onLoad(options) {
		uni.setNavigationBarTitle({
			title: options.title || '商品详情'
		});
		this.pageOptions = options
		this.goodsId=options.id
		this.getDataDetail(options.id)
		this.getStoreList(options.id)
	},
	/**
	   * 用户点击右上角分享
	   */
	onShareAppMessage: function () {
		console.log('this.goodsId',this.goodsId)
		return {
		  title: `您的好友正在邀请您购买优惠机油保养套餐`,
		  imageUrl:`${this.goodsInfo.contentImg[0]}`,
		  path:`/pages/detail/goodsDetail?id=${this.goodsId}` 
		}
	},
	methods: {
		/* 商品详情 */
		async getDataDetail(id){
			let res = await this.$store.dispatch('detailInfo',{id:id})
			if(res.success){
				let info=res.data
				// if(info.productResults){
				// 	for(let it of info.productResults){
				// 		arr.push(it.name)
				// 	}
				// }
				this.goodsInfo={
					bannerImg: info.imageUrl,
					price: '￥'+info.price+'',
					originalPrice:'￥'+info.originalPrice,
					title:info.name,
					peizhi:info.productResults,
					content:info.description||'',
					contentImg:JSON.parse(info.images),
					saleCount:info.saleCount+'人已购'
				}
			}
		},
		/* 门店详情 */
		toStoreDetail(id){
			uni.navigateTo({
				url:`/pages/detail/storeDetail?storeId=${id}`
			})
		},
		/* 门店 */
		async getStoreList(id){
			let params={
				latitude:wx.getStorageSync('getUserLocationInfo').latitude,
				longitude:wx.getStorageSync('getUserLocationInfo').longitude,
				packageId: id,
				pageNum: 1,
				pageSize: 10
			}
			let _storeList = await this.$store.dispatch('detailStoreList',params);
			_storeList = _storeList.data;
			_storeList.list.forEach(x=>{
				x.starNum = Math.floor(x.star) || 0
				x.starNum2 = 5 - x.starNum
			})
			this.storeList = _storeList.list;
		},
		imageOnLoad() {
			//this.$set(this.data[key][index], 'loaded', 'loaded');
			//this.$set(this.goodsInfo.bannerImg, 'loaded', 'loaded');
		},
		//分享
		share() {
			console.log(123)
			this.$refs.share.toggleMask();
		},
		/* 直接购买 */
		buyTo(item){
			uni.navigateTo({
				url:`/pages/order/confirmOrder?packageId=${this.goodsId}&storeId=${item.storeId}&type=goods`
			})
		},
		//查看详情
		lookDetails() {
			if(this.showDetails){
				this.showDetails=false
			}else{
				this.showDetails=true
			}
		}
	},
	//处理遮罩层物理返回键
	onBackPress() {
		if (this.$refs.share.show) {
			this.$refs.share.toggleMask();
			return true;
		}
	}
};
</script>

<style lang="scss" scoped>
/* banner */
.carousel {
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
.flex {
	display: flex;
}
.ac {
	align-items: center;
}
.jbt {
	justify-content: space-between;
}
.share-btn{
	padding: 0;
	margin: 0;
	height: 34upx;
	width: 34upx;
	display: flex;
	align-items: center;
	justify-content: center;
}
button::after{
	border: 0;
}
/* 个人信息 */
.info {
	margin: 40upx 25upx 40upx 25upx;
	padding: 0px 15upx 0px 15upx;
	background: #fff;
	border-radius:22upx;
	box-shadow:0upx 9upx 15upx 1upx rgba(8,52,59,0.06);
	.logo {
		width: 34upx;
		height: 34upx;
		// margin-right: 20upx;
	}
	.price {
		font-size: 48upx;
		font-family: PingFang SC;
		font-weight: 500;
		padding-left: 15upx;
		color: $font-color-price;
	}
	.price-hit{
		margin-left: 16upx;
		font-size: 24upx;
		font-family: PingFang SC;
		font-weight: 500;
		text-decoration: line-through;
		color: #3C3835;
		line-height: 38px;
		opacity: 0.4;
	}
	.yigou {
		height: 40upx;
		background: rgba(0, 177, 169, 0.12);
		border-radius: 4upx;
		display: flex;
		align-items: center;
		margin-left: 14upx;
		text {
			font-size: 22upx;
			padding: 10upx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #00b1a9;
		}
	}
	.title {
		padding-left: 15upx;
		padding-right: 15upx;
		font-size: $font-lg;
		padding-top: 33upx;
		font-family: PingFang SC;
		font-weight: 800;
		color: #3c3835;
	}
	.peizhi{
		font-size: $font-sm;
		padding-left: 15upx;
		padding-top: 13upx;
		font-family: PingFang SC;
		font-weight: 500;
		color:rgba(60,56,53,0.5);
	}
	.line{
		
	}
	.content{
		font-size:28upx;
		padding: 0px 15upx 0px 15upx;
		line-height: 24px;
		margin-top: 30upx;
		font-family:PingFang SC;
		font-weight:500;
		color:rgba(60,56,53,1);
	}
	.content-img{
		width: 100%;
		height: 258upx;
		margin-top: 30upx;
	}
}
/* 查看详情 */
.actions {
	padding-top: 22upx;
	padding-bottom: 30upx;
	background: #fff;
	.yticon {
		font-size: 24upx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(60, 56, 53, 0.5);
	}
}
/* 销售门店 */
.stores {
	margin: 0px 25upx 0px 25upx;
	.bg{
		width:20upx;
		height:40upx;
		background:#FDB924;
	}
	.title{
		font-size:36upx;
		font-family:PingFang SC;
		font-weight:800;
		color: #3C3835;
	}
	.item{
		width: 100%;
		height:227upx;
		margin-bottom: 10upx;
		margin-top: 20upx;
		.v1{
			display: flex;
			justify-content: space-between;
			.store{
				font-size:36upx;
				font-family:PingFang SC;
				font-weight:800;
				color:rgba(60,56,53,1);
				line-height:32upx;
			}
			.btn{
				width:133upx;
				height:48upx;
				background:#FDB924;
				border-radius:21px 21px 21px 0px;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				font-size:26upx;
				font-family:PingFang SC;
				font-weight:500;
				color:#3C3835;
			}
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
		.address{
			margin-top: 26upx;
			.l1{
				font-size:28upx;
				font-family:PingFang SC;
				font-weight:500;
				color:#3C3835;
				line-height:32upx;
			}
			.l2{
				margin-left: 35upx;
				font-size:28upx;
				font-family:PingFang SC;
				font-weight:500;
				color:rgba(60,56,53,1);
				line-height:32upx;
				opacity:0.5;
			}
			image{
				width: 15upx;
				height: 30upx;
				margin-top: 7upx;
				float: right;
			}
		}
	}
}
.text-content{
	 text-overflow: -o-ellipsis-lastline;
	  overflow: hidden;
	  text-overflow: ellipsis;
	  display: -webkit-box;
	  -webkit-line-clamp: 3;
	  line-clamp: 3;
	  -webkit-box-orient: vertical;
}
</style>
