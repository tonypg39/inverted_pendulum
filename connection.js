var server_url = "http://127.0.0.1:5000/";


function tryConnection() {
    //alert("fuckin go' it");
    $.get(server_url, function (data, status) {
        $("#connection_state").text(data);
        //alert("fuckin go' it");
    });
}