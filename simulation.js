var input_force = 0.0;
var key_force = 0.0;
var control_source = "manual";

function dynamical_loop(){
    window.setTimeout(dynamical_loop,sim_params.dt);
    update_state();
    key_force = assistKey();
    if(running){
        if(control_source == "pid")
            input_force =  PID_theta(PID_x_dot(0.0,10),10);
        //else if (control_source == "agent");
        else if(control_source == "manual"){
        }
        else{
            input_force = 0.0;
        }
        simulate();
    }
}
function addNoise(k,sig = true,value){
    var sentido = 1.0;
    if(sig){
        var c = Math.random()
        if(c >= 0.5)
            sentido = 1.0;
        else
            sentido = -1.0
    }
    return k*sentido*value*Math.random();
}

function simulate(){
    /////////// saving the previous state//////////
    var l_theta = parseFloat(state.theta);
    var l_theta_d = parseFloat(state.theta_dot);
    var l_x = parseFloat(state.x);
    var l_x_d = parseFloat(state.x_dot);
    var last_beta_wheel = parseFloat(state.beta_wheel);
    ///////////getting simul_params/////////////
    var m = parseFloat(sim_params.m_pend);
    var M = parseFloat(sim_params.m_cart);
    var l = parseFloat(sim_params.L);
    var dt = parseFloat(sim_params.dt);
    var g = 9.8; // gravity forces in m/s^2
    var F = parseFloat(state.F);
    var k = sim_params.ground_friction;
    var ft = sim_params.friction;
    var u = sim_params.wind_friction;
    F = (F + -1.0*(k*l_x_d))//+addNoise(sim_params.wind_friction,true,0.75);
     
    var numA1 = -1.0*m*g*Math.sin(l_theta)*Math.cos(l_theta);
    var numA2 = m*l*Math.pow(l_theta_d,2) *Math.sin(l_theta);
    var numA3 = ft*m*l_theta_d*Math.cos(l_theta)+F;
    var denA = (M+m*(1-Math.pow(Math.cos(l_theta),2)));
    var A = (numA1+numA2+numA3)/denA;

    var numB1 = (M+m)*(g*Math.sin(l_theta)-ft*l_theta_d);
    var numB2 = -1.0*(Math.cos(l_theta)*(l*m*l_theta_d*l_theta_d*Math.sin(l_theta)+F));  
    var denB =  l*(M+m*(1-Math.pow(Math.cos(l_theta),2)));
    var B = (numB1+numB2)/denB;
    //////Solving the discrete differential equations Euler method/////////////
    var new_x = l_x + (l_x_d*dt)/1000.0;
    var new_x_d = l_x_d +(A*dt)/1000.0;
    var new_theta = l_theta + (l_theta_d*dt)/1000.0;
    var new_theta_d = l_theta_d + (B*dt)/1000.0;
    var new_beta_wheel = last_beta_wheel + ((l_x_d/sim_params.wheel_rad)*dt)/1000;
    /////////////////////////////////////////////////////////
    if(Math.abs(new_theta) <=Math.PI/2.0){
        sim_params.time_up+=dt/1000;
    }
    else{
        sim_params.best_score = Math.max(sim_params.time_up,sim_params.best_score);
    }
    state.x = new_x;
    state.x_dot = new_x_d;
    state.theta = new_theta;
    state.theta_dot = new_theta_d;
    state.beta_wheel = new_beta_wheel;

}
var sense = 0;
var keys =[false,false,false,false];
var base = 37; 

function is_atendible(){
    for(var i = 0;i<4;i++){
        if(keys[i])
            return false
    }
    return true;
}

const KeyUp = (event) => {
    if (event.which == 37 && keys[event.which-base]) {
        keys[event.which-base] = false;
        sense = 0;
        $("#decrement").css("background-color","#1590FF");
    }
    else if(event.which == 39 && keys[event.which-base]){
        keys[event.which-base] = false;
        sense = 0;
        $("#increment").css("background-color","#1590FF");
    }
    else{
        sense = sense;
    }
}

