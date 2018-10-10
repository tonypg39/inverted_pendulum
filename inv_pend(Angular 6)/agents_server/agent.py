
import math as mt
from abc import ABCMeta, abstractmethod


class Agent():
    __metaclass__ = ABCMeta

    @abstractmethod
    def __init__(self, init_params):
        pass

    @abstractmethod
    def act(self, current_state, setpoint):
        """ Returns the action to take: the Force """
        pass

    @abstractmethod
    def reset(self):
        pass

    @abstractmethod
    def set_reset_env(self):
        raise NotImplementedError

"""
class PID_theta(Pid):
    def getSignalControl(self, set_point, variable, dt, max_usignal):
        set_point = mt.radians(set_point)
        return self.getOutput(variable, set_point, dt, max_usignal)


class PID_x_dot(Pid):
    def getSignalControl(self, set_point, variable, dt, max_usignal):
        return self.getOutput(set_point, variable, dt, max_usignal)
"""
