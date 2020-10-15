<template>
	<view class="container">
		<!-- 顶部 -->
		<indexTop :custom="true">
			<view class="left-top-area">
				<text class="">{{location}}</text>
				<!-- <image src="/static/xia.png" /> -->
			</view>
			<view @click="clickChange">
				<uni-search-bar :radius="100" bdColor="#4CC8C3" borWidth="1.5px" :clickChange="true" placeholder="搜索你想要的商品或服务" />
			</view>
		</indexTop>
		<!-- 我的爱车 -->
		<view class="my-car-style" v-if="hasCar" @click="navTo('/pages/car/carManage')">
			<view class="flex_row_yCenter">
				<image :src="carImg"></image>
				<text class="left">{{carName}}</text>
			</view>
			<text class="yticon icon-you right" />
		</view>
		<view class="my-car-style addnew" v-else @click="navTo('/pages/car/addCar')">
			<view class="flex_row_yCenter">
				<image src="@/static/tianjia.png"></image>
				<text class="left">添加我的爱车</text>
			</view>
			<text class="yticon icon-you right" />
		</view>
		<!-- 头部轮播 -->
		<view class="carousel-section">
			<swiper class="carousel" indicator-active-color="#4CC8C4" indicator-color="#FFFFFF" circular :indicator-dots="true" 
				:autoplay="true" :interval="2000" :duration="500">
				<swiper-item v-for="(item, index) in bannerList" :key="index" class="carousel-item">
					<image :src="item.imageUrl" />
				</swiper-item>
			</swiper>
		</view>
		<!-- 推荐商品 -->
		<view class="f-header">
			<view class="tit-box">
				<view class="tui-bg"></view>
				<text class="tit">推荐商品</text>
			</view>
			<view class="flex_row_yCenter">
				<text class="tit2" @click="getMore('查看全部商品')">查看全部商品</text>
				<text class="yticon icon-you" />
			</view>
		</view>
		<!-- 列表 -->
		<view class="guess-section">
			<view v-for="(item, index) in tuiGoodsList" :key="index" class="guess-item">
				<view class="image-wrapper" @click="navToDetailPage(item)">
					<image :src="item.thumbUrl" mode="aspectFill"></image>
				</view>
				<text class="title clamp">{{ item.name }}</text>
				<view class="bt-area">
					<view class="flex_row_yCenter">
						<text class="price">￥{{ item.price||'' }}</text>
						<text class="price-hit">￥{{ item.originalPrice||''}}</text>
					</view>
					<image src="/static/logo/shopcart.png"  @click="toShopCar(item)"/>
				</view>
			</view>
		</view>
		<!-- 热销商品 -->
		<view class="f-header">
			<view class="tit-box">
				<view class="hot-bg"></view>
				<text class="tit">热销商品</text>
			</view>
			<view class="flex_row_yCenter">
				<text class="tit2" @click="getMore('热销商品')">更多</text>
				<text class="yticon icon-you" />
			</view>
		</view>
		<!-- 列表 -->
		<block v-for="(item, index) in hotGoodsList" :key="index">
			<view class="hot-goods">
				<image class="image-bg" :src="item.thumbUrl" mode="aspectFill" @click="navToDetailPage(item)"/>
				<view class="item-right">
					<text class="clamp2 title" @click="navToDetailPage(item)">{{ item.name||'' }}</text>
					<text class="class" @click="navToDetailPage(item)">{{item.productDesc||''}}</text>
					<view class="flex_row_yCenter" @click="navToDetailPage(item)">
						<image class="hot" src="/static/logo/huo.png" />
						<text class="hot-text">{{item.saleCount || 0}}人已下单</text>
					</view>
					<view class="btns">
						<view class="flex_row_yCenter" @click="navToDetailPage(item)">
							<text class="price">￥{{ item.price||'' }}</text>
							<text class="price-hit">￥{{ item.originalPrice||''}}</text>
						</view>
						<image src="/static/logo/shopcart.png" @click="toShopCar(item)"/>
					</view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
