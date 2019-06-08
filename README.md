# 入門｜フロントエンド開発

## Environment

- Frameworks:
    - Web: `python3 + flask`
- Docker: `18.09.6`
    - docker-ccompose: `1.24.0`
    - Containers:
        - flask:
            - FROM: `alpine:3.7`
            - DEV: flaskの開発用サーバーを実行
            - PRD: flaskサーバーをuwsgiプロトコルで実行
        - nginx:
            - FROM: `nginx`
            - DEV: 使用されない
            - PRD: nginxサーバー <=> uwsgi <=> flaskサーバー

***

## Usage

```bash
# development server: localhost:3000
$ python bootstrap.py

# product server: localhost <=> flask server: localhost:3000
$ python bootstrap.py -o
```

### Command line options

short option | long option      | 引数       | 説明
:--:         | :--              | :--        | :--
`-o`         | `--product`      |            | 本番用Dockerとして実行
`-s`         | `--sudo`         |            | docker-composeをsudo権限で実行
`-b`         | `--build`        |            | docker-composeを`--build`オプション付きで実行
`-u`         | `--flask_port`   | ポート番号 | flaskサーバーの実行ポートを指定（default=`3000`）
`-p`         | `--port`         | ポート番号 | 本番サーバー(nginx)の実行ポートを指定（default=`80`）
`-v`         | `--virtual_host` | ホスト名   | 仮想ホスト名を指定（default=`local-host.jp`）
