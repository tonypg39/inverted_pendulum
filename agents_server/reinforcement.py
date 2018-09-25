import numpy as np
#from keras.models import Sequential
#from keras.layers import Dense, InputLayer
from agent import Agent
import math as mt


class RL_TabAgent(Agent):
    """ A reinforcement learning agent based on tabular q_learning"""

    def __init__(self, env_params, initial_params=None):
        if initial_params is None:
            self.params = self.default_params()
        else:
            self.params = initial_params

        # Number of actions and its definitions
        self.num_actions = 3
        self.actions = np.array([-.25, .0, .25])
        self.num_states = 360
        
        # Training variables
        self.F_cum = 0.0    # The cumulative force
        self.q_table = self.create_q_table()
        self.last_s = 0
        self.last_a = 0
        self.env_params = env_params
        self.cont_decay = 0

        self.dist = np.zeros(self.num_actions)

    def default_params(self):
        params = {
            'gamma': 0.9,
            'epsilon': 0.6,
            'decay_rate': 0.99,
            'learn_rate': 0.3
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
        s_p = self.map_state(current_state['theta'])

        # Update the q-table based on the Bellman Equation
        r = self.reward_func(current_state)
        q_predict = self.q_table[s, a]
        q_target = r + self.params['gamma']*np.max(self.q_table[s_p])

        self.q_table[s, a] += self.params['learn_rate']*(q_target - q_predict)
        # print(self.params['epsilon'])
        # Take the next action
        if (np.random.uniform() < self.params['epsilon']) or (np.max(np.abs(self.q_table[s_p])) < 1e-3):
            ac = np.random.randint(self.num_actions)
            self.dist[ac] += 1
        else:
            ac = np.argmax(self.q_table[s_p])

        self.last_a = ac
        self.last_s = s_p
        if self.cont_decay == 1000:
            self.params['epsilon'] *= self.params['decay_rate']
            self.cont_decay = 0
        else:
            self.cont_decay += 1
        u = self.map_force(ac)
        print(self.params)
        print(self.q_table[80:100])
        return u

    def map_state(self, angle):
        angle = mt.degrees(angle)
        s = (90 - angle + 360) % 360
        s = int(s)
        return s

    def reward_func(self, state):
        """ This method returns the reward of a particular state """
        if abs(state['theta']) < 1:
            return 8.0

        elif abs(state['theta']) < 5:
            return 5.0

        return -3.5

    def map_force(self, action):
        return self.actions[action]*self.env_params['max_u_signal']
