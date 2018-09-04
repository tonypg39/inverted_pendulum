
cv_width = 1050
cv_height = 500

var floor_height = 60

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
    ctx.fillRect(margin, cv_height - floor_height, cv_width - 2 * margin, floor_height - margin)
    ctx.restore();
}

function draw_(params) {
    
}
