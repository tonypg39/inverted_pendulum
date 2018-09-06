var cv_width = 850;
var cv_height = 500;

//meters
var running = false;
var geo_params = {
    w_cart: 0.5, 
    h_cart: 0.20,  
    floor_height: 0.5, 
    pix_per_m : 150,
    pend_radius: 0.08,    
    offset_x : 2.0,
    dt_draw : 5
}

var sim_params = {
    L: 0.30, // m
    wheel_rad: 0.075, // m
    m_cart: 2.0, // kg
    m_pend: 0.60,  // kg
    dt: 10,  // ms
    friction: 0.9
}

var state = {
    x: 0.0,
    x_dot : 0.0,
    theta : 0.0,
    theta_dot : 0.0,
    F: 0.0,
    beta_wheel:(Math.PI / 180) * 30
}

function initialize() {
    id_draw = setInterval(draw,geo_params.dt_draw);
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
        geo_params.offset_x = 1.5;
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

