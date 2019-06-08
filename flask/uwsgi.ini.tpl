[uwsgi]
wsgi-file = /flask/app/server.py
callable = app
master = true
processes = 1
socket = :{{ flask_port }}
chmod-socket = 666
vacuum = true
die-on-term = true
py-autoreload = 1
