<template>
	<view>
		<!-- 扫码部分 -->
		<view class="tankuangBox">
			<view class="mask" @tap="hidePop()"></view>     
			<!-- 车牌号扫描 -->
			<view v-if="carScanShow" class="tankuangOne">
			  <view class="saomaPart">
				<image class="img1" src="/static/saomiao_bg.png"/>
				<camera device-position="back" flash="off" binderror="error" class="img2"></camera>
			  </view>
			  <view class="carWrap disp-just-bet-ali-cen">
				<!-- <input bindinput="watchCarNum" v-for=(item,index) in LicensePlateList" maxlength=1 focus="focusActive == index" data-key="index" :key="index" class="num-textarea" placeholder-class="index == 7 ? 'xny' : ''" placeholder="index == 7 ? '新能源' : ''" value="item" class="num-textarea index == 7 ? 'xny-input' : ''" cursor-spacing='100'> -->
				<!-- <view v-for=(item,index) in LicensePlateList" :key="index">{{item}}</view> -->
	
				<view class='inputPlate-container' @tap='onFocusTap'>
					<block v-for="(item, index) in plateCount" :key="index">
						<text class="LicensePlateList.length == item - 1 ? 'active-border-color':'border-color' 'activecar'">{{LicensePlateList[index]}}</text>
					</block>
					<text class="(LicensePlateList.length == 7 || LicensePlateList.length == 8) ? 'active-border-color':'border-color' 'activecar'" v-if="LicensePlateList[7]">{{LicensePlateList[7]}}</text>
					<image class="LicensePlateList.length == 7 ? 'active-border-color':'dashed-border-color' 'newEnerge'" src='/static/xinnengyuan.png' v-if="!LicensePlateList[7]"></image>
				</view>
			  </view>
			  <button v-if="!hasCarInfo" @tap="takePhoto" class="sureCheckCar">点击扫描车辆信息</button>
			  <!-- <button wx:elif="hasWirteCarNo" @tap="hidePop()" style="margin-bottom:0;margin-top:0;" class="sureCheckCar">确认车辆信息</button> -->
			  <button wx:else @tap="hidePop('save')" class="sureCheckCar">确认车辆信息</button> 
			  <view class='plate-keyboard-container' v-if="isShowKeyboard">
				<!-- 关闭键盘 -->
				  <view class='close-keyboard'>
					  <view class='line'></view>
					  <view class='close-btn' @tap='onCloseKeyboardTap'>关闭</view>
				  </view>
				  <!-- 省份键盘 -->
				  <view class='keyboard-provience-panel' v-if="showkKeyboardType == 1">
					  <view class='keyboard-panel'>
						  <block v-for="(item, index) in keyValue1" :key="index">
							  <view class='key-panel' @tap='onKeyboardTap' :data-value='item'>{{item}}</view>
						  </block>
					  </view>
					  <view class='keyboard-panel'>
						  <block v-for="(item, index) in keyValue2" :key="index">
							  <view class='key-panel' @tap='onKeyboardTap' :data-value='item'>{{item}}</view>
						  </block>
					  </view>
					  <view class='keyboard-panel'>
						  <block v-for="(item, index) in keyValue3" :key="index">
							  <view class='key-panel' @tap='onKeyboardTap' :data-value='item'>{{item}}</view>
						  </block>
					  </view>
					  <view class='keyboard-panel'>
						  <!-- <view class='ABC' @tap='onKeyboardTap' data-value='ABC'>ABC</view> -->
						  <block v-for="(item, index) in keyValue4" :key="index">
							  <view class='key-panel' @tap='onKeyboardTap' :data-value='item'>{{item}}</view>
						  </block>
						  <view class='key-panel backspace' @tap='onKeyboardTap' data-value='delete'>
							  <!-- <image src='../images/picon/backDeleteImg.jpg'></image> -->
							  <text class="iconfont icon-backspace"></text>
						  </view>
					  </view>
				  </view>
				  <!-- 数字、字母键盘 -->
				  <view class='keyboard-number-panel' v-if="!showkKeyboardType">
					  <view class='keyboard-panel'>
						  <block v-for="(item,index) in keyNumber" :key="index">
							  <view class='key-panel' @tap='onKeyboardTap' :data-value='item'>{{item}}</view>
						  </block>
					  </view>
					  <view class='keyboard-panel'>
						  <block v-for="(item,index) in keyLetterValue1" :key="index">
							  <view class='key-panel' @tap='onKeyboardTap' :data-value='item'>{{item}}</view>
						  </block>
					  </view>
					  <view class='keyboard-panel'>
						  <block v-for="(item,index) in keyLetterValue2" :key="index">
							  <view class='key-panel' @tap='onKeyboardTap' :data-value='item'>{{item}}</view>
						  </block>
					  </view>
					  <view class='keyboard-panel'>
						  <!-- <view class='ABC' @tap='onKeyboardTap' :data-value='ABC'>地区</view> -->
						  <block v-for="(item,index) in keyLetterValue3" :key="index">
							  <view class='key-panel' @tap='onKeyboardTap' :data-value='item'>{{item}}</view>
						  </block>
						  <view class='key-panel backspace' @tap='onKeyboardTap' data-value='delete'>
							  <image src='/static/backDeleteImg.jpg'></image>
							  <!-- <text class="iconfont icon-backspace">111</text> -->
						  </view>
					  </view>
				  </view>
				</view>
			</view>
		  </view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// showCamera: true, // 显示照相机
				carScanShow:true,//车辆扫描显示
				LicensePlatePic: '', // 扫描获得的车牌照片
				carNumberInfo:{},//车牌号扫描出的数据
				vinNumberInfo:{},//vin码扫描出的数据
				hasCarInfo: false, // 获得车牌数据
				topInfo:{},
				keyValue1: '京津晋翼蒙辽黑吉沪',
				keyValue2: '苏浙皖闽赣鲁豫鄂湘',
				keyValue3: '粤桂琼渝川贵云藏陕',
				keyValue4: 'W甘青宁新使虚台',
				keyNumber: '1234567890',
				keyLetterValue1: 'QWERTYUP学领',
				keyLetterValue2: 'ASDFGHJKL警',
				keyLetterValue3: 'ZXCVBNM港澳',
				showkKeyboardType: 1,   //1是省份键盘 0是数字字母键盘
				LicensePlateList: [],
				plateCount: [1, 2, 3, 4, 5, 6, 7], //输入框的个数
				isShowKeyboard: false, //是否显示键盘,默认显示
			};
		},
		props: {
			//接受传过来的车牌号
			lcenseList: {
				type: String,
				default: ""
			},
		},
		created(){
	
		},
		methods:{
			hidePop(type){
				let _LicensePlateList = ''
				if(type){
					_LicensePlateList = this.LicensePlateList.join(',')
					_LicensePlateList = _LicensePlateList.replace(/,/g,"")
				}else{
					_LicensePlateList = this.lcenseList
				}
				this.$emit('getSonVal',false,_LicensePlateList)
			},
			//唤起键盘事件
			onFocusTap() {
				this.isShowKeyboard = true;
			},
			//关闭键盘
			onCloseKeyboardTap() {
				this.isShowKeyboard = false;
			},
			//点击键盘事件
			onKeyboardTap(event) {
				var value = event.currentTarget.dataset.value;
				console.log(this.LicensePlateList,value,event);
				switch (value) {
					case 'delete':
						if (this.LicensePlateList.length > 0) {
							this.LicensePlateList.pop();
						}
						if(this.LicensePlateList.length < 7){
						  this.hasCarInfo = false
						}else{
						  this.hasCarInfo = true
						  this.hasWirteCarNo = true
						}
						//如果输入的值被删除完，显示省份键盘
						if (this.LicensePlateList.length == 0) {
							this.showkKeyboardType = true;
						}
						break;
					default:
						this.showkKeyboardType = false;
						if (this.LicensePlateList.length == 8) {
							//替换数组最后一个元素
							this.LicensePlateList.splice(7, 1, value);
						} else {
							this.LicensePlateList.push(value);
						}
						if(this.LicensePlateList.length < 7){
						  this.hasCarInfo = false
						}else{
						  this.hasCarInfo = true
						  this.hasWirteCarNo = true
						}
						this.carNumberInfo.CarNo = this.LicensePlateList.join("");
				}
			},
			inputCarNumFocus(e){
				let _key = e.currentTarget.dataset.key;
				let _val = e.detail.value;
				this.LicensePlateList.splice(_key,1,"")
				this.focusActive = _key;
			},
			saoMiao(type){
				if(type == 'car'){
				  // 扫车出现
				  this.isShowKeyboard = false;   // 关闭键盘
				  this.showkKeyboardType = true;   // 展示省份键盘
				  this.LicensePlateList =[];   // 车牌列表清空
				  this.showCamera = true
				  this.carScanShow = true;
				  this.vinScanShow = false;
				}else if(type == 'vin'){
				  //扫vin出现
				  this.showCamera = true
				  this.carScanShow = false;
				  this.vinScanShow = true;
				}
			},
			upLoad(data,type) {
			  if(type == 'car'){
				this.GetCarNoFromImage(data)
			  }else if(type == 'vin'){
				this.GetVINCodeToImage(data) 
			  }
			},
			takePhoto(){
				this.$parent.takePhoto('win')
			},
			// 获取车牌
			GetCarNoFromImage(data) {
			  var that = this;
			  applyApi.postJson("PickUpCarInfo/GetCarNoFromImage",data,function(res){
				  console.log("车牌图片11res:",res)
				  if(res.CCOFinishedTime){
					res.CCOFinishedTime = res.CCOFinishedTime.slice(0,10);
					if(res.CCOFinishedTime.slice(0,4) > 2000){
					  res.CCOFinishedTimeType = true;
					}
				  }
				  that.carNumberInfo = res;
				  that.vinNumberInfo = res;
				  that.CheckCarOrderList = res.CheckCarOrderList
				  that.hasCarInfo = true
				  that.hasWirteCarNo = false
				  that.vinNumberInfo.VINCode = res.VINCode
				  that.vinNumberInfo.KMNum = res.KMNum
				  if(res.CarModel){
					that.vinNumberInfo.CarModel = res.CarModel
				  }
				  that.LicensePlateList = res.CarNo.split('')
				  // that.hidePop();
				  // that.GetVINCodeToImage(data)
			  })
			},
		}
	}
