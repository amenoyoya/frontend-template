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

#### Install Webpack + Vue + Vuetify
```bash
# install webpack
$ yarn add -D webpack webpack-cli webpack-dev-server

# install vue + loader
$ yarn add -D vue vue-loader vue-template-compiler css-loader style-loader babel-loader @babel/core @babel/preset-env

# install vuetify
$ yarn add -D vuetify
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
            // - vue-style-loader: <link>タグにスタイル展開
            test: /\.css$/,
            use: ['vue-style-loader', 'css-loader']
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
- Test run:
    ```bash
    $ yarn start
    # => "Hello, World!" in http://localhost:3000
    ```
