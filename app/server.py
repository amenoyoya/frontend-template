# encoding: utf-8

from libs.frasco import Frasco, Response

app = Frasco(__name__)

# top page
@app.get('/')
def index():
    return Response.template('index.html')

if __name__ == "__main__":
    # run server in debug mode on port 3000
    # hostを'0.0.0.0'にしないとDockerコンテナの外部からアクセスできない
    app.run(debug=True, host='0.0.0.0', port=3000)
