<template>
	<view class="content">
		<view class="navbar">
			<view class="nav-item" v-for="item in goodsSort" :key="item.index" :class="{ current: filterIndex === item.index }" 
			@click="tabClick(item)">{{ item.name }}</view>
		</view>
		<!-- 列表 -->
		<view>
			<block v-for="(item, index) in goodsList" :key="index" >
				<view class="goods-list box-shadow" @click="navToDetailPage(item)">
					<view class="goods-item">
						<image class="image-bg" :src="item.thumbUrl" mode="aspectFill" />
						<view class="item-right">
							<text class="clamp title">{{ item.name }}</text>
							<view class="label">{{item.productDesc || ''}}</view>
							<view class="btns">
								<view class="flex_row_yCenter">
									<text class="price">￥{{ item.price }}</text>
									<text class="price-hit">￥{{ item.originalPrice}}</text>
								</view>
								<image class="cart" src="/static/logo/shopcart.png" @click.stop="toShopCar(item)"/>
							</view>
						</view>
					</view>
					<view class="line"></view>
					<view class="bottom-area">
						<text class="left">{{item.storeName || ''}}</text>
						<view class="right flex_row_center">
							<image src="/static/dizhi.png"/>
							<text>{{item.storeDistance || 0}}km</text>
						</view>
					</view>
				</view>
			</block>
		</view>
		<uni-load-more v-if="goodsList.length>5" :status="loadingType"></uni-load-more>
	</view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import { goodsSort } from '@/common/js/common.js';
import { mapState } from 'vuex';
export default {
	computed: {
		...mapState(['tuiGoodsList','hotGoodsList'])
	},
	components: {
		uniLoadMore
	},
	data() {
		return {
			latitude:'',
			longitude:'',
			headerTitle:'',
			goodsSort: goodsSort,
			headerPosition: 'fixed',
			loadingType: 'more', //加载更多状态
			filterIndex: 0,
			sortType:'xl',//当前筛选排序类型
			priceOrder: 0, //1 价格从低到高 2价格从高到低
			pageNum:1, //当前页码
			pageSize:10,//每页数据量
			goodsList: []
		};
	},

	onLoad(options) {
		//console.log(JSON.stringify(options))
		this.headerTitle=options.title
		this.latitude=options.latitude
		this.longitude=options.longitude
		uni.setNavigationBarTitle({
			title: this.headerTitle
		});
		this.loadData();
	},
	onPageScroll(e) {
		//兼容iOS端下拉时顶部漂移
		if (e.scrollTop >= 0) {
			this.headerPosition = 'fixed';
		} else {
			this.headerPosition = 'absolute';
		}
	},
	onShareAppMessage() {},
	//下拉刷新
	onPullDownRefresh() {
		// this.pageNum=1
		// this.loadData('refresh');
	},
	//加载更多
	onReachBottom() {
		this.pageNum+=1
		this.loadData();
	},
	methods: {
		//加载商品 ，带下拉刷新和上滑加载
		async loadData(type = 'add', loading) {
			//没有更多直接返回
			if (type === 'add') {
				if (this.loadingType === 'nomore') {
					return;
				}
				this.loadingType = 'loading';
			} else {
				this.loadingType = 'more';
			}
			wx.showLoading()
			let params={
				  latitude: this.latitude,
				  longitude: this.longitude,
				  packageName: "",
				  pageNum:this.pageNum,
				  pageSize: this.pageSize,
				  sortType: this.sortType
			}
			let res = await this.$store.dispatch('getAllGoodsList',params)
			wx.hideLoading()
			let _list = res.data.list
			this.goodsList = this.goodsList.concat(_list)
			this.loadingType = _list.length >= this.pageNum ? 'more' : 'nomore'
		},
		//筛选点击
		tabClick(item) {
			this.pageNum=1
			this.filterIndex=item.index
			this.sortType=item.type
			this.goodsList = []
			uni.pageScrollTo({
				duration: 300,
				scrollTop: 0
			});
			this.loadData('refresh');
		},
		//详情
		navToDetailPage(item) {
			let title = item.name
			let id = item.packageId
			uni.navigateTo({
				url: `/pages/detail/goodsDetail?title=${title}&id=${id}`
			});
		},
		async toShopCar(item){
			let params={
				"packageId": item.packageId,
				"storeId": item.storeId
			  }
			if(item.storeId){
				await this.$store.dispatch('addCart',params)
				// uni.switchTab({
				// 	url: '/pages/cart/cart'  
				// });
				this.$api.msg('已添加至购物车');
			}else{
				return ''
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	background: #FFFFFF;
	height: 100vh;
	margin-top: 96upx;
}
/* 顶部tabbar */
.navbar {
	position: fixed;
	top: 44px;
	left: 0;
	top: var(--window-top);
	display: flex;
	width: 100%;
	height: 80upx;
	background: #fff;
	box-shadow: 0 2upx 10upx rgba(0, 0, 0, 0.06);
	z-index: 10;
	.nav-item {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		font-size: $font-base;
		color: $font-color-dark;
		position: relative;
		&.current {
			color: $uni-color-success;
			font-size: $font-lg;
			&:after {
				content: '';
				position: absolute;
				left: 50%;
				bottom: 0;
				transform: translateX(-50%);
				width: 120upx;
				height: 0;
				border-bottom: 2px solid $uni-color-success;
			}
		}
	}
}

/* 商品列表 */
.goods-list{
	//height: calc(100vh - 176upx);
	margin: 25upx 25upx 0px 25upx;
	background-color: #FFFFFF;
	.goods-item {
		display: flex;
		align-items: center;
		position: relative;
		padding: 5upx 10upx 30upx 10upx;
		.image-bg {
			width: 155upx;
			height: 145upx;
			border-radius: 8upx;
			}
		.item-right {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			height: 145upx;
			flex: 1;
			overflow: hidden;
			padding-left: 30upx;
			font-size: $font-base;
			font-family: PingFang SC;
			font-weight: 500;
			.title {
				color: #3C3836;
			}
			.btns{
				display: flex;
				align-items: center;
				justify-content: space-between;
				.price {
					font-size: 28upx;
					color:$font-color-price;
				}
				.cart{
					width: 48upx;
					height: 48upx;
				}
			}
		}
	}
	.line{
		width:100%;
		height:1upx;
		background-color:rgba(0,0,0,1) ;
		// border:1upx solid rgba(0,0,0,1);
		opacity:0.07;
	}
	.bottom-area{
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 20upx;
		.left{
			font-size:24upx;
			font-family:PingFang SC;
			font-weight:500;
			color:rgba(60,56,53,1);
			opacity:0.6;
		}
		.right{
			padding: 0px 12upx 0px 12upx;
			height:34upx;
			background:rgba(231,249,249,1);
			border-radius:4upx;
			image{
				width:15upx;
				height:18upx;
			}
			text{
				padding-left: 5upx;
				font-size:24upx;
				font-family:PingFang SC;
				font-weight:500;
				color:rgba(0,177,169,1);
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
	.label{
		font-size:28upx;
		font-family:PingFang SC;
		color:rgba(60,56,53,1);
		line-height:32upx;
		opacity:0.5;
	}
}
</style>
