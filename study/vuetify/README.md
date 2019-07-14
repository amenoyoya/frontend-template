# Vuetify導入（仮）

## What's this?

Webアプリ制作において、専門ではないデザイン部分に時間をとられるのを防ぐための試験的技術運用プロジェクトの1つ

Vuetifyにより、とりあえずそれっぽい見た目のアプリが開発できるようになることを目指す

- **Vuetify**
    - Vueをベースに構築されたUIフレームワーク
    - Googleが提唱したマテリアルデザインの考えにのっとって構成された直感的で使いやすいコンポーネントを手軽に扱うことが可能
    - 現状のモダンブラウザであれば問題なく動作
        - 最低限動いて欲しいIE11にも対応
    - ドキュメントのサンプルが豊富

***

## Setup

### Environment
- OS: Windows10 Pro
- CLI:
    - nodejs: `10.15.3`
    - yarn (package manager): `1.15.2`

---

### Install
webpack + vue の構成とする

#### Install Webpack + Vue
```bash
# install webpack
$ yarn add -D webpack webpack-cli webpack-dev-server

# install vue + loader
$ yarn add -D vue vue-loader vue-template-compiler css-loader style-loader babel-loader @babel/core @babel/preset-env
```

- **webpack.config.js**
    ```javascript
    const path = require('path');
    // vue-loader plugin
    const VueLoaderPlugin = require('vue-loader/lib/plugin');    

    module.exports = {
      // 実行モード: develop => 開発, production => 本番
      // webpack4系以降はmodeを指定しないと警告が出る
      mode: 'development',
      // エントリーポイント
      entry: "./src/index.js",
      // 出力設定
      output: {
        // バンドル後のファイル名
        filename: 'bundle.js',
        // 出力先のパス（※絶対パスで指定すること）
        path: path.join(__dirname, 'public')
      },
      // ビルドしたJavaScriptにsource-mapを書き出す
      devtool: 'inline-soruce-map',
      // モジュール設定
      module: {
        rules: [
          {
            // 拡張子 .js の場合
            test: /\.js$/,
            // babel-loaderを使って ES6 をコンパイル
            loader: "babel-loader",
            // Babel のオプションを指定
            options: {
              // preset_env の構文拡張を有効に
              presets: [
                ["@babel/preset-env"]
              ]
            },
            // node_modules/ 内のファイルは除外
            exclude: /node_modules/
          },
          {
            // 拡張子 .vue の場合
            test: /\.vue$/,
            // vue-loaderを使って vue をコンパイル
            use: "vue-loader"
          },
          {
            // .css ファイル: css-loader => vue-style-loader の順に適用
            // - css-loader: cssをJSにトランスコンパイル
            // - style-loader: <link>タグにスタイル展開
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
          }
        ]
      },
      // import文で読み込むモジュールの設定
      resolve: {
        extensions: [".js", ".vue"], // .js, .vue をimport可能に
        modules: ["node_modules"], // node_modulesディレクトリからimport可能に
        alias: {
          // vue-template-compilerに読ませてコンパイルするために必要
          vue$: 'vue/dist/vue.esm.js',
        },
      },
      // VueLoaderPluginロード
      plugins: [new VueLoaderPlugin()],
      // 開発サーバー設定
      devServer: {
        // 起点ディレクトリを public/ に設定
        contentBase: path.join(__dirname, 'public'),
        // ポートを3000に設定
        port: 3000,
        // ブラウザを自動的に開く
        open: true
      }
    };
    ```
- **package.json**
    ```diff
    {
        "scripts": {
    +        "start": "webpack-dev-server --hot"
        },
    }
    ```

#### Test run: Webpack + Vue
- **src/App.vue** (Vueコンポーネント)
    ```html
    <template>
        <div>
            <p>Hello, World!</p>
        </div>
    </template>
    ```
- **src/index.js** (Webpackエントリーポイント)
    ```javascript
    import Vue from 'vue';
    import App from './App'    

    new Vue({
      el: '#app', // Vueでマウントする要素
      components: { App }, // 使用するコンポーネント
      template: '<app/>', // el（#app）の中に表示する内容
    });
    ```
- **public/index.html** (webpack-dev-serverエントリーポイント)
    ```html
    <!DOCTYPE html>
    <html lang="ja">
        <head>
            <meta charset="utf-8">
        </head>
        <body>
            <!-- Vueにより id="app" の要素が置き換えられる -->
            <div id="app"></div>
            <!-- Vue + webpack によりバンドルされた bundle.js を読み込む -->
            <script src="./bundle.js"></script>
        </body>
    </html>
    ```
- Test run
    ```bash
    $ yarn start
    # => "Hello, World!" in http://localhost:3000
    ```

#### Install Vuetify
```bash
# install vuetify
$ yarn add -D vuetify

# install material-design-icons-iconfront
$ yarn add -D material-design-icons-iconfont

# install url-loader
$ yarn add -D url-loader

# install polyfill for IE11/Safari9
$ yarn add -D babel-polyfill
```

- **webpack.config.js** (svg等のアイコンのloader設定を追加)
    ```diff
    module.exports = {
      // ～略～
      module: {
        rules: [
    +     /* アイコンloader設定 */
    +     {
    +       test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    +       use: [{
    +         loader: 'url-loader?mimetype=image/svg+xml'
    +       }],
    +     },
    +     {
    +       test: /\.woff(\d+)?(\?v=\d+\.\d+\.\d+)?$/,
    +       use: [{
    +         loader: 'url-loader?mimetype=application/font-woff'
    +       }],
    +     },
    +     {
    +       test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
    +       use: [{
    +         loader: 'url-loader?mimetype=application/font-woff'
    +       }],
    +     },
    +     {
    +       test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
    +       use: [{
    +         loader: 'url-loader?mimetype=application/font-woff'
    +       }],
    +     },
        ]
      }
    }
    ```

#### Test run: Vuetify
- **src/App.vue** (※ **v-appタグで囲むのを忘れないように！**)
    ```html
    <template>
        <!-- Vuetifyコンポーネントを使う場合は v-appタグで囲むこと！ -->
        <v-app>
            <!-- Alertコンポーネントを使ってみる -->
            <v-alert :value="true" type="success">Hello, World!</v-alert>
        </v-app>
    </template>
    ```
- **src/index.js**
    ```javascript
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
    ```
- Test run
    ```bash
    $ yarn start
    # => "Hello, World!" in http://localhost:3000
    ```

![thumbnail-vuetify](./thumbnail-vuetify.png)
