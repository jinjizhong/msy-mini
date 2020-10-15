import Vue from 'vue'
import Vuex from 'vuex'
import resUrl  from './api'

Vue.use(Vuex)
/* vuex state存储 */
const state = {
	defaultCar:'',//默认车辆
	myCarList:[],//我的车辆列表
	bannerList:[],//banner
	tuiGoodsList:[{},{}],//推荐商品
	hotGoodsList:[],//热销商品
	availableAmount:0 //积分
}
/* mutations */
const mutations = {
	/* 存储用户信息 */
	saveWXInfo(state, info){
		Vue.prototype.hasLogin = true
		uni.setStorageSync('hasLogin',true)
		uni.setStorageSync('userInfo',info)
	},
	/* 用户积分 */
	SAVE_INTERVAL:(state,{res})=>{
		if(res.success){
			state.availableAmount=res.data.availableAmount || 0
			//console.log(state.availableAmount,'90990')
		}else{
			state.availableAmount=0
		}
	},
	GET_GOODS:(state, { res,type,pageIndex })=>{
		if(res.success){
			switch (type){
				case 1:
					state.bannerList=res.data
					break;
				case 2:
					if(pageIndex==1){
						state.tuiGoodsList=[]
						state.tuiGoodsList=res.data.list
					}else{
						state.tuiGoodsList= state.tuiGoodsList.concat(res.data.list)
					}
					break;
				case 3:
					if(pageIndex==1){
						state.hotGoodsList=[]
						state.hotGoodsList=res.data.list
					}else{
						state.hotGoodsList=state.hotGoodsList.concat(res.data.list)
					}
					break;
			}
		}
	},
	GET_CAR:(state,{res,licensePlate})=>{
		if(res.success){
			state.defaultCar=licensePlate
			state.myCarList=res.data
		}
	}
}
/* 执行actions动作，提交到mutations  */
const actions = {
	/* 登录 */
	async Login(...rest) {
		// 发送异步请求
		const result = await resUrl.Login(rest[1])
		return result
	},
	/* 首页banner */
	async getBanner({commit}){
		const res = await resUrl.getBanner({num: 5})
		let type=1
		commit('GET_GOODS', { res , type})
	},
	/* 分页获取推荐商品列表 */
	async getTuiGoods({commit}, data){
		const res = await resUrl.tuiGoodsList(data)
		let type=2
		let pageIndex=data.pageNum
		commit('GET_GOODS', { res , type, pageIndex})
	},
	/* 分页获取所有商品列表 */
	async getAllGoodsList({commit}, data){
		return await resUrl.getAllGoodsList(data)
		// let type=2
		// let pageIndex=data.pageNum
		// commit('GET_GOODS', { res , type, pageIndex})
	},
	
	/* 分页获取热销商品列表 */
	async getHotGoods({commit}, data){
		const res = await resUrl.hotGoodsList(data)
		let type=3
		let pageIndex=data.pageNum
		commit('GET_GOODS', { res , type, pageIndex })
	},
	/* 获取门店列表 */
	async getStoreList(...rest) {
		return await resUrl.getStoreList(rest[1])
	},
	/* 查询门店详情 */
	async getStoreDetail(...rest) {
		return await resUrl.getStoreDetail(rest[1])
	},
	/* 查询门店商品 */
	async getStorePackage(...rest) {
		return await resUrl.getStorePackage(rest[1])
	},
	/* 获取用户车辆基础信息列表接口 */
	async getMemberBaseCars(...rest) {
		return await resUrl.getMemberBaseCars(rest[1])
	},
	/* 获取用户车辆详细信息列表接口 */
	async getCarDetails({commit}, data) {
		const res=await resUrl.getCarDetails(data)
		let licensePlate=''
		if(res.success){
			if(res.data){
				for (let it of res.data) {
					if(it.isDefault){
						licensePlate=it.licensePlate
					}
				}
			}
		}
		commit('GET_CAR', { res , licensePlate })
		return res
	},
	/* 用户车俩信息保存接口 */
	async saveMemberCar(...rest) {
		return await resUrl.saveMemberCar(rest[1])
	},
	/* 车牌扫描，返回车牌 */
	async vehicleCar(...rest) {
		return await resUrl.vehicleCar(rest[1])
	},
	/* vin码扫描 */
	async vinDistinguish(...rest) {
		return await resUrl.vinDistinguish(rest[1])
	},
	/* 直接购买生产订单 */
	async confirmOrder(...rest){
		return await resUrl.confirmOrder(rest[1])
	},
	/* 根据购物车信息生成订单 */
	async generateOrder(...rest){
		return await resUrl.generateOrder(rest[1])
	},
	/* 获取用户订单详情 */
	async orderDetail(...rest){
		return await resUrl.orderDetail(rest[1])
	},
	/* 分页获取用户订单列表 */
	async orderList(...rest) {
		return await resUrl.orderList(rest[1])
	},
	/* 分页获取用户退款订单列表 */
	async refundOrder(...rest) {
		return await resUrl.refundOrder(rest[1])
	},
	/* 获取用户积分信息 */
	async inteInfo({commit}) {
		let params={
			"memberId": uni.getStorageSync('memberId')
		}
		let res = await resUrl.inteInfo(params)
		commit('SAVE_INTERVAL', { res })
	},
	/* 获取用户积分记录列表 */
	async recordList(...rest) {
		return await resUrl.recordList(rest[1])
	},
	/* 获取套餐详情信息 */
	async detailInfo(...rest) {
		return await resUrl.detailInfo(rest[1])
	},
	/* 获取套餐详情中销售门店列表 */
	async detailStoreList(...rest) {
		return await resUrl.detailStoreList(rest[1])
	},
	/* 订单同步接口 */
	async orderAsync(...rest) {
		return await resUrl.orderAsync(rest[1])
	},
	/* 订单核销 */
	async orderVertify(...rest) {
		return await resUrl.orderVertify(rest[1])
	},
	/* 根据订单号获取支付确认信息 */
	async paymentConfirm(...rest) {
		return await resUrl.paymentConfirm(rest[1])
	},
	/* 订单申请退款 */
	async refundApply(...rest){
		return await resUrl.refundApply(rest[1])
	},
	/* 退款原因列表 */
	async refundList(){
		return await resUrl.refundList()
	},
	/* 删除订单 */
	async deleteOrder(...rest){
		return await resUrl.deleteOrder(rest[1])
	},
	/* 删除车辆 */
	async deleteCar(...rest) {
		return await resUrl.deleteCar(rest[1])
	},
	/* 添加套餐到购物车 */
	async addCart(...rest) {
		return await resUrl.addCart(rest[1])
	},
	/* 清空购物车 */
	async clearCart(...rest) {
		return await resUrl.clearCart(rest[1])
	},
	/* 删除购物车中的商品 */
	async deleteCart(...rest) {
		return await resUrl.deleteCart(rest[1])
	},
	/* 获取会员的购物车列表 */
	async cartList() {
		return await resUrl.cartList()
	},
	/* 会员注册 */
	async becomeMember(...rest) {
		return await resUrl.becomeMember(rest[1])
	},
	/* 商品及服务搜索 */
	async prodSearch(...rest) {
		return await resUrl.prodSearch(rest[1])
	},
	/* 查询车辆品牌列表 */
	async getVehicleBrand(...rest) {
		return await resUrl.getVehicleBrand(rest[1])
	},
	/* 获取门店评价选项列表 */
	async commentList() {
		return await resUrl.commentList()
	},
	/* 保存门店评价 */
	async commentSave(...rest) {
		return await resUrl.commentSave(rest[1])
	},
	/* 查询车辆车系列表 */
	async getVehicleSeries(...rest) {
		return await resUrl.getVehicleSeries(rest[1])
	},
	/* 查询车辆车型列表 */
	async getVehicleType(...rest) {
		return await resUrl.getVehicleType(rest[1])
	},
	/* 订单核销获取 */
	async getVerificationInfo(...rest) {
		return await resUrl.getVerificationInfo(rest[1])
	},
	/* 查询订单套餐信息 */
	async queryOrderPackage(...rest) {
		return await resUrl.queryOrderPackage(rest[1])
	},
	
}

export default new Vuex.Store({
	state,
	mutations,
	actions
})
