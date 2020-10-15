import request from './request.js'
const search='search' //搜索
const portal='portal' //其他

const Login = (data) => request.httpRequest(`${portal}/login/wxAuth`, data)  // 小程序登录接口
const getBanner = (data) => request.httpRequest(`${portal}/home/banner/list`, data,'get',false)  // 获取banner列表
const hotGoodsList = (data) => request.httpRequest(`${portal}/home/hot/package/list`, data,'',false)  // 分页获取热销商品列表
const tuiGoodsList = (data) => request.httpRequest(`${portal}/home/recommend/package/list`, data,'',false)  // 分页获取推荐商品列表
const getAllGoodsList = (data) => request.httpRequest(`${portal}/home/listByPage`, data,'',false)  // 分页获取所有商品列表
const getStoreList = (data) => request.httpRequest(`${portal}/store/getStoreList`, data)  // 获取门店列表
const getStoreDetail = (data) => request.httpRequest(`${portal}/store/getStoreDetail`, data)  // 查询门店详情
const getStorePackage = (data) => request.httpRequest(`${portal}/store/getStorePackage`, data)  // 查询门店商品
const deleteCar = (data) => request.httpRequest(`${portal}/api/memberCar/delete`, data)  // 删除车辆
const getMemberBaseCars = (data) => request.httpRequest(`${portal}/api/memberCar/getMemberBaseCars`, data)  // 获取用户车辆基础信息列表接口
const getCarDetails = (data) => request.httpRequest(`${portal}/api/memberCar/getMemberCars`, data)  // 获取用户车辆详细信息列表接口
const saveMemberCar = (data) => request.httpRequest(`${portal}/api/memberCar/saveMemberCar`, data)  // 用户车俩信息保存接口
const vehicleCar = (data) => request.httpRequest(`${portal}/api/memberCar/vehiclePlateDistinguish`, data)  // 车牌扫描，返回车牌
const vinDistinguish = (data) => request.httpRequest(`${portal}/api/memberCar/vinDistinguish`, data)  // vin码扫描
const confirmOrder = (data) => request.httpRequest(`${portal}/order/generateConfirmOrder`, data)  // 直接购买生产订单
const generateOrder = (data) => request.httpRequest(`${portal}/order/generateOrder`, data)  // 根据购物车信息生成订单
const orderDetail = (data) => request.httpRequest(`${portal}/member/order/detail`, data)  // 获取用户订单详情
const orderList = (data) => request.httpRequest(`${portal}/member/order/list`, data)  // 分页获取用户订单列表
const refundOrder = (data) => request.httpRequest(`${portal}/member/order/refund/list`, data)  // 分页获取用户退款订单列表
const refundApply = (data) => request.httpRequest(`${portal}/refund/apply`, data)  // 申请退款
const refundList = (data) => request.httpRequest(`${portal}/refund/list`, '')  // 退款原因列表
const deleteOrder = (data) => request.httpRequest(`${portal}/order/deleteOrder`, data)  // 用户删除订单
const paymentConfirm = (data) => request.httpRequest(`${portal}/order/paymentConfirm`, data)  // 根据订单号获取支付确认信息
const inteInfo = (data) => request.httpRequest(`${portal}/member/integration/info`, data,'',false)  // 获取用户积分信息
const recordList = (data) => request.httpRequest(`${portal}/member/integration/record/list`, data)  // 获取用户积分记录列表
const detailInfo = (data) => request.httpRequest(`${portal}/package/detail`, data,'get')  // 获取套餐详情信息
const detailStoreList = (data) => request.httpRequest(`${portal}/package/detail/store/list`, data)  // 获取套餐详情中销售门店列表
const orderAsync = (data) => request.httpRequest(`${portal}/callbackApi/order/sync`, data)  // 订单同步接口
const orderVertify = (data) => request.httpRequest(`${portal}/callbackApi/order/verificate`, data)  // 订单核销
const addCart = (data) => request.httpRequest(`${portal}/cart/add`, data)  // 添加套餐到购物车
const clearCart = () => request.httpRequest(`${portal}/cart/clear`,'','get')  // 清空购物车
const deleteCart = (data) => request.httpRequest(`${portal}/cart/delete`, data)  // 删除购物车中的商品
const cartList = () => request.httpRequest(`${portal}/cart/list`,'','get')  // 获取会员的购物车列表
const becomeMember = (data) => request.httpRequest(`${portal}/api/member/becomeMember`,data)  //领取会员
const prodSearch = (data) => request.httpRequest(`${search}/esPackage/search`, data,'get')  // 搜索套餐
const getVehicleBrand = (data) => request.httpRequest(`${portal}/api/memberCar/getVehicleBrand`, data,'get')  // 查询车牌列表
const commentList = (data) => request.httpRequest(`${portal}/store/comment/option/list`,'')  //获取门店评价选项列表
const commentSave = (data) => request.httpRequest(`${portal}/store/comment/save`,data)  //保存门店评价
const getVehicleSeries = (data) => request.httpRequest(`${portal}/api/memberCar/getVehicleSeries`, data)  // 查询车牌列表
const getVehicleType = (data) => request.httpRequest(`${portal}/api/memberCar/getVehicleType`, data)  // 查询车型列表
const getVerificationInfo = (data) => request.httpRequest(`${portal}/member/order/getVerificationInfo`, data)  // 订单核销获取
const queryOrderPackage = (data) => request.httpRequest(`${portal}/member/order/queryOrderPackage`, data,'get')  // 查询订单套餐信息

export default{
	Login,
	getBanner,
	hotGoodsList,
	tuiGoodsList,
	getStoreList,
	getStoreDetail,
	getStorePackage,
	deleteCar,
	getMemberBaseCars,
	getCarDetails,
	saveMemberCar,
	vehicleCar,
	vinDistinguish,
	orderDetail,
	orderList,
	refundOrder,
	inteInfo,
	recordList,
	detailInfo,
	detailStoreList,
	orderAsync,
	orderVertify,
	addCart,
	clearCart,
	deleteCart,
	cartList,
	confirmOrder,
	generateOrder,
	refundApply,
	deleteOrder,
	paymentConfirm,
	refundList,
	becomeMember,
	prodSearch,
	getVehicleBrand,
	commentList,
	commentSave,
	getVehicleSeries,
	getVehicleType,
	getVerificationInfo,
	getAllGoodsList,
	queryOrderPackage
}