<template>
	<view class="content">
		<view class="top-line"/>
		<view class="zw"></view>
		<scroll-view v-if="isGetLocation" scroll-y class="scroll-aside" @scroll="asideScroll">
			<view v-for="item in storeList" :key="item.id" class="card" @click="toStoreDetail(item)">
				<view class="v1">
					<view class="store">{{item.name}}</view>
					<view v-if="item.recentlyUse" class="tag">最近常去</view>
				</view>
				<view class="star">
					<image v-for="xing in item.starNum" :key="index" src="../../static/xing.png">
					<image v-for="xing2 in item.starNum2" :key="index" src="../../static/xing2.png">
					<label>{{item.star || 0}}</label>
				</view>
				<view class="address">
					<label class="l1">{{item.address}}</label>
					<label class="l2">{{item.distance}}Km</label>
					<image src="../../static/right.png">
				</view>
				<view class="line"></view>
				<view class="time">营业时间:{{item.businessHours}}</view>
			</view>
			<view class="card">
				
			</view>
		</scroll-view>
		<block v-else>
			<empty></empty>
			<button @tap="openLocation" class="opensetting" open-type="openSetting" @opensetting="getSetting">门店列表需要地理位置授权</button>
		</block>
	</view>
</template>

<script>
	import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue';
	import empty from '@/components/empty.vue';
	import { getBMap } from '@/common/js/util.js';
	import { mapState } from 'vuex';
	export default {
		components: {
			uniSearchBar,
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
				flist: [],
				slist: [],
				tlist: [],
				isGetLocation:false,//true 已经开启   false未开启
				packageId:'',//商品ID
			}
		},
		onLoad(options){
			this.isGetLocation = wx.getStorageSync("getUserLocationInfo") ? true : false;
			this.packageId=options.packageId
			this.getStoreList();
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
							 success: async(res)=> {
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
				this.isGetLocation = data
			},
			async getStoreList(){
				if(!this.isGetLocation){
					return
				}
				let params = {
					memberId:this.memberId,
					latitude:wx.getStorageSync('getUserLocationInfo').latitude,
					longitude:wx.getStorageSync('getUserLocationInfo').longitude,
					packageId:this.packageId
				}
				let _storeList = await this.$store.dispatch('getStoreList',params);
				_storeList = _storeList.data.storeList;
				//console.log(_storeList,33)
				_storeList.list.forEach(x=>{
					x.starNum = Math.floor(x.star) || 0
					x.starNum2 = 5 - x.starNum
				})
				this.storeList = _storeList.list;
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
			toStoreDetail(item){
				uni.$emit("storeListen",{name: item.name,id: item.id})
				uni.navigateBack()
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
