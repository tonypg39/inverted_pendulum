
function dynamical_loop(){
    window.setTimeout(dynamical_loop,sim_params.dt);
    if(running)
        simulate();
    update_state();
}

function simulate(){
    /////////// saving the previous state//////////
    var last_theta = parseFloat(state.theta);
    var last_theta_dot = parseFloat(state.theta_dot);
    var last_x = parseFloat(state.x);
    var last_x_dot = parseFloat(state.x_dot);
    var last_beta_wheel = parseFloat(state.beta_wheel);
    ///////////getting simul_params/////////////
    var m = parseFloat(sim_params.m_pend);
    var M = parseFloat(sim_params.m_cart);
    var l = parseFloat(sim_params.L);
    var dt = parseFloat(sim_params.dt);
    var g = 9.8; // gravity forces in m/s^2
    var F = state.F;
    var A = (F + m*g*Math.sin(last_theta)*Math.cos(last_theta) - m*l*Math.pow(last_theta_dot,2)*Math.sin(last_theta))/(m+M - m*Math.pow(Math.cos(last_theta),2));
    var B = (m*F*Math.cos(last_theta) - m*l*Math.pow(last_theta_dot,2)*Math.sin(last_theta)*Math.cos(last_theta)+m*g*Math.sin(last_theta)*(m+M))/(m*l - Math.pow(m,2)*Math.pow(Math.cos(last_theta),2));
    //////Solving the discrete differential equations Euler method/////////////
    var new_x = last_x + (last_x_dot*sim_params.dt)/1000.0;
    var new_x_dot = last_x_dot +(A*dt)/1000.0;
    var new_theta = last_theta + (last_theta_dot*dt)/1000.0;
    var new_theta_dot = last_theta_dot + (B*dt)/1000.0;
    var new_beta_wheel = last_beta_wheel + ((last_x_dot/sim_params.wheel_rad)*dt)/1000;
    /////////////////////////////////////////////////////////
    /*if(Math.abs(new_theta) >=Math.PI/2.0){
        new_theta = (Math.PI/2.0)*Math.sign(new_theta);
        we
    }*/
    state.x = new_x;
    state.x_dot = new_x_dot;
    state.theta = new_theta;
    state.theta_dot = new_theta_dot;
    state.beta_wheel = new_beta_wheel;

}