var cv_width = 850;
var cv_height = 500;

//meters
var running = false;
var geo_params = {
    w_cart: 2.90, 
    h_cart: 1.00,  
    floor_height: 0.7, 
    pix_per_m : 80,
    offset_x : 300
}

var sim_params = {
    L: 0.50, // m
    wheel_rad: 0.30, // m
    m_cart: 10, // kg
    m_pend: 3,  // kg
    dt: 30  // ms
}

var state = {
    x: 0.0,
    x_dot : 0.0,
    theta : 0.0,
    theta_dot : 0.0,
    F: 0.0
}

function initialize() {
    id_draw = setInterval(draw,30);
    if(running)
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

            document.getElementById("start_btn").style;
        }
    );
}


