// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import $ from 'jquery'
import jQuery from "jquery"
import axios from 'axios'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)
Vue.use(Vuetify)

Vue.config.productionTip = false

Vue.prototype.$ajax = axios

const i18n = new VueI18n({
  locale: 'zh-CN', // 语言标识, 通过切换locale的值来实现语言切换,this.$i18n.locale 
  messages: {
    'zh-CN': require('./lang/zh'), // 中文语言包
    'en-US': require('./lang/en') // 英文语言包
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  router,
  components: {
    App
  },
  template: '<App/>'
})
