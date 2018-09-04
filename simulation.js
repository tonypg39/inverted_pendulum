
function dynamical_loop(){
    window.setTimeout(dynamicalLoop,sim_params.dt);
    simulate();
}

function simulate(){
    /////////// saving the previous state//////////
    var last_theta = state.theta;
    var last_theta_dot = state.theta_dot;
    var last_x = state.x;
    var last_s_dot = state.x_dot;
    ///////////getting simul_params/////////////
    m = sim_params.m_pend;
    M = sim_params.m_cart;
    l = sim_params.L;
    dt = sim_params.dt;
    g = 9.8; // gravity forces in m/s^2
    var A = (F + m*g*Math.sin(last_theta)*Math.cos(last_theta) - m*l*Math.pow(last_theta_dot,2)*Math.sin(last_theta))/(m+M - m*Math.pow(Math.cos(last_theta),2));
    var B = (m*F*Math.cos(last_theta) - m*l*Math.pow(last_theta_dot2)*Math.sin(last_theta)*Math.cos(last_theta)+m*g*Math.sin(last_theta)*(m+M))/(m*l - Math.pow(m,2)*Math.pow(Math.cos(last_theta),2));
    //////Solving the discrete differential equations Euler method/////////////
    var new_x = last_x + (last_x_dot*sim_params.dt)/1000.0;
    var new_x_dot = last_x_dot +(A*dt)/1000.0;
    var new_theta = last_theta + (last_theta_dot*dt)/1000.0;
    var new_theta_dot = last_theta_dot + (B*dt)/1000.0;
    /////////////////////////////////////////////////////////
    if(Math.abs(new_theta) >=Math.PI/2.0){
        new_theta = (Math.PI/2.0)*Math.sign(new_theta);
        new_theta = 0.0;
    }
    state.x = new_x;
    state.x_dot = new_x_dot;
    state.theta = new_theta;
    state.theta_dot = new_theta_dot;
}