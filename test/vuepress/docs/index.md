# VuePress

## Hello, World

***

### 環境
- node.js (`10.15.3 LTS`)
  - ※ Windows環境で`12.0.0`を使うと開発サーバーの起動ができない
  - パッケージマネージャ: `yarn`を推奨
    ```bash
    # yarnをグローバルにインストール
    $ npm install -g yarn
    ```

***

### プロジェクト作成
```bash
# プロジェクトディレクトリ作成
$ mkdir vuepress

# プロジェクトディレクトリ内にVuePressインストール
$ cd vuepress
$ yarn add -D vuepress
```

***

### Markdown文書の作成
```bash
# `docs/index.md`ファイル作成
$ mkdir docs
$ touch docs/index.md
```

`docs/index.md`を編集
```markdown
# VuePress

Hello, World!
```

***

### VuePress実行
ここまでで、以下のようなディレクトリ構造になるはず
```python
vuepress/
 |- docs/
 |   `- index.md # 作成したMarkdown文書
 |- node_modules/
 |   `- # VuePressに必要なnodeモジュールが入っている
 |- package.json # パッケージ管理用設定ファイル
 `- yarn.lock # パッケージ依存性バージョンの記録
```

作成した文書のディレクトリを`package.json`に追加する
```json
{
  "scripts": {
    "docs:dev": "vuepress dev docs",
    "docs:build": "vuepress build docs"
  },
   : (略)
}
```

#### 開発用サーバーを起動
```bash
# package.jsonの`scripts`で定義した`docs:dev`コマンドを呼び出す
## `vuepress dev docs` が実行される
$ yarn docs:dev
```

[localhost:8080](http://localhost:8080) にアクセスして、`docs/index.md`の内容が表示されることを確認する

#### 静的ファイルにコンパイル
```bash
# package.jsonの`scripts`で定義した`docs:build`コマンドを呼び出す
## `vuepress build docs` が実行される
$ yarn docs:build
```

`docs/.vuepress/dist`ディレクトリに HTML, JavaScript, CSS が生成されるため、これらのファイルをそのままサーバーにデプロイすれば良い