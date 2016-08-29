<?php
// Include confi.php
$conn = mysql_connect("localhost", "root", "");
mysql_select_db('MusicShifter', $conn);

if ($_SERVER['REQUEST_METHOD'] == "POST"){
    // Get EQ data from the POST
    $name = isset($_POST['name']) ? 
        mysql_real_escape_string($_POST['name']) : 
        null;

    $playbackRate = isset($_POST['playbackRate']) ? 
        mysql_real_escape_string($_POST['playbackRate']) : 
        null;

    $trebleLevel = isset($_POST['trebleLevel']) ? 
        mysql_real_escape_string($_POST['trebleLevel']) : 
        null;
    
    $midLevel = isset($_POST['midLevel']) ? 
        mysql_real_escape_string($_POST['midLevel']) : 
        null;

    $bassLevel = isset($_POST['bassLevel']) ? 
        mysql_real_escape_string($_POST['bassLevel']) : 
        null;

    // Insert new EQ if we were passed all the settings.
    if (is_null($name) || $is_null($playbackRate) || is_null($trebleLevel) || is_null($midLevel) || is_null($bassLevel)) {
        $result = false;
    }
    else {
        $sql = "INSERT INTO MusicShifter.EQ(name, playbackRate, trebleLevel, midLevel, bassLevel)" +
            "VALUES ('$name', $playbackRate, $trebleLevel, $midLevel, $bassLevel);";
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
