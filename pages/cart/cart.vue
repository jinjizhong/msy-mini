<template>
	<!-- 购物车 -->
	<view class="container">
		<!-- 空白页 -->
		<!-- <view v-if="empty === true" class="empty">
			<image src="/static/emptyCart.jpg" mode="aspectFit"></image>
			<view class="empty-tips">
				空空如也
				<navigator class="navigator" url="../index/index" open-type="switchTab">随便逛逛></navigator>
			</view>
		</view> -->
		<empty v-if="empty === true" text='暂无任何商品'/>
		<view v-else>
			<view class="top-select">
				<view class="flex_row_yCenter" @click="check('all')">
					<image class="sec-image" :src="allChecked ? imgSelect : imgUnselect" />
					<text class="left">全选</text>
				</view>
				<text class="right" :class="hasSelect?'light':'light'" @click="deletCart">删除</text>
			</view>
			<!-- 列表 -->
			<block v-for="(item, index) in cartList" :key="index" >
				<view class="cart-item" :class="{ 'b-b': index !== cartList.length - 1 }" @click="toDetails(item)">
					<image class="sec-image" @click.stop="check('item', index,item)" :src="item.checked ? imgSelect : imgUnselect" />
					<view class="image-bg" >
						<image
							:src="item.imageUrl"
							:class="[item.loaded]"
							mode="aspectFill"
							lazy-load
							@load="onImageLoad('cartList', index)"
							@error="onImageError('cartList', index)"
						/>
					</view>
					<view class="item-right">
						<text class="clamp2 title">{{ item.name }}</text>
						<view class="bt-area">
							<view class="flex_row_yCenter">
								<text class="price">￥{{ item.price }}</text>
								<text class="price-hit">￥{{ item.originalPrice }}</text>
							</view>
							<view class="bt flex_column_center" @click="buyTo(item)">购买</view>
						</view>
					</view>
				</view>
			</block>
		</view>
		<uni-popup ref="popup" type="dialog">
		    <uni-popup-dialog type="input" message="成功消息" title="删除选中？" :duration="2000" :before-close="true" >
				<slot>
					<view class="soltview">
						<button @click="delConfirm" type="default">确认</button>
						<button class="cancel" @click="cancel" type="default">取消</button>
					</view>
				</slot>
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
import empty from '@/components/empty';
import uniPopup from '@/components/uni-pop/uni-popup.vue'
import uniPopupDialog from '@/components/uni-pop/uni-popup-dialog.vue'
export default {
	components: {
		uniPopup,
		uniPopupDialog,
		empty
	},
	data() {
		return {
			imgSelect: '/static/selected.png', //选中的select
			imgUnselect: '/static/select.png', //未选中的select
			allChecked: false, //全选状态  true|false
			empty: false, //空白页现实  true|false
			cartList: [],
			hasSelect:false
		};
	},
	onShow() {
		this.allChecked=false
		this.hasSelect=false
		if (!this.hasLogin) {
			this.cartList=[]
			return
		}
		this.loadData()
	},
	watch: {
		//显示空白页
		cartList: {
		    handler (e) {
				//console.log(JSON.stringify(e),'哈哈哈哈哈')
				let empty = e.length === 0 ? true : false;
				if (this.empty !== empty) {
					this.empty = empty;
				}
		    },
		    deep: true
		}
	},
	onShareAppMessage() {},
	methods: {
		//请求数据
		async loadData() {
			let res = await this.$store.dispatch('cartList');
			//console.log(JSON.stringify(res))
			this.allChecked=false
			this.hasSelect=false
			this.cartList = res.data.cartList || [];
			if(this.cartList.length==0){
				this.empty = true
			}else{
				let cartList = this.cartList.map(item=>{
					item.checked = false;
					return item;
				});
				this.cartList = cartList;
			}
		},
		//删除按钮
		deletCart() {
			let that=this
			if(!that.hasSelect){
				this.$api.msg('请选择移除的商品')
				return
			}
			if(that.allChecked){
				this.$refs.popup.open()
			}else{
				that.cartList.forEach(item => {
					if(item.checked){
						this.$refs.popup.open()
					}
				});
			}
		},
		async delConfirm(){
			let that=this
			/* 全选还是部分选 */
			if(that.allChecked){
				await that.$store.dispatch('clearCart')
				this.cartList = [];
				this.$refs.popup.close()
			}else{
				that.cartList.forEach(item => {
					if(item.checked){
						that.deleteCartItem()
					}
				});
			}
		},
		cancel(){
			this.$refs.popup.close()
		},
		//监听image加载完成
		onImageLoad(key, index) {
			//this[key][index].image = '/static/errorImage.jpg';
			this.$set(this[key][index], 'loaded', 'loaded');
		},
		//监听image加载失败
		onImageError(key, index) {
			this[key][index].imageUrl = '/static/errorImage.jpg';
		},
		//选中状态处理
		check(type,index,item) {
			if(type === 'item'){
				this.cartList[index].checked = !this.cartList[index].checked;
				for(let it of this.cartList){
					if(item.id==it.id){
						if(it.checked){
							this.hasSelect=true
						}else{
							this.hasSelect=false
							this.allChecked=false
						}
					}
				}
				this.$forceUpdate()
				//this.$set(this.cartList)
			}else{
				const checked = !this.allChecked
				const list = this.cartList;
				list.forEach(item=>{
					item.checked = checked;
				})
				this.allChecked = checked;
				this.hasSelect=this.allChecked
			}
		},
		//删除
		deleteCartItem() {
			let ids=[]
			for(let it of this.cartList){
				if(it.checked){
					ids.push(it.id)
				}
			}
			this.$store.dispatch('deleteCart',{ids:String(ids)}).then(res=>{
				if(res.success){
					this.$api.msg('删除成功')
					this.loadData()
				}else{
					this.$api.msg('删除错误')
				}
				this.$refs.popup.close()
			})
		},
		/* 商品详情 */
		toDetails(item){
			//详情页面的title
			//console.log(item)
			let title = item.name
			let id = item.packageId
			uni.navigateTo({
				url: `/pages/detail/goodsDetail?title=${title}&id=${id}`
			});
		},
		buyTo(item){
			uni.navigateTo({
				url:`/pages/order/confirmOrder?id=${item.id}&type=cart`
			})
		}
	}
};
</script>

