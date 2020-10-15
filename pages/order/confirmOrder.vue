<template>
	<view class="container">
		<view class="cards">
			<view class="card">
				<view class="title-v">
					<label>商品信息</label>
				</view>
				<view class="line"></view>
				<view class="cont1">
					<view class="left">{{goodsInfo}}</view>
					<view class="num">x1</view>
				</view>
			</view>
			<view class="card">
				<view class="title-v">
					<label>联系信息</label>
					<view class="label2"><label>门店会根据您所填写的信息与您联系</label></view>
				</view>
				<view class="line"></view>
				<view class="cont1 cont2">
					<view class="v1">姓名</view>
					<input class="input" type="text" :disabled='disabled' v-model="name" id='name' maxlength="10" placeholder="请填写真实姓名" value="" />
					<view class="v1">手机号</view>
					<input class="input" type="number" :disabled='disabled' v-model="phoneNum" id='phone' maxlength="11" placeholder="请填写手机号" value="" />
				</view>
			</view>
			<view class="card">
				<view class="title-v">
					<label>服务门店选择</label>
					<view class="label2"><label>默认选择最近常去的门店</label>
					</view>
				</view>
				<view class="line"></view>
				<view class="cont1" @click="storeChoose">
					<view class="left">{{store.name || '请选择门店'}}</view>
					<image class="right" src="/static/right.png" mode=""></image>
				</view>
			</view>
			<view class="card">
				<view class="title-v">
					<label>车辆选择</label>
					<view class="label2"><label>默认选择常用车</label></view>
				</view>
				<view class="line"></view>
				<!-- <radio-group name="">
					<view class="cont1">
						<view class="left">车牌号：沪A686MI</view>
						<radio class="radio" value="" />
					</view>
					<view class="line"></view>
					<view class="cont1">
						<view class="left">车牌号：沪A686MI</view>
						<radio class="radio" value="" />
					</view>
				</radio-group> -->
				<view class="cont1">
					<view class="left flex cph">车牌号：
						<!-- <label class="mc-label" @click="showInputCar = true"></label> -->
						<xfl-select v-if="!disabled" class="xfl-input" :list="candidates" :clearable="false" :placeholder="'请输入或选择车牌号'" 
						:isCanInput="true" :initValue="carNo" @confirm="changeCar" />
						<input v-else type="text" v-model="carNo" :disabled='disabled' />
					</view>
				</view>
			</view>
			<view class="card" v-if="!disabled">
				<view class="title-v">
					<label>积分<label class="jifenzhi">{{jifen}}</label></label>
					<label class="jifen">
						<text>使用积分</text>
						<radio value="1" :checked="checkRadio" @click="checkChange"/>
					</label>
				</view>
				<view class="line"></view>
				<view class="cont1">
					<view class="left rule">积分使用上限{{useIntegration}}</view>
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="view1">
				<view class="viewleft">
					<label class="txt">需支付</label>
					<label class="txt2">￥</label>
					<label class="txt3" v-if="!checkRadio">{{nowAmount}}</label>
					<label class="txt3" v-if="checkRadio">{{nowAmount-jifenPrice}}</label>
					<label class="tag" v-if="checkRadio&&jifenPrice>0">已减￥{{jifenPrice}}</label>
				</view>
				<button v-if="!disabled" type="default" :disabled="isSubmit?'disabled':''" :class="isSubmit?'disabled':''" @click="submitOrder()">提交订单</button>
				<button v-else type="default" :disabled="isSubmit?'disabled':''" :class="isSubmit?'disabled':''" @click="submitOrder()">提交支付</button>
			</view>
			<view class="view2"></view>
		</view>
		<inputCarNo v-if="showInputCar" @getSonVal="showInputCarType" :lcenseList="carNo"></inputCarNo>
	</view>
</template>

