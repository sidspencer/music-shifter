<?php
// Include confi.php
$conn = mysql_connect("localhost", "root", "");
mysql_select_db('MusicShifter', $conn);

if ($_SERVER['REQUEST_METHOD'] == "POST"){
    $eq = json_decode($HTTP_RAW_POST_DATA);

    // Insert new EQ if we were passed all the settings.
    if (is_null($eq->name) || is_null($eq->playbackRate) || is_null($eq->$trebleLevel) || is_null($eq->midLevel) || is_null($eq->bassLevel)) {
        $result = false;
    }
    else {
        $sql = "INSERT INTO MusicShifter.EQ(name, playbackRate, trebleLevel, midLevel, bassLevel)" +
            "VALUES ('$eq->name', $eq->playbackRate, $eq->trebleLevel, $eq->midLevel, $eq->bassLevel);";
        $result = mysql_query($sql);
    }

    if ($result) {
        $jsonArr = array("status" => 1, "msg" => "Success adding user");
    }
    else {
        $jsonArr = array("status" => 0, "msg" => "Error adding user");
    }
}
elseif ($_SERVER['REQUEST_METHOD'] == "GET") {
    // Retrieve all EQs from the database.
    $sql = "SELECT id, name, playbackRate, trebleLevel, midLevel, bassLevel FROM EQ ORDER BY name ASC";

    $result = mysql_query($sql);

    if ($result) {
        $jsonArr = $result->fetch_array(MYSQLI_ASSOC);
    }
    else {
        $jsonArr = array("status" => 1, "msg" => "Error retrieving EQs");
    }
}
else {
        $jsonArr = array("status" => 0, "msg" => "Request method not accepted");
}

@mysql_close($conn);
 
// Output
header('Content-type: application/json');
echo json_encode($json);
?>
