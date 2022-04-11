import Vue from 'vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/global.css'
import axios from 'axios'
import '@/assets/fonts/iconfont.css'

//axios挂Vue
Vue.prototype.$http =axios;
axios.defaults.baseURL="http://47.101.177.78:8888/api/private/v1/"
//设置token
axios.interceptors.request.use(function (res){
  let token=sessionStorage.getItem('token');
  res.headers.Authorization=token;
  return res;
})

Vue.filter("create_time", function(value) {
  return moment(value*1000).format("yyyy-MM-DD HH:mm:ss");
});

Vue.filter("add_time", function(value) {
  return moment(value*1000).format("yyyy-MM-DD HH:mm:ss");
});

//拦截器
axios.interceptors.response.use(function (res){
  return res.data;
})

Vue.use(ElementUI)
import App from './App.vue'
import moment from "moment";
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

