import Vue from 'vue' // Vue を使う
import App from './App' // App.vue を読み込む

// IE11/Safari9用のpolyfill
// babel-polyfill を import するだけで IE11/Safari9 に対応した JavaScript にトランスコンパイルされる
import 'babel-polyfill'

// Buefy: Vue + Bulma
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
Vue.use(Buefy)

// DraggableTree
import {DraggableTree} from 'vue-draggable-nested-tree';
Vue.component('tree', DraggableTree);

// QuillEditor
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor, { theme: 'snow' })

new Vue({
  el: '#app', // Vueでマウントする要素
  render: h => h(App), // App.vue をレンダリング
})