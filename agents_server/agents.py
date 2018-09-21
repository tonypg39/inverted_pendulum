from pid_control import PID_ThetaAgent, PID_CascadeAgent
from reinforcement import RL_TabAgent
import math as mt


class AgentHandler():

    def __init__(self, env_params):
        self.env_params = env_params

    def create_agent(self, agent_name):
        """Returns an agent selected by the name"""
        if agent_name == 'pid_theta':
            return PID_ThetaAgent(self.env_params)

        elif agent_name == 'pid_cascade':
            return PID_CascadeAgent(self.env_params)

        elif agent_name == 'rl_tab':
            return RL_TabAgent(self.env_params)
        else:
            return None

    def update_env_params(self, env_params):
        self.env_params = env_params

    def check_terminal_state(self, current_state):
        """ Returns true if the environment is at a dead-end state"""
        return abs(mt.degrees(current_state['theta'])) > 100


if __name__ == '__main__':
    ev = {
        'dt': 10,
        'max_u_signal': 20
    }
    ah = AgentHandler(ev)
    ag_th = ah.create_agent('pid_theta')
    ag_csc = ah.create_agent('pid_cascade')
    # Test the agent
    state = {
        'theta': -3,
        'theta_dot': 0.0,
        'x': 0.0,
        'x_dot': 0.0
    }

    setpoint = {
        'theta': 0.0,
        'theta_dot': 0.0,
        'x': 2.0,
        'x_dot': -1.0
    }
    F_th = ag_th.act(state, setpoint)
    F_csc = ag_csc.act(state, setpoint)
    print(("F [THETA Agent] : %f\n") % (F_th))
    print(("F [CASC Agent] : %f\n") % (F_csc))
