var cv_width = 850;
var cv_height = 500;

//meters
var running = false;
var geo_params = {
    w_cart: 0.45, 
    h_cart: 0.12,  
    floor_height: 0.25, 
    pix_per_m : 500,
    pend_radius: 0.05,
    offset_x : 300
}

var sim_params = {
    L: 0.40, // m
    wheel_rad: 0.035, // m
    m_cart: 8.0, // kg
    m_pend: 2.25,  // kg
    dt: 10,  // ms
    friction: 0.75
}

var state = {
    x: 0.0,
    x_dot : 0.0,
    theta : 0.0,
    theta_dot : 0.0,
    F: 0.0,
    beta_wheel:0.0
}

function initialize() {
    id_draw = setInterval(draw,30);
    dynamical_loop();           
    ///////////////////Event asosiate with clicks/////////////
    $("#start_btn").click(
        function () {            
            if (running) {
                $("#start_btn").css("background-color", "#116011");
                $("#start_btn").html("Start");               
                running = false;
            }
            else {
                $("#start_btn").css("background-color", "#991111");
                $("#start_btn").html("Stop");
                running = true;
            }
        }
    );
}
function update_state(){
    if(running){ 
        state.F = parseFloat($("#input_force").val());
        if(isNaN(state.F))
            state.F = 1.0;
    }
    else{
        state.F = parseFloat($("#input_force").val());
        if(isNaN(state.F))
            state.F = 1.0; 
        state.theta = ( (parseFloat($("#input_theta").val()))*Math.PI )/180.0;
        if(isNaN(state.theta))
            state.theta = 0.0;
        state.x = 0.0;
        state.x_dot = 0.0;
        state.theta_dot = 0.0;
        state.beta_wheel = 0.0;
    }
    show_state();
}
function show_state(){
    /////////////PUll it all in the HTML////////////
    var a = (parseFloat(state.theta)*180.0)/Math.PI;
    $("#theta").html(a.toFixed(2));
    $("#theta_dot").html(parseFloat(state.theta_dot).toFixed(2));
    $("#x").html(parseFloat(state.x).toFixed(2));
    $("#x_dot").html(parseFloat(state.x_dot).toFixed(2));
}

