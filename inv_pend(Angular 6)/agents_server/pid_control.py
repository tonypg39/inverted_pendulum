import math as mt
from agent import Agent


class PID():
    def __init__(self, Kc, Ki, Kd, threshold=0.0):
        self.Kc = Kc
        self.Ki = Ki
        self.Kd = Kd
        self.default_Kc = Kc
        self.default_Ki = Ki
        self.default_Kd = Kd
        self.threshold = threshold
        self.error = 0.0
        self.l_error = 0.0
        self.l2_error = 0.0
        self.sum_error = 0.0
        self.l_u_signal = 0.0
        self.u_signal = 0.0

    def restart(self):
        self.error = 0.0
        self.l_error = 0.0
        self.l2_error = 0.0
        self.sum_error = 0.0
        self.l_u_signal = 0.0
        self.u_signal = 0.0
        self.Kc = self.default_Kc
        self.Ki = self.default_Ki
        self.Kd = self.default_Kd

    def constraint(self, a, b, x):
        if x > a and x < b:
            return x
        elif x <= a:
            return a
        else:
            return b

    def updateK(self, params):
        self.Kc = params[0]
        self.Ki = params[1]
        self.Kd = params[2]
    
    def getParameters(self):
        return [self.Kc,self.Ki,self.Kd],['Kc','Ki','Kd']

    def update_state(self):
        self.l2_error = self.l_error;
        self.l_error = self.error;
        self.sum_error = self.constraint(-100,100, (self.sum_error + self.error));
        self.l_u_signal = self.u_signal;

    def classic_compute(self, setpoint, variable, dt, max_output):
        self.error = setpoint - variable
        if (abs(self.error) <= self.threshold):
            return 0.0
        P = self.Kc * self.error
        I = self.Ki * self.sum_error * dt
        D = self.Kd * ((self.error - self.l_error) / dt)
        output = P + I + D
        self.u_signal = self.constraint(-1.0 * max_output, max_output, output)
        self.update_state()
        return self.u_signal

    def positional_compute(self, setpoint, variable, dt, max_output):
        self.error = setpoint - variable
        if (abs(self.error) <= self.threshold):
            return 0.0
        P = self.Kc * self.error
        I = self.Ki * self.error * dt
        D = self.Kd * ((self.error - self.l_error) / dt)
        output = P + I + D + self.l_u_signal 
        self.u_signal = self.constraint(-1.0 * max_output, max_output, output)
        self.update_state()
        return self.u_signal
    
    def velocity_compute(self, setpoint, variable, dt, max_output):
        self.error = setpoint - variable
        if (abs(self.error) <= self.threshold):
            return 0.0
        P = self.Kc * (self.error-self.l_error)
        I = self.Ki * self.error * dt
        D = self.Kd * ((self.error - 2.0 * self.l_error + self.l2_error) / dt)
        output = P + I + D + self.l_u_signal 
        self.u_signal = self.constraint(-1.0 * max_output, max_output, output)
        self.update_state()
        return self.u_signal
        

