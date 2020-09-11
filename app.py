from flask import Flask, request, render_template, url_for

app = Flask(__name__)

@app.route('/superviser_cooling', methods=['GET','POST'])
def superviser_cooling():
    return render_template('superviser_cooling.html')

@app.route('/user_cooling', methods=['GET','POST'])
def user_cooling():
    return render_template('user_cooling.html')

@app.route('/', methods=['GET','POST'])
def login():
    return render_template('index.html')

app.run(host='0.0.0.0', port=9001)