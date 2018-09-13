var cv_width = 850;
var cv_height = 500;

//meters
var running = false;
var geo_params = {
    w_cart: 0.43,
    h_cart: 0.15,
    floor_height: 0.55,
    pix_per_m: 275,
    pend_radius: 0.065,
    offset_x: 2.0,
    dt_draw: 20
}

var sim_params = {
    L: 0.30, // m
    wheel_rad: 0.045, // m
    m_cart: 2.0, // kg
    m_pend: 0.090, // kg
    dt: 10, // ms
    friction: 1.5,
    ground_friction: 4.8,
    time_up: 0.00,
    best_score: 0.00,
    wind_friction: 0.5,
    max_force: 20.0
}

var set_point={
    theta:0.0,
    theta_dot:0.0,
    x:0.0,
    x_dot:0.0
}

var state = {
    x: 0.0,
    x_dot: 0.0,
    theta: 0.0,
    theta_dot: 0.0,
    F: 0.0,
    beta_wheel: (Math.PI / 180) * 30
}

function initialize() {
    id_draw = setInterval(draw, geo_params.dt_draw);
    $(".sim-params").hide();
    dynamical_loop();
    ///////////////////Event asosiate with clicks/////////////
    $("#start_btn").click(start_stop);
    $("#mode").click(select_modes);
    $("#adjust").click(adjustParameters);
    $("#enter-adjust").click(enterNewParameters);
    tryConnection();
}

function update_state() {
    if (running) {
        state.F = input_force + key_force;
        set_point.x_dot = parseFloat($("#input_velocity").val());
        if(isNaN(set_point.x_dot))
            set_point.x_dot = 0.0;
    } else {
        state.theta = ((parseFloat($("#input_theta").val())) * Math.PI) / 180.0;
        set_point.x_dot= parseFloat($("#input_velocity").val());
        if (isNaN(state.theta))
            state.theta = 0.0;
        if (isNaN(set_point.x_dot))
            set_point.x_dot = 0.0;
        input_force = 0.0;
        reset_PID_values();
        state.F = input_force + key_force;
        state.x = 0.0;
        state.x_dot = 0.0;
        state.theta_dot = 0.0;
        state.beta_wheel = 0.0;
        sim_params.time_up = 0.0;
        geo_params.offset_x = 1.5;
    }
    show_state();
}

function show_state() {
    /////////////PUll it all in the HTML////////////
    var a = (parseFloat(state.theta) * 180.0) / Math.PI;
    $("#theta").html(a.toFixed(3));
    $("#theta_dot").html(parseFloat(state.theta_dot).toFixed(3));
    $("#x").html(parseFloat(state.x).toFixed(3));
    $("#x_dot").html(parseFloat(state.x_dot).toFixed(3));
    $("#input_force").html((parseFloat(state.F).toFixed(3)));
}

function adjustParameters() {
    $(".sim-params").show();
}

function enterNewParameters() {
    $(".sim-params").hide();
}

function select_modes() {
    if (modes[id_modes] == "manual") {
        $("#mode").css("background-color", "#222222");
        $("#mode").html("pid_theta");
        id_modes = 1;
    } else if (modes[id_modes] == "pid_theta") {
        $("#mode").css("background-color", "#121212");
        $("#mode").html("pid_cascade");
        id_modes = 2;
    } else if(modes[id_modes] =="pid_cascade"){
        $("#mode").css("background-color", "#11888");
        $("#mode").html("agent");
        id_modes = 3;
    }else{
        $("#mode").css("background-color", "#888888");
        $("#mode").html("manual");
        id_modes = 0;
    }
    initialization();
}

function start_stop() {
    if (running) {
        $("#start_btn").css("background-color", "#116011");
        $("#start_btn").html("Start");
        running = false;
    } else {
        $("#start_btn").css("background-color", "#991111");
        $("#start_btn").html("Stop");
        running = true;
    }
}