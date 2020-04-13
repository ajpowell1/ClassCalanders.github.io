<?php
ini_set("session.cookie_httponly", 1);

header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
require 'databases.php';
//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);
session_name('change');
session_start();
//User agent consistency
$previous_ua = @$_SESSION['useragent'];
$current_ua = $_SERVER['HTTP_USER_AGENT'];

if(isset($_SESSION['useragent']) && $previous_ua !== $current_ua){
	die("Session hijack detected");
}else{
	$_SESSION['useragent'] = $current_ua;
}

//Variables can be accessed as such:
$current_user = $_SESSION['current_user'];
$eventName = htmlentities($json_obj['eventName']);
$month = htmlentities($json_obj['month']);
$day = htmlentities($json_obj['day']);
$year = htmlentities($json_obj['year']);
$time = htmlentities($json_obj['time']);
$sharedUser = htmlentities($json_obj['sharedUser']);
$checkToken = $json_obj['currentToken'];

if (!hash_equals($checkToken, $_SESSION['token'])) {
    echo json_encode(array(
        "success" => false,
        "message" => "Token match error. Please re-login and try again."
        ));
    exit;
}

$stmt = $mysqli->prepare("SELECT COUNT(*) FROM user_info WHERE username=?");
//Bind the parameter
$stmt->bind_param('s', $sharedUser);
$stmt->execute();
// Bind the results
$stmt->bind_result($cnt);
$stmt->fetch();
$count = $cnt;
$stmt->close();

if ($count == 1) {   
    //if the username exists, share this event with the user: 
    $stmt2 = $mysqli->prepare("INSERT into events(name, month, day, year, time, username, shared_by) values (?, ?, ?, ?, ?, ?, ?)");
    if(!$stmt2){
        echo json_encode(array(
            "success" => false,
            "message" => "Event couldn't be shared. Try again."
            ));
        exit;
    }
    $stmt2->bind_param('sssssss', $eventName, $month, $day, $year, $time, $sharedUser, $current_user);
    $stmt2->execute();
    $stmt2->close();

    //modify the current user's event to reflect the user they have shared the event with
    $stmt3 = $mysqli->prepare("UPDATE events set shared_with=? where name=? and month=? and day=? and username=?");
    if(!$stmt3){
        echo json_encode(array(
            "success" => false,
            "message" => "Event couldn't be shared. Try again."
            ));
        exit;
    }
    $stmt3->bind_param('sssss', $sharedUser, $eventName, $month, $day, $current_user);
    $stmt3->execute();
    $stmt3->close();

    echo json_encode(array(
        "success" => true,
        "message" => "Event was shared!"
        ));
        exit;
}
else {
    echo json_encode(array(
    "success" => false,
    "message" => "Username does not exist. Event wasn't shared. Try again."
    ));
    exit;
}
?>