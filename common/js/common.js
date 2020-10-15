module.exports = {
	/* 商品排序 */
	goodsSort: [{
			index: 0,
			type:'xl',
			name: '销量'
		},
		{
			index: 1,
			type:'jgasc',
			name: '价格升序'
		},
		{
			index: 2,
			type:'jgdesc',
			name: '价格降序'
		}
	],
	orderStatus: [{
			state: 0,
			text: '待核销',
			loadingType: 'more',
			orderList: []
		},
		{
			state: 1,
			text: '待支付',
			loadingType: 'more',
			orderList: []
		},
		{
			state: 2,
			text: '已完成',
			loadingType: 'more',
			orderList: []
		},
		{
			state: 3,
			text: '待评价',
			loadingType: 'more',
			orderList: []
		},
		{
			state: 4,
			text: '已退单',
			loadingType: 'more',
			orderList: []
		}
	],
}
