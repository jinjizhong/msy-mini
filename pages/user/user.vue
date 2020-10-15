<template>
	<view class="com-content">
		<view class="user-section">
			<view class="bg bgc1"></view>
			<view class="user-info-box">
				<image class="portrait" :src="userInfo.avatarUrl || '/static/missing-face.png'"></image>
				<view class="info-box">
					<text class="username" @click="goLogin">{{ userInfo.nickName || '请登录 >' }}</text>
					<text class="jifen">积分：{{availableAmount || 0}}</text>
				</view>
			</view>
			<view class="vip-card-box">
				<view v-if="isMember" class="btn flex_column_center">已领取</view>
				<view v-else class="btn flex_column_center" @click="getMember">领取</view>
			</view>
		</view>
		<!-- 订单 -->
		<view class="order-section">
			<view class="order-title">
				<text class="t-left">全部订单</text>
				<view class="flex_row_yCenter" @click="navTo('/pages/order/order?state=0')">
					<text class="t-right">查看全部</text>
					<text class="yticon icon-you" />
				</view>
			</view>
			<view class="order-bot">
				<view class="order-item" @click="navTo('/pages/order/order?state=1')" >
					<image class="logo" src="@/static/daizhifu.png" />
					<text>待支付</text>
				</view>
				<view class="order-item" @click="navTo('/pages/order/order?state=0')" >
					<image class="logo" src="@/static/shenhetongguo.png" />
					<text>待核销</text>
				</view>
				<view class="order-item" @click="navTo('/pages/order/order?state=2')" >
					<image class="logo" src="@/static/wancheng.png" />
					<text>已完成</text>
				</view>
				<view class="order-item" @click="navTo('/pages/order/order?state=3')" >
					<image class="logo" src="@/static/pingjia.png" />
					<text>待评价</text>
				</view>
			</view>
		</view>
		<!-- 我的爱车 -->
		<view class="order-section">
			<view class="order-title">
				<text class="t-left">我的爱车</text>
				<view class="flex_row_yCenter" @click="navTo('/pages/car/carManage')" >
					<text class="t-right">查看全部</text>
					<text class="yticon icon-you" />
				</view>
			</view>
			<view class="car-love">
				<view class="order-item" v-for="(item,index) in carList" :key="index">
					<image class="logo" :src="item.image" />
					<text class="clamp">{{item.brand}}</text>
				</view>
				<view class="order-item" @click="navTo('/pages/car/addCar')" >
					<image class="logo" src="@/static/tianjia.png" />
					<text>添加爱车</text>
				</view>
			</view>
		</view>
		<view class="list-section icon">
			<list-cell title="积分管理" @eventClick="navTo('/pages/user/jifen')"/>
			<list-cell title="我的客服" @eventClick="navTo('/pages/user/kefu')"/>
			<list-cell title="关于我们"/>
		</view>
		<!-- 弹框输入马石油会员 -->
		<view class="member-view" v-if="getMemberShow">
			<image class="shine" src="/static/shine.png" mode=""></image>
			<view class="member">
				<image class="member-bg" src="/static/member_bg.png" mode=""></image>
				<view class="info">
					<view class="input">
						<input type="text" @input="bindinputFun" v-model="userName" id='name' maxlength="10" placeholder="请输入真实姓名" />
					</view>
	<!-- 				<view class="input">
						<input type="number" @input="bindinputFun" v-model="phoneNum" id='phone' maxlength="11" placeholder="请输入手机号" />
					</view>
					<view class="input">
						<input class="phone" type="number" @input="bindinputFun" v-model="phoneCode" id='code' placeholder="输入手机验证码" />
						<button class="getcode" type="default" :class="canGetCode ? '' : 'disabledBtn'" :disabled="canGetCode ? '' : 'disabled' " @click="getCountDown">{{sendMg}}</button>
					</view> -->
					<!-- <button class="get" type="default" :class="canSubmit ? '' : 'disabledBtn'" :disabled="canSubmit ? '' : 'disabled' " @click="confirm">确认领取</button> -->
					<button class="get" :class="userName?'':'disabled'" type="default" :disabled="userName?'':'disabled'" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">确认领取</button>
				</view>
				<image class="close-btn" @click="closeMember" src="/static/close.png" mode=""></image>
			</view>
		</view>
	</view>
