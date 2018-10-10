import math as mt
from agent import Agent


class controllerParams():
    def __init__(self, error=0.0, l_error=0.0, sum_error=0.0, l_u_signal=0.0):
        self.error = error
        self.l_error = l_error
        self.sum_error = sum_error
        self.l_u_signal = l_u_signal

    def resetParams(self):
        self.error = 0.0
        self.l_error = 0.0
        self.sum_error = 0.0
        self.l_u_signal = 0.0


class PID():
    def __init__(self, Kc, Ki, Kd, threshold=0.0, contParams=controllerParams()):
        self.Kc = Kc
        self.Ki = Ki
        self.Kd = Kd
        self.contParams = contParams
        self.threshold = 0.0

    def restart(self):
        self.contParams.resetParams()

    def constrain(self, a, b, x):
        if x > a and x < b:
            return x
        elif x <= a:
            return a
        else:
            return b

    def updateK(self, Kc, Ki, Kd):
        self.Kc = Kc
        self.Ki = Ki
        self.Kd = Kd

    def getOutput(self, setpoint, variable, dt, max_usignal):
        self.contParams.error = (setpoint-variable)
        # print(("Error : %f") % (self.contParams.error))
        P = self.Kc*(self.contParams.error)
        I = self.Ki*(self.contParams.error)+self.contParams.l_u_signal
        D = self.Kd*((self.contParams.error -
                      self.contParams.l_error)/(dt*0.001))
        if(abs(self.contParams.error) <= self.threshold):
            return 0.0
        output = P + I + D
        output = self.constrain(-1.0*max_usignal,
                                max_usignal, output)
        self.contParams.l_error = self.contParams.error
        self.contParams.sum_error += self.contParams.error
        self.contParams.l_u_signal = output
        return output
        


class PID_ThetaAgent(Agent):
    """
    This agent uses a PID algorithm to control the angle
    """

    def __init__(self, env_params, init_params=None):
        if init_params is not None:
            self.params = init_params
        else:
            self.params = self.default_params()
        self.PID = PID(self.params['Kc'], self.params['Ki'],
                       self.params['Kd'], self.params['threshold'], controllerParams())
        self.env_params = env_params

    def reset(self):
        self.params = self.default_params()

    def default_params(self):
        return {
            'Kc': 0.975,
            'Ki': 0.2125,
            'Kd': 0.5,
            'threshold': 1e-10
        }

    def act(self, current_state, setpoint):
        """
        Defines how the PID agent returns the force
        """
        state_theta = current_state['theta']
        setpoint = mt.radians(setpoint['theta'])
        u = self.PID.getOutput(
            state_theta, setpoint, self.env_params['dt'], self.env_params['max_u_signal'])
        return u

    def reset(self):
        pass

    def set_reset_env(self):
        pass


class PID_CascadeAgent(Agent):
    """
    This agent uses a cascaded PID controller to control the velocity of
    the robot
    """

    def __init__(self, env_params, init_params=None):
        if init_params is not None:
            self.params = init_params
        else:
            self.params = self.default_params()

        self.PID_x_dot = PID(
            self.params['v_Kc'], self.params['v_Ki'], self.params['v_Kd'], self.params['v_threshold'], controllerParams())
        self.PID_theta = PID(
            self.params['t_Kc'], self.params['t_Ki'], self.params['t_Kd'], self.params['t_threshold'], controllerParams())
        self.env_params = env_params

    def default_params(self):
        return {
            'v_Kc': 0.015,
            'v_Ki': 0.0128,
            'v_Kd': 0.0215,
            'v_threshold': 0.01,
            't_Kc': 0.975,
            't_Ki': 0.2125,
            't_Kd': 0.5,
            't_threshold': 1e-10
        }

    def act(self, current_state, setpoint):
        """
        Defines how the PID agent returns the force
        """
        state_v = current_state['x_dot']
        state_theta =current_state['theta']
        setpoint_v = setpoint['x_dot']
        # print(("Setpoint %f , Variable %f") % (setpoint_v, state_v))
        setpoint_theta = self.PID_x_dot.getOutput(
            setpoint_v, state_v, self.env_params['dt'], self.env_params['max_u_signal'])

        #print("Cascada output")
        print(setpoint_theta)

        setpoint_theta = mt.radians(setpoint_theta)
        u = self.PID_theta.getOutput(
            state_theta, setpoint_theta, self.env_params['dt'], self.env_params['max_u_signal'])
        return u

    def reset(self):
        pass

    def set_reset_env(self):
        pass
