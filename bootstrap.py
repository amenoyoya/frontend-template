# encoding: utf-8
'''
Dockerによる開発を楽にする:
    port番号, 開発用｜本番用 などの設定を自動化

developed by yoya(@amenoyoya): https://github.com/amenoyoya
LICENSE: MIT
'''
from argparse import ArgumentParser
from jinja2 import Template
import subprocess

def run(args):
    # generate docker-compose.yml
    with open('./docker-compose.yml.tpl') as f:
        template = Template(f.read())
    with open('./docker-compose.yml', 'w') as f:
        f.write(template.render({
            'product': args.product,
            'flask_port': args.flask_port,
            'port': args.port,
            'virtual_host': args.virtual_host
        }))

    # generate flask/Dockerfile
    with open('./flask/Dockerfile.tpl') as f:
        template = Template(f.read())
    with open('./flask/Dockerfile', 'w') as f:
        f.write(template.render({'product': args.product}))
    
    # for product mode
    if args.product:
        # generate flask/uwsgi.ini
        with open('./flask/uwsgi.ini.tpl') as f:
            template = Template(f.read())
        with open('./flask/uwsgi.ini', 'w') as f:
            f.write(template.render({'flask_port': args.flask_port}))
    
        # generate nginx/conf.tpl
        with open('./nginx/nginx.conf.tpl') as f:
            template = Template(f.read())
        with open('./nginx/nginx.conf', 'w') as f:
            f.write(template.render({'flask_port': args.flask_port}))

    # docker-compose up
    command = ['docker-compose', 'up']
    if args.sudo:
        command = ['sudo'] + command
    if args.build:
        command += ['--build']
    subprocess.call(command)


if __name__ == "__main__":
    parser = ArgumentParser()
    parser.add_argument(
        '-o', '--product', action='store_true', help='run in product mode'
    )
    parser.add_argument(
        '-u', '--flask_port', type=int, default=3000,
        help='set flask server running port (default=3000)'
    )
    parser.add_argument(
        '-p', '--port', type=int, default=80,
        help='set product server running port [only available in product mode] (default=80)'
    )
    parser.add_argument(
        '-v', '--virtual_host', type=str, default='local-host.jp',
        help='set product server virtual host [only available in product mode and under using jwilder/nginx-proxy] (default=local-host.jp)'
    )
    parser.add_argument(
        '-s', '--sudo', action='store_true', help='start docker-compose as super user'
    )
    parser.add_argument(
        '-b', '--build', action='store_true', help='docker-compose up with --build option'
    )
    run(parser.parse_args())
