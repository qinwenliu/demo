import Vue from 'vue'
import ElementUI from 'element-ui'
import * as THREE from 'three'
import * as ThreeStats from 'three-stats'
// import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/icon.css';
import axios from 'axios'
import VueAxios from 'vue-axios'
// import * as echarts from 'echarts'
import echarts from '../echarts'
import dataV from '@jiaminghi/data-view'
import BaiduMap from 'vue-baidu-map'

import App from './App.vue'
import router from './router'


// Vue.prototype.$echarts = echarts //挂载在原型，组件内使用直接this.$echarts调用
Vue.prototype.$echarts = echarts

Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'SzHLdlsrB21MYsCSR1gIbbu9C0n4DYGa'
})

Vue.use(dataV)
Vue.prototype.THREE = THREE

Vue.prototype.ThreeStats = ThreeStats

Vue.config.productionTip = false

Vue.use(ElementUI);

Vue.use(VueAxios, axios)
Vue.prototype.$axios = axios;

axios.interceptors.request.use((config) => {
  let token = sessionStorage.getItem('token')
  if(token) {
    config.headers.Authorization = 'Bearer ' + token
    // console.log(config.headers.token)
  }
  return config;
}, (error) => {
  return Promise.reject(error);
})

axios.interceptors.response.use(response => { 
  if (response.data.code == 401) {
    ElementUI.Message({  
     message: '身份已失效', 
     type: 'err' 
     });
     sessionStorage.removeItem('token');
     this.$router.push('/MyLogin')
   } else { 
     return response 
   } 
  }, 
 error => { 
  return Promise.reject(error); 
  })


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

