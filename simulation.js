
function dynamical_loop(){
    window.setTimeout(dynamical_loop,sim_params.dt);
    if(running)
        simulate();
    update_state();

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
    var ft = sim_params.friction;
     
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
    /*if(Math.Math.abs(new_theta) >=Math.PI/2.0){
        new_theta = (Math.PI/2.0)*Math.sign(new_theta);
        we
    }*/
    state.x = new_x;
    state.x_dot = new_x_d;
    state.theta = new_theta;
    state.theta_dot = new_theta_d;
    state.beta_wheel = new_beta_wheel;

}