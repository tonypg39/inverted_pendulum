cv_width = 850;
cv_height = 500;


geo_params = {
    w_cart: 60,
    h_cart: 30,
    floor_height: 60
}

sim_params = {
    L: 50,
    wheel_rad: 20,
    m_cart: 10,
    m_pend: 3,
    dt: 10
}

state = {
    x: 0.0,
    theta: 0.0,
    F: 0.0
}

function draw() {
    cv_env = document.getElementById("sim_environment");
    ctx = cv_env.getContext("2d");
    draw_background();
    draw_floor();
}

function draw_background() {
    // Background color setting
    ctx.fillStyle = '#555555';
    ctx.fillRect(0, 0, cv_width, cv_height);

    // Deliner setting
    ctx.strokeStyle = '#aaaaaa'
    ctx.strokeRect(0, 0, cv_width, cv_height);
}

function draw_floor() {
    ctx.save();
    ctx.fillStyle = '#553333';
    var margin = 3
    ctx.fillRect(margin, cv_height - geo_params.floor_height, cv_width - 2 * margin, geo_params.floor_height - margin)
    ctx.restore();
}

function draw_(params) {

}
