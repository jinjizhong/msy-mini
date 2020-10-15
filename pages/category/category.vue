<template>
	<view class="content">
		<view class="top-line"/>
		<view class="zw"></view>
		<block v-if="isGetLocation">
			<view>
				<uni-search-bar @confirm="getStoreList" @input="getInputVal" :clickChange="true" :inputShow="true" :radius="5" searchHeight="68rpx" placeholder="搜索你想要找到的门店" />
			</view>
			<scroll-view scroll-y class="scroll-aside" @scroll="asideScroll">
				<view v-for="item in storeList" :key="item.id" class="card" @click="toStoreDetail(item.id)">
					<view class="v1">
						<view class="store">{{item.name}}</view>
						<view v-if="item.recentlyUse" class="tag">最近常去</view>
					</view>
					<view class="star">
						<image v-for="xing in item.starNum" :key="index" src="../../static/xing.png">
						<image v-for="xing2 in item.starNum2" :key="index" src="../../static/xing2.png">
						<label>{{item.star || 5}}</label>
					</view>
					<view class="address">
						<label class="l1">{{item.address || ''}}</label>
						<label class="l2">{{item.distance || 0}}Km</label>
						<image src="../../static/right.png">
					</view>
					<view class="line"></view>
					<view class="time">营业时间:{{item.businessHours || ''}}</view>
				</view>
				<uni-load-more v-if="storeList.length>10" :status="loadingType"></uni-load-more>
				<!-- <openLocation v-if="!isGetLocation" @openLocation="getOpenLocation"></openLocation> -->
			</scroll-view>
		</block>
		<block v-else>
			<empty></empty>
			<button @tap="openLocation" class="opensetting" open-type="openSetting" @opensetting="getSetting">门店列表需要地理位置授权</button>
		</block>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue';
	import { getBMap } from '@/common/js/util.js';
	import empty from '@/components/empty.vue';
	import { mapState } from 'vuex';
	export default {
		components: {
			uniSearchBar,
			uniLoadMore,
			empty
		},
		computed: {
			...mapState(['memberId'])
		},
		data() {
			return {
				storeList:[],//门店列表
				sizeCalcState: false,
				currentId: 1,
				slist: [],
				keyWords:'',//搜索关键字
				loadingType: 'more', //加载更多状态
				isGetLocation:false,//true 已经开启   false未开启
				pageNum:1, //当前页码
				pageSize:10,//每页数据量
			}
		},
		onLoad(){
			this.isGetLocation = wx.getStorageSync("getUserLocationInfo") ? true : false;
			// this.getStoreList();
		},
		onShow(){
			if(this.storeList.length == 0){
				this.getStoreList();
			}
		},
		onShareAppMessage() {},
		methods: {
			openLocation(){
				this.isGetLocation = true
			},
			getSetting(){
				let that=this
				wx.getSetting({
				    success: function(res) {
						if(!res.authSetting['scope.userLocation']){
							that.isGetLocation = false
							return
						}
						wx.getLocation({
							 type: 'wgs84',
							 success: async (res)=> {
								let resData= await getBMap()
								let resLatLong={
								 	latitude:resData.location.lng ,
								 	longitude:resData.location.lat
								}
								wx.setStorageSync("getUserLocationInfo",resLatLong);
								that.getStoreList();
							 },
							 fail(res){
								 // that.getLocation()
								 //console.log(JSON.stringify(res))
							 }
						})
					}
				})
				
			},
			getOpenLocation(data){
				//console.log(data,2233)
				this.isGetLocation = data
				//console.log(this.isGetLocation,223344)
				// this.$forceUpdate()
			},
			async getStoreList(searchType,type = 'add', loading){
				//没有更多直接返回
				if (type === 'add') {
					if (this.loadingType === 'nomore') {
						return;
					}
					this.loadingType = 'loading';
				} else {
					this.loadingType = 'more';
				}
				if(!this.isGetLocation){
					return
				}
				let params = {
					memberId:this.memberId,
					latitude:wx.getStorageSync('getUserLocationInfo').latitude,
					longitude:wx.getStorageSync('getUserLocationInfo').longitude,
					storeName:this.keyWords,
					pageNum:this.pageNum,
					pageSize: this.pageSize,
				}
				let storeList = await this.$store.dispatch('getStoreList',params);
				let _storeList = storeList.data.storeList.list;
				if(this.pageNum == 1 && storeList.data.frequentStore){
					storeList.data.frequentStore.recentlyUse = true
					_storeList.unshift(storeList.data.frequentStore)
				}
				_storeList.forEach(x=>{
					x.starNum = Math.floor(x.star) || 5
					x.starNum2 = 5 - x.starNum
				})
				if(searchType){
					this.storeList = _storeList;
				}else{
					this.storeList = this.storeList.concat(_storeList)
				}
				this.loadingType = _storeList.length >= this.pageNum ? 'more' : 'nomore'
				// this.storeList = _storeList.list;
				
			},
			//加载更多
			onReachBottom() {
				this.pageNum+=1
				this.getStoreList();
			},
			//滚动
			asideScroll(e){
				if(!this.sizeCalcState){
					this.calcSize();
				}
				let scrollTop = e.detail.scrollTop;
				let tabs = this.slist.filter(item=>item.top <= scrollTop).reverse();
				if(tabs.length > 0){
					this.currentId = tabs[0].pid;
				}
			},
			//计算右侧栏每个tab的高度等信息
			calcSize(){
				let h = 0;
				this.slist.forEach(item=>{
					let view = uni.createSelectorQuery().select("#main-" + item.id);
					view.fields({
						size: true
					}, data => {
						item.top = h;
						h += data.height;
						item.bottom = h;
					}).exec();
				})
				this.sizeCalcState = true;
			},
			goSearch(){
				wx.navigateTo({
					url: `/pages/search/search`
				})
			},
			navToList(sid, tid){
				uni.navigateTo({
					url: `/pages/product/list?fid=${this.currentId}&sid=${sid}&tid=${tid}`
				})
			},
			toStoreDetail(id){
				uni.navigateTo({
					url:`/pages/detail/storeDetail?storeId=${id}`
				})
			},
			getInputVal(data){
				this.keyWords = data.value;
				this.pageNum = 1
				this.loadingType = 'more'
				// this.getStoreList('keywords')
			}
		}
	}
