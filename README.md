# 入門｜Atomic Design

## Environment

- OS: Ubuntu 18.04
- CLI:
    - nodejs: `10.15.3`
        - n (バージョン管理ツール): `4.1.0`
        - yarn (パッケージマネージャ): `1.16.0`
- Framework:
    - React: `3.0.1`
    - Storybook: `5.1.9`

***

## Setup (1H)

### Install CLI Tools
```bash
# install nodejs
$ sudo apt install -y nodejs npm
$ sudo npm install -g n # Install n-install on global
$ sudo n stable # Install stable nodejs by using n-install
$ sudo apt purge -y nodejs npm # Remove old nodejs and npm
$ sudo apt autoremove -y

# install yarn on global
$ sudo bpm install -g yarn

# show versions
$ n --version
4.1.0

$ nodejs -v
10.15.3

$ yarn -v
1.16.0
```

### Create React Project
React
: ユーザインターフェースをコポーネンとベースで構築するための JavaScript ライブラリ

```bash
# install create-react-app on local
$ yarn add -D create-react-app

# create react project into `app` directory
$ yarn create-react-app app
```

### Install Storybook
Storybook
: UIコンポーネントのカタログ
再利用可能なコンポーネントを効率よく構築可能

```bash
# set current directory to `app`
$ cd app

# install storybook for react
$ yarn add -D @storybook/react

# install react, react-dom, @babel/core, and babel-loader
$ yarn add -D react react-dom
$ yarn add -D babel-loader @babel/core
```

***

## Configures (0.5H)

`app/package.json`にStorybook実行用のscriptを追加する

```json
{
    "scripts": {
        "storybook": "start-storybook"
    }
}
```

`app/.storybook/config.js`に設定を書き込む

```javascript
import { configure } from '@storybook/react';

function loadStories() {
    // コンポーネントカタログを`app/stories/index.js`に定義
    require('../stories/index.js');
}

configure(loadStories, module);
```

***

## Sample Components (0.5H)

`app/stories/index.js`にUIコンポーネントを書いていく

以下は、テキスト付きのボタンコンポーネントの例

```javascript
import React from 'react';
import { storiesOf } from '@storybook/react';
import { Button } from '@storybook/react/demo';

storiesOf('Button', module)
    .add('with text', () => (
        <Button>Hello Button</Button>
    ));
```

コンポーネントを作成したら、`package.json`に定義しておいた`storybook`スクリプトを実行する

```bash
$ yarn storybook
# => Storybookが http://localhost:XXXX で実行され、ブラウザで開かれる
```