<script>
	import xflSelect from '@/components/xfl-select/xfl-select.vue'
	import inputCarNo from '@/components/input-carno.vue';
	import util from "../../common/js/util.js"
	import { mapState } from 'vuex';
	export default {
		computed: {
			...mapState(['defaultCar','myCarList'])
		},
		components: { xflSelect,inputCarNo },
		data() {
			return {
				goodsInfo:'',
				name:'',//姓名
				phoneNum:'',//手机号
				canSubmit:false,//是否可以提交订单
				cartIdArr:[], //购物车Id集合
				/* 商户信息 */
				store:{
					name:'',
					id:''
				},
				packageId:'',//商品id
				checkRadio:true,
				jifen:0,//积分
				carNo:'',//车牌号
				conType:'',//跳转过来的类型
				nowAmount:0,//应付金额
				jifenPrice:0,//当前积分兑换金额
				candidates:[],
				orderNo:'',//订单号
				disabled:false ,//不可点击
				getCarNo:{},//获取扫描车牌数据
				showInputCar:false,//是否显示输入车牌号
				useIntegration:0,//本次订单积分使用上限
				storeImg:'',//门店照片
				isSubmit:false,//是否处于提交状态
			};
		},
		async onLoad(options){
			let params={}
			this.conType=options.type //跳转过来的类型
			this.storeImg = options.img
			/* 购物车    直接购买   待支付 */
			if(this.conType=='cart'){
				params={
					id:options.id
				}
				this.carNo=this.defaultCar
				/* 获取提交单信息 */
				await this.getData(params)
				// 获取车辆
				this.getCar()
			}else if(this.conType=='goods'){
				params={
					packageId:options.packageId,
					storeId:options.storeId
				}
				this.carNo=this.defaultCar
				/* 获取提交单信息 */
				await this.getData(params)
				// 获取车辆
				this.getCar()
			}else if(this.conType=='dzf'){
				this.orderNo=options.orderNo
				this.disabled=true
				this.paymentConfirm()
			}
		},
		onShareAppMessage() {},
		onShow() {
			/* 监听页面返回 */
			uni.$on("storeListen", res => {
			    this.store={
			    	name:res.name,
			    	id:res.id
			    }
			    // 清除监听
			    uni.$off('storeListen');
			})
		},
		methods:{
			/* 获取提交确认单 */
			getData(params){
				this.$store.dispatch('confirmOrder',params).then(res=>{
					let resData=res.data
					//console.log('确认订单获取==》',resData)
					this.cartIdArr=[]
					if(res.success){
						this.goodsInfo=resData.cartDTOList[0].name //商品名称
						this.packageId=resData.cartDTOList[0].packageId //商品id
						this.name = resData.linkmanDTO.realName||'' //用户名
						this.phoneNum = resData.linkmanDTO.mobile||'' //电话号
						for (let it of resData.cartDTOList) {
							this.cartIdArr.push(it.id)
						}
						if(resData.storeDTO!==null){
							/* 商户信息 */
							this.store={
								name:resData.storeDTO.name,
								id:resData.storeDTO.id
							}
						}
						if(resData.licensePlate!==null){
							this.carNo=resData.licensePlate //车牌号
						}
						this.nowAmount=resData.calcAmount.totalAmount //金额
						this.useIntegration = resData.calcIntegration.useIntegration||100
						if(resData.calcIntegration!==null){
							this.jifen=resData.calcIntegration.useIntegration || 0 //积分
							this.jifenPrice=resData.calcIntegration.thisUseAmount || 0 //积分抵扣金额
						}
					}else{
						this.$api.msg(res.message)
					}
				})
			},
			/* 订单提交 */
			submitOrder(){
				this.isSubmit = true
				if(this.goodsInfo==''){
					this.$api.msg('商品信息不能为空')
					this.isSubmit = false
				}else if(this.name==''||this.phoneNum==''){
					this.$api.msg('联系信息不能为空')
					this.isSubmit = false
				}else if(this.store.name==""){
					this.$api.msg('商户信息不能为空')
					this.isSubmit = false
				}else if(this.carNo==''){
					this.$api.msg('车牌号不能为空')
					this.isSubmit = false
				}else{
					let that=this
					wx.getSetting({
						withSubscriptions: true,
						success (res) {
						if(res.subscriptionsSetting){
							let hit=that
							wx.requestSubscribeMessage({
								tmplIds: ['qbS5JLmXgJ-I3MHDSBxiITpC50AYGCMah27HQh1qRwQ'],
								success (res) {
									console.log(res)
									let resCode=res['qbS5JLmXgJ-I3MHDSBxiITpC50AYGCMah27HQh1qRwQ']
									if(resCode=='accept'){
										hit.toRequest('1')
									}else{
										hit.toRequest('0')
									}
								},
								fail(err){
									console.log('错误==》',err)
								}
							})
							
						}else{
							this.$api.msg('用户未授权')
						}
						}
					})
				}
			},
			async toRequest(sendWxMsgFlag){
				// util.showLoad()
				
				let params={}
				if(this.conType=='dzf'){
					params={
						orderNo:this.orderNo
					}
				}else{
					params={
						"cartIds":String(this.cartIdArr),
						"licensePlate":this.carNo,
						"mobile":this.phoneNum,
						"realName":this.name,
						"payChannel":2,
						"storeId":this.store.id,
						"useIntegration":this.checkRadio?this.jifen:0,
						"sendWxMsgFlag":sendWxMsgFlag//推送通知：0不发送，1发送
					}
				}
				let res= await this.$store.dispatch('generateOrder',params)
				// util.hideLoading();
				if(res.success){
					console.log('this.storeImg',this.storeImg)
					uni.redirectTo({
						url:`/pages/money/paySuccess?orderNo=${res.data.orderNo}&img=${this.storeImg}`
					})
					//this.$api.msg("支付成功")
					//uni.navigateBack()
					this.$api.msg(res.message)
				}else{
					this.$api.msg('操作失败')
				}
				this.isSubmit = false
			},
			checkChange(){
				if(this.checkRadio){
					this.checkRadio=false
				}else{
					this.checkRadio=true
				}
			},
			/* 去门店选择 */
			storeChoose(){
				if(!this.disabled){
					uni.navigateTo({
						url:`/pages/search/storeChoose?packageId=${this.packageId}`
					})
				}
			},
			/* 根据订单号获取支付确认信息*/
			paymentConfirm(){
				this.$store.dispatch('paymentConfirm',{orderNo:this.orderNo}).then(res=>{
					if(res.success){
						let data=res.data
						this.goodsInfo=data.packageName
						this.name = data.realName
						this.phoneNum=data.mobile
						this.store={
							name:data.storeDTO.name,
							id:data.storeDTO.id
						}
						this.packageId=data.packageId
						this.carNo=data.licensePlate
					}else{
						this.$api.msg('数据错误')
					}
				})
			},
			async getCar(){
				this.candidates=[]
				for(let it of this.myCarList){
					/* 车牌号集合 */
					this.candidates.push(it.licensePlate)
				}
			},
			changeCar(e){
				this.carNo=e
			},
			showInputCarType(data,carNo){
				this.showInputCar = data
				console.log(carNo,8888888)
				this.carNo= carNo
				this.$forceUpdate()
				
			},
		}
	}
