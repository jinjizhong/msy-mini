<template>
	<view>
		<web-view :src="webViewUrl"></web-view>
	</view>
</template>

<script>
	export default {
		components: {
		},
		data() {
			return {
				webViewUrl:''
			}
		},
		onLoad(option) {
			//console.log(option.fileUrl)
			this.webViewUrl= option.linkUrl
		},
		methods: {
		}
	}
</script>

<style scoped>
	
</style>
