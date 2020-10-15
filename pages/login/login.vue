<template>
	<view class="container flex_column_yCenter">
		<image class="msyLogo" src="/static/msgLogo.png" />
		<button type="default" class="wx-btn" open-type="getUserInfo" @getuserinfo="bindGetUserInfo" hover-class="none">
			<image class="logo" src="/static/logo/weixin.png" />
			<text>微信一键登录</text>
		</button>
	</view>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
	data() {
		return {
			mobile: '',
			password: '',
			logining: false
		};
	},
	onLoad() {},
	onShareAppMessage() {},
	methods: {
		...mapMutations(['saveWXInfo']),
		navBack() {
			uni.redirectTo({
				url:'/pages/index/index'
			});
		},
		/* 微信登录授权 */
		bindGetUserInfo(e) {
			if (e.detail.userInfo) {
				//console.log('用户的信息如下：',e.detail.userInfo);
				/* 存储用户信息 */
				let that =this
				wx.login({
					success: res => {
						//console.log("用户的coed==code:" + res.code);
						that.getLogin(res.code,e.detail)
					}
				});
			} else {
				//用户按了拒绝按钮
				wx.showModal({
					title: '警告',
					content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
					showCancel: false,
					confirmText: '返回授权',
					success: function(res) {
						// 用户没有授权成功，不需要改变 isHide 的值
						if (res.confirm) {
							wx.showToast({
								title: '未授权',
								icon: 'none'
							});
						}
					}
				});
			}
		},
		getLogin(code,info){
			let params={
				code:code,
				fullUserInfo:{
					encryptedData:info.encryptedData,
					iv:info.iv,
					rawData:info.rawData,
					signature:info.signature
				}
			}
			this.$store.dispatch('Login',params).then(res=>{
				//console.log('=====>',JSON.stringify(res))
				if(res){
					this.saveWXInfo(info.userInfo);//用户个人信息
					//授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
					wx.showToast({
						title: '授权成功',
						icon: 'success'
					});
					wx.setStorageSync('token',res.data.token) //用户token
					wx.setStorageSync('memberId',res.data.memeberId) //用户ID
					wx.setStorageSync('loginInfo',res.data) //登录返回的信息
					wx.switchTab({
						url: '/pages/index/index'
					});
				}
			})
		}
	}
};
</script>

<style lang="scss">
.container {
	padding-top: 15vh;
	position: relative;
	width: 100vw;
	height: calc(100vh - 44px);
	overflow: hidden;
	background: #fff;
	.msyLogo {
		width: 188upx;
		height: 221upx;
	}
	.wx-btn {
		margin-top: 128upx;
		width: 80vw;
		height: 88upx;
		background: #20ac16;
		border-radius: 10upx;
		display: flex;
		align-items: center;
		justify-content: center;
		.logo {
			width: 42upx;
			height: 35upx;
		}
		text {
			padding-left: 21upx;
			font-size: 30upx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #fff;
		}
	}
}
</style>
