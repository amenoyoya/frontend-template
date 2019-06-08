FROM alpine:3.7

RUN apk --update-cache \
    add musl \
    linux-headers \
    gcc \
    g++ \
    make \
    gfortran \
    openblas-dev \
    python3 \
    python3-dev

RUN pip3 install --upgrade pip && pip3 install flask uwsgi
ENV LANG="ja_JP.UTF-8" LANGUAGE="ja_JP:ja" LC_ALL="ja_JP.UTF-8" TZ="Asia/Tokyo"

WORKDIR /flask/app
{%- if product %}
CMD ["uwsgi", "--ini", "/flask/uwsgi.ini"]
{%- else %}
CMD ["python3", "server.py"]
{%- endif %}
