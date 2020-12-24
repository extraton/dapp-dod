import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';

let snack = {
  install(Vue) {
    Vue.prototype.$snack = {
      listener: null,
      success(data) {
        if (null !== this.listener) {
          this.listener(data.text);
        }
      },
      danger(data) {
        return this.success(data);
      }
    }
  }
}

Vue.use(snack);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
