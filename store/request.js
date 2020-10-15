import uniRequest from 'uni-request'
import { configApi } from '../common/js/applyApi.js';

function init() {
	//初始化配置
	//设置api访问基路径
	const requestUrl = configApi.baseUrl;
	const userToken = uni.getStorageSync('token');
	uniRequest.defaults.baseURL = requestUrl;
	uniRequest.defaults.headers.common['Authorization'] = 'Bearer '+userToken || '' //自定义请求头信息
	uniRequest.defaults.headers.post['Content-Type'] = 'application/json'
}

export function httpRequest(url = '', data = {}, type = '',loading=true) {
	/* 打开loading */
	if(loading){
		wx.showLoading()
	}
	init();
	return new Promise((resolve, reject) => {
		let promise
		if (type === 'get') {
			// 准备 url query 参数数据
			let dataStr = '' // 数据拼接字符串，将data连接到url
			Object.keys(data).forEach(key => {	
				dataStr += key + '=' + data[key] + '&'
			})
			if (dataStr !== '') {
				// 把最后的&去掉，拼成完整的url
				dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
				url = url + '?' + dataStr
			}
			// 发送 get 请求
			promise = uniRequest.get(url)
		} else {
			/* 发送post请求 */
			promise = uniRequest.post(url, data)
		}
		promise.then(res => {
			// console.log('成功返回的数据是===>'+JSON.stringify(res))
			if(res.data.code==401){
				uni.redirectTo({
					url:'/pages/login/login'
				})
				uni.setStorageSync('hasLogin',false)
				uni.setStorageSync('userInfo','')
				uni.setStorageSync('memberId','')
				uni.setStorageSync('loginInfo','')
				uni.showToast({
					icon:'none',
				    title: res.data.message,
				    duration: 2000
				});
			}else{
				//console.log('成功返回的数据是===>',res)
				resolve(res.data)
			}
		}).catch(error => {
			//console.log('错误返回的数据是===>',error)
			reject(error)
		}).finally(function(){
			/* 关闭loading */
			if(loading){
				wx.hideLoading()
			}
		});
	})
	// // 请求拦截
	// uniRequest.interceptors.request.use(
	// 	request => {
	// 		//配置基本信息    
	// 		return request;
	// 	},
	// 	err => {
	// 		console.log('请求失败');
	// 		return Promise.reject(err);
	// 	});

	// // 响应拦截
	// uniRequest.interceptors.response.use((res) => {
	// 	console.log('返回进入拦截成功')
	// 	return Promise.resolve(res);
	// }, (err) => {
	// 	console.log('返回进入拦截失败')
	// 	return Promise.reject(err);
	// });
}

export default {
	httpRequest
}
