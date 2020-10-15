<template>
	<view class="container">
		<view class="title-v">
			<label>车辆识别号</label>
		</view>
		<view class="input">
			<input type="text" maxlength="18" v-model="getVinInfo.vinCode" placeholder="请填写车辆识别号" :name="getVinInfo.vinCode" />
			<image class="sm" @click="saoMiao('vin')" src="../../static/saomiao.png" mode=""></image>
		</view>
		<view class="title-v">
			<label>品牌车型</label>
		</view>
		<view class="input" @click="chooseBrand">
			<input type="text" v-model="getVinInfo.brandName" disabled="disabled" placeholder="请选择车型" :name="getVinInfo.bandInfo" />
			<image class="right" src="../../static/right.png" mode=""></image>
		</view>
		<view class="title-v">
			<label>车牌号码</label>
		</view>
		<view class="input" @click="saoMiao('car')">
			<input type="text" disabled="disabled" v-model="getCarNo.Code" maxlength="8" placeholder="请输入车牌号" :name="getCarNo.Code" />
			<image class="sm" src="../../static/saomiao.png" mode=""></image>
		</view>
		<view class="title-v">
			<label>是否设置为默认车型</label>
			<view class="open">
				<label>{{switchChecked ? '开启' : '关闭'}}</label>
				 <!-- <switch v-if="firstSwitchChecked == false" class="switch" style='zoom:.6;' checked='true' @change="switchChange"/> -->
				 <switch class="switch" style='zoom:.6;' :checked="switchChecked" @change="switchChange"/>
			</view>
		</view>
		<button class="confirm" @click="saveMemberCar" type="default">确定</button>
		
		<!-- 扫码部分 -->
		<inputCarNo v-if="showInputCar" @getSonVal="showInputCarType" :lcenseList="getCarNo.Code"></inputCarNo>
		<inputVinNo v-if="showInputVin" @getSonVal="showInputVinType"></inputVinNo>
	  
	</view>
</template>

