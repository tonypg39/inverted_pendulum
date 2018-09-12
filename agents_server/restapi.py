from flask import Flask
from flask_cors import CORS
import time
from flask import request, jsonify, json, url_for, send_file, abort,\
    redirect, make_response

app = Flask("InvertedP")
CORS(app)

response = {
    'F' : 2.3
}

@app.route("/", methods = ['GET'])
def index():
    return "Lola"

@app.route("/get_force", methods = ['GET'])
def force():
    return response

if __name__ == "__main__":
    app.run("127.0.0.1",5000)