</script>

<style lang="scss">
	.disabled{
		opacity: 0.5;
	}
button::after { border: none; }
.container{
	min-height: 100vh;
	height: 100%;
	background-color: #F4F4F4;
	.flex{
		display: flex;
		align-items: center;
	}
	.cards{
		width: 700upx;
		margin: 0 auto;
		padding-bottom: 164upx;
		padding-top: 20upx;
		.card{
			background:rgba(255,255,255,1);
			border-radius:22upx;
			padding: 0 25upx;
			margin-bottom: 20upx;
			.title-v{
				height: 90upx;
				line-height: 90upx;
				font-size:34upx;
				font-family:PingFang SC;
				font-weight:800;
				color:rgba(59,55,53,1);
				display: flex;
				justify-content: space-between;
				align-items: center;
				.jifenzhi{
					font-size:34upx;
					font-family:PingFang SC;
					font-weight:800;
					color:rgba(0,177,169,1);
					line-height:32px;
					margin-left: 10upx;
				}
				.jifen{
					text{
						color:rgba(0,177,169,1);
						font-size:28upx;
						font-family:PingFang SC;
						font-weight: 400;
						margin-right: 8upx;
					}
				}
				.label2{
					display: flex;
					label{
						font-family: PingFang SC;
						line-height: 38upx;
						background:rgba(234,255,254,0.7);
						padding: 6upx 9upx;
						border-radius:10upx;
						font-size:28upx;
						font-family:PingFang SC;
						color:rgba(0,177,169,1);
						font-weight:300;
					}
				}
			}
			.line{
				width: 100%;
				height:2upx;
				border:1upx solid rgba(0,0,0,0.07);
			}
			.cont1{
				height: 98upx;
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.left{
					font-size:28upx;
					font-family:PingFang SC;
					color:rgba(59,55,53,1);
				}
				.rule{
					font-size:28upx;
					font-family:PingFang SC;
					color:rgba(59,55,53,0.5);
				}
				.num{
					font-size:28upx;
					font-family:PingFang SC;
					color:rgba(59,55,53,0.5);
				}
				.right{
					width: 10upx;
					height: 18upx;
				}
				.v1{
					width: 100%;
					font-size:28upx;
					font-family:PingFang SC;
					color:rgba(59,55,53,1);
					line-height:72upx;
				}
				.input{
					height:72upx;
					width: 100%;
					background:rgba(241,241,241,0.5);
					border-radius:22upx;
					font-size:28upx;
					color:rgba(59,55,53,1);
					padding-left: 20upx;
				}
			}
			.cont2{
				flex-direction: column;
				height: auto;
				padding-bottom: 50upx;
			}
		}
	}
	.footer{
		width:100%;
		height:164upx;
		position: fixed;
		bottom: 0;
		z-index: 99;
		background:rgba(255,255,255,1);
		.view1{
			height: 100upx;
			display: flex;
			.disabledBtn{
				opacity: 0.5;
			}
			.viewleft{
				width: 556upx;
				padding: 0 40upx;
				display: flex;
				align-items: center;
				.txt{
					font-size:28upx;
					font-family:PingFang SC;
					color:rgba(59,55,53,1);
				}
				.txt2{
					font-size:28upx;
					font-family:PingFang SC;
					color:rgba(199,161,47,1);
					margin-left: 16upx;
				}
				.txt3{
					font-size:38upx;
					font-family:PingFang SC;
					color:rgba(199,161,47,1);
					font-weight: 600;
				}
				.tag{
					line-height: 38upx;
					background: rgba(75,199,195,1);
					color:rgba(255,255,255,1);
					padding: 6upx 15upx;
					border-radius: 10upx;
					font-size: 28upx;
					font-family: PingFang SC;
					font-weight: 500;
					margin-left: 25upx;
				}
			}
			button{
				width:190upx;
				height:99upx;
				background:rgba(247,191,41,1);
				font-size:30upx;
				font-family:PingFang SC;
				font-weight:500;
				color:rgba(59,55,53,1);
				border-radius: 0;
				line-height: 99upx;
				outline: none;
			}
			
		}
	}
	.xfl-input{
		height:72upx;
	}
	.cph{
		position: relative;
		.mc-label{
			display: block;
			position: absolute;
			width: 100%;
			height: 100%;
			z-index: 100;
			left: 100upx;
		}
	}
}

</style>
