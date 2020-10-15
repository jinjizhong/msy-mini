<template>
  <view class="mc" catchtouchmove="touchHandler">
    <view class="mc-view"  @tap="hidePop()"></view>
    <view class="content">
      <label>此处需要您的地理位置授权</label>
      <view class="btns">
        <button @tap="openLocation">已经开启</button>
        <button @tap="openLocation" open-type="openSetting" @opensetting="getSettingByFather">去开启</button>
      </view>
    </view>
  </view>
</template>

<script>

export default {
	data() {
		return {
		};
	},
    props: {
      
    },
    methods: {
      openLocation(){
        this.$emit('openLocation', true);
      },
	  getSettingByFather(){
		  this.$parent.getSetting()
		  console.log(123)
	  }
    }
  }
</script>
<style lang="scss">
.mc{
    position: fixed;
    width: 100%;
    height: 100vh;
    z-index: 2;
    background-color: rgba(0,0,0,0.6);
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    .mc-view{
       position: fixed;
        width: 100%;
        height: 100vh;
        top: 0;
        left: 0;
    }
    .content{
      width: 650upx;
      height: 232upx;
      background-color: #fff;
      display: flex;
      flex-direction: column ;
      label{
        padding: 50upx 0;
        // height: 50upx;
        text-align: center;
        line-height: 50upx;
      }
      .btns{
        border-top: 1upx solid #eeeeee;
        height: 80upx;
        display: flex;
        button{
          width: 324upx;
          height: 100%;
          background-color: #fff;
          border-radius: 0;
          line-height: 80upx;
        }
        button:nth-child(1){
          border-right: 1upx solid #eeeeee;
        }
        button:nth-child(2){
          color: #f79b46;
        }
      }
    }
    button:after{
      border: none;
    }
  }
</style>