</script>

<style lang="scss">
.sureCheckCar{
  width: 650rpx;
  margin: 50rpx 0;
  margin-left: calc((100% - 650rpx)/2);
  padding: 0 30rpx;
  border-radius: 30rpx;
  box-sizing: border-box;
  background:rgba(0,178,170,1);
  color: white;
  height: 108rpx;
  font-size: 32rpx;
  line-height: 108rpx;
}
.againScan{
  background:rgba(250,250,250,1);
  font-family:PingFang SC;
  font-weight:bold;
  color:rgba(51,51,51,1);
}
.tankuangBox{
  width: 100%;
  height: 100vh;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 9;
  .tankuangOne{
    width: 100%;
    border-top-left-radius: 50upx;
    border-top-right-radius: 50upx;
    background-color: white;
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 30upx 0;
    box-sizing: border-box;
    z-index: 99;
    .saomaPart{
      width: 650upx;
      height: 370upx;
      margin-left: calc((100% - 650upx)/2);
      position: relative;
      .img1{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
      .img2{
        width: 600upx;
        height: 320upx;
        position: absolute;
        // border:1upx solid;
        top: 25upx;
        left: calc((100% - 600upx)/2);
      }
    }
  }
}
.carWrap{
  width: 650upx;
  margin: 50upx 0;
  margin-left: calc((100% - 650upx)/2);
  box-sizing: border-box;
  position: relative;
  // view{
  //   width: 76upx;
  //   height: 88upx;
  //   background-color: #FAFAFA;
  //   border-radius: 14upx;
  //   border: 1upx solid #E1E1E1;
  //   line-height: 88upx;
  //   text-align: center;
  // }
  .num-textarea{
    width: 76upx;
    height: 88upx;
    background-color: #FAFAFA;
    border-radius: 14upx;
    border: 1upx solid #E1E1E1;
    line-height: 88upx;
    text-align: center;
  }
  .input-hide-carNum{
    position: absolute;
    width: 100%;
    height: 100%;
    color: #FAFAFA;
  }
  .xny{
    background-color: #f0f9f4;
    font-size: 20upx;
    color: #009343;
  }
  .xny-input{
    background-color: #f0f9f4;
    color: #009343;
    border:1px solid;
  }
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 98;
  background-color: rgba(0,0,0,0.5);

}
.CheckCarList {
  padding: 20upx 0;
    width: max-content;
    height: 400upx;

  &-item {
    width: 610upx;
    height:400upx;
    margin-left:  50upx;
    box-shadow: 1px 1px 5px #d1d1d1;
    padding: 0 20upx;
    border-radius: 30upx;
    margin-bottom: 20upx;
    // float: left;
    &:last-child {
      margin-right: 20upx;
    }
  }
}
.CheckCarListScrollView {
  margin-bottom: 20upx;
}


// 自定义车牌
.inputPlate-container{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100% !important;
}
.active-border-color{
    border: 1px solid #009343;
}
.dashed-border-color{
    border: 1px solid #009343;
}
.border-color{
    border: 1px solid #ccc;
}
.activecar, .newEnerge{
    float: left;
    width: 60upx;
    height: 66upx;
    text-align: center;
    line-height: 66upx;
    align-self: center;
    font-size: 40upx;
    color: #666;
    border-radius: 16upx;
}
.activecar{
  margin-right: 10upx;
}
.plate-keyboard-container{
    width: 100%;
    background-color: #d0d5d9;
    margin-bottom: -30upx;
}
.close-keyboard{
    background-color: #fff;
    height: 30px;
}
.line{
    background-color: #d0d5d9;
    width: 100%;
    height: 1px;
}
.close-btn{
    color: #009343;
    font-size: 15px;
    line-height: 30px;
    float: right;
    margin-right: 15px;
}
.keyboard-number-panel, .keyboard-provience-panel
{
    padding-bottom: 10upx;
}
.keyboard-panel{
    width: 100%;
    padding-top: 10upx;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
}
.key-panel{
    width: 65upx;
    height: 90upx;
    border-radius: 10upx;
    text-align: center;
    line-height: 90upx;
    float: left;
    background-color: #fff;
    color: #666;
    font-size: 40upx;
}
.deleteImg, .ABC{
    width: 90upx;
    height: 90upx;
    border-radius: 10upx;
    text-align: center;
    line-height: 90upx;
    float: left;
    background-color: #acb3bb;
}
.deleteImg image{
    width: 55upx;
    height: 45upx;
    margin-top: 25upx;
}
.box-container{
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    border-radius: 10px;
    width: 90%;
    height: 400upx;
    margin: 0 auto;
    background-color: #fff;
    overflow: hidden;
}
.plateTitle{
    width: 100%;
    height: 70upx;
    background-color: #009343;
    text-align: center;
    line-height: 70upx;
    color: #fff;
    font-size: 26upx;
}
.input-field-container{
    width: 100%;
    height: 220upx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.submitBtn{
    width: 80%;
	height: 70upx;
	background-color: #009343;
	border: none;
	border-radius: 10upx;
	text-align: center;
	line-height: 70upx;
	color: white;
	font-size: 26upx;
	margin-left: 10%;
}
.backspace{
  font-size: 30upx !important;
}
.icon-backspace{
  font-size: 50upx;
}
</style>
