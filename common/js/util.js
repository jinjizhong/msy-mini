let toast = function(title, type) {
	type = type || 'none';
	wx.showToast({
		title: title,
		icon: type,
		duration: 2000,
		mask: true,
	})
}
let showLoad = function() {
	wx.showLoading({
		title: '加载中…'
	});
}
let hideLoading = function() {
	wx.hideLoading()
}
/* 格式化时间 */
let formatTime = (date) => {
	let arr = date.split("T");
	let d = arr[0];
	let darr = d.split('-');

	let t = arr[1];
	let tarr = t.split('.000');
	let marr = tarr[0].split(':');
	let dd = darr[0] + "-" + darr[1] + "-" + darr[2] + " " + marr[0] + ":" +
		marr[1] + ":" + marr[2];
	return dd;
}
let twoTimeForm = (date) => {
	let nowDate = new Date();
	let EndDate = new Date(formatTime(date))
	let dateDiff = EndDate.getTime() - nowDate.getTime();
	let days = Math.floor(dateDiff / (24 * 3600 * 1000)) //计算出天数 
	//计算出小时数 
	let leave1 = dateDiff % (24 * 3600 * 1000) //计算天数后剩余的毫秒数 
	let hours = Math.floor(leave1 / (3600 * 1000))
	//计算相差分钟数 
	let leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数 
	let minutes = Math.floor(leave2 / (60 * 1000))
	//计算相差秒数 
	let leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数 
	let seconds = Math.round(leave3 / 1000)
	//调用checkTime方法将数字小于10的在前面补0
	days = checkTime(days);
	hours = checkTime(hours);
	minutes = checkTime(minutes);
	seconds = checkTime(seconds);
	return hours + "小时" + minutes + "分钟" + seconds + "秒";
	setTimeout(function() {
		twoTimeForm(), 1000
	})
}
/* 百度地图获取位置 */
let getBMap=()=>{
	let bmap = require('../../libs/bmap-wx.min.js');
	let BMap = new bmap.BMapWX({ 
		ak: 'WdzPKnyBza8oimdF8ZENRh6PLSibnDdW' 
	}); 
	return new Promise((resolve, reject)=>{
		BMap.regeocoding({
			fail: (error)=>{
				reject(error)
			}, 
			success: (res)=>{
				console.log(res.originalData.result,'成功------')
				resolve(res.originalData.result)
			}
		})
	})
}

module.exports = {
	toast,
	showLoad,
	hideLoading,
	formatTime,
	getBMap
}
