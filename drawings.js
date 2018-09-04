
function draw() {
    cv_env = document.getElementById("sim_environment");
    ctx = cv_env.getContext("2d");
    draw_background();
    draw_floor();
    draw_cart();
}

function draw_background() {
    // Background color setting
    ctx.fillStyle = '#777777';
    ctx.fillRect(0, 0, cv_width, cv_height);

    // Deliner setting
    ctx.strokeStyle = '#aaaaaa'
    ctx.strokeRect(0, 0, cv_width, cv_height);
}

function draw_floor() {
    ctx.save();
    ctx.fillStyle = '#553333';
    var margin = 3;
    var fl_h = geo_params.floor_height * geo_params.pix_per_m;
    console.log(fl_h);
    ctx.fillRect(margin, cv_height - fl_h, cv_width - 2 * margin, fl_h - margin)
    ctx.restore();
}

function draw_cart() {
    ctx.save();
    var x_cv = state.x * geo_params.pix_per_m;
    var w_cart = geo_params.w_cart * geo_params.pix_per_m;
    var h_cart = geo_params.h_cart * geo_params.pix_per_m;
    var wheel_rad = sim_params.wheel_rad * geo_params.pix_per_m;
    var fl_h = geo_params.floor_height * geo_params.pix_per_m
    ctx.fillStyle = '#121255';
    
    start_x_cart = 400; // x_cv - w_cart / 2;
    start_y_cart = parseInt(cv_height - 3 - fl_h - 2 * wheel_rad- h_cart);
    console.log(start_x_cart,start_y_cart,fl_h);
    ctx.fillRect(start_x_cart, start_y_cart, w_cart, h_cart);
    //ctx.fillRect(0,0,80,80);
    ctx.restore();
}


