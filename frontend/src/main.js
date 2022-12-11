import Vue from "vue";

// 
import BootstrapVue from "bootstrap-vue";
import 'bootstrap/dist/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import App from "./App.vue";
import router from "./router";
import store from "./store";
import vueConfig from "vue.config";

Vue.config.productionTip = false;

Vue.use(BootstrapVue);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
