from pid_control import PID_ThetaAgent, PID_CascadeAgent
from reinforcement import RL_TabAgent


class AgentHandler():

    def __init__(self, env_params):
        self.env_params = env_params
        self.current_agent = 'none'

    def create_agent(self, agent_name):
        """Returns an agent selected by the name"""
        if agent_name == 'pid_theta':
            return PID_ThetaAgent(self.env_params)

        elif agent_name == 'pid_cascade':
            return PID_CascadeAgent(self.env_params)

        elif agent_name == 'rl_tab':
            return RL_TabAgent(self.env_params)

    def check_terminal_state(self, current_state):
        """ Returns true if the environment is at a dead-end state"""
        return abs(current_state['theta']) > 100


if __name__ == '__main__':
    ev = {
        'dt': 10,
        'max_u_signal': 20
    }
    ah = AgentHandler(ev)
    ag = ah.create_agent('rl_tab')
    print(ag.params)
    print(ag)