const KeyDown = (event) => {
    if(is_atendible()){
        if (event.which == 37) {
            sense = -1;
            keys[event.which-base] = true; 
            $("#decrement").css("background-color", "#FC1201");
            running = true;
        }
        else if(event.which == 39){
            sense = 1;
            keys[event.which-base] = true;
            $("#increment").css("background-color", "#FC1201");
            running = true;
        }
        else{
            sense = 0;
        }
    }
    if(event.which == 16)
        select_modes();
    if(event.which == 32)
        start_stop();
}

function assistKey(){
    var speed = 10.0;
    if(is_atendible()== false){
        var temp = key_force+sense*(speed*sim_params.dt)*0.01;
        return Math.min(Math.abs(temp),sim_params.max_force)*Math.sign(temp);
    }
    else{
        if(Math.abs(key_force) <=0.0000001){
            sense = 0.0;
            return 0.0;
        }
        else{
            if(key_force < 0.0)
                var temp = key_force + (speed*sim_params.dt)*0.01;
            else
                var temp = key_force - (speed*sim_params.dt)*0.01;
            return temp;
        }

    }
  
}
////////////////////////////////////////////////
var ctr_theta = {error:0.0,l_error:0.0,sum_error:0.0,u_signal:0.0,l_u_signal:0.0,Kc:1.2,Kd:0.550,Ki:0.25}
var ctr_x_dot = {error:0.0,l_error:0.0,sum_error:0.0,u_signal:0.0,l_u_signal:0.0,Kc:0.015,Kd:0.0215,Ki:0.0228}

//////////////////////////////////////////////////////
function reset_PID_values(){
    ctr_theta.error = 0.0;
    ctr_theta.l_error = 0.0;
    ctr_theta.l_u_signal = 0.0;
    ctr_theta.sum_error = 0.0;
    ctr_theta.u_signal = 0.0;
    ctr_x_dot.error = 0.0;
    ctr_x_dot.l_error = 0.0;
    ctr_x_dot.l_u_signal = 0.0;
    ctr_x_dot.sum_error = 0.0;
    ctr_x_dot.u_signal = 0.0;
}

function constrain(val,a,b){
    if(val>a && val<b)
        return val;
    else if(val<=a)
        return a;
    else
    return b;
}
/////////////////////////////////////////////////
function PID_theta(set_point,dt){
    set_point = (set_point*Math.PI)/180.0;
    //////////Getting Errors///////////
    ctr_theta.error = (state.theta - set_point);
   
    var P = ctr_theta.Kc*ctr_theta.error;
    var D = ctr_theta.Kd*((ctr_theta.error - ctr_theta.l_error)/dt)*1000;
    var I = ctr_theta.Ki*ctr_theta.error + ctr_theta.l_u_signal;
    ctr_theta.u_signal = P + D + I;

    ctr_theta.u_signal = constrain(ctr_theta.u_signal,-sim_params.max_force,sim_params.max_force);
    ctr_theta.l_error = ctr_theta.error;
    ctr_theta.l_u_signal = ctr_theta.u_signal;
    ctr_theta.sum_error +=ctr_theta.error;
    return ctr_theta.u_signal;
}
function PID_x_dot(set_point,dt){
    ctr_x_dot.error = (set_point-state.x_dot);
    if(Math.abs(ctr_x_dot.error)<=0.05)
        return 0.0;
    var P = ctr_x_dot.Kc*ctr_x_dot.error;
    var D  = ctr_x_dot.Kd*((ctr_x_dot.error - ctr_x_dot.l_error)/dt)*1000;
    var I = ctr_x_dot.Ki*ctr_x_dot.error + ctr_x_dot.l_u_signal;
    ctr_x_dot.u_signal = P+I+D;

    ctr_x_dot.u_signal = constrain(ctr_x_dot.u_signal,-30,30);
    ctr_x_dot.l_error = ctr_x_dot.error;
    ctr_x_dot.l_u_signal = ctr_x_dot.u_signal;
    ctr_x_dot.sum_error+=ctr_x_dot.error;
    return ctr_x_dot.u_signal; 
    
}