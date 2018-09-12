var server_url = "http://127.0.0.1:5000/";

function send_state(){
    var url = server_url+"send_state";
    $.post(url,state);
}
function initialization(){
    var url = server_url+"initial_parameters";
    $.post(url,{jsim_params:sim_params,jstate:state,jmode:modes[id_modes]});
}