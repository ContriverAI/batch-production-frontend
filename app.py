from flask import Flask, request, render_template, url_for
# from flask_cors import CORS, cross_origin

app = Flask(__name__)
# CORS(app, support_credentials=True)

@app.route('/superviser_cooling', methods=['GET','POST'])
# @cross_origin(supports_credentials=True)
def superviser_cooling():
    return render_template('superviser_cooling.html')

@app.route('/superviser_production', methods=['GET','POST'])
# @cross_origin(supports_credentials=True)
def superviser_production():
    return render_template('superviser_production.html')

@app.route('/superviser_store', methods=['GET','POST'])
# @cross_origin(supports_credentials=True)
def superviser_store():
    return render_template('superviser_store.html')

@app.route('/user_cooling', methods=['GET','POST'])
# @cross_origin(supports_credentials=True)
def user_cooling():
    return render_template('user_cooling.html')

@app.route('/user_production', methods=['GET','POST'])
# @cross_origin(supports_credentials=True)
def user_production():
    return render_template('user_production.html')

@app.route('/user_store', methods=['GET','POST'])
# @cross_origin(supports_credentials=True)
def user_store():
    return render_template('user_store.html')

@app.route('/admin', methods=['GET','POST'])
# @cross_origin(supports_credentials=True)
def admin():
    return render_template('admin.html')

@app.route('/', methods=['GET','POST'])
# @cross_origin(supports_credentials=True)
def login():
    return render_template('index.html')

#app.run(host='0.0.0.0', port=9002, ssl_context=('cert.pem', 'key.pem'))
app.run(host='0.0.0.0', port = 9001)
