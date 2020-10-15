<template>
	<view>
		<view class="search-box">
			<view class="search">
				<uni-search-bar
					:radius="5"
					searchHeight="68rpx"
					@input="getInputVal"
					:clickChange="true"
					:inputShow="true"
					@clickChange="clickChange"
					placeholder="搜索你想要的商品或服务"
					@confirm="getConfirm"
				/>
			</view>
			<label class="cancle" @click="cancel">取消</label>
		</view>
		<view class="search-list">
			<view class="li" v-for="(item, index) in searchList" :key="index" @click="navToDetailPage(item)">
				<view class="left">
					<image v-if="item.imageUrl" class="prodImg" :src="item.imageUrl" mode=""></image>
					<image v-else class="bgimg" src="/static/msgLogo.png" mode=""></image>
				</view>
				<view class="right">
					<view class="title">{{ item.name }}</view>
					<view class="label">{{ item.productDesc || '' }}</view>
					<view class="price">
						<view class="price-v">
							<label>￥</label>
							{{ item.price }}
						</view>
						<image src="/static/logo/shopcart.png" @click.stop="toShopCar(item)" mode=""></image>
					</view>
					<view class="num">
						<image src="/static/logo/huo.png" mode=""></image>
						<lable>{{ item.saleCount || 0 }}人已下单</lable>
					</view>
				</view>
			</view>
			<uni-load-more v-if="searchList.length > 10" :status="loadingType"></uni-load-more>
		</view>
	</view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
export default {
	components: {
		uniLoadMore
	},
	data() {
		return {
			keyWords: '', //搜索关键字
			searchList: [], //搜索列表
			loadingType: 'more', //加载更多状态
			pageNum: 0,
			pageSize: 10
		};
	},
	onLoad() {
		this.getStoreList();
	},
	onShareAppMessage() {},
	methods: {
		cancel() {
			uni.navigateBack();
		},
		async getStoreList() {
			if (this.loadingType == 'nomore') {
				return;
			}
			this.loadingType = 'loading';
			let params = {
				keyword: this.keyWords,
				sort: 0,
				pageSize: this.pageSize,
				pageNum: this.pageNum
			};
			let searchList = await this.$store.dispatch('prodSearch', params);
			searchList = searchList.data.list;
			if (searchList.length >= this.pageSize) {
				this.pageNum++;
				this.loadingType = 'more';
			} else {
				this.loadingType = 'nomore';
			}
			this.searchList = this.searchList.concat(searchList);
		},
		getInputVal(data) {
			this.keyWords = data.value;
			this.pageNum = 0;
			this.loadingType = 'more';
		},
		//详情页
		navToDetailPage(item) {
			//详情页面的title
			let title = item.name;
			let id = item.id;
			if (id) {
				uni.navigateTo({
					url: `/pages/detail/goodsDetail?title=${title}&id=${id}`
				});
			} else {
				return '';
			}
		},
		async toShopCar(item) {
			if (!this.hasLogin) {
				uni.navigateTo({
					url: '/pages/login/login'
				});
			}
			let params = {
				packageId: item.id
			};
			await this.$store.dispatch('addCart', params);
			this.$api.msg('添加成功');
		},
		getConfirm() {
			this.searchList = [];
			this.getStoreList();
		}
	},
	//加载更多
	onReachBottom() {
		this.getStoreList();
	},
};
</script>

<style lang="scss">
.search-box {
	display: flex;
	align-items: center;
	padding: 9rpx;
	.search {
		width: 642upx;
	}
	.cancle {
		margin-left: 15upx;
		border: none;
		font-size: 30upx;
		font-family: PingFang SC;
		color: rgba(0, 177, 169, 1);
		padding: 0;
		background-color: none;
	}
}
.search-list {
	width: 700upx;
	margin: 0 auto;
	background: rgba(255, 255, 255, 1);
	border-radius: 22upx;
	//box-shadow:0upx 9upx 15upx 1upx rgba(8,52,59,0.06);
	padding-bottom: 30upx;
	.li {
		display: flex;
		padding: 23upx 14upx;
		background: rgba(255, 255, 255, 1);
		.left {
			width: 255upx;
			height: 238upx;
			background: rgba(255, 251, 242, 1);
			.bgimg {
				margin-left: 73upx;
				margin-top: 54upx;
				width: 108upx;
				height: 127upx;
				opacity: 0.5;
			}
			.prodImg {
				width: 255upx;
				height: 239upx;
			}
			image {
			}
		}
		.right {
			width: 390upx;
			margin-left: 28upx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.title {
				font-size: 28upx;
				font-family: PingFang SC;
				color: #3c3835;
				line-height: 32upx;
			}
			.label {
				font-size: 28upx;
				font-family: PingFang SC;
				color: rgba(60, 56, 53, 1);
				line-height: 32upx;
				opacity: 0.5;
			}
			.num {
				display: flex;
				align-items: center;
				image {
					width: 20upx;
					height: 26upx;
				}
				lable {
					margin-left: 12upx;
					color: #00b1a9;
					font-size: 24upx;
					font-family: PingFang SC;
					color: rgba(0, 177, 169, 1);
				}
			}
			.price {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.price-v {
					font-size: 28upx;
					font-family: PingFang SC;
					font-weight: 500;
					color: rgba(199, 162, 47, 1);
					label {
						font-weight: 200;
					}
				}
				image {
					width: 48upx;
					height: 48upx;
					margin-right: 10upx;
				}
			}
		}
	}
}
</style>
