<?php
// Include confi.php
include_once('config.php');
 
if($_SERVER['REQUEST_METHOD'] == "POST"){
    // Get data
    $name = isset($_POST['name']) ? mysql_real_escape_string($_POST['name']) : "";
    $email = isset($_POST['email']) ? mysql_real_escape_string($_POST['email']) : "";
    $password = isset($_POST['pwd']) ? mysql_real_escape_string($_POST['pwd']) : "";
    $status = isset($_POST['status']) ? mysql_real_escape_string($_POST['status']) : "";
    
    // Insert data into data base
    $sql = "INSERT INTO `tuts_rest`.`users` (`ID`, `name`, `email`, `password`, `status`) VALUES (NULL, '$name', '$email', '$password', '$status');";
    $result = mysql_query($sql);

    if($qur){
        $json = array("status" => 1, "msg" => "Success adding user");
    }else{
        $json = array("status" => 0, "msg" => "Error adding user");
    }
}
elseif ($_SERVER['REQUEST_METHOD'] == "GET") {
    // GET ALL
    $sql = "SELECT id, name, playbackRate, trebleLevel, midLevel, bassLevel FROM EQ ORDER BY name ASC";

    $result = mysql_query($sql);

    if ($result) {
        $json = $result->fetch_array(MYSQLI_ASSOC);
    }
}
else {
        $json = array("status" => 0, "msg" => "Request method not accepted");
}

@mysql_close($conn);
 
/* Output header */
 header('Content-type: application/json');
 echo json_encode($json);
?>