class PID_ThetaAgent(Agent):
    """
    This agent uses a PID algorithm to control the angle
    """

    def __init__(self, env_params, init_params=None):
        if init_params is not None:
            self.params = init_params
        else:
            self.params = self.default_params()
        self.PID = PID(self.params['Kc'],self.params['Ki'],self.params['Kd'],self.params['threshold'])
        self.env_params = env_params

    def reset(self):
        self.params = self.default_params()
        self.PID.restart()

    def default_params(self):
        return {
            'Kc': 1.0,
            'Ki': 2.2125,
            'Kd': 0.575,
            'threshold': 1e-10
        }

    def act(self, current_state, setpoint):
        """
        Defines how the PID agent returns the force
        """
        state_theta = current_state['theta']
        setpoint = mt.radians(setpoint['theta'])
        u = self.PID.positional_compute(state_theta, setpoint,(self.env_params['dt'])/1000.0, self.env_params['max_force'])
        return u

    def reset(self):
        self.PID.restart()
        pass

    def set_reset_env(self):
        pass
    
    def getParameters(self):
        return self.PID.getParameters()
    
    def updateParameters(self,params):
        self.PID.updateK(params)

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

        self.PID_x_dot = PID(self.params['v_Kc'], self.params['v_Ki'],self.params['v_Kd'],self.params['v_threshold'])
        self.PID_theta = PID(self.params['t_Kc'], self.params['t_Ki'], self.params['t_Kd'],self.params['t_threshold'])
        self.env_params = env_params

    def default_params(self):
        return {
            'v_Kc': 0.015,
            'v_Ki': 0.5,
            'v_Kd': 0.0415,
            'v_threshold': 0.01,
            't_Kc': 1.0,
            't_Ki': 2.2125,
            't_Kd': 0.575,
            't_threshold': 1e-10
        }

    def act(self, current_state, setpoint):
        """
        Defines how the PID agent returns the force
        """
        state_v = current_state['x_dot']
        state_theta =current_state['theta']
        setpoint_v = setpoint['x_dot']
        
        setpoint_theta = self.PID_x_dot.positional_compute(setpoint_v, state_v, float(self.env_params['dt'])/1000.0, 5.0)

        setpoint_theta = mt.radians(setpoint_theta)
        u = self.PID_theta.positional_compute(state_theta, setpoint_theta, float(self.env_params['dt'])/1000.0 , self.env_params['max_force'])
        
        return u

    def reset(self):
        self.PID_theta.restart()
        self.PID_x_dot.restart()
        pass

    def set_reset_env(self):
        pass
    
    def getParameters(self):
        return self.PID_x_dot.getParameters()
    
    def updateParameters(self,params):
        self.PID_x_dot.updateK(params)


class PID_PointTrackerAgent(Agent):
    """
    This agent uses a cascaded PID controller to control the velocity of
    the robot
    """

    def __init__(self, env_params, init_params=None):
        if init_params is not None:
            self.params = init_params
        else:
            self.params = self.default_params()
        
        self.PID_x = PID(self.params['x_Kc'], self.params['x_Ki'],self.params['x_Kd'],self.params['x_threshold']) 
        self.PID_x_dot = PID(self.params['v_Kc'], self.params['v_Ki'],self.params['v_Kd'],self.params['v_threshold'])
        self.PID_theta = PID(self.params['t_Kc'], self.params['t_Ki'], self.params['t_Kd'],self.params['t_threshold'])
        self.env_params = env_params

    def default_params(self):
        return {
            'x_Kc': 0.6,
            'x_Ki': 0.05,
            'x_Kd': 0.55,
            'x_threshold': 0.10,
            'v_Kc': 0.015,
            'v_Ki': 0.0128,
            'v_Kd': 0.0215,
            'v_threshold': 0.01,
            't_Kc': 1.0,
            't_Ki': 2.2125,
            't_Kd': 0.575,
            't_threshold': 1e-10
        }

    def act(self, current_state, setpoint):
        """
        Defines how the PID agent returns the force
        """
        state_x = current_state['x']
        state_v = current_state['x_dot']
        state_theta =current_state['theta']
        
        setpoint_x = setpoint['x']
        setpoint_x_dot = self.PID_x.classic_compute(setpoint_x,state_x,float(self.env_params['dt'])/1000.0,1.5)
        setpoint_theta = self.PID_x_dot.positional_compute(setpoint_x_dot, state_v, float(self.env_params['dt'])/1000.0,5.0)
        setpoint_theta = mt.radians(setpoint_theta)
        u = self.PID_theta.positional_compute(state_theta, setpoint_theta, float(self.env_params['dt'])/1000.0 , self.env_params['max_force'])
        
        return u

    def reset(self):
        self.PID_theta.restart()
        self.PID_x_dot.restart()
        self.PID_x.restart()
        pass

    def set_reset_env(self):
        pass
    
    def getParameters(self):
        return self.PID_x.getParameters()
    
    def updateParameters(self,params):
        self.PID_x.updateK(params)
