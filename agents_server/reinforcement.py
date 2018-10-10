import numpy as np
from keras.models import Sequential
from keras.layers import Dense, InputLayer
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
        self.actions = np.array([-.15, .0, .15])
        self.num_states = (82, self.num_actions)

        # Training variables
        self.F_cum = 0.0    # The cumulative force
        self.q_table = self.create_q_table()
        self.last_s = (0,)
        self.last_a = 0
        self.env_params = env_params
        self.cont_decay = 0
        self.reset_env = True

        self.dist = np.zeros(self.num_actions)

    def default_params(self):
        params = {
            'gamma': 1.0,
            'epsilon': 0.6,
            'decay_rate': 1.0,
            'learn_rate': 0.5
        }
        return params

    def reset(self):
        self.params = self.default_params()
        self.q_table = create_q_table()
        self.F_cum = 0.0

    def create_q_table(self):
        return np.zeros(self.num_states)

    def act(self, current_state, setpoint):
        """ Update the Q-Table based on the last action and state"""
        s = self.last_s  # Refers only to theta
        a = self.last_a  # Refers only the last action taken
        s_p = self.map_state(
            current_state['theta'], current_state['theta_dot'])

        # Update the q-table based on the Bellman Equation
        r = self.reward_func(current_state)
        q_predict = self.q_table[s + (a,)]

        if not self.reset_env:
            q_target = r + self.params['gamma'] * np.max(self.q_table[s_p])
        else:
            q_target = r
            print(str(r) + ' Reset')
            self.reset_env = False
            # self.q_table[40,1]=90

        self.q_table[s+(a,)] += self.params['learn_rate'] * \
            (q_target - q_predict)
        # print(self.params['epsilon'])
        # Take the next action
        if (np.random.uniform() < self.params['epsilon']) or (np.max(np.abs(self.q_table[s_p])) < 1e-3):
            ac = np.random.randint(self.num_actions)
            self.dist[ac] += 1
        else:
            ac = np.argmax(self.q_table[s_p])

        #ac = 0

        self.last_a = ac
        self.last_s = s_p
        if self.cont_decay == 1000:
            self.params['epsilon'] *= self.params['decay_rate']
            self.cont_decay = 0
        else:
            self.cont_decay += 1
        u = self.map_force(ac)
        f_u = self.F_cum + u
        print(self.params)
        print(self.q_table[30:51])
        return f_u

    def constraint(self, a, b, x):
        if x <= a:
            return a
        if x >= b:
            return b
        return x

    def map_state(self, theta, theta_dot):
        theta = mt.degrees(theta)
        # Map theta_dot from -6 to 6 into 0 -> 120
        th_d_ind = self.constraint(-6, 6, theta_dot)
        th_d_ind = round((th_d_ind + 6)*10)

        # Map theta from -40 to 40 into 0 -> 80
        th_ind = self.constraint(-40, 40, theta)
        th_ind = round(th_ind + 40)

        s = (th_ind,)  # , th_d_ind
        return s

    def reward_func(self, state):
        """ This method returns the reward of a particular state """
        if abs(state['theta']) < 1:
            return 2.0

        elif abs(state['theta']) < 3:
            return 0.0

        elif abs(state['theta']) > 30:
            return -100.0
        return -2.0

    def set_reset_env(self):
        self.reset_env = True

    def map_force(self, action):
        return self.actions[action]*self.env_params['max_u_signal']


class RL_NNAgent(Agent):

    def __init__(self, env_params, initial_params=None):
        if initial_params is None:
            self.params = self.default_params()
        else:
            self.params = initial_params

        # Number of actions and its definitions        
        self.actions = np.array([-.15, .15])   
        self.num_actions = len(self.actions)     

        # learning parameter counter
        self.counter_decay = 0
        self.q_net = self.create_qnn()
        self.env_params = env_params

    def create_qnn(self):
        model = Sequential()
        model.add(InputLayer(batch_input_shape=(1, 4)))

    def default_params(self):
        params = {
            'gamma': 0.9,
            'epsilon': 0.6,
            'decay_rate': 0.99,
            'learn_rate': 0.3
        }
        return params
