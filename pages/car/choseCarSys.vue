<template>
    <view class="content">
       <scroll-view scroll-y="true" class="scrollList" scroll-with-animation="true" :scroll-into-view="toView">
            <view class="scroll-item " v-for="(item,index) in dataList" :key="index">
                <!-- <view class="scroll-item__title" :id="item.brandName">
                    {{item.brandName}}
                </view>
                <view class="scroll-item__group" @tap="toChoseCarSys" v-for="(item,index) in item.OutCarSiCardataList" :key="index"> -->
				<view class="scroll-item__group-item" @tap="toChoseCarSys(item)" >
					<view class="scroll-item__group-item_name">
						{{item.description}}
					</view>
				</view>
                <!-- </view> -->
            </view>
        </scroll-view>
        <!-- <view class='right' @touchstart='touchStart' @touchmove='touchMove' @touchend='touchEnd' id='right'>
            <view v-for="(item,index) in letters" :key="index" class='letter' @tap='letterclick(item)'>{{item}}</view>
        </view> -->
    </view>
</template>

<script>
var rightheight = 0;
var touchEndy = 0;
export default {
  data() {
	  return {
		PageOption: {
		    BrandName:''
		},
		dataList:[],//列表
		scrollData: [],
		toView: 'D',
		touchEndy: 0,
		rightheight: 0,
		letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
		  
	  }
  },
  methods: {
	  //开始触摸事件
	  touchStart(e) {
	    touchEndy = e.touches[0].pageY;
	  },
	  touchMove(e) {
	    touchEndy = e.touches[0].pageY;
	    var lindex = parseInt(touchEndy / rightheight * 27);//根据前面分析获取手指触摸位置在letters中的index值
	    var value = this.letters[lindex];
	  },
	  search(e) {
	      this.PageOption.BrandName = e.detail.value
	      this.getData()
	  },
	  // 选择车系
	  toChoseCarSys(item) {
	      let {BrandId,VehicleSeriesName,description} = item
		  let {PageOption:{BrandName,BrandImage}} = this
	      wx.navigateTo({ url: `/pages/car/choseVehicleType?BrandId=${BrandId}&BrandName=${BrandName}&VehicleSeriesName=${VehicleSeriesName}&Description=${description}&BrandImage=${BrandImage}` });
	  },
	  touchEnd (e) {
	    var lindex = parseInt(touchEndy / rightheight * 27);
	    var value = this.letters[lindex];
	  },
	  //右侧索引表点击事件
	  letterclick(item) {
	    this.toView = item
	  },
	  
	  async getData(options) {
		  let params ={
			  brandId:options.BrandId,
			  vehicleSeriesName:options.BrandName
		  }
		  let dataList = await this.$store.dispatch('getVehicleSeries',params);
		  this.dataList = dataList.data
	  }
  },
  onShareAppMessage() {},
  onLoad(options) {
	  this.PageOption = options
	  console.log('options',options)
	  this.getData(options)
  },
  onShow() {
     //  var query = wx.createSelectorQuery();//创建节点选择器
     //    query.select('#right').boundingClientRect()
     //    query.exec(function (res) {
     //    //res就是 所有标签为mjltest的元素的信息 的数组
     //    console.log(res);
     //    //取高度
     //    console.log("height : "+res[0].height);
     //    rightheight = res[0].height;
     // })

  },
   
}
</script>
<style lang="less">
.scrollList {
    height: 100vh;
  .scroll {
    &-item {
      &__title {
        font-size:24upx;
        font-weight:800;
        color:rgba(51,51,51,1);
        background:rgba(250,250,250,1);
        padding: 30upx;
      }
      &__group {
        &-item {
            display: flex;
            align-items: center;
            height: 128upx;
            padding: 0 25upx;
          &_img {
              width:72upx;
              height:72upx;
              // padding: 0 25upx;
			  margin-right: 30upx;
          }
          &_name {
            font-size: 28upx;
            font-weight: 800;
            color: rgba(51, 51, 51, 1);
          }
        }
      }
    }
  }
}
.right {
  position: fixed;
  display: flex;
  flex-direction: column;
  height: 90%;
  width: 60upx;
  justify-content: space-around;
  align-items: center;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  z-index: 999;
}
.letter {
  font-size: 20upx;
  color: #1296DB;
  width: 60upx;
  padding-top: 5upx;
  padding-bottom: 5upx;
  text-align: center;
}
.searchbar {
    height: 88upx;
    display: flex;
    align-items: center;
    padding: 0 30upx;
    margin: 30upx 50upx;
    border-radius: 30px;
    background:rgba(250,250,250,1);
    image {
        width: 40upx;
        height: 30upx;
        padding-right: 10upx;

    }
}
</style>