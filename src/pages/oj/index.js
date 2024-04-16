import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '../../store'
import ViewUI from 'view-design';
import i18n from '@/i18n'
import 'view-design/dist/styles/iview.css';
import Panel from '@oj/components/Panel.vue'


Vue.config.productionTip = false

Vue.use(ViewUI, {
  i18n: (key, value) => i18n.t(key, value)
});
Vue.component(Panel.name, Panel)

// 注册全局消息提示
Vue.prototype.$Message.config({
  duration: 2
})
Vue.prototype.$error = (s) => Vue.prototype.$Message.error(s)
Vue.prototype.$info = (s) => Vue.prototype.$Message.info(s)
Vue.prototype.$success = (s) => Vue.prototype.$Message.success(s)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
