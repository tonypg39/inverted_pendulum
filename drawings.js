


function draw() {
    cv_env = document.getElementById("sim_environment");
    ctx = cv_env.getContext("2d");
    draw_background();
    draw_floor();
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
    var margin = 3
    ctx.fillRect(margin, cv_height - geo_params.floor_height, cv_width - 2 * margin, geo_params.floor_height - margin)
    ctx.restore();
}

