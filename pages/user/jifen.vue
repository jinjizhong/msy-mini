<template>
	<view class="com-content">
		<view class="banner flex_column_xCenter">
			<image class="jfbg" src="../../static/jf_bg.png" mode=""></image>
			<view class="all">
				<view class="num">{{availableAmount}}</view>
				<text class="txt">我的积分</text>
			</view>
		</view>
		<view class="topContent">
			<view class="content">
				<view class="navbar">
					<view v-for="(item, index) in navList" :key="index" class="nav-item" :class="{ current: tabCurrentIndex === index }" 
						@click="tabCurrentIndex = index">
						{{ item.text }}
					</view>
				</view>
				<!-- list列表 -->
				<view class="list-height">
					<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
						<swiper-item v-for="(tabItem, tabIndex) in navList" :key="tabIndex">
							<scroll-view class="scroll-list" scroll-y @scrolltolower="loadData">
								<empty v-if="tabItem.orderList.length == 0" text='暂无记录'/>
								<view v-else v-for="(item, index) in tabItem.orderList" :key="index" class="list-item">
									<view class="left">
										<image src="/static/logo/jifen.png"/>
										<view class="flex_column">
											<text class="title">{{item.typeDescription}}</text>
											<text class="time">{{item.created | formatDate}}</text>
										</view>
									</view>
									<text class="num">{{item.amount}}</text>
								</view>
							</scroll-view>
						</swiper-item>
					</swiper>
				</view>
 			</view>
		</view>
	</view>
</template>
<script>
import Json from '@/Json';
import {formatTime} from '@/common/js/util.js';
import { mapState } from 'vuex';
import empty from '@/components/empty';
export default {
	components:{
		empty
	},
	computed: {
		...mapState(['availableAmount'])
	},
	data() {
		return {
			tabCurrentIndex: 0,
			navList: [
				{
					type: 0,
					text: '全部',
					loadingType: 'more',
					orderList: []
				},
				{
					type: 1,
					text: '已使用',
					loadingType: 'more',
					orderList: []
				}
			],
			pageNum:1
		};
	},
	onLoad() {
		this.loadData()
	},
	onShareAppMessage() {},
	filters:{
		formatDate(value){
			if(value==null){
				return ;
			}
			return value;
		}
	},
	methods: {
		async loadData(source){
			let navItem = this.navList[this.tabCurrentIndex]
			if (source === 'tabChange' && navItem.loaded === true) {
				//tab切换只有第一次需要加载数据
				return;
			}
			if (navItem.loadingType != 'more') {
				//防止重复加载
				return;
			}
			let params={
				"memberId": uni.getStorageSync('memberId'),
				"pageNum": this.pageNum,
				"pageSize": 10,
				"type": this.tabCurrentIndex
			}
			let res = await this.$store.dispatch('recordList',params)
			let list=res.data.list
			list.forEach(item => {
				item.amount = item.type == 1 ? '+'+item.amount : '-'+item.amount
				navItem.orderList.push(item);
			});
			//loaded新字段用于表示数据加载完毕
			this.$set(navItem, 'loaded', true);
			//判断是否还有数据， 有改为 more， 没有改为noMore
			if(list.length >= 10){
				this.pageNum++
				navItem.loadingType = 'more';
			}else{
				navItem.loadingType = 'noMore';
			}
		},
		/* 改变tab */
		changeTab(e) {
			this.tabCurrentIndex = e.target.current;
			this.loadData('tabChange');
			this.pageNum = 1
			navItem.loadingType = 'more';
			//console.log(this.navList)
		}
	}
};
</script>
<style lang="scss" scoped>
.com-content {
	background: rgba(244, 244, 244, 1);
	min-height: 100vh;
}
.swiper-box{
	height: calc(100vh - 460upx);
	.scroll-list{
		width: 100%;
		height: calc(100vh - 450upx);
	}
}
.banner {
	width: 100%;
	height: 376upx;
	position: relative;
	.jfbg{
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		z-index: 0;
	}
	.all {
		padding-left: 15%;
		padding-bottom: 10%;
		position: absolute;
	}
	.num {
		font-size: 72upx;
		font-family: PingFang SC;
		font-weight: 800;
		color: rgba(60, 56, 54, 1);
	}
	.txt {
		font-size: 28upx;
		font-family: PingFang SC;
		font-weight: 500;
		color: rgba(60, 56, 54, 1);
	}
}
.topContent {
	margin: -100upx 25upx 0px 25upx;
	.content {
		width: 700upx;
		// height: calc(100vh - 360upx);
		background: #ffffff;
		border-radius: 22upx;
		position: absolute;
	}
}
.navbar {
	display: flex;
	height: 40px;
	padding: 0 5px;
	background: #fff;
	box-shadow: 0 1px 5px rgba(0, 0, 0, 0.06);
	border-top-left-radius: 22upx;
	border-top-right-radius:22upx;
	position: relative;
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
			color: $font-color-base;
			font-size: $font-lg;
			&:after {
				content: '';
				position: absolute;
				left: 50%;
				bottom: 0;
				transform: translateX(-50%);
				width: 44px;
				height: 0;
				border-bottom: 2px solid $font-color-base;
			}
		}
	}
}
.list-height{
	height: 60%;
	.list-item{
		padding: 25upx;
		width: 100%;
		height: 136upx;
		font-family:PingFang SC;
		font-weight:500;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.left{
			display: flex;
			align-items: center;
		}
		image{
			width:71upx;
			height:71upx;
			margin-right: 34upx;
		}
		.title{
			font-size:28upx;
			color: #3C3836;
		}
		.time{
			font-size:24upx;
			color:rgba(60,56,54,0.5);
		}
		.num{
			font-size:30upx;
		}
	}
}
</style>