<script>
	import inputCarNo from '@/components/input-carno.vue';
	import inputVinNo from '@/components/input-vin.vue';
	import { configApi } from '../../common/js/applyApi.js';
	import util from '../../common/js/util.js';
	export default {
		components: {
			inputCarNo,
			inputVinNo
		},
		data() {
			return {
				switchChecked:true,//switch true false
				showInputCar:false,//是否显示输入车牌号
				showInputVin:false,//是否显示输入vin码
				getVinInfo:{
					brandName:'',
					bandInfo:''
				},//获取扫描vin码数据
				getCarNo:{},//获取扫描车牌数据
				editCarId:'',//修改时车辆id
				bandInfo:'111',
				BrandImage:'',//返回的车牌图片
				//firstSwitchChecked:true,//初始化switch
			};
		},
		computed:{
			
		},
		onShow(){
			let that = this
			/* 监听页面返回 */
			uni.$on("storeListen", res => {
				//console.log(res,'<====res')
				let {BrandName,VehicleSeriesName,carVehicleTypeName,BrandImage}=res
				that.getVinInfo.brandName = `${BrandName} ${VehicleSeriesName} ${carVehicleTypeName}`
				that.getVinInfo.bandInfo = that.getVinInfo.brandName
				this.BrandImage = BrandImage
			    // 清除监听
			    uni.$off('storeListen');
			})
		},
		onLoad(options){
			console.log(options)
			this.getVinInfo.brandName = options.brand
			this.switchChecked = options.isDefault?JSON.parse(options.isDefault):true
			//this.firstSwitchChecked = options.isDefault
			this.getVinInfo.vinCode = options.vinCode
			this.getCarNo.Code = options.licensePlate
			this.editCarId = options.id
			//console.log(this.switchChecked)
			uni.setNavigationBarTitle({
				title: options.title || '添加车辆信息'
			});
		},
		onShareAppMessage() {},
		methods: {
			switchChange(e){
				//console.log(e.detail.value)
				this.switchChecked = e.detail.value;
			},
			saoMiao(type){
				if(type == 'car'){
				  // 扫车出现
				  this.showInputCar = true;
				}else if(type == 'vin'){
				  //扫vin出现
				  this.showInputVin = true;
				}
			},
			showInputCarType(data,carNo){
				this.showInputCar = data
				this.getCarNo.Code= carNo
			},
			showInputVinType(data){
				this.showInputVin = data
			},
			//获取win码信息
			takePhoto(type){
				console.log(12)
				let that = this;
				util.showLoad()
				let url = type == 'vin' ? `${configApi.baseUrl}portal/api/memberCar/vinDistinguish` : `${configApi.baseUrl}portal/api/memberCar/vehiclePlateDistinguish`
				this.getWxSetting().then(res=>{
				  const ctx = wx.createCameraContext()
				  ctx.takePhoto({
					quality: 'high',
					success: (res) => {
					  console.log('图片=》',res.tempImagePath)
					  wx.uploadFile({
						url, 
						filePath:res.tempImagePath,
						name: 'file',
						header: {
							'content-type': 'multipart/form-data' ,// 默认值
							Authorization:'Bearer '+ wx.getStorageSync('token')
						},
						success: function (res) {
							util.hideLoading()
							if(JSON.parse(res.data).data){
								util.toast('扫描成功')
							}else{
								util.toast('扫描失败')
								return
							}
							//console.log('获取到的信息1==》',JSON.parse(res.data).data)
							if(type == 'vin'){ 
								that.getVinInfo = JSON.parse(res.data).data;
								that.getVinInfo.brandName = `${that.getVinInfo.brandName} ${that.getVinInfo.vehicleSeriesName} ${that.getVinInfo.vehicleTypeName}`
								that.BrandImage = JSON.parse(res.data).data.brandPicUrl
							}else{
								that.getCarNo = JSON.parse(JSON.parse(res.data).data);
							}
							that.showInputVin = false
							that.showInputCar = false
						}
					  })
					}
				  })
				})
				.catch(err=>{
				  util.toast('未开启摄像头授权，请前往小程序设置中手动开启摄像头授权')
				  this.showInputVin = false
				});
			},
			getWxSetting(){
				return new Promise((resolve,reject)=>{
				  wx.getSetting({
					success(res) {
					  if(res.authSetting['scope.camera']!=undefined && !res.authSetting['scope.camera']){
						reject()
						return
					  }else{
						resolve();
					  }
					}
				  })
				})
			
			},
			//选择品牌
			chooseBrand(){
				wx.navigateTo({
					url:'/pages/car/choseBrand'
				})
			},
			//保存
			async saveMemberCar(){
				let {getVinInfo:{brandName:brand,vinCode},switchChecked:isDefault,getCarNo:{Code:licensePlate},editCarId,BrandImage:image} = this;
				if(!brand){
					util.toast('请填写车型')
					return
				}else if(!vinCode){
					util.toast('请填写车辆识别号')
					return
				}else if(!licensePlate){
					util.toast('请填写车牌号')
					return
				}
				let params = {
					brand,
					isDefault,
					licensePlate,
					memberId:wx.getStorageSync('memberId'),
					memberName:'',
					image,
					vinCode
				}
				//console.log(33,params)
				if(editCarId){
					params.id = editCarId
				}
				let res = await this.$store.dispatch('saveMemberCar',params)
				//console.log(res,333)
				if(res.code == 200){
					util.toast("保存成功")
					// wx.redirectTo({
					// 	url:"/pages/car/carManage"
					// })
					uni.navigateBack()
				}else{
					util.toast(res.message)
				}
			}
		}	
	}
</script>

<style lang="scss">
.container{
	padding-top: 50upx;
	 width: 630upx;
	 margin: 0 auto;
	 .title-v{
	 	font-size:29upx;
	 	font-family:PingFang SC;
	 	color:rgba(60,56,54,1);
		padding-left: 10upx;
		margin-top: 25upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.open{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.switch{
				margin-left: 15upx;
			}
		}
	 }
	 .input{
		 margin-top: 20upx;
		 width:620upx;
		 height:72upx;
		 background:rgba(241,241,241,0.5);
		 border-radius:22upx;
		 padding-left: 20upx;
		 display: flex;
		 justify-content: space-between;
		 align-items: center;
		 input{
			 width: 500upx;
			 height: 100%;
			 font-size: 29upx;
		 }
		 .sm{
			 width: 38upx;
			 height: 38upx;
			 margin-right: 27upx;
		 }
		 .right{
			 width: 10upx;
			 height: 20upx;
			 margin-right: 27upx;
		 }
	 }
	 .confirm{
		 width:600upx;
		 height:88upx;
		 background:rgba(0,177,169,1);
		 border-radius:22upx;
		 font-size:34upx;
		 font-family:PingFang SC;
		 font-weight:500;
		 color:rgba(255,255,255,1);
		 line-height:88upx;
		 margin-top:500upx;
	 }
}
</style>