</template>
<script>
import listCell from '@/components/mix-list-cell';
import util from '../../common/js/util.js'
import { mapState } from 'vuex';
export default {
	computed: {
		...mapState(['availableAmount'])
	},
	components: {
		listCell
	},
	onShareAppMessage() {},
	data() {
		return {
			isMember:false,//是否是会员
			userInfo:'',
			getMemberShow:false,//领取会员
			time:60,
			sendMg:'获取验证码',
			sendNum:0,
			phoneNum:'',//用户手机号
			userName:'',//用户姓名
			phoneCode:'',//验证码
			canGetCode: false,//是否可以获取code
			canSubmit:false,//是否可以提交
			carList:[],//车辆列表
		};
	},
	async onShow() {
		if (!this.hasLogin) {
			this.carList=[]
			this.userInfo=''
			return
		}
		this.userInfo=uni.getStorageSync('userInfo')
		this.isMember = wx.getStorageSync('loginInfo').memberFlag == 1
		await this.$store.dispatch('inteInfo')
		this.getCarsList()
	},
	onLoad(){
		
	},
	methods: {
		goLogin(){
			if (!this.hasLogin) {
				uni.navigateTo({
					url:'/pages/login/login'
				});
			}
			
		},
		getMember(){
			/* 是否已经登录 */
			if (!this.hasLogin) {
				uni.navigateTo({
					url:'/pages/login/login'
				});
			}else{
				this.getMemberShow = true;
			}
		},
		closeMember(){
			this.getMemberShow = false;
		},
		bindinputFun(e){
			let id = e.currentTarget.dataset.id;
			let _val = e.detail.value;
			this.canGetCode = this.phoneNum.length == 11 ? true : false
			if(this.userName && this.phoneNum.length == 11 && this.phoneCode){
				this.canSubmit = true
			}else{
				this.canSubmit = false
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
		confirm(){
			this.getMemberShow=false
		},
		//注册会员
		async becomeMember(_detail){
			let {encryptedData,iv}=_detail
			let params = {
				encryptedData,
				iv,
				realName:this.userName,
				sessionKey:wx.getStorageSync('loginInfo').sessionKey
			}
			let res = await this.$store.dispatch('becomeMember',params)
			util.toast('会员领取成功')
			this.getMemberShow = false
			this.isMember = true
		},
		//获取用户车辆列表
		async getCarsList(){
			let _memberId = wx.getStorageSync('memberId') || 2
			let _carList = await this.$store.dispatch('getCarDetails',{memberId:_memberId});
			this.carList = _carList.data || [];
		},
		getPhoneNumber(e) {
			if(e.detail.errMsg == "getPhoneNumber:ok"){
				console.log(e,33)
			  this.becomeMember(e.detail)
			}
		  },
	}
};
</script>
<style lang="scss" scoped>
.com-content{
	padding-bottom: 20upx;
	min-height: 100vh;
}
.member-view{
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	z-index: 99;
	.disabledBtn{
		opacity: 0.5;
	}
	.shine{
		width: 1500upx;
		height: 1500upx;
		margin-left: -375upx;
		animation:turn 20s linear infinite;     
	}
	.close-btn{
		position: absolute;
		width: 78upx;
		height: 167upx;
		margin-top: 376upx;
	}
	.member{
		position: fixed;
		width: 100%;
		height: 100%;
		z-index: 9;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background:rgba(0,0,0,0.42);
		.member-bg{
			width: 700upx;
			height: 700upx;
			margin-left: 14upx;
		}
		.info{
			position: absolute;
			width: 493upx;
			top: 50%;
			margin-top: -70upx;
			.txt{
				font-size:29upx;
				font-family:PingFang SC;
				color:rgba(224, 190, 124, 0.5);
				padding-left: 30upx;
				margin-top: 20upx;
			}
			.input{
				margin-top: 110upx;
				display: flex;
				justify-content: space-between;
				input{
					width: 100%;
					height:72upx;
					background:rgba(95,108,90,0.3);
					border-radius:22upx;
					padding-left: 30upx;
					font-size:29upx;
					color: #fff;
				}
				.phone{
					width: 279upx;
				}
				.getcode{
					margin-left: 20upx;
					width: 195upx;
					height:72upx;
					background:rgba(0,178,170,0.38);
					border-radius:22upx;
					font-size:29upx;
					line-height: 72upx;
					font-family:PingFang SC;
					color:rgba(255,255,255,0.5);
				}
			}
			.get{
				width:100%;
				height:72upx;
				background:linear-gradient(0deg,rgba(224,190,124,1),rgba(240,216,168,1));
				border-radius:22upx;
				font-size:30upx;
				line-height: 72upx;
				font-family:PingFang SC;
				color:rgba(116,89,36,1);
				margin-top: 50upx;
			}
			.disabled{
				opacity: 0.7;
			}
		}
	}
	@keyframes turn{
	  0%{-webkit-transform:rotate(0deg);}
	  25%{-webkit-transform:rotate(90deg);}
	  50%{-webkit-transform:rotate(180deg);}
	  75%{-webkit-transform:rotate(270deg);}
	  100%{-webkit-transform:rotate(360deg);}
	}
}
.com-content{
	background: $page-bg;
}
	
%flex-center {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
%section {
	display: flex;
	justify-content: space-around;
	align-content: center;
	background: #fff;
	border-radius: 10upx;
}
/* 顶部渐变 */
.user-section {
	height: 372upx;
	padding: 100upx 30upx 0;
	position: relative;
	.bg {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		filter: blur(1px);
		opacity: 0.7;
	}
	.bgc1{
		background:linear-gradient(180deg,rgba(76,200,196,1),rgba(232,255,255,1));
	}
	.bgc2{
		background:linear-gradient(180deg,rgba(224,190,124,1),rgba(237,220,186,1));
	}
}
/* 用户信息 */
.user-info-box {
	height: 180upx;
	display: flex;
	align-items: center;
	position: relative;
	.portrait {
		width: 130upx;
		height: 130upx;
		border-radius: 50%;
	}
	.info-box{
		font-family:PingFang SC;
		font-weight:800;
		margin-left: 20upx;
		display: flex;
		flex-direction: column;
	}
	.username {
		padding-bottom: 15upx;
		font-size: $font-lg + 4upx;
		color: $font-color-dark;
	}
	.jifen{
		font-size: $font-base + 2upx;
		color:#A1822D;
	}
}
/* 会员box */
.vip-card-box {
	display: flex;
	flex-direction: column;
	color: #745924;
	height: 92upx;
	background: url(../../static/vipBg.png) no-repeat center;
	background-size: cover;
	border-radius: 16upx 16upx 0 0;
	overflow: hidden;
	position: relative;
	padding: 20upx 24upx;
	.btn {
		position: absolute;
		right: 20upx;
		top: 24upx;
		width:88upx;
		height:42upx;
		background:linear-gradient(0deg,rgba(224,190,124,1),rgba(240,216,168,1));
		border-radius:21px 21px 21px 0px;
		font-size: 24upx;
	}
}
/* 订单&爱车 */
.order-section {
	margin: 20upx 25upx 0upx 25upx;
	border-radius:22upx;
	background-color: #FFFFFF;
	/* 标题 */
	.order-title{
		display: flex;
		align-items: center;
		justify-content: space-between;
		color:#3C3836;
		padding: 28upx 24upx 20upx 32upx;
		font-family:PingFang SC;
		font-weight:800;
		.t-left{
			font-size: $font-base;
		}
		.t-right{
			font-size: $font-sm;
			padding-right: 9upx;
			opacity:0.5;
		}
		.yticon{
			font-size: $font-base;
			opacity:0.5;
		}
	}
	.order-item {
		@extend %flex-center;
		width: 120upx;
		height: 120upx;
		border-radius: 10upx;
		font-family:PingFang SC;
		font-weight:500;
		font-size: $font-sm;
		color: #3C3836;
		.logo{
			height: 57upx;
			width: 57upx;
			margin-bottom: 16upx;
		}
		text{
			width: 100upx;
			text-align: center;
		}
	}
	/* 下面的九宫格 */
	.order-bot{
		@extend %section;
		padding: 28upx 0;
	}
	.car-love{
		padding: 28upx 22upx;
		display: inline-flex;
		align-items: center;
	}
}
.list-section {
	margin: 20upx 25upx 0px 25upx;
	background: #fff;
	border-radius:22upx;
	.sec-header {
		display: flex;
		align-items: center;
		font-size: $font-base;
		color: $font-color-dark;
		line-height: 40upx;
		margin-left: 30upx;
	}
}
</style>
