# Vue + Electron

## Environment

- OS:
    - Ubuntu 18.04
- Node.js: 13.2.0
    - Yarn: 1.21.0

***

## Installation

```bash
# initialize project
$ yarn init -y

# install packages
$ yarn add  electron webpack webpack-cli \
            babel-loader @babel/core @babel/preset-env babel-polyfill \
            vue vue-loader vue-template-compiler \
            css-loader style-loader

# install buefy
$ yarn add buefy
```

***

## Structure

```bash
./
|_ public/ # Webpack出力先ディレクトリ
|   |_ (index.js) # WebpackでバンドルされたJSファイル
|   |_ index.html # フロント画面
|
|_ src/ # Webpackソーススクリプト格納ディレクトリ
|   |_ App.vue  # Vueコンポーネント
|   |_ index.js # Webpackでバンドルされるエントリーポイント
|
|_ main.js # Electronソーススクリプト
|_ package.json # プロジェクト構成設定
|_ webpack.config.js # Webpackバンドル設定
```

### webpack.config.js
```javascript
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  mode: 'development', // 'production'
  // ソーススクリプト: ./src/index.js
  entry: './src/index.js',
  // 出力先: ./public/index.js
  output: {
    filename: 'index.js',
    path: path.join(__dirname, 'public')
  },
  // モジュール設定
  module: {
    rules: [
      // .js ファイルを babel-loader でトランスコンパイル
      {
        test: /\.js$/,
        exclude: /node_modules/, // node_modules/ 内のファイルは除外
        use: [
          // babel-loader を利用
          {
            loader: 'babel-loader',
            options: {
              // @babel/preset-env の構文拡張を有効に
              presets: ['@babel/preset-env']
            }
          }
        ]
      },
      // Vue単一ファイルコンポーネント（.vue ファイル）読み込み設定
      {
        test: /\.vue$/,
        // vue-loaderを使って .vue ファイルをコンパイル
        use: [
          {
            loader: "vue-loader",
          },
        ],
      },
      // スタイルシート（.css ファイル）読み込み設定
      {
        // .css ファイル: css-loader => vue-style-loader の順に適用
        // - css-loader: cssをJSにトランスコンパイル
        // - style-loader: <link>タグにスタイル展開
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },

      /* アイコンローダーの設定 */
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'url-loader?mimetype=image/svg+xml'
        }],
      },
      {
        test: /\.woff(\d+)?(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'url-loader?mimetype=application/font-woff'
        }],
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'url-loader?mimetype=application/font-woff'
        }],
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'url-loader?mimetype=application/font-woff'
        }],
      },
    ]
  },
  // import文で読み込むモジュールの設定
  resolve: {
    extensions: [".js", ".vue"], // .js, .vue をimport可能に
    modules: ["node_modules"], // node_modulesディレクトリからも import できるようにする
    alias: {
      // vue-template-compilerに読ませてコンパイルするために必要な設定
      vue$: 'vue/dist/vue.esm.js',
    },
  },
  // VueLoaderPluginを使う
  plugins: [new VueLoaderPlugin()],
}
```

### src/App.vue
```html
<template>
  <section>
    <b-collapse :open="false">
      <button class="button is-primary" slot="trigger">Click me!</button>
      <div class="notification">
        <div class="content">
          <h3>Subtitle</h3>
          <p>Hello, world</p>
        </div>
      </div>
    </b-collapse>
  </section>
</template>
```

### src/index.js
```javascript
import Vue from 'vue' // Vue を使う
import App from './App' // App.vue を読み込む

// IE11/Safari9用のpolyfill
// babel-polyfill を import するだけで IE11/Safari9 に対応した JavaScript にトランスコンパイルされる
import 'babel-polyfill'

// Buefy: Vue + Bulma
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

Vue.use(Buefy)

new Vue({
  el: '#app', // Vueでマウントする要素
  render: h => h(App), // App.vue をレンダリング
})
```

### index.html
```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
</head>
<body>
    <!-- id: app の要素を Vue で制御 -->
    <div id="app"></div>
    <!-- Webpack でバンドルしたJSファイルを読み込む -->
    <script src="./index.js"></script>
</body>
</html>
```

### main.js
```javascript
// Electronの実行に必要なモジュールを取り込む
const electron = require('electron')
const path = require('path')
const url = require('url')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

// Electronのライフサイクルを定義
let mainWindow // メインウィンドウを表す変数
app.on('ready', createWindow)
app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') app.quit()
})
app.on('activate', function() {
  if (mainWindow === null) createWindow()
})

// ウィンドウを作成してコンテンツを読み込む
function createWindow() {
  mainWindow = new BrowserWindow({width: 800, height: 600})
  mainWindow.loadURL(url.format({ // 読み込むコンテンツを指定
    pathname: path.join(__dirname, 'public', 'index.html'),
    protocol: 'file:',
    slashes: true  
  }))
  // ウィンドウが閉じる時の処理
  mainWindow.on('closed', function() {
    mainWindow = null
  })
}
```

### package.json
```json
{
  (略)
  "scripts": {
    "start": "webpack --watch --watch-poll & electron main.js"
  }
}
```

***

## Electron開発

Webpack + Vue でフロント画面を開発し、Electron で画面を描画する

```bash
# webpack --watch --watch-poll & electron main.js
## webpack --watch --watch-poll: ソースファイル変更を検知して自動的にバンドル実行
### & でつなげることで webpack 監視バンドルをバックグラウンド実行
## electron main.js: Electron で main.js を実行
$ yarn start
```

Electron ではファイル変更時に画面を自動的にリロードできないため `Ctrl + R` で画面を更新する必要がある（Webpack 自体はファイル変更を検知して自動的にバンドルを実行する）
