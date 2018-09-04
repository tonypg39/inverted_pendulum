
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
    ctx.fillRect(margin, cv_height - fl_h, cv_width - 2 * margin, fl_h - margin)
    ctx.restore();
}

function draw_cart() {
    ctx.save();
    var x_cv = state.x * geo_params.pix_per_m + geo_params.offset_x;
    var w_cart = geo_params.w_cart * geo_params.pix_per_m;
    var h_cart = geo_params.h_cart * geo_params.pix_per_m;
    var wheel_rad = sim_params.wheel_rad * geo_params.pix_per_m;
    var fl_h = geo_params.floor_height * geo_params.pix_per_m;
    ctx.fillStyle = '#121255';
    
    start_x_cart =  x_cv - w_cart / 2;
    start_y_cart = parseInt(cv_height - fl_h - 2 * wheel_rad - h_cart);
    ctx.fillRect(start_x_cart, start_y_cart, w_cart, h_cart);
    //ctx.fillRect(0,0,80,80);
    ctx.restore();
    draw_wheels();
}


function draw_wheels() {
    // left wheel
    x_pos = state.x * geo_params.pix_per_m + geo_params.offset_x;
    var w_cart = geo_params.w_cart * geo_params.pix_per_m;
    var wheel_radius = sim_params.wheel_rad * geo_params.pix_per_m;
    var fl_h = geo_params.floor_height * geo_params.pix_per_m;

    first_x = x_pos - (1/3) *  w_cart;
    sec_x = x_pos + (1/3) * w_cart;
    y_w = cv_height - fl_h - wheel_radius;
    draw_wheel(first_x, y_w, wheel_radius, 50);
    draw_wheel(sec_x, y_w, wheel_radius, 50);
}

function draw_wheel(xc,yc,wheel_radius,wheel_angle) {
    ctx.save();
    
    ctx.beginPath();
    ctx.fillStyle = '#222222'; // Wheel primary color
    ctx.arc(xc, yc, wheel_radius, (Math.PI / 180) * 0, (Math.PI / 180) * 360, false);
    ctx.fill();    
    ctx.closePath();

    w_a =(Math.PI / 180) * wheel_angle;
    var xp1 = wheel_radius * Math.cos(w_a), yp1 = wheel_radius * Math.sin(w_a);
    var xp2 = - xp1, yp2 = -yp1;

    ctx.beginPath();
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#661111";    // Wheel's stripe color
    var x1 = xp1 + xc, x2 = xp2 + xc;
    var y1 = yp1 + yc, y2 = yp2 + yc;
        
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();    
    ctx.closePath();

    ctx.restore();
}