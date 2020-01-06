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
            loader: 'vue-loader',
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
        test: /\.(ttf|eot|woff|woff2)(\d+)?(\?v=\d+\.\d+\.\d+)?$/,
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