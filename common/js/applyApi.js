// const ENV = 'PROD';//正式
const ENV = 'DEV'; //测试

// 测试
//整体项目
const DEV_API_URL = 'https://testshopportal.51autoshop.com/';

// 正式
const PROD_API_URL = 'https://shopportal.51autoshop.com/';



export const configApi = {
  ENV: ENV,
  baseUrl: ENV == 'DEV' ? DEV_API_URL : PROD_API_URL,
}
