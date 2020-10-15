<template>
	<view class="uni-searchbar">
		<view :style="{borderRadius:radius+'px',backgroundColor: bgColor,borderColor:bdColor,height:searchHeight,borderWidth:borWidth}" class="uni-searchbar__box" @click="searchClick">
			<!-- #ifdef MP-ALIPAY -->
			<view class="uni-searchbar__box-icon-search">
				<uni-icons color="#999999" size="18" type="search" />
			</view>
			<!-- #endif -->
			<!-- #ifndef MP-ALIPAY -->
			<uni-icons color="#999999" class="uni-searchbar__box-icon-search" size="14" type="search" />
			<!-- #endif -->
			<input v-if="inputShow" :focus="showSync" :placeholder="placeholder" :maxlength="maxlength" @confirm="confirm" class="uni-searchbar__box-search-input"
			 confirm-type="search" type="text" v-model="searchVal" />
			<text v-else class="uni-searchbar__text-placeholder">{{ placeholder }}</text>
			<!-- <view v-if="inputShow && (clearButton==='always'||clearButton==='auto'&&searchVal!=='')" class="uni-searchbar__box-icon-clear" @click="clear">
				<uni-icons color="#999999" class="" size="24" type="clear" />
			</view> -->
		</view>
		<!-- <text @click="cancel" class="uni-searchbar__cancel" v-if="cancelButton ==='always' || show && cancelButton ==='auto'">{{cancelText}}</text> -->
	</view>
</template>

<script>
	import uniIcons from "./uni-icons.vue";
	export default {
		name: "UniSearchBar",
		components: {
			uniIcons
		},
		props: {
			placeholder: {
				type: String,
				default: "请输入搜索内容"
			},
			radius: {
				type: [Number, String],
				default: 5
			},
			clearButton: {
				type: String,
				default: "auto"
			},
			cancelButton: {
				type: String,
				default: "auto"
			},
			cancelText: {
				type: String,
				default: '取消'
			},
			bgColor: {
				type: String,
				default: "#FFFFFF"
			},
			maxlength: {
				type: [Number, String],
				default: 100
			},
			clickChange:{
				type: Boolean,
				default: false
			},
			bdColor:{
				type: String,
				default: "rgba(0, 0, 0, 0.25)"
			},
			searchHeight:{
				type: String,
				default: ""
			},
			inputShow:{//设置input是否使用
				type: Boolean,
				default: false
			},
			borWidth:{
				type:String,
				default: '0.5px'
			}
		},
		data() {
			return {
				show: true,
				showSync: false,
				searchVal: ""
			}
		},
		watch: {
			searchVal() {
				this.$emit("input", {
					value: this.searchVal
				})
			}
		},
		methods: {
			searchClick() {
				if (this.show) {
					return
				}
				
				if(this.clickChange){
					this.$emit("clickChange")
				}else{
					this.searchVal = ""
					this.show = true;
					this.$nextTick(() => {
						this.showSync = true;
					})
				}
			},
			clear() {
				this.searchVal = ""
			},
			cancel() {
				this.$emit("cancel", {
					value: this.searchVal
				});
				this.searchVal = ""
				this.show = false
				this.showSync = false
				// #ifndef APP-PLUS
				uni.hideKeyboard()
				// #endif
				// #ifdef APP-PLUS
				plus.key.hideSoftKeybord()
				// #endif
			},
			confirm() {
				// #ifndef APP-PLUS
				uni.hideKeyboard();
				// #endif
				// #ifdef APP-PLUS
				plus.key.hideSoftKeybord()
				// #endif
				this.$emit("confirm", {
					value: this.searchVal
				})
			}
		}
	};
</script>

<style lang="scss" scoped>
	$uni-searchbar-height: 28px;

	.uni-searchbar {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		position: relative;
		padding: $uni-spacing-col-base;
		background-color: #FFFFFF;
	}

	.uni-searchbar__box {
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		overflow: hidden;
		position: relative;
		flex: 1;
		justify-content: flex-start;
		flex-direction: row;
		align-items: center;
		height: $uni-searchbar-height;
		padding: 13px 10px 13px 0px;
		//border-width: 0.5px;
		border-style: solid;
	}

	.uni-searchbar__box-icon-search {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		width: 32px;
		justify-content: center;
		align-items: center;
		color: $uni-text-color-placeholder;
	}

	.uni-searchbar__box-search-input {
		flex: 1;
		font-size: $uni-font-size-base;
		color: $uni-text-color;
	}

	.uni-searchbar__box-icon-clear {
		align-items: center;
		line-height: 24px;
		padding-left: 5px;
	}

	.uni-searchbar__text-placeholder {
		// font-size: $uni-font-size-base;
		// color: $uni-text-color-placeholder;
		// margin-left: 5px;
		font-size:24upx;
		font-family:PingFang SC;
		font-weight:500;
		color:rgba(60,56,54,1);
		opacity:0.3;
		padding:0px 0px 2px 0px;
	}

	.uni-searchbar__cancel {
		padding-left: 10px;
		line-height: $uni-searchbar-height;
		font-size: 14px;
		color: $uni-text-color;
	}
</style>