import indexTop from '@/components/com-comp/index-top.vue';
import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue';
import { getBMap } from '@/common/js/util.js';
import { mapState } from 'vuex';
export default {
	computed: {
		...mapState(['bannerList','tuiGoodsList','hotGoodsList'])
	},
	components: {
		indexTop,
		uniSearchBar
	},
	data() {
		return {
			latitude:'',
			longitude:'',
			location:'定位中...',
			carImg:'',
			carName:'',
			hasCar:false,//是否有车辆
		};
	},

	onLoad() {
		this.getLocation()
	},
	onShow() {
		this.loadData()
		this.hasCar=false
		if(this.hasLogin){
			this.getCarsList()
		}
	},
	onShareAppMessage() {},
	methods: {
		/* 获取地理位置 */
		async getLocation(){
			let that=this
			let resData=await getBMap()
			/* getLocation只是做权限验证 */
			wx.getLocation({
				 type: 'wgs84',
				 success (res) {
				    
					let resLatLong={
						latitude:resData.location.lng ,
						longitude:resData.location.lat
					}
					that.latitude=resData.location.lng
					that.longitude=resData.location.lat
					wx.setStorageSync("getUserLocationInfo",resLatLong);
					that.location=resData.addressComponent.city
					
				 },
				 fail(res){
					 // that.getLocation()
					 //console.log(JSON.stringify(res))
				 }
			})
		},
		/**
		 * 请求静态数据只是为了代码不那么乱
		 * 分次请求未作整合
		 */
		async loadData() {
			// uni.showLoading({
			// 	mask: true,
			//     title: '加载中'
			// });
			/* 获取banner */
			await this.$store.dispatch('getBanner')
			let params={
				  latitude: this.latitude,
				  longitude: this.longitude,
				  packageName: "",
				  pageNum:1,
				  pageSize: 6,
				  sortType: 'xl'
			}
			/* 获取推荐商品 */
			await this.$store.dispatch('getTuiGoods',params)
			/* 推荐热门商品 */
			await this.$store.dispatch('getHotGoods',params)
			//uni.hideLoading();
		},
		//获取用户车辆列表
		async getCarsList(){
			let _memberId = wx.getStorageSync('memberId')
			let res = await this.$store.dispatch('getCarDetails',{memberId:_memberId});
			if(res.success){
				for(let it of res.data){
					if(it.isDefault){
						this.hasCar=it.isDefault
						this.carName=it.brand
						this.carImg=it.image
					}
				}
			}else{
				this.$api.msg(res.message)
			}
		},
		navTo(url) {
			if (!uni.getStorageSync('hasLogin')) {
				url = '/pages/login/login';
			}
			uni.navigateTo({
				url
			});
		},
		addCar(url){
			//let hasLogin = uni.getStorageSync('hasLogin') || false//是否登录
			// userInfo:uni.getStorageSync('userInfo') || '',//用户信息
			console.log('url',url,this.hasCar)
			if (!this.hasLogin) {
				url = '/pages/login/login'
			}
			if(!this.hasCar){
				uni.navigateTo({
					url
				});
			}
		},
		//详情页
		navToDetailPage(item) {
			//详情页面的title
			let title = item.name
			let id = item.packageId
			if(id){
				uni.navigateTo({
					url: `/pages/detail/goodsDetail?title=${title}&id=${id}`
				});
			}else{
				return ''
			}
		},
		/* 点击搜索 */
		clickChange() {
			uni.navigateTo({
				url: `/pages/search/search`
			})
		},
		/* 更多 */
		getMore(title){
			/* 商品列表需要传经纬度 */
			uni.navigateTo({
				url:`/pages/product/list?title=${title}&latitude=${this.latitude}&longitude=${this.longitude}`
			})
		},
		async toShopCar(item){
			let params={
				"packageId": item.packageId
				// "storeId": item.storeId
			  }
			if (!this.hasLogin) {
				uni.navigateTo({ url:'/pages/login/login' });
				return
			}
			await this.$store.dispatch('addCart',params)
			this.$api.msg('已添加至购物车');
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	background: #f5f5f5;
}
.left-top-area {
	display: flex;
	align-items: center;
	padding-left: 25upx;
	width: 20%;
	font-size: 30upx;
	font-family: PingFang SC;
	font-weight: 500;
	color: rgba(60, 56, 54, 1);
	image {
		width: 20upx;
		height: 11upx;
		margin-left: 8upx;
	}
}
/* 我的爱车 */
.addnew image{
	margin-top: 10upx;
}
.my-car-style {
	// position: fixed;
	padding: 0upx 25upx 0upx 25upx;
	z-index: 99;
	height: 88upx;
	width: 100%;
	background-color: #ffffff;
	display: flex;
	align-items: center;
	justify-content: space-between;
	box-shadow: 0upx 9upx 14upx 2upx rgba(8, 52, 59, 0.06);
	image {
		width: 44upx;
		height: 44upx;
	}
	.left {
		width: 80%;
		font-size: 30upx;
		margin-left: 6upx;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
		font-family: PingFang SC;
		font-weight: 800;
		color: rgba(60, 56, 54, 1);
	}
	.right {
		color: $font-color-light;
	}
}
/* 头部 轮播图 */
.carousel-section {
	position: relative;
	// padding-top: 50px;
}
.carousel {
	width: 100%;
	height: 325upx;
	margin-top: 27upx;
	.carousel-item {
		width: 100%;
		height: 100%;
		padding: 0 25upx;
		// padding-bottom: 20upx;
		overflow: hidden;
	}
	image {
		width: 100%;
		height: 100%;
		border-radius: 10upx;
		box-shadow: 0upx 9upx 14upx 2upx rgba(8, 52, 59, 0.06);
	}
}
// 列表头部
.f-header {
	display: flex;
	align-items: center;
	height: 130upx;
	padding: 6upx 30upx 8upx;
	margin-top: 16upx;
	background: #fff;
	image {
		flex-shrink: 0;
		width: 80upx;
		height: 80upx;
		margin-right: 20upx;
	}
	.tit-box {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	.tit {
		font-family:PingFang SC;
		font-weight:800;
		font-size: $font-lg + 4upx;
		color: #font-color-dark;
		z-index: 1;
	}
	.tit2 {
		font-size: $font-base;
		color: $font-color-light;
	}
	.icon-you {
		font-size: $font-lg + 2upx;
		color: $font-color-light;
	}
	/* 推荐bg */
	.tui-bg{
		position: absolute;
		width:155upx;
		height:20upx;
		background:#FDBA24;
		margin-top: 24upx;
	}
	/* 热销bg */
	.hot-bg{
		position: absolute;
		width:155upx;
		height:20upx;
		background:#C0D830;
		margin-top: 24upx;
	}
}
/* 推荐商品 */
.guess-section {
	display: flex;
	flex-wrap: wrap;
	padding: 0 30upx;
	background: #fff;
	box-shadow:0upx 9upx 15upx 1upx rgba(8,52,59,0.06);
	.guess-item {
		display: flex;
		flex-direction: column;
		width: 48%;
		padding-bottom: 40upx;
		&:nth-child(2n + 1) {
			margin-right: 4%;
		}
	}
	.image-wrapper {
		width: 100%;
		height: 330upx;
		border-radius: 3px;
		overflow: hidden;
		image {
			width: 100%;
			height: 100%;
			opacity: 1;
		}
	}
	.title {
		font-size: $font-base;
		color: $font-color-dark;
		line-height: 80upx;
	}
	.bt-area {
		display: flex;
		align-items: center;
		justify-content: space-between;
		.price {
			font-size: $font-base;
			color: $font-color-price;
		}
		
		image {
			width: 48upx;
			height: 48upx;
		}
	}
}
/* 热销商品 */
.hot-goods {
	display: flex;
	align-items: center;
	position: relative;
	padding: 25upx 25upx;
	background-color: #FFFFFF;
	.image-bg {
		width: 209upx;
		height: 200upx;
		border-radius: 8upx;
		}
	.item-right {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 200upx;
		flex: 1;
		overflow: hidden;
		padding-left: 30upx;
		font-size: $font-base;
		font-family: PingFang SC;
		font-weight: 500;
		.title {
			color: #3C3836;
		}
		.class{
			color: rgba(60,56,54,0.5);
		}
		.hot{
			width:20upx;
			height:27upx;
		}
		.hot-text{
			padding-left: 13upx;
			color: $uni-color-success;
		}
		.btns{
			display: flex;
			align-items: center;
			justify-content: space-between;
			.price {
				color:$font-color-price;
			}
			image{
				width: 48upx;
				height: 48upx;
			}
		}
	}
}
	.price-hit{
		padding-left: 9upx;
		font-size:20upx;
		font-family:PingFang SC;
		font-weight:500;
		text-decoration:line-through;
		color:rgba(60,56,53,1);
		opacity:0.4;
	}
</style>
