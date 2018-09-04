var cv_width = 850;
var cv_height = 500;


var geo_params = {
    w_cart: 60,
    h_cart: 30,
    floor_height: 60
}

var sim_params = {
    L: 50,
    wheel_rad: 20,
    m_cart: 10,
    m_pend: 3,
    dt: 30
}

var state = {
    x: 0.0,
    x_dot : 0.0,
    theta : 0.0,
    theta_dot : 0.0,
    F: 0.0
}

function initialize() {
    id_draw = setInterval(draw,sim_params.dt);
}

