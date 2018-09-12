function draw() {
    cv_env = document.getElementById("sim_environment");
    ctx = cv_env.getContext("2d");
    //check_boundaries();
    draw_background();
    draw_floor();
    draw_markers();
    draw_cart();
    draw_text();
}

function check_boundaries() {
    var x_pos = state.x * geo_params.pix_per_m + geo_params.offset_x * geo_params.pix_per_m;
    var dx = state.x_dot * (geo_params.dt_draw / 1000);
    if (x_pos > cv_width * .70)
        geo_params.offset_x -= dx;
    else if (x_pos < cv_width * .30)
        geo_params.offset_x += dx;
}

function draw_background() {
    // Background color setting
    ctx.fillStyle = '#cccccc';
    ctx.fillRect(0, 0, cv_width, cv_height);
    // Deliner setting
    ctx.strokeStyle = '#222222';
    ctx.strokeRect(0, 0, cv_width, cv_height);
}

function draw_marker() {
    //Marker point of coordinate frame origin
    ctx.fillStyle = "#aa99aa";
    var mkx = geo_params.offset_x * geo_params.pix_per_m;
    var mky = cv_height - 0.5 * geo_params.floor_height * geo_params.pix_per_m;
    console.log(mky);
    var mkw = geo_params.floor_height * 0.1 * geo_params.pix_per_m;
    ctx.fillRect(mkx, mky, mkw, mkw * 4);
}

function draw_markers() {
    var disp_nx = state.x - parseInt(state.x);
    var mky = cv_height - 0.5 * geo_params.floor_height * geo_params.pix_per_m;
    var mkw = geo_params.floor_height * 0.02 * geo_params.pix_per_m;

    // Left direction markers
    var c_m = parseInt(state.x);
    var c_px = obtain_x_px() - disp_nx * geo_params.pix_per_m;
    //draw the numbers
    ctx.font = "15px serif";
    ctx.fillStyle = "#aa99aa";
    var t_n = c_m.toFixed(0);
    ctx.fillText(t_n, c_px, mky + 13 *
        mkw);
    while (c_px > 0) {
        if (c_m == 0) {
            ctx.fillStyle = "#aa2222";
        } else
            ctx.fillStyle = "#aa99aa";
        ctx.fillRect(c_px, mky, mkw, mkw * 4);
        c_px -= geo_params.pix_per_m;
        c_m -= 1;

        //draw the numbers
        ctx.font = "15px serif";
        ctx.fillStyle = "#aa99aa";
        var t_n = c_m.toFixed(0);
        ctx.fillText(t_n, c_px, mky + 13 * mkw);
    }

    // Right direction markers    
    c_m = parseInt(state.x) + 1;
    disp_nx = c_m - state.x;

    c_px = obtain_x_px() + disp_nx * geo_params.pix_per_m;
    while (c_px < cv_width) {
        if (c_m == 0) {
            ctx.fillStyle = "#aa2222";
        } else
            ctx.fillStyle = "#aa99aa";
        ctx.fillRect(c_px, mky, mkw, mkw * 4);

        //draw the numbers
        ctx.font = "15px serif";
        ctx.fillStyle = "#aa99aa";
        var t_n = c_m.toFixed(0);
        ctx.fillText(t_n, c_px, mky + 13 *
            mkw);
        c_px += geo_params.pix_per_m;
        c_m += 1;
    }

}

function draw_floor() {
    ctx.save();
    ctx.fillStyle = '#332222';
    var margin = 3;
    var fl_h = geo_params.floor_height * geo_params.pix_per_m;
    ctx.fillRect(margin, cv_height - fl_h, cv_width - 2 * margin, fl_h - margin)
    ctx.restore();
}

function draw_cart() {
    ctx.save();
    var x_cv = obtain_x_px();
    var w_cart = geo_params.w_cart * geo_params.pix_per_m;
    var h_cart = geo_params.h_cart * geo_params.pix_per_m;
    var wheel_rad = sim_params.wheel_rad * geo_params.pix_per_m;
    var fl_h = geo_params.floor_height * geo_params.pix_per_m;
    ctx.fillStyle = '#113333';
    start_x_cart = x_cv - w_cart / 2;
    start_y_cart = parseInt(cv_height - fl_h - wheel_rad - h_cart);
    ctx.fillRect(start_x_cart, start_y_cart, w_cart, h_cart);
    //ctx.fillRect(0,0,80,80);
    ctx.restore();
    draw_wheels();
    draw_pendulum();
}

