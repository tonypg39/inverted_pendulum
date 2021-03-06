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
        - rl_qnn    [Reinforcement agent based on Q-Neural Nets Learning]
"""

# Agents Parameters
agent_handler = AgentHandler({
    'dt': 10.0,
    'max_force': 25.0
})

agentsd = {}
active_agent = 'none'

# Variables to update
current_state = {'theta':0.0,'theta_dot':0.0,'x':0.0,'x_dot':0.0,'beta_wheel':0.0}
setpoint = {'theta':0.0,'theta_dot':0.0,'x':0.0,'x_dot':0.0}


@app.route("/", methods=['GET'])
def index():
    response = {'id':"API is conected" }
    return jsonify(response)




def get_force():
    global agent_handler, agentsd, active_agent, current_state, setpoint
    response = {
        'F': 0.0,
        'reset': False,
    }
    if active_agent != 'none':
        response['F'] = agentsd[active_agent].act(current_state, setpoint)                
        if agent_handler.check_terminal_state(current_state):
            response['reset'] = True
            if(active_agent == 'pid_theta' or active_agent == 'go_to_point' or active_agent == 'pid_cascade' ):
                #agentsd[active_agent].reset()
                pass
           agentsd[active_agent].set_reset_env()
    return response


@app.route("/switch_agent", methods=['POST'])
def switch_agent():
    global agent_handler, agentsd, active_agent, current_state, setpoint
    data = request.get_json(force=True)
    response = {'parameters':[],'labels':[]}
    ac_ag = data['selected_agent']
    if(ac_ag != 'manual'):
        if agentsd.get(ac_ag) is None:  # if this type of agent has not been created
            ag = agent_handler.create_agent(ac_ag)
            if ag is not None:  # if it is a valid agent
                active_agent = ac_ag
                agentsd[active_agent] = ag
        else:  # if this type of agent had already been created
            active_agent = ac_ag
        response['parameters'],response['labels'] = agentsd[active_agent].getParameters()
    return jsonify(response)
            


@app.route("/send_state", methods=['POST'])
def get_state():
    global agent_handler, agentsd, active_agent, current_state, setpoint
    data = request.get_json(force=True)
    current_state = data
    return jsonify(get_force())


@app.route('/send_setpoint',methods=['POST'])
def get_set_point():
    global agent_handler, agentsd, active_agent, current_state, setpoint
    data = request.get_json(force = True)
    setpoint = data['set_point']
    if(active_agent!='manual' and active_agent!='none'):
        agentsd[active_agent].updateParameters(data['parameters'])
    return make_response("")

@app.route("/update_parameters", methods=['POST'])
def update_parameters():
    global agent_handler, agentsd, active_agent, current_state, setpoint
    data = request.get_json(force=True)    
    agent_handler.update_env_params(data['env_params'])
    agentsd[active_agent].reset()
    current_state = data['state']    
    return make_response("")
    

if __name__ == "__main__":
    app.run("127.0.0.1", 5000)
