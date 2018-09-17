
import math as mt
from abc import ABCMeta,abstractmethod
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

class Pid():
    def __init__(self, Kc, Ki, Kd,threshold = 0.0,contParams=controllerParams()):
        self.Kc = Kc
        self.Ki = Ki
        self.Kd = Kd
        self.output = 0.0
        self.contParams = contParams
        self.threshold = 0.0

    def restart(self):
        self.contParams.resetParams()
        self.output = 0.0
    
    def constrain(self,a, b, x):
        if x > a and x < b:
            return x
        elif x <= a:
            return a
        else:
            return b
    
    def updateK(self,Kc,Ki,Kd):
        self.Kc = Kc
        self.Ki = Ki
        self.Kd  = Kd

    def getOutput(self, setpoint,variable,dt,max_usignal):
        self.contParams.error = (setpoint-variable)
        P = self.Kc*(self.contParams.error)
        I = self.Ki*(self.contParams.error)+self.contParams.l_u_signal
        D = self.Kd*((self.contParams.error - self.contParams.l_error)/(dt*0.001))
        if(abs(self.contParams.error)<=self.threshold):
            return 0.0
        self.output = P + I + D
        self.output = self.constrain(-1.0*max_usignal,max_usignal,self.output)
        self.contParams.l_error = self.contParams.error
        self.contParams.sum_error+=self.contParams.error
        self.contParams.l_u_signal = self.output
        return self.output

class PID_theta(Pid):
    def getSignalControl(self,set_point,variable,dt,max_usignal):
        set_point = mt.radians(set_point)
        return self.getOutput(variable,set_point,dt,max_usignal)

class PID_x_dot(Pid):
    def getSignalControl(self,set_point,variable,dt,max_usignal):
        return self.getOutput(set_point,variable,dt,max_usignal)


