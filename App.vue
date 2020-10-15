<script>
/**
 * vuex管理登陆状态，具体可以参考官方登陆模板示例
 */
export default {
	methods: {
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
				console.log('登陆返回信息=====>',res)
				if(res.success){
					wx.setStorageSync('loginInfo',res.data)
					wx.setStorageSync('token',res.data.token)
					wx.setStorageSync('sessionKey',res.data.sessionKey)
					wx.setStorageSync('memberId',res.data.memeberId) 
				}
			})
		},
		//查看是否授权
		getSetting(){
			let that = this;
			/* 授权 */
			wx.getSetting({
		      success: function(res) {
				let settingRes = res;
				//console.log("授权信息==>",res)
		        if (res.authSetting['scope.userInfo']) {
					/* 获取用户信息 */
					wx.getUserInfo({
						success: function(res) {
							let getUserInfoRes = res
							//console.log('获取用户信息==》',res)
							/* 用户授权成功后，获取用户的code */
							wx.login({
								success: res => {
									// 获取到用户的 code 之后：res.code
									//console.log("用户的code:" + JSON.stringify(res));
									that.getLogin(res.code,getUserInfoRes)
								}
							});
						}
					});
		        } else {
		          //用户没有授权
					wx.navigateTo({
						url:"/pages/login/login"
					})
		        }
		      }
		    });
		},
		//重写分享方法
		overShare() {
			//监听路由切换
			//间接实现全局设置分享内容
			wx.onAppRoute(function (res) {
				//获取加载的页面
				let pages = getCurrentPages(),
					//获取当前页面的对象
					view = pages[pages.length - 1],
					data;
				if (view) {
					data = view.data;
					console.log(view.$vm,view.$vm.goodsId,'view---')
					console.log('是否重写分享方法', data.isOverShare);
					if(view.$vm.goodsId || view.$vm.storeId) return
					if (!data.isOverShare) {
						data.isOverShare = true;
						view.onShareAppMessage = function () {
							//你的分享配置
							return {
								title: '马石油020商城欢迎您',
								imageUrl:'/static/share.jpg',
								path: '/pages/index/index'
							};
						}
					}
				}
			})
		},
	},
	onLaunch: function() {
		//this.getSetting();
		this.overShare()
	},
	
	onShow: function() {
		//console.log('App Show');
	},
	onHide: function() {
		//console.log('App Hide');
	}
};
</script>

<style lang="scss">
@import './common/css/unirever.css';
@import './common/css/common.css';
view,
scroll-view,
swiper,
swiper-item,
cover-view,
cover-image,
icon,
text,
rich-text,
progress,
button,
checkbox,
form,
input,
label,
radio,
slider,
switch,
textarea,
navigator,
audio,
camera,
image,
video {
	box-sizing: border-box;
}
/* 骨架屏替代方案 */
.Skeleton {
	background: #f3f3f3;
	padding: 20upx 0;
	border-radius: 8upx;
}

/* 图片载入替代方案 */
.image-wrapper {
	font-size: 0;
	background: #f3f3f3;
	border-radius: 4px;
	image {
		width: 100%;
		height: 100%;
		transition: 0.6s;
		opacity: 0;
		&.loaded {
			opacity: 1;
		}
	}
}
// 超过一行省略
.clamp {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	display: block;
}
// 超过两行省略
.clamp2 {
	word-break: break-word; //换行模式
	overflow: hidden;
	text-overflow: ellipsis; //修剪文字
	display: -webkit-box;
	-webkit-line-clamp: 2; //此处为上限行数
	-webkit-box-orient: vertical;
}

.common-hover {
	background: #f5f5f5;
}

/*边框*/
.b-b:after,
.b-t:after {
	position: absolute;
	z-index: 3;
	left: 0;
	right: 0;
	height: 0;
	content: '';
	transform: scaleY(0.5);
	border-bottom: 1px solid $border-color-base;
}

.b-b:after {
	bottom: 0;
}

.b-t:after {
	top: 0;
}

/* button样式改写 */
uni-button,
button {
	height: 80upx;
	line-height: 80upx;
	font-size: $font-lg + 2upx;
	font-weight: normal;

	&.no-border:before,
	&.no-border:after {
		border: 0;
	}
}

uni-button[type='default'],
button[type='default'] {
	color: $font-color-dark;
}

/* input 样式 */
.input-placeholder {
	color: #999999;
}

.placeholder {
	color: #999999;
}
</style>
