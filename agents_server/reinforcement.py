import numpy as np
#from keras.models import Sequential
#from keras.layers import Dense, InputLayer
from agent import Agent


class RL_TabAgent(Agent):
    """ A reinforcement learning agent based on tabular q_learning"""

    def __init__(self, env_params, initial_params=None):
        if initial_params is None:
            self.params = self.default_params()
        else:
            self.params = initial_params

        # Number of actions and its definitions
        self.num_actions = 3
        self.actions = np.array([.2, .0, .2])
        self.num_states = 360

        self.q_table = self.create_q_table()
        self.last_s = .0
        self.last_a = 0

    def default_params(self):
        params = {
            'gamma': 0.9,
            'epsilon': 0.5,
            'decay_rate': 0.995,
            'learn_rate': 0.2
        }
        return params

    def reset(self):
        self.params = self.default_params()
        self.q_table = create_q_table()

    def create_q_table(self):
        return np.zeros((self.num_states, self.num_actions))

    def act(self, current_state, setpoint):
        """ Update the Q-Table based on the last action and state"""
        s = self.last_s  # Refers only to theta
        a = self.last_a  # Refers only the last action taken
        s_p = state['theta']

        # Update the q-table based on the Bellman Equation
        r = self.reward_func(state)
        q_predict = self.q_table[s, a]
        q_target = r + self.params['gamma']*np.max(self.q_table[s_p])

        self.q_table += self.params['learn_rate']*(q_target - q_predict)

        # Take the next action
        if (np.random.uniform() < self.params['epsilon']) or (self.q_table[s_p].all() == 0.0):
            ac = np.random.randint(self.num_actions)
        else:
            ac = np.argmax(self.q_table[s_p])

        self.last_a = ac
        self.last_s = s_p
        return ac