</script>

<style lang='scss' scoped>
	.zw{
		height: 5upx;
	}
	.card{
		margin-top: 20upx;
		padding: 30upx 25upx;
		width:700upx;
		height:281upx;
		background:rgba(255,255,255,1);
		border-radius:22upx;
		box-shadow:0upx 9upx 15upx 1upx rgba(8,52,59,0.06);
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
			.tag{
				width:108upx;
				height:34upx;
				background:rgba(231,249,249,1);
				border-radius:4upx;
				font-size:22upx;
				font-family:PingFang SC;
				font-weight:500;
				color:rgba(76,200,195,1);
				line-height:38upx;
				text-align: center;
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
		.line{
			width: 100%;
			height:1upx;
			border:1upx solid rgba(0,0,0,1);
			opacity:0.07;
			margin-top: 20upx;
		}
		.time{
			font-size:28upx;
			font-family:PingFang SC;
			font-weight:800;
			color:rgba(60,56,53,1);
			line-height:70upx;
		}
	}
	.top-line{
		width: 100%;
		height: 1upx;
		background-color: rgba(182,180,180,0.48);
		position: fixed;
		z-index: 99;
	}
	.content{
		
	}
	.scroll-aside{
		flex: 1;
		overflow: hidden;
		padding-left: 25upx;
	}
	.t-list{
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		background: #fff;
		padding-top: 12upx;
		&:after{
			content: '';
			flex: 99;
			height: 0;
		}
	}
	.t-item{
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 176upx;
		font-size: 26upx;
		color: #666;
		padding-bottom: 20upx;
		
		image{
			width: 140upx;
			height: 140upx;
		}
	}
	.opensetting{
		width: 600upx;
		height: 88upx;
		background: #00B1A9;
		border-radius: 22upx;
		color: #fff;
		position: absolute;
		top: calc(70vh - 40upx);
		left: 75upx;
	}
	button::after{
		border: none;
	}
</style>
