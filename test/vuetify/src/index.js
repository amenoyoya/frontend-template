import Vue from 'vue';
import App from './App'
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css'; // vuetifyのスタイルシート
import 'babel-polyfill'; // IE11/Safari9用のpolyfill
 
Vue.use(Vuetify);

new Vue({
  el: "#app",
  render: h => h(App)
});
