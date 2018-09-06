var input_force = 0.0;

function dynamical_loop(){
    window.setTimeout(dynamical_loop,sim_params.dt);
    update_state();
    assistKey();
    if(running){
        PID(0.0,2.0,0.8,0.5,10);
        simulate();
    }
    else{
        reset_PID_values();
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
    F = (F + -1.0*(k*l_x_d))+ addNoise(u,true,0.001);
     
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
}

function assistKey(){
    var speed = 10.0;
    if(is_atendible()== false){
        var temp = input_force+sense*(speed*sim_params.dt)*0.01;
        input_force = Math.min(Math.abs(temp),20.0)*Math.sign(temp);
    }
    else{
        if(Math.abs(input_force) <=0.0000001){
            sense = 0.0;
            input_force = 0.0;
        }
        else{
            if(input_force < 0.0)
                var temp = input_force + (speed*sim_params.dt)*0.01;
            else
                var temp = input_force - (speed*sim_params.dt)*0.01;
            input_force = temp;
        }

    }
  $("#input_force").html((parseFloat(input_force).toFixed(1)));
}
////////////////////////////////////////////////
var error = 0.0;
var last_u_signal  = 0.0;
var last_error = 0.0;
var u_signal = 0.0;

function reset_PID_values(){
    error = 0.0;
    last_u_signal  = 0.0;
    last_error = 0.0;
    u_signal = 0.0;
}
/////////////////////////////////////////////////
function PID(set_point,Kc =2.0,Kd = 0.0,Ki = 0.0,dt){
    var theta = -1.0*state.theta;
    set_point = (set_point*Math.PI)/180.0;
    error = (set_point - theta);
    console.log(theta);
    var sign = Math.sign(error);
    if(Math.abs(error)<=0.017){
        u_signal = last_u_signal;
        error = 0.0;
    }
    else{
        u_signal = Kc*error + (Kd*(error - last_error)/dt)*1000 + Ki*(error)+last_u_signal;
    }
    last_error = error;
    last_u_signal = u_signal;
    input_force = Math.min(40,Math.abs(u_signal))*Math.sign(u_signal);
    }
