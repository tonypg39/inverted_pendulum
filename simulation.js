function dynamical_loop(){
    window.setTimeout(dynamicalLoop,sim_params.dt);
    upgrade_state();
}

function upgrade_state(){
    var last_state = state;
    

}