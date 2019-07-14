import Vue from 'vue';
import App from './App'
import Vuetify from 'vuetify';
// vuetifyのスタイルシートload
import 'vuetify/dist/vuetify.min.css';
// material-design-iconsをload
import 'material-design-icons-iconfont/dist/material-design-icons.css';
// IE11/Safari9用のpolyfill
import 'babel-polyfill';

Vue.use(Vuetify); // Vuetifyのコンポーネントを使用可能に

new Vue({
  el: "#app",
  render: h => h(App)
});