function obtain_x_px() {
    var x_proj_px = state.x * geo_params.pix_per_m + geo_params.offset_x * geo_params.pix_per_m;
    var dx = state.x_dot * (geo_params.dt_draw / 1000);
    var lft_bnd = 0.8,
        rght_bnd = 0.2;
    if (x_proj_px > lft_bnd * cv_width) { // && state.x_dot > 0) {
        //geo_params.offset_x += dx;
        return lft_bnd * cv_width;
    } else if (x_proj_px < rght_bnd * cv_width) { //&& state.x_dot < 0) {
        //geo_params.offset_x += dx;
        return rght_bnd * cv_width;
    }
    return x_proj_px;
}

function draw_wheels() {
    // left wheel
    var x_pos = obtain_x_px();
    var w_cart = geo_params.w_cart * geo_params.pix_per_m;
    var wheel_radius = sim_params.wheel_rad * geo_params.pix_per_m;
    var fl_h = geo_params.floor_height * geo_params.pix_per_m;
    var beta_w = (180 / Math.PI) * state.beta_wheel;

    first_x = x_pos - (1 / 3) * w_cart;
    sec_x = x_pos + (1 / 3) * w_cart;
    y_w = cv_height - fl_h - wheel_radius;

    draw_wheel(first_x, y_w, wheel_radius, beta_w);
    draw_wheel(sec_x, y_w, wheel_radius, beta_w);
}

function draw_wheel(xc, yc, wheel_radius, wheel_angle) {
    ctx.save();

    ctx.beginPath();
    ctx.fillStyle = '#404040'; // Wheel primary color
    ctx.arc(xc, yc, wheel_radius, (Math.PI / 180) * 0, (Math.PI / 180) * 360, false);
    ctx.fill();
    ctx.closePath();

    w_a = (Math.PI / 180) * wheel_angle;
    var xp1 = wheel_radius * Math.cos(w_a),
        yp1 = wheel_radius * Math.sin(w_a);
    var xp2 = -xp1,
        yp2 = -yp1;

    ctx.beginPath();
    ctx.lineWidth = wheel_radius * .3;
    ctx.strokeStyle = "#661111"; // Wheel's stripe color
    var x1 = xp1 + xc,
        x2 = xp2 + xc;
    var y1 = yp1 + yc,
        y2 = yp2 + yc;

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();

    ctx.restore();
}


function draw_pendulum() {
    var x_pos = obtain_x_px();
    var w_cart = geo_params.w_cart * geo_params.pix_per_m;
    var h_cart = geo_params.h_cart * geo_params.pix_per_m;
    var wheel_radius = sim_params.wheel_rad * geo_params.pix_per_m;
    var fl_h = geo_params.floor_height * geo_params.pix_per_m;
    var L = sim_params.L * geo_params.pix_per_m;
    var theta = state.theta;
    var pend_radius = geo_params.pend_radius * geo_params.pix_per_m;

    // Draw base of the pendulum
    var st_bx = x_pos - w_cart / 10;
    var st_by = cv_height - fl_h - wheel_radius - 1.2 * h_cart;
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.fillRect(st_bx, st_by, w_cart / 5, 0.2 * h_cart);


    // Draw the pendulum cord
    var stp_x = x_pos,
        stp_y = st_by + 0.1 * h_cart;
    var vec_x = L * Math.sin(theta);
    var vec_y = L * Math.cos(theta);
    ctx.beginPath();
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = L * .12;
    ctx.moveTo(stp_x, stp_y);
    ctx.lineTo(stp_x + vec_x, stp_y - vec_y);
    ctx.stroke();
    ctx.closePath();

    // Draw the pendulum itself
    var vecp_x = (L + pend_radius) * Math.sin(theta);
    var vecp_y = (L + pend_radius) * Math.cos(theta);
    var cx = stp_x + vecp_x,
        cy = stp_y - vecp_y;

    ctx.beginPath();
    ctx.fillStyle = "#113333"; // pendulum primary color
    ctx.arc(cx, cy, pend_radius, (Math.PI / 180) * 0, (Math.PI / 180) * 360, false);
    ctx.fill();
    ctx.closePath();

    ctx.restore();
}

function draw_text() {
    ctx.font = "15px serif"
    ctx.fillStyle = "#002225";
    var text = parseFloat(sim_params.time_up).toFixed(3);
    ctx.fillText("time up: " + text, 0.80 * cv_width, .1 * cv_height);
    ctx.font = "15px serif"
    ctx.fillStyle = "#002225";
    var score = parseFloat(sim_params.best_score).toFixed(3);
    ctx.fillText("best score: " + score, 0.80 * cv_width, .15 * cv_height);
}