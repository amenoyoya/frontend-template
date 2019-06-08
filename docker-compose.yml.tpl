version: '3'

services:
  flask:
    build: ./flask
    ports:
      - {{ flask_port }}:3000
    volumes:
      - ./app:/flask/app
      - ./flask/uwsgi.ini:/flask/uwsgi.ini
    network_mode: bridge
  
  {%- if product %}
  nginx:
    build: ./nginx
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
    links:
      - flask
    ports:
      - {{ port }}:80
    network_mode: bridge
    {%- if virtual_host %}
    environment:
      VIRTUAL_HOST: {{ virtual_host }}
    {%- endif %}
  {%- endif %}