<style lang="scss" scoped>
.container {
	border-top: 1upx solid rgba(182, 180, 180, 0.48);
	padding-bottom: 134upx;
	/* 空白页 */
	.empty {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100vh;
		padding-bottom: 100upx;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		background: #fff;
		image {
			width: 240upx;
			height: 160upx;
			margin-bottom: 30upx;
		}
		.empty-tips {
			display: flex;
			font-size: $font-sm + 2upx;
			color: $font-color-disabled;
			.navigator {
				color: $uni-color-primary;
				margin-left: 16upx;
			}
		}
	}
}
/* 上面的全选 */
.top-select {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 40upx 25upx 19upx 25upx;
	.left {
		font-size: 36upx;
		font-family: PingFang SC;
		font-weight: 800;
		color: rgba(60, 56, 54, 1);
	}
	.right {
		font-size: 34upx;
		font-family: PingFang SC;
		font-weight: 500;
	}
	.light{
		color: rgba(76, 200, 196, 1);
	}
	.hit{
		color: #3C3835;
		opacity: 0.5;
	}
}
.sec-image {
	width: 60upx;
	height: 60upx;
	margin-top: 12upx;
}
/* 购物车列表项 */
.cart-item {
	display: flex;
	align-items: center;
	position: relative;
	padding: 25upx 25upx;
	.image-bg {
		width: 209upx;
		height: 195upx;
		background: rgba(255, 255, 255, 1);
		flex-shrink: 0;
		position: relative;
		image {
			width: 209upx;
			height: 195upx;
			border-radius: 8upx;
		}
	}

	.item-right {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 195upx;
		flex: 1;
		overflow: hidden;
		padding-left: 30upx;
		font-size: 28upx;
		font-family: PingFang SC;
		font-weight: 500;
		.title {
			color: rgba(60, 56, 54, 1);
		}
		.bt-area {
			display: flex;
			align-items: center;
			justify-content: space-between;
			.price {
				color: $font-color-price;
			}
			.bt {
				width: 78upx;
				height: 48upx;
				background: rgba(247, 192, 42, 1);
				font-size: 26upx;
				color: rgba(60, 56, 54, 1);
				border-radius: 21px 21px 21px 0px;
			}
		}
	}
}
.price-hit {
	padding-left: 9upx;
	font-size: 20upx;
	font-family: PingFang SC;
	font-weight: 500;
	text-decoration: line-through;
	color: rgba(60, 56, 53, 1);
	opacity: 0.4;
}
.soltview{
	display: flex;
	justify-content: space-between;
	button{
		width:236upx;
		height:72upx;
		background:rgba(0, 177, 169, 1);
		border-radius:22upx;
		line-height: 72upx;
		font-size:30upx;
		font-family:PingFang SC;
		font-weight:500;
		color: #fff;
		margin: 0 10upx;
	}
	button::after{
		border: none;
	}
	.cancel{
		background-color: rgba(254, 249, 236, 1);
		color:rgba(199,162,47,1);
	}
}
</style>
