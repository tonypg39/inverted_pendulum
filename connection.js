var server_url = "http://127.0.0.1:5000/";

function send_state() {
    var url = server_url + "send_state";
    var data = {
        state: state,
        set_point: set_point
    }
    $.post(url, JSON.stringify(data));
}

function initialization() {
    var data = {
        state: state,
        sim_params: sim_params,
        mode: modes[id_modes],
        set_point: set_point
    }
    console.log(data)
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

function get_force() {
    $.getJSON(server_url + "get_force", function (data, status) {
        input_force = data.F;
        console.log(data.F);
    });
}