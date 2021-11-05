import Vue from 'vue'
import App from './App.vue'
import store from './store'
import SlotMachine from '@puckwang/vue-slot-machine';

Vue.config.productionTip = false
Vue.use(SlotMachine);

new Vue({
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
