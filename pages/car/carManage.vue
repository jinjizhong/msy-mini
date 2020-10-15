<template>
	<view class="container">
		<empty v-if="carList.length === 0" />
		<view class="card" v-for="item in carList" :key="item.id">
			<view class="carinfo">
				<view class="left">
					<image v-if="item.image" class="img" :src="item.image" mode=""></image>
					<image v-else src="/static/msgLogo.png" mode=""></image>
				</view>
				<view class="right">
					<view class="title">{{item.brand}}</view>
					<!-- <view class="tags">
						<view class="tag">车身颜色</view>
						<view class="tag2">{{item.color}}</view>
					</view> -->
				</view>
			</view>
			<view class="car-manage">
				<view class="btns">
					<label @click="del(item.id)">删除</label>
					<view></view>
					<label @click="goEdit(item)">编辑</label>
				</view>
			</view>
		</view>
		<button class="add" @click="add" type="default">添加车辆</button>
		<uni-popup ref="popup" type="dialog">
		    <uni-popup-dialog type="input" message="成功消息" title="确认删除此车辆吗" :duration="2000" :before-close="true" @close="close" @confirm="confirm">
				<slot>
					<view class="soltview">
						<button @click="delConfirm(1)" type="default">确认</button>
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
				carList:[],//车辆列表
				delId:"",//选中的删除id
			};
		},
		onLoad(options){
			uni.setNavigationBarTitle({
				title: options.title || '添加车辆信息'
			});
			//this.getCarsList();
		},
		onShow() {
			this.getCarsList();
		},
		onShareAppMessage() {},
		methods:{
			//获取用户车辆列表
			async getCarsList(){
				let _memberId = wx.getStorageSync('memberId') || 2
				let _carList = await this.$store.dispatch('getCarDetails',{memberId:_memberId});
				console.log(_carList,'_carList')
				this.carList = _carList.data || [];
			},
			del(id){
				this.delId = id;
				this.$refs.popup.open()
			},
			async delConfirm(){
				let res = await this.$store.dispatch('deleteCar',{ids:this.delId});
				this.$refs.popup.close()
				this.getCarsList();
			},
			cancel(){
				this.$refs.popup.close()
			},
			add(){
				if(this.carList.length>=3){
					this.$api.msg('最多只能添加三辆车')
				}else{
					wx.navigateTo({
						url:`/pages/car/addCar`
					})
				}
			},
			goEdit(_item){
				console.log(_item)
				let {id,brand,isDefault,licensePlate,vinCode} = _item
				wx.navigateTo({
					url:`/pages/car/addCar?title=编辑车辆&id=${id}&brand=${brand}&isDefault=${isDefault}&licensePlate=${licensePlate}&vinCode=${vinCode}`
				})
			}
		}
	}
</script>

<style lang="scss">
.container{
	position: relative;
	min-height: 100vh;
	padding: 25upx;
	.card{
		width: 700upx;
		padding: 25upx;
		padding-bottom: 0;
		background:rgba(255,255,255,1);
		border-radius:22px;
		display: flex;
		flex-direction: column;
		border-radius:22upx;
		box-shadow:0upx 9upx 15upx 1upx rgba(8,52,59,0.06);
		margin-bottom: 30upx;
		.carinfo{
			display: flex;
			.left{
				background:rgba(255,251,242,1);
				width: 125upx;
				height: 125upx;
				display: flex;
				justify-content: center;
				align-items: center;
				image{
					width: 60upx;
					height: 70upx;
					opacity: 0.7;
				}
				.img{
					width: 100%;
					height: 100%;
					opacity: 1;
				}
			}
			.right{
				width: 490upx;
				margin-left: 23upx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.title{
					font-size:29upx;
					font-family:PingFang SC;
					color:rgba(60,56,54,1);
					line-height:32upx;
				}
				.tags{
					display: flex;
					align-items: center;
					margin-bottom: 6upx;
					.tag{
						font-size:24upx;
						font-family:PingFang SC;
						color:rgba(0,178,170,1);
						height: 34upx;
						line-height: 34upx;
						width: 112upx;
						background-color: rgba(231, 249, 249, 1);
						text-align: center;
					}
					.tag2{
						font-size:29upx;
						font-family:PingFang SC;
						color:rgba(60,56,54,1);
						margin-left: 16upx;
					}
				}
			}
		}
		.car-manage{
			margin-top: 10upx;
			height: 64upx;
			border-top:1rpx solid rgba(0,0,0,0.1);
			// display: flex;
			// align-items: center;
			.btns{
				float: right;
				height: 100%;
				width: 140upx;
				label{
					float: left;
					font-size:24upx;
					font-family:PingFang SC;
					color:rgba(60,56,54,1);
					line-height:32px;
				}
				view{
					margin: 0 15upx;
					float: left;
					height: 60%;
					margin-top: 14.4upx;
					width: 1px;
					border-right:1rpx solid rgba(0,0,0,0.2);;
				}
			}
		}
	}
	.add{
		position: fixed;
		left: 75upx;
		bottom: 50upx;
		width:600upx;
		height:88upx;
		background:rgba(0,178,170,1);
		border-radius:22upx;
		font-size:34upx;
		font-family:PingFang SC;
		color:rgba(255,255,255,1);
		line-height:88upx;
	}
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
