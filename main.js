var cv_width = 850;
var cv_height = 500;

//meters
var running = false;
var geo_params = {
    w_cart: 2.90, 
    h_cart: 1.30,  
    floor_height: 0.7, 
    pix_per_m : 70,
    pend_radius: 0.35,    
    offset_x : 5.0
}

var sim_params = {
    L: 1.60, // m
    wheel_rad: 0.45, // m
    m_cart: 10, // kg
    m_pend: 3,  // kg
    dt: 10,  // ms
    ft: 0.1 // friction
}

var state = {
    x: 0.5,
    x_dot : 0.0,
    theta : 0.0,
    theta_dot : 0.0,
    F: 0.0,
    beta_wheel:(Math.PI / 180) * 30
}

function initialize() {
    id_draw = setInterval(draw,5);
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
        console.log(state.F);
    }
    else{
        state.x = 0.0;
        state.x_dot = 0.0;
        state.theta = ((parseFloat($("#input_theta").val()))*Math.PI)/180.0;
        state.theta_dot = 0.0;
        state.F = parseFloat($("#input_force").val());
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

