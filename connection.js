var server_url = "http://127.0.0.1:5000/";

function send_state() {
    var url = server_url + "send_state";
    var data = {
        state: state,
        set_point: set_point
    }
    $.post(url, JSON.stringify(data));
}

function update_serv_parameters() {
    var url = server_url + "update_parameters";
    var data = {
        env_params: sim_params
    }
    $.post(url, JSON.stringify(data));
}

function get_force() {
    var url = server_url + "get_force";
    $.get(url, function (data, status) {
        input_force = data.F;
        console.log(data.F);
        if (data.reset == true) {
            reset_env(data.theta_init)
        }
    })
}

function switch_agent() {
    var url = server_url + "switch_agent";
    var data = {
        selected_agent: modes[id_modes]
    }
    $.post(url, JSON.stringify(data));
}

/*
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

function get_force() {
    $.getJSON(server_url + "get_force", function (data, status) {
        input_force = data.F;
        console.log(data.F);
    });
}
*/