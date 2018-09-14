from flask import Flask
from flask_cors import CORS
import time
from flask import request, jsonify, json, url_for, send_file, abort,\
    redirect, make_response
from agent import *
app = Flask("InvertedP")
CORS(app)

@app.route("/", methods=['GET'])
def index():
    return "Lola"

# ///////////////////////////////////////////
pend_state = dict()
sim_params = dict()
set_point  = dict()
mode = 'manual'
# ////////////////////////////////////////
pid_theta = PID_theta(1.2,0.25,0.580,0.0)
pid_x_dot  = PID_x_dot(0.015,0.0228,0.0215,0.0)

@app.route("/get_force", methods=['GET'])
def force():
    global sim_params, pend_state,mode,set_point,pid_theta,pid_x_dot
    response = {'F': 0.0}
    if mode == 'manual':
        response['F'] = 0.0
        pid_theta.restart()
        pid_x_dot.restart()
    elif mode == 'pid_theta':
        response['F'] = pid_theta.getSignalControl(0.0,pend_state['theta'],sim_params['dt'],sim_params['max_force'])
    elif mode == 'pid_cascade':
        setpoint_theta = pid_x_dot.getSignalControl(set_point['x_dot'],pend_state['x_dot'],sim_params['dt'],sim_params['max_force'])
        print(setpoint_theta)
        response['F'] = pid_theta.getSignalControl(0.0,pend_state['theta'],sim_params['dt'],sim_params['max_force'])
        #response['F'] = pid_x_dot.getSignalControl(set_point['x_dot'],pend_state['x_dot'],10,20)
    else:
        response['F'] = 0.0
    return jsonify(response)


@app.route('/initial_parameters', methods=['POST'])
def get_initial_params():
    global sim_params, pend_state,mode,set_point,pid_theta,pid_x_dot
    data = request.get_json(force=True)
    sim_params = data['sim_params']
    pend_state = data['state']
    mode = data['mode']
    set_point = data['set_point']
    pid_theta.restart()
    pid_x_dot.restart()
    return make_response("")

@app.route('/send_state',methods=['POST'])
def get_state():
    global sim_params, pend_state,mode,set_point,pid_theta,pid_x_dot
    data = request.get_json(force = True)
    pend_state = data['state']
    set_point = data['set_point']
    return make_response("")

if __name__ == "__main__":
    app.run("127.0.0.1", 5000)
