<template>
	<!-- 扫码部分 -->
	<view class="tankuangBox">
		<view class="mask" @tap="hidePop()"></view>     
		<!-- Vin扫描 -->
		<view class="tankuangOne">
		  <view class="saomaPart">
			<image class="img1" src="/static/saomiao_bg.png"/>
			<camera device-position="back" flash="off" binderror="error" class="img2"></camera>
		  </view>
		  <button @tap="takePhoto('vin')" style="" class="sureCheckCar">确认扫描信息</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods:{
			hidePop(e){
				// if(this.hasWirteCarNo){
				//   let params = {
				// 	"ImageUrl":"",
				// 	"CarNo":this.carNumberInfo.CarNo
				//   }
				//   this.upLoad(params,'car')
				// }
				this.$emit('getSonVal',false)
			},
			takePhoto(){
				this.$parent.takePhoto('vin')
			}
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
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 98;
  background-color: rgba(0,0,0,0.5);

}
.line{
    background-color: #d0d5d9;
    width: 100%;
    height: 1px;
}
</style>

