import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // 中文

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import { hasBtnPermission } from './utils/permission' // button permission
import * as filters from './filters' // global filters

// set ElementUI lang to 中文
Vue.use(ElementUI, { locale })

Vue.use(ElementUI, {
  size: Cookies.get('size') || 'small' // set element-ui default size
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
Vue.prototype.hasPerm = hasBtnPermission

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
