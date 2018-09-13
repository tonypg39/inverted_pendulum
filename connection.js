var server_url = "http://127.0.0.1:5000/";

function send_state() {
    var url = server_url + "send_state";
    $.post(url, state);
}
function initialization() {
    var data={jstate:state,jsim_param:sim_params,jid_mode:id_modes}
    var url = server_url + "initial_parameters";
    $.post(url, JSON.stringify(data));
}

function tryConnection() {
    //alert("fuckin go' it");
    $.get(server_url, function (data, status) {
        $("#connection_state").text(data);
        //alert("fuckin go' it");
    });
}