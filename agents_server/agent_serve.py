from flask import Flask
from flask_cors import CORS
import time
from flask import request, jsonify, json, url_for, send_file, abort,\
    redirect, make_response
from agents import AgentHandler
import numpy as np

app = Flask("InvertedPendulum")
CORS(app)

"""
    Possible agents:
        - pid_theta [Agent acts according to a PID algorithm on theta]
        - pid_cascade [Agent acts according to a Cascaded PID controller]
        - rl_tab    [Reinforcement agent based on Q-Table Learning]
"""

# Agents Parameters
agent_handler = AgentHandler({
    'dt': 10,
    'max_u_signal': 20
})
agentsd = {}
active_agent = 'none'

# Variables to update
current_state = None
setpoint = None


@app.route("/", methods=['GET'])
def index():
    return "HELLO FROM AGENTS SERVER"


@app.route("/get_force", methods=['GET'])
def force():
    global agent_handler, agentsd, active_agent
    # Dict representing the JSON object to send as a force
    response = {
        'F': 0.0,
        'reset': False,
        'theta_init': 0.0
    }
    if active_agent != 'none':
        response['F'] = agentsd[active_agent].act(current_state, setpoint)                
        #print(agent_handler.check_terminal_state(current_state))
        if agent_handler.check_terminal_state(current_state):
            response['reset'] = True
            response['theta_init'] = -6.0 + np.random.uniform() * 12.0    
        
    return jsonify(response)


@app.route("/switch_agent", methods=['POST'])
def switch_agent():
    global agent_handler, agentsd, active_agent, current_state, setpoint
    data = request.get_json(force=True)
    ac_ag = data['selected_agent']

    if agentsd.get(ac_ag) is None:  # if this type of agent has not been created
        ag = agent_handler.create_agent(ac_ag)
        if ag is not None:  # if it is a valid agent
            active_agent = ac_ag
            agentsd[active_agent] = ag

    else:  # if this type of agent had already been created
        active_agent = ac_ag    
    return make_response("")


@app.route("/send_state", methods=['POST'])
def get_state():
    global agent_handler, agentsd, active_agent, current_state, setpoint
    data = request.get_json(force=True)
    current_state = data['state']
    setpoint = data['set_point']
    return make_response("")


@app.route("/update_parameters", methods=['POST'])
def update_parameters():
    global agent_handler, agentsd, active_agent, current_state, setpoint
    data = request.get_json(force=True)    
    agent_handler.update_env_params(data['env_params'])    
    return make_response("")


if __name__ == "__main__":
    app.run("127.0.0.1", 5000)
